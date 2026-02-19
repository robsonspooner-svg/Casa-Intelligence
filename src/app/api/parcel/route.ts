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

/**
 * Detect strata / community title plans — these return fragment geometry,
 * not the full land lot. We need to compute a convex hull for these.
 *
 * IMPORTANT: SP (Survey Plan) is NOT strata — it's the standard plan type
 * for regular residential subdivisions. Including SP here caused the convex
 * hull to merge all lots in an entire subdivision into one giant boundary.
 * Only BUP, GTP, and CTS are true strata/community title types.
 */
function isStrataPlan(plan: string | null): boolean {
  if (!plan) return false;
  const upper = plan.toUpperCase();
  // BUP = Building Units Plan, GTP = Group Titles Plan, CTS = Community Title Scheme
  return /BUP|GTP|CTS/.test(upper);
}

/** Extract the plan identifier from a lotplan string (e.g. "0BUP5536" -> "BUP5536") */
function extractPlan(lotplan: string): string | null {
  // Lotplan format: lot + plan, e.g. "0BUP5536", "00000BUP5536"
  const match = lotplan.match(/(BUP|GTP|CTS)\d+$/i);
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

/**
 * Calculate approximate centroid of a polygon feature and return distance
 * from a reference point. Used to pick the closest parcel to the geocoded coordinates.
 */
function getParcelDistanceFromPoint(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  feature: any,
  refLat: number,
  refLng: number,
): number {
  const rings = feature.geometry?.rings;
  if (!rings || rings.length === 0) return Infinity;

  // Compute centroid of the first ring
  let sumX = 0, sumY = 0, count = 0;
  for (const coord of rings[0]) {
    sumX += coord[0];
    sumY += coord[1];
    count++;
  }
  if (count === 0) return Infinity;

  const cx = sumX / count;
  const cy = sumY / count;

  // Euclidean distance in degrees (fine for comparison at same locality)
  return Math.sqrt((cx - refLng) ** 2 + (cy - refLat) ** 2);
}

/**
 * Pick the best parcel from a list of candidates near the geocoded point.
 *
 * Strategy: prefer residential-sized parcels (<10,000m²) closest to the point.
 * Only fall back to large parcels if no residential ones are found.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pickClosestParcel(candidates: any[], refLat: number, refLng: number): any {
  // Separate into residential-sized and large parcels
  const residential = candidates.filter((f) => (f.attributes?.lot_area || 0) <= 10000);
  const pool = residential.length > 0 ? residential : candidates;

  let best = pool[0];
  let bestDist = getParcelDistanceFromPoint(pool[0], refLat, refLng);

  for (let i = 1; i < pool.length; i++) {
    const dist = getParcelDistanceFromPoint(pool[i], refLat, refLng);
    if (dist < bestDist) {
      bestDist = dist;
      best = pool[i];
    }
  }

  return best;
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

    // Find the best parcel — skip road reserves and tiny parcels
    // Geocoded points often land on the road centerline, hitting the road reserve parcel.
    // When multiple real parcels overlap at the point (e.g. a small residential lot inside
    // a large parent lot), prefer the smallest reasonable one — that's the actual allotment.
    let feature = data.features[0];
    let foundRealParcel = false;
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    const realParcels = data.features.filter((f: { attributes: Record<string, unknown> }) => {
      const attrs = f.attributes || {};
      const isRoad = (attrs.tenure && /road/i.test(String(attrs.tenure))) ||
                     (attrs.lot_area != null && Number(attrs.lot_area) > 0 && Number(attrs.lot_area) < 50) ||
                     !attrs.lotplan;
      return !isRoad && attrs.lotplan && Number(attrs.lot_area) > 0;
    });

    if (realParcels.length > 0) {
      // If there are both small (<10,000m²) and large parcels, prefer the smallest.
      // This handles the case where a residential lot sits inside a larger parent lot
      // and both are returned by the point query.
      const smallParcels = realParcels.filter((f: { attributes: Record<string, unknown> }) => Number(f.attributes?.lot_area || 0) <= 10000);
      if (smallParcels.length > 0) {
        // Pick the smallest residential-sized parcel
        feature = smallParcels.reduce((best: { attributes: Record<string, unknown> }, f: { attributes: Record<string, unknown> }) =>
          Number(f.attributes?.lot_area || Infinity) < Number(best.attributes?.lot_area || Infinity) ? f : best
        );
      } else {
        // All are large — pick closest to geocoded point
        feature = pickClosestParcel(realParcels, latNum, lngNum);
      }
      foundRealParcel = true;
    }

    // If point query only returned road reserves, do an envelope query (~55m) to find the real lot
    if (!foundRealParcel) {
      try {
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        const buffer = 0.0005; // ~55m
        const envParams = new URLSearchParams({
          geometry: `${lngNum - buffer},${latNum - buffer},${lngNum + buffer},${latNum + buffer}`,
          geometryType: 'esriGeometryEnvelope',
          inSR: '4326',
          spatialRel: 'esriSpatialRelIntersects',
          outFields: '*',
          returnGeometry: 'true',
          outSR: '4326',
          f: 'json',
        });

        const envData = await queryLayer(CADASTRAL_LAYER, envParams);

        if (envData.features && envData.features.length > 0) {
          // Filter to valid non-road parcels, then pick the closest to the geocoded point.
          // Previously we picked the largest, but that could grab a massive adjacent lot
          // (e.g. 107,000m² council land) when the target is a ~400m² residential block.
          const candidates = envData.features.filter((f: { attributes: Record<string, unknown> }) => {
            const attrs = f.attributes || {};
            const isRoad = (attrs.tenure && /road/i.test(String(attrs.tenure))) ||
                           (attrs.lot_area != null && Number(attrs.lot_area) > 0 && Number(attrs.lot_area) < 50) ||
                           !attrs.lotplan;
            return !isRoad && attrs.lotplan && Number(attrs.lot_area) > 0;
          });

          if (candidates.length > 0) {
            // Prefer the closest parcel centroid to the geocoded point
            const best = pickClosestParcel(candidates, latNum, lngNum);
            feature = best;
            foundRealParcel = true;
          }
        }
      } catch (envErr) {
        console.warn('Envelope fallback for road-reserve avoidance failed:', envErr);
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
