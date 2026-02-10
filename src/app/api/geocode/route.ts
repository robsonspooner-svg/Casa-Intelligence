import { NextRequest, NextResponse } from 'next/server';

// ArcGIS World Geocoder — publicly available, no API key required for reasonable usage
const ARCGIS_GEOCODER_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';

// Sunshine Coast bounding box for biasing results
const SC_LOCATION = '153.1,-26.7'; // Centre of Sunshine Coast
const SC_SEARCH_EXTENT = '152.7,-27.0,153.2,-26.3'; // SW lng/lat, NE lng/lat

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
      location: SC_LOCATION,
      searchExtent: SC_SEARCH_EXTENT,
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
