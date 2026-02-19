import { NextRequest, NextResponse } from 'next/server';
import { STATE_WIDE_OVERLAYS } from '@/lib/lga-registry';

/**
 * QLD-wide overlay API.
 * Queries state-wide overlay layers (flood, bushfire, heritage, environment, vegetation, wetlands, coastal).
 * Returns which overlays affect the parcel.
 */

interface OverlayHit {
  layerId: number;
  layerName: string;
  bucket: string;
  attributes: Record<string, unknown>;
}

async function queryStateOverlay(
  url: string,
  name: string,
  bucket: string,
  lat: number,
  lng: number,
): Promise<OverlayHit | null> {
  try {
    const params = new URLSearchParams({
      geometry: `${lng},${lat}`,
      geometryType: 'esriGeometryPoint',
      spatialRel: 'esriSpatialRelIntersects',
      distance: '30',
      units: 'esriSRUnit_Meter',
      outFields: '*',
      returnGeometry: 'false',
      inSR: '4326',
      outSR: '4326',
      f: 'json',
    });

    const res = await fetch(`${url}?${params}`, {
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (data.features && data.features.length > 0) {
      return {
        layerId: 0,
        layerName: name,
        bucket,
        attributes: data.features[0].attributes || {},
      };
    }

    return null;
  } catch {
    return null;
  }
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
    const results = await Promise.all(
      Object.values(STATE_WIDE_OVERLAYS).map((overlay) =>
        queryStateOverlay(overlay.url, overlay.name, overlay.bucket, latNum, lngNum)
      )
    );

    const hits = results.filter((r): r is OverlayHit => r !== null);

    return NextResponse.json({ overlays: hits });
  } catch (error) {
    console.error('QLD overlays lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch overlay data. Please try again.' },
      { status: 500 }
    );
  }
}
