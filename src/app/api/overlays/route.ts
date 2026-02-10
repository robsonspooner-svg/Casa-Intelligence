import { NextRequest, NextResponse } from 'next/server';

const SCC_OVERLAYS_BASE =
  'https://services-ap1.arcgis.com/YQyt7djuXN7rQyg4/arcgis/rest/services/PlanningScheme_SunshineCoast_Overlays_SCC_OpenData/FeatureServer';

// Key planning overlay layers to query
const OVERLAY_LAYERS = [
  { id: 0, name: 'Acid Sulfate Soils', bucket: 'environment' },
  { id: 32, name: 'High Bushfire Hazard Area', bucket: 'bushfire' },
  { id: 33, name: 'High Bushfire Hazard Area Buffer', bucket: 'bushfire' },
  { id: 34, name: 'Medium Bushfire Hazard Area', bucket: 'bushfire' },
  { id: 35, name: 'Medium Bushfire Hazard Area Buffer', bucket: 'bushfire' },
  { id: 37, name: 'Coastal Protection Area', bucket: 'coastal' },
  { id: 46, name: 'Flooding and Inundation Area', bucket: 'flood' },
  { id: 47, name: 'Drainage Deficient Areas', bucket: 'flood' },
  { id: 49, name: 'Specific Site Note (Height)', bucket: 'height' },
  { id: 50, name: 'Maximum Height of Buildings and Structures', bucket: 'height' },
  { id: 52, name: 'Local Heritage Place (Shipwreck)', bucket: 'heritage' },
  { id: 53, name: 'State Heritage Place', bucket: 'heritage' },
  { id: 54, name: 'Local Heritage Place', bucket: 'heritage' },
  { id: 55, name: 'Land In Proximity to a Local Heritage Place', bucket: 'heritage' },
  { id: 56, name: 'Character Building', bucket: 'character' },
  { id: 57, name: 'Character Area', bucket: 'character' },
  { id: 58, name: 'Landslide Hazard Area', bucket: 'landslide' },
  { id: 59, name: 'Steep Land (Slope)', bucket: 'slope' },
  { id: 24, name: 'Waterways', bucket: 'waterways' },
  { id: 26, name: 'Riparian Protection Area', bucket: 'waterways' },
  { id: 27, name: 'Ramsar Wetlands', bucket: 'wetlands' },
  { id: 28, name: 'Wetlands', bucket: 'wetlands' },
  { id: 30, name: 'Native Vegetation Area', bucket: 'biodiversity' },
  { id: 62, name: 'High Voltage Electricity Line and Buffer (Distribution)', bucket: 'infrastructure' },
  { id: 63, name: 'High Voltage Electricity Line and Buffer (Transmission)', bucket: 'infrastructure' },
  { id: 70, name: 'Scenic Route', bucket: 'scenic' },
];

const CONCURRENCY = 8;

interface OverlayHit {
  layerId: number;
  layerName: string;
  bucket: string;
  attributes: Record<string, unknown>;
}

async function queryLayer(
  layerId: number,
  layerName: string,
  bucket: string,
  lat: number,
  lng: number
): Promise<OverlayHit | null> {
  try {
    const params = new URLSearchParams({
      geometry: JSON.stringify({ x: lng, y: lat }),
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

    const res = await fetch(`${SCC_OVERLAYS_BASE}/${layerId}/query?${params}`, {
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (data.features && data.features.length > 0) {
      return {
        layerId,
        layerName,
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
    // Query layers with concurrency limit
    const hits: OverlayHit[] = [];
    const chunks: typeof OVERLAY_LAYERS[] = [];

    for (let i = 0; i < OVERLAY_LAYERS.length; i += CONCURRENCY) {
      chunks.push(OVERLAY_LAYERS.slice(i, i + CONCURRENCY));
    }

    for (const chunk of chunks) {
      const results = await Promise.all(
        chunk.map((layer) => queryLayer(layer.id, layer.name, layer.bucket, latNum, lngNum))
      );
      for (const result of results) {
        if (result) hits.push(result);
      }
    }

    return NextResponse.json({ overlays: hits });
  } catch (error) {
    console.error('Overlays lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch overlay data. Please try again.' },
      { status: 500 }
    );
  }
}
