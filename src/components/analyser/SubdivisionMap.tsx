'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { useCtrlScrollZoom, CtrlScrollTooltip } from '@/lib/useCtrlScrollZoom';
import 'maplibre-gl/dist/maplibre-gl.css';

interface OverlayHit {
  layerId: number;
  layerName: string;
  bucket: string;
  attributes: Record<string, unknown>;
}

interface SubdivisionMapProps {
  lat: number;
  lng: number;
  parcelGeometry: GeoJSON.Geometry | null;
  overlays: OverlayHit[];
  zoneName: string | null;
  subdivided: boolean;
  lotCount: number;
}

const OVERLAY_COLORS: Record<string, string> = {
  flood: '#3b82f6',
  bushfire: '#f97316',
  heritage: '#8b5cf6',
  character: '#a855f7',
  landslide: '#ef4444',
  slope: '#ef4444',
  coastal: '#06b6d4',
  waterways: '#0ea5e9',
  wetlands: '#14b8a6',
  biodiversity: '#22c55e',
  environment: '#16a34a',
  infrastructure: '#6b7280',
  scenic: '#a3a3a3',
};

const LOT_COLORS = ['#1B1464', '#16a34a', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6', '#ec4899'];

export default function SubdivisionMap({ lat, lng, parcelGeometry, overlays, zoneName, subdivided, lotCount }: SubdivisionMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { containerRef: scrollRef, showTooltip, setMap } = useCtrlScrollZoom();

  useEffect(() => {
    if (!mapContainer.current) return;

    let map: maplibregl.Map;

    const initMap = async () => {
      try {
        const maplibregl = await import('maplibre-gl');

        map = new maplibregl.Map({
          container: mapContainer.current!,
          style: {
            version: 8,
            sources: {
              'osm-tiles': {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '&copy; OpenStreetMap contributors',
              },
            },
            layers: [
              {
                id: 'osm-tiles',
                type: 'raster',
                source: 'osm-tiles',
                minzoom: 0,
                maxzoom: 19,
              },
            ],
          },
          center: [lng, lat],
          zoom: 17,
          attributionControl: false,
        });

        // Disable scroll zoom — hook re-enables only when Ctrl is held
        setMap(map);

        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

        map.on('load', () => {
          setIsLoaded(true);

          if (parcelGeometry) {
            // Main parcel boundary
            map.addSource('parcel', {
              type: 'geojson',
              data: { type: 'Feature', geometry: parcelGeometry, properties: {} },
            });

            map.addLayer({
              id: 'parcel-fill',
              type: 'fill',
              source: 'parcel',
              paint: {
                'fill-color': '#1B1464',
                'fill-opacity': 0.12,
              },
            });

            map.addLayer({
              id: 'parcel-outline',
              type: 'line',
              source: 'parcel',
              paint: {
                'line-color': '#1B1464',
                'line-width': 2.5,
                'line-opacity': 0.9,
              },
            });

            // If subdivided, create N lot polygons by slicing bbox strips and clipping to parcel
            if (subdivided && parcelGeometry.type === 'Polygon' && lotCount >= 2) {
              try {
                const turf = require('@turf/turf');
                const feature = turf.feature(parcelGeometry);
                const bbox = turf.bbox(feature);
                const width = bbox[2] - bbox[0];
                const height = bbox[3] - bbox[1];
                const splitHorizontally = width > height;
                const pad = 0.001;
                const labelFeatures: GeoJSON.Feature[] = [];

                for (let i = 0; i < lotCount; i++) {
                  let stripPoly;
                  if (splitHorizontally) {
                    const stripWidth = width / lotCount;
                    const x0 = bbox[0] + i * stripWidth;
                    const x1 = bbox[0] + (i + 1) * stripWidth;
                    stripPoly = turf.bboxPolygon([
                      x0 - (i === 0 ? pad : 0),
                      bbox[1] - pad,
                      x1 + (i === lotCount - 1 ? pad : 0),
                      bbox[3] + pad,
                    ]);
                  } else {
                    const stripHeight = height / lotCount;
                    const y0 = bbox[1] + i * stripHeight;
                    const y1 = bbox[1] + (i + 1) * stripHeight;
                    stripPoly = turf.bboxPolygon([
                      bbox[0] - pad,
                      y0 - (i === 0 ? pad : 0),
                      bbox[2] + pad,
                      y1 + (i === lotCount - 1 ? pad : 0),
                    ]);
                  }

                  const clipped = turf.intersect(turf.featureCollection([feature, stripPoly]));
                  if (!clipped) continue;

                  const color = LOT_COLORS[i % LOT_COLORS.length];
                  const sourceId = `lot-${i}`;

                  map.addSource(sourceId, { type: 'geojson', data: clipped });
                  map.addLayer({
                    id: `${sourceId}-fill`,
                    type: 'fill',
                    source: sourceId,
                    paint: { 'fill-color': color, 'fill-opacity': 0.18 },
                  });
                  map.addLayer({
                    id: `${sourceId}-outline`,
                    type: 'line',
                    source: sourceId,
                    paint: { 'line-color': color, 'line-width': 2, 'line-opacity': 0.8 },
                  });

                  const centroid = turf.centroid(clipped);
                  const areaM2 = Math.round(turf.area(clipped));
                  labelFeatures.push({
                    ...centroid,
                    properties: { label: `Lot ${i + 1}\n${areaM2.toLocaleString()}m²` },
                  });
                }

                if (labelFeatures.length > 0) {
                  map.addSource('lot-labels-src', {
                    type: 'geojson',
                    data: { type: 'FeatureCollection', features: labelFeatures },
                  });
                  map.addLayer({
                    id: 'lot-labels',
                    type: 'symbol',
                    source: 'lot-labels-src',
                    layout: {
                      'text-field': ['get', 'label'],
                      'text-size': 11,
                      'text-font': ['Open Sans Bold'],
                      'text-anchor': 'center',
                    },
                    paint: {
                      'text-color': '#1B1464',
                      'text-halo-color': '#ffffff',
                      'text-halo-width': 2,
                    },
                  });
                }
              } catch {
                // Turf not available or intersection failed
              }
            }

            // Fit bounds
            try {
              const turf = require('@turf/turf');
              const bbox = turf.bbox({ type: 'Feature', geometry: parcelGeometry, properties: {} });
              map.fitBounds(
                [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
                { padding: 60, maxZoom: 18, duration: 800 }
              );
            } catch {
              // Fallback
            }
          }

          // Marker
          new maplibregl.Marker({ color: '#1B1464' })
            .setLngLat([lng, lat])
            .addTo(map);
        });

        mapRef.current = map;
      } catch (err) {
        console.error('Map init error:', err);
        setError('Map could not be loaded');
      }
    };

    initMap();

    return () => {
      if (map) map.remove();
    };
  }, [lat, lng, parcelGeometry, subdivided, lotCount, overlays, zoneName]);

  if (error) {
    return (
      <div className="bg-surface rounded-card border border-border/50 p-8 text-center">
        <MapPin className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
        <p className="text-sm text-text-secondary">{error}</p>
      </div>
    );
  }

  // Build overlay legend
  const activeOverlays = overlays.filter((o) => OVERLAY_COLORS[o.bucket]);

  return (
    <div className="space-y-2">
      <div ref={scrollRef} className="relative rounded-card overflow-hidden border border-border/50" style={{ height: 500 }}>
        {showTooltip && <CtrlScrollTooltip />}
        <div ref={mapContainer} className="w-full h-full" />
        {!isLoaded && (
          <div className="absolute inset-0 bg-surface flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-casa-navy animate-spin" />
          </div>
        )}

        {/* Zone badge */}
        {zoneName && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
            <p className="text-[10px] text-text-tertiary uppercase tracking-wider">Zoning</p>
            <p className="text-xs font-semibold text-casa-navy">{zoneName}</p>
          </div>
        )}

        {/* Overlay legend */}
        {activeOverlays.length > 0 && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-2 shadow-sm space-y-1">
            <p className="text-[9px] text-text-tertiary uppercase tracking-wider font-medium">Overlays</p>
            {activeOverlays.map((o) => (
              <div key={o.bucket} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: OVERLAY_COLORS[o.bucket] || '#6b7280' }}
                />
                <span className="text-[10px] text-text-secondary">{o.layerName}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
