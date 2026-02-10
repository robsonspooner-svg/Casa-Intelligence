import { NextRequest, NextResponse } from 'next/server';

const QLD_DEM_BASE =
  'https://spatial-img.information.qld.gov.au/arcgis/rest/services/Elevation/QldDem/ImageServer';

const SLOPE_CATEGORIES: { maxPercent: number; label: string }[] = [
  { maxPercent: 5, label: 'Flat to gentle' },
  { maxPercent: 10, label: 'Moderate slope' },
  { maxPercent: 15, label: 'Steep' },
  { maxPercent: 25, label: 'Very steep' },
  { maxPercent: Infinity, label: 'Extreme' },
];

function categorise(slopePercent: number): string {
  for (const tier of SLOPE_CATEGORIES) {
    if (slopePercent <= tier.maxPercent) return tier.label;
  }
  return 'Extreme';
}

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat');
  const lng = request.nextUrl.searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng parameters required' }, { status: 400 });
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  try {
    // Primary: identify endpoint with Slope_percent_rise raster function
    const identifyParams = new URLSearchParams({
      geometry: JSON.stringify({ x: lngNum, y: latNum }),
      geometryType: 'esriGeometryPoint',
      mosaicRule: '',
      renderingRule: JSON.stringify({
        rasterFunction: 'Slope_percent_rise',
      }),
      returnGeometry: 'false',
      returnCatalogItems: 'false',
      f: 'json',
    });

    const res = await fetch(`${QLD_DEM_BASE}/identify?${identifyParams}`, {
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      const data = await res.json();
      const pixelValue = data?.value;

      if (pixelValue !== undefined && pixelValue !== null && pixelValue !== 'NoData') {
        const slopePercent = parseFloat(String(pixelValue));
        if (!isNaN(slopePercent)) {
          return NextResponse.json({
            slope: {
              averageSlopePercent: Math.round(slopePercent * 10) / 10,
              category: categorise(slopePercent),
            },
          });
        }
      }
    }

    // Fallback: getSamples endpoint with a small envelope around the point
    const offset = 0.0003; // ~30m
    const envelope = {
      xmin: lngNum - offset,
      ymin: latNum - offset,
      xmax: lngNum + offset,
      ymax: latNum + offset,
      spatialReference: { wkid: 4326 },
    };

    const samplesParams = new URLSearchParams({
      geometry: JSON.stringify(envelope),
      geometryType: 'esriGeometryEnvelope',
      mosaicRule: '',
      renderingRule: JSON.stringify({
        rasterFunction: 'Slope_percent_rise',
      }),
      sampleCount: '9',
      returnFirstValueOnly: 'false',
      f: 'json',
    });

    const samplesRes = await fetch(`${QLD_DEM_BASE}/getSamples?${samplesParams}`, {
      signal: AbortSignal.timeout(10000),
    });

    if (samplesRes.ok) {
      const samplesData = await samplesRes.json();
      const samples = samplesData?.samples;

      if (Array.isArray(samples) && samples.length > 0) {
        const values = samples
          .map((s: { value: string }) => parseFloat(s.value))
          .filter((v: number) => !isNaN(v) && v >= 0);

        if (values.length > 0) {
          const avg = values.reduce((sum: number, v: number) => sum + v, 0) / values.length;
          return NextResponse.json({
            slope: {
              averageSlopePercent: Math.round(avg * 10) / 10,
              category: categorise(avg),
            },
          });
        }
      }
    }

    // No data available — return null gracefully
    return NextResponse.json({
      slope: {
        averageSlopePercent: null,
        category: 'Unknown',
      },
    });
  } catch (error) {
    console.error('Slope lookup error:', error);
    return NextResponse.json({
      slope: {
        averageSlopePercent: null,
        category: 'Unknown',
      },
    });
  }
}
