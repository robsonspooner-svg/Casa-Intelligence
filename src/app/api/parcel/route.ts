import { NextRequest, NextResponse } from 'next/server';

const BASE_URL =
  'https://spatial-gis.information.qld.gov.au/arcgis/rest/services/PlanningCadastre/LandParcelPropertyFramework/MapServer';

// Layer 4 = Cadastral parcels (individual lot boundaries including strata fragments)
const CADASTRAL_LAYER = `${BASE_URL}/4/query`;

function esriRingsToGeoJSON(rings: number[][][]): GeoJSON.Geometry {
  return {
    type: 'Polygon',
    coordinates: rings,
  };
}

/** Detect strata / community title plans — these return fragment geometry, not the full land lot */
function isStrataPlan(plan: string | null): boolean {
  if (!plan) return false;
  const upper = plan.toUpperCase();
  // BUP = Building Units Plan, SP = Survey Plan (strata), GTP = Group Titles Plan, CTS = Community Title Scheme
  return /BUP|SP|GTP|CTS/.test(upper);
}

/** Extract the plan identifier from a lotplan string (e.g. "0BUP5536" -> "BUP5536") */
function extractPlan(lotplan: string): string | null {
  // Lotplan format: lot + plan, e.g. "0BUP5536", "00000BUP5536", "409SP332538"
  const match = lotplan.match(/(BUP|SP|GTP|CTS)\d+$/i);
  return match ? match[0].toUpperCase() : null;
}

async function queryLayer(url: string, params: URLSearchParams, timeout = 10000) {
  const res = await fetch(`${url}?${params}`, {
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json();
}

/**
 * Compute convex hull of a set of 2D points using Graham scan.
 * Returns the hull as a closed ring (first point repeated at end).
 */
function convexHull(points: number[][]): number[][] {
  if (points.length < 3) return [...points, points[0]];

  // Find bottom-most (then left-most) point as pivot
  let pivot = points[0];
  for (const p of points) {
    if (p[1] < pivot[1] || (p[1] === pivot[1] && p[0] < pivot[0])) {
      pivot = p;
    }
  }

  // Sort by polar angle relative to pivot
  const sorted = points
    .filter(p => p !== pivot)
    .sort((a, b) => {
      const angleA = Math.atan2(a[1] - pivot[1], a[0] - pivot[0]);
      const angleB = Math.atan2(b[1] - pivot[1], b[0] - pivot[0]);
      if (angleA !== angleB) return angleA - angleB;
      // Same angle — closer point first
      const distA = (a[0] - pivot[0]) ** 2 + (a[1] - pivot[1]) ** 2;
      const distB = (b[0] - pivot[0]) ** 2 + (b[1] - pivot[1]) ** 2;
      return distA - distB;
    });

  const stack: number[][] = [pivot, sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    while (stack.length > 1) {
      const top = stack[stack.length - 1];
      const below = stack[stack.length - 2];
      const cross = (top[0] - below[0]) * (sorted[i][1] - below[1]) -
                    (top[1] - below[1]) * (sorted[i][0] - below[0]);
      if (cross <= 0) {
        stack.pop();
      } else {
        break;
      }
    }
    stack.push(sorted[i]);
  }

  // Close the ring
  stack.push(stack[0]);
  return stack;
}

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat');
  const lng = request.nextUrl.searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng parameters required' }, { status: 400 });
  }

  try {
    const pointParams = new URLSearchParams({
      geometry: `${lng},${lat}`,
      geometryType: 'esriGeometryPoint',
      inSR: '4326',
      spatialRel: 'esriSpatialRelIntersects',
      outFields: '*',
      returnGeometry: 'true',
      outSR: '4326',
      f: 'json',
    });

    // Query cadastral parcels
    const data = await queryLayer(CADASTRAL_LAYER, pointParams);

    if (!data.features || data.features.length === 0) {
      return NextResponse.json({ parcel: null, message: 'No parcel found at this location' });
    }

    // Find the best parcel — prefer ones with lotplan data and real area, skip road reserves
    let feature = data.features[0];
    for (const f of data.features) {
      const attrs = f.attributes || {};
      if (attrs.lotplan && attrs.lot_area > 0) {
        feature = f;
        break;
      }
    }

    let props = feature.attributes || {};
    let geometry = feature.geometry;

    // If this is a strata/BUP plan, the point-query geometry traces the building footprint
    // (or a unit fragment), not the full land lot. Query with an envelope for ALL features
    // from the same plan, then compute the convex hull to get the true lot boundary.
    const plan = props.plan || '';
    const planId = extractPlan(props.lotplan || '');

    if (isStrataPlan(plan) && planId) {
      try {
        // Build a small envelope around the point (~100m in each direction)
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        const buffer = 0.001; // ~111m lat, ~100m lng at this latitude
        const envelopeParams = new URLSearchParams({
          geometry: `${lngNum - buffer},${latNum - buffer},${lngNum + buffer},${latNum + buffer}`,
          geometryType: 'esriGeometryEnvelope',
          inSR: '4326',
          spatialRel: 'esriSpatialRelIntersects',
          where: `plan='${planId}'`,
          outFields: 'lotplan,lot,plan,lot_area,tenure,shire_name,locality',
          returnGeometry: 'true',
          outSR: '4326',
          f: 'json',
        });

        const envelopeData = await queryLayer(CADASTRAL_LAYER, envelopeParams);

        if (envelopeData.features && envelopeData.features.length > 0) {
          // Collect ALL coordinate points from all features in this plan
          const allPoints: number[][] = [];
          for (const f of envelopeData.features) {
            if (f.geometry?.rings) {
              for (const ring of f.geometry.rings) {
                for (const coord of ring) {
                  allPoints.push([coord[0], coord[1]]);
                }
              }
            }
          }

          if (allPoints.length >= 3) {
            // Compute convex hull of all plan fragments = the full lot boundary
            const hull = convexHull(allPoints);
            geometry = { rings: [hull] };
          }

          // Use the lot_area from the first feature (all share the same total plan area)
          const firstAttrs = envelopeData.features[0].attributes || {};
          if (firstAttrs.lot_area && firstAttrs.lot_area > 0) {
            props = { ...props, lot_area: firstAttrs.lot_area };
          }
        }
      } catch (err) {
        // If envelope query fails, fall back to the original point-query geometry
        console.warn('Strata envelope query failed, using point-query geometry:', err);
      }
    }

    // Convert Esri polygon rings to GeoJSON
    let geoJsonGeometry: GeoJSON.Geometry | null = null;
    if (geometry && geometry.rings && geometry.rings.length > 0) {
      geoJsonGeometry = esriRingsToGeoJSON(geometry.rings);
    }

    // Calculate area — prefer lot_area from attributes, fallback to turf calculation
    let areaSqm: number | null = props.lot_area && props.lot_area > 0 ? Math.round(props.lot_area) : null;

    if (!areaSqm && geoJsonGeometry) {
      try {
        const turf = await import('@turf/turf');
        areaSqm = Math.round(turf.area({
          type: 'Feature',
          geometry: geoJsonGeometry,
          properties: {},
        }));
      } catch {
        // Fallback failed, area remains null
      }
    }

    return NextResponse.json({
      parcel: {
        lot: props.lot || null,
        plan: props.plan || null,
        lotPlan: props.lotplan || (props.lot && props.plan ? `${props.lot}/${props.plan}` : null),
        areaSqm,
        tenure: props.tenure || null,
        lga: props.shire_name || null,
        locality: props.locality || null,
        geometry: geoJsonGeometry,
      },
    });
  } catch (error) {
    console.error('Parcel lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parcel data. Please try again.' },
      { status: 500 }
    );
  }
}
