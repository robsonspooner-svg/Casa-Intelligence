import { NextRequest, NextResponse } from 'next/server';

// ArcGIS World Geocoder — publicly available, no API key required for reasonable usage
const ARCGIS_GEOCODER_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';

// SEQ + Toowoomba bounding box for biasing results
const SEQ_LOCATION = '152.7,-27.5'; // Centre of search region
const SEQ_SEARCH_EXTENT = '151.5,-28.5,153.6,-26.0'; // SW lng/lat, NE lng/lat — includes Toowoomba

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address');

  if (!address || address.length < 3) {
    return NextResponse.json({ error: 'Address query required (min 3 chars)' }, { status: 400 });
  }

  try {
    // Append "QLD" if not already present to bias to Queensland
    const searchQuery = /qld|queensland/i.test(address) ? address : `${address}, QLD`;

    const params = new URLSearchParams({
      SingleLine: searchQuery,
      outFields: '*',
      maxLocations: '8',
      countryCode: 'AU',
      location: SEQ_LOCATION,
      searchExtent: SEQ_SEARCH_EXTENT,
      f: 'json',
    });

    const res = await fetch(`${ARCGIS_GEOCODER_URL}?${params}`, {
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Geocoder responded with ${res.status}`);
    }

    const data = await res.json();

    const candidates = (data.candidates || [])
      .filter((c: { location: { x: number; y: number }; score: number }) =>
        c.location && c.location.x !== 0 && c.location.y !== 0 && c.score > 60
      )
      .map((c: { address: string; location: { x: number; y: number }; score: number; attributes: Record<string, string> }) => ({
        address: c.address,
        lng: c.location.x,
        lat: c.location.y,
        score: c.score,
        suburb: c.attributes?.Nbrhd || c.attributes?.City || c.attributes?.Subregion || '',
      }));

    return NextResponse.json({ candidates });
  } catch (error) {
    console.error('Geocode error:', error);
    return NextResponse.json(
      { error: 'Failed to geocode address. Please try again.' },
      { status: 500 }
    );
  }
}
