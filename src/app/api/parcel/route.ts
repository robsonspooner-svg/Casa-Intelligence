import { NextRequest, NextResponse } from 'next/server';

const QLD_CADASTRAL_URL =
  'https://spatial-gis.information.qld.gov.au/arcgis/rest/services/PlanningCadastre/LandParcelPropertyFramework/MapServer/4/query';

function esriRingsToGeoJSON(rings: number[][][]): GeoJSON.Geometry {
  return {
    type: 'Polygon',
    coordinates: rings,
  };
}

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat');
  const lng = request.nextUrl.searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng parameters required' }, { status: 400 });
  }

  try {
    // Must include inSR=4326 for WGS84 coordinates
    const params = new URLSearchParams({
      geometry: `${lng},${lat}`,
      geometryType: 'esriGeometryPoint',
      inSR: '4326',
      spatialRel: 'esriSpatialRelIntersects',
      outFields: '*',
      returnGeometry: 'true',
      outSR: '4326',
      f: 'json',
    });

    const res = await fetch(`${QLD_CADASTRAL_URL}?${params}`, {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`Cadastral API responded with ${res.status}`);
    }

    const data = await res.json();

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

    const props = feature.attributes || {};
    const geometry = feature.geometry;

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
