import { NextRequest, NextResponse } from 'next/server';

const SCC_ZONING_URL =
  'https://services-ap1.arcgis.com/YQyt7djuXN7rQyg4/arcgis/rest/services/PlanningScheme_Zoning_SCC/FeatureServer/5/query';

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat');
  const lng = request.nextUrl.searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng parameters required' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      geometry: JSON.stringify({ x: parseFloat(lng), y: parseFloat(lat) }),
      geometryType: 'esriGeometryPoint',
      spatialRel: 'esriSpatialRelIntersects',
      outFields: '*',
      returnGeometry: 'true',
      inSR: '4326',
      outSR: '4326',
      f: 'json',
    });

    const res = await fetch(`${SCC_ZONING_URL}?${params}`, {
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Zoning API responded with ${res.status}`);
    }

    const data = await res.json();

    if (!data.features || data.features.length === 0) {
      return NextResponse.json({
        zone: null,
        message: 'No zoning data found. This site may be outside the Sunshine Coast planning scheme area.',
      });
    }

    const feature = data.features[0];
    const attrs = feature.attributes || {};

    // SCC fields: LABEL = "High Density Residential Zone", HEADING = "Residential Zone Category"
    const zoneName = (attrs.LABEL || attrs.ZONE_NAME || attrs.Zone_Name || attrs.ZONE || 'Unknown')
      .replace(/ Zone$/, ''); // Strip trailing " Zone" for cleaner display

    return NextResponse.json({
      zone: {
        name: zoneName,
        code: attrs.ZONE_CODE || attrs.Zone_Code || attrs.CODE || null,
        precinct: attrs.PRECINCT || attrs.Precinct || null,
        localPlan: attrs.LOCAL_PLAN || attrs.Local_Plan || null,
        category: attrs.HEADING || null,
      },
    });
  } catch (error) {
    console.error('Zoning lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch zoning data. Please try again.' },
      { status: 500 }
    );
  }
}
