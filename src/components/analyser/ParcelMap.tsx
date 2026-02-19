'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { useCtrlScrollZoom, CtrlScrollTooltip } from '@/lib/useCtrlScrollZoom';
import 'maplibre-gl/dist/maplibre-gl.css';

interface ParcelMapProps {
  lat: number;
  lng: number;
  parcelGeometry: GeoJSON.Geometry | null;
  zoneGeometry?: GeoJSON.Geometry | null;
}

export default function ParcelMap({ lat, lng, parcelGeometry }: ParcelMapProps) {
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
                tiles: [
                  'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                ],
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

        setMap(map);

        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

        map.on('load', () => {
          setIsLoaded(true);

          // Add parcel boundary if available
          if (parcelGeometry) {
            map.addSource('parcel', {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: parcelGeometry,
                properties: {},
              },
            });

            map.addLayer({
              id: 'parcel-fill',
              type: 'fill',
              source: 'parcel',
              paint: {
                'fill-color': '#1B1464',
                'fill-opacity': 0.15,
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

            // Fit bounds to parcel
            try {
              const turf = require('@turf/turf');
              const bbox = turf.bbox({ type: 'Feature', geometry: parcelGeometry, properties: {} });
              map.fitBounds(
                [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
                { padding: 60, maxZoom: 18, duration: 800 }
              );
            } catch {
              // Fallback: just center on the point
            }
          }

          // Add a marker at the searched point
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
  }, [lat, lng, parcelGeometry]);

  if (error) {
    return (
      <div className="bg-surface rounded-card border border-border/50 p-8 text-center">
        <MapPin className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
        <p className="text-sm text-text-secondary">{error}</p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="relative rounded-card overflow-hidden border border-border/50 h-full flex flex-col">
      {showTooltip && <CtrlScrollTooltip />}
      <div ref={mapContainer} className="w-full flex-1 min-h-[300px]" />
      {!isLoaded && (
        <div className="absolute inset-0 bg-surface flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-casa-navy animate-spin" />
        </div>
      )}
    </div>
  );
}
