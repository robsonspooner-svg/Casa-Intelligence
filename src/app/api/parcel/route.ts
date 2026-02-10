import { NextRequest, NextResponse } from 'next/server';

const BASE_URL =
  'https://spatial-gis.information.qld.gov.au/arcgis/rest/services/PlanningCadastre/LandParcelPropertyFramework/MapServer';

// Layer 4 = Cadastral parcels (raw lot boundaries)
// Layer 50 = Properties (consolidated property boundaries — merges strata into parent lot)
const CADASTRAL_LAYER = `${BASE_URL}/4/query`;
const PROPERTIES_LAYER = `${BASE_URL}/50/query`;

function esriRingsToGeoJSON(rings: number[][][]): GeoJSON.Geometry {
  return {
    type: 'Polygon',
    coordinates: rings,
  };
}

/** Detect BUP / strata plans — these return building-footprint geometry, not the land lot */
function isStrataPlan(planOrLotplan: string | null): boolean {
  if (!planOrLotplan) return false;
  const upper = planOrLotplan.toUpperCase();
  return /BUP|SP|GTP|CTS/.test(upper);
}

async function queryLayer(url: string, params: URLSearchParams, timeout = 10000) {
  const res = await fetch(`${url}?${params}`, {
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json();
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

    // Query cadastral parcels first
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

    // If this is a strata/BUP plan, the geometry follows the building footprint.
    // Query the Properties layer (50) instead to get the full land boundary.
    const plan = props.plan || props.lotplan || '';
    if (isStrataPlan(plan)) {
      try {
        const propData = await queryLayer(PROPERTIES_LAYER, pointParams);

        if (propData.features && propData.features.length > 0) {
          // Pick the property feature — prefer ones with real area
          let propFeature = propData.features[0];
          for (const f of propData.features) {
            const a = f.attributes || {};
            if (a.lot_area > 0 || a.AREA > 0) {
              propFeature = f;
              break;
            }
          }

          const propGeometry = propFeature.geometry;
          if (propGeometry && propGeometry.rings && propGeometry.rings.length > 0) {
            // Use the property boundary geometry but keep the cadastral attributes
            geometry = propGeometry;

            // Update area from property layer if available
            const propAttrs = propFeature.attributes || {};
            if (propAttrs.lot_area && propAttrs.lot_area > 0) {
              props = { ...props, lot_area: propAttrs.lot_area };
            }
          }
        }
      } catch (err) {
        // If Properties layer fails, fall back to the cadastral geometry
        console.warn('Properties layer fallback failed, using cadastral geometry:', err);
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
