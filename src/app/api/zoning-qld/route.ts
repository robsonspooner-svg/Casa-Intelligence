import { NextRequest, NextResponse } from 'next/server';
import { LGA_BOUNDARY_URL, getLGAEndpoints, buildGeometryParams } from '@/lib/lga-registry';

/**
 * QLD-wide zoning API.
 * 1. Determines which LGA the coordinates fall in via state boundary layer
 * 2. Looks up the council-specific zoning endpoint from the registry
 * 3. Queries that endpoint with the correct geometry format
 * 4. Returns zone name, code, and LGA information
 *
 * Supports 7 SEQ councils. Others fall back gracefully with null zone.
 */
export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat');
  const lng = request.nextUrl.searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng parameters required' }, { status: 400 });
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  try {
    // Step 1: Determine LGA
    const lgaParams = new URLSearchParams({
      geometry: `${lng},${lat}`,
      geometryType: 'esriGeometryPoint',
      spatialRel: 'esriSpatialRelIntersects',
      outFields: 'adminareaname,abbrev_name,lga',
      returnGeometry: 'false',
      inSR: '4326',
      f: 'json',
    });

    const lgaRes = await fetch(`${LGA_BOUNDARY_URL}?${lgaParams}`, {
      signal: AbortSignal.timeout(8000),
    });

    let lgaName: string | null = null;

    if (lgaRes.ok) {
      const lgaData = await lgaRes.json();
      if (lgaData.features && lgaData.features.length > 0) {
        const attrs = lgaData.features[0].attributes || {};
        lgaName = attrs.adminareaname || attrs.lga || attrs.abbrev_name || null;
      }
    }

    // Step 2: Look up council endpoints from registry
    if (lgaName) {
      const endpoints = getLGAEndpoints(lgaName);
      if (endpoints?.zoning) {
        const { zoning } = endpoints;
        const geom = buildGeometryParams(latNum, lngNum, !!zoning.useEnvelope);

        const zoningParams = new URLSearchParams({
          geometry: geom.geometry,
          geometryType: geom.geometryType,
          spatialRel: 'esriSpatialRelIntersects',
          outFields: '*',
          returnGeometry: 'false',
          inSR: '4326',
          outSR: '4326',
          f: 'json',
        });

        const zoningRes = await fetch(`${zoning.url}?${zoningParams}`, {
          signal: AbortSignal.timeout(10000),
        });

        if (zoningRes.ok) {
          const data = await zoningRes.json();
          if (data.features && data.features.length > 0) {
            const attrs = data.features[0].attributes || {};

            // Extract zone name — try the configured field first, then common fallbacks
            const zoneName = (
              attrs[zoning.nameField] ||
              attrs.LABEL ||
              attrs.ZONE_NAME ||
              attrs.Zone_Name ||
              attrs.Zone ||
              'Unknown'
            ).replace(/ Zone$/i, '');

            return NextResponse.json({
              zone: {
                name: zoneName,
                code: attrs[zoning.codeField] || null,
                precinct: zoning.precinctField ? attrs[zoning.precinctField] : null,
                localPlan: zoning.localPlanField ? attrs[zoning.localPlanField] : null,
                category: zoning.categoryField ? attrs[zoning.categoryField] : null,
              },
              lga: lgaName,
            });
          }
        }
      }
    }

    // Step 3: No zoning endpoint — return LGA info with null zone
    // The subdivision UI will still show "May Be Subdividable" with Subdivide button
    return NextResponse.json({
      zone: null,
      lga: lgaName,
    });
  } catch (error) {
    console.error('QLD zoning lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch zoning data. Please try again.' },
      { status: 500 }
    );
  }
}
