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
  minFrontageM?: number;
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

export default function SubdivisionMap({ lat, lng, parcelGeometry, overlays, zoneName, subdivided, lotCount, minFrontageM }: SubdivisionMapProps) {
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

            // Subdivision visualisation: street-frontage-aware, area-balanced lots.
            //
            // Strategy:
            //   1. Detect the street-facing edge (closest parcel edge to geocoded point)
            //   2. Measure real frontage in metres using turf.distance (geodesic)
            //   3. If all lots fit side-by-side with compliant frontage → MODE A (strips)
            //   4. Otherwise → MODE B (battle-axe: front lots + driveway + rear lots)
            //   5. Use binary search to find equal-area split points rather than equal-width
            //   6. Label the driveway as "Access Easement" when shared by multiple rear lots
            if (subdivided && parcelGeometry.type === 'Polygon' && lotCount >= 2) {
              try {
                const turf = require('@turf/turf');
                const feature = turf.feature(parcelGeometry);
                const ring = parcelGeometry.coordinates[0]; // outer ring
                const pad = 0.001;
                const labelFeatures: GeoJSON.Feature[] = [];

                // --- 1) Find the street-facing edge ---
                let bestEdgeIdx = 0;
                let bestDist = Infinity;
                for (let j = 0; j < ring.length - 1; j++) {
                  const [ex, ey] = ring[j];
                  const [fx, fy] = ring[j + 1];
                  const dx = fx - ex;
                  const dy = fy - ey;
                  const lenSq = dx * dx + dy * dy;
                  if (lenSq === 0) continue;
                  const t = Math.max(0, Math.min(1, ((lng - ex) * dx + (lat - ey) * dy) / lenSq));
                  const px = ex + t * dx;
                  const py = ey + t * dy;
                  const dist = Math.sqrt((lng - px) ** 2 + (lat - py) ** 2);
                  if (dist < bestDist) {
                    bestDist = dist;
                    bestEdgeIdx = j;
                  }
                }

                // --- 2) Street edge vector and coordinate system ---
                const [ax, ay] = ring[bestEdgeIdx];
                const [bx, by] = ring[bestEdgeIdx + 1];
                const edgeDx = bx - ax;
                const edgeDy = by - ay;
                const edgeLen = Math.sqrt(edgeDx * edgeDx + edgeDy * edgeDy);
                const ux = edgeDx / edgeLen; // unit along street
                const uy = edgeDy / edgeLen;

                // Perpendicular — ensure it points INTO the parcel
                let perpX = -uy;
                let perpY = ux;
                const parcelCentroid = turf.centroid(feature);
                const ctrX = parcelCentroid.geometry.coordinates[0];
                const ctrY = parcelCentroid.geometry.coordinates[1];
                const midX = (ax + bx) / 2;
                const midY = (ay + by) / 2;
                if ((ctrX - midX) * perpX + (ctrY - midY) * perpY < 0) {
                  perpX = -perpX;
                  perpY = -perpY;
                }

                // --- 3) Project all vertices onto the local coordinate system ---
                let minAlong = Infinity, maxAlong = -Infinity;
                let minDepth = Infinity, maxDepth = -Infinity;
                for (const coord of ring) {
                  const along = (coord[0] - ax) * ux + (coord[1] - ay) * uy;
                  const depth = (coord[0] - ax) * perpX + (coord[1] - ay) * perpY;
                  if (along < minAlong) minAlong = along;
                  if (along > maxAlong) maxAlong = along;
                  if (depth < minDepth) minDepth = depth;
                  if (depth > maxDepth) maxDepth = depth;
                }
                const frontageSpan = maxAlong - minAlong;
                const depthSpan = maxDepth - minDepth;
                const clipPad = depthSpan * 0.15;

                // Geodesic frontage measurement (metres) using turf.distance
                const frontageM = turf.distance(
                  turf.point(ring[bestEdgeIdx]),
                  turf.point(ring[bestEdgeIdx + 1]),
                  { units: 'meters' },
                );
                const reqFrontage = minFrontageM || 10;
                const frontLotsMax = Math.max(1, Math.floor(frontageM / reqFrontage));
                const totalAreaM2 = turf.area(feature);

                // --- Helpers ---
                const addLot = (clipped: GeoJSON.Feature, index: number, label: string) => {
                  const color = LOT_COLORS[index % LOT_COLORS.length];
                  const sid = `lot-${index}`;
                  map.addSource(sid, { type: 'geojson', data: clipped });
                  map.addLayer({ id: `${sid}-fill`, type: 'fill', source: sid, paint: { 'fill-color': color, 'fill-opacity': 0.18 } });
                  map.addLayer({ id: `${sid}-outline`, type: 'line', source: sid, paint: { 'line-color': color, 'line-width': 2, 'line-opacity': 0.8 } });
                  const c = turf.centroid(clipped);
                  const m2 = Math.round(turf.area(clipped));
                  labelFeatures.push({ ...c, properties: { label: `${label}\n${m2.toLocaleString()}m²` } });
                };

                const buildClippedRect = (a0: number, a1: number, d0: number, d1: number) => {
                  const corners = [
                    [ax + a0 * ux + d0 * perpX, ay + a0 * uy + d0 * perpY],
                    [ax + a1 * ux + d0 * perpX, ay + a1 * uy + d0 * perpY],
                    [ax + a1 * ux + d1 * perpX, ay + a1 * uy + d1 * perpY],
                    [ax + a0 * ux + d1 * perpX, ay + a0 * uy + d1 * perpY],
                    [ax + a0 * ux + d0 * perpX, ay + a0 * uy + d0 * perpY],
                  ];
                  return turf.intersect(turf.featureCollection([feature, turf.polygon([corners])]));
                };

                // Binary search for the split position along an axis that gives a target area
                const findEqualAreaSplit = (
                  splitAxis: 'along' | 'depth',
                  rangeMin: number, rangeMax: number,
                  fixedMin: number, fixedMax: number,
                  targetArea: number,
                ): number => {
                  let lo = rangeMin, hi = rangeMax;
                  for (let iter = 0; iter < 20; iter++) {
                    const mid = (lo + hi) / 2;
                    let clipped;
                    if (splitAxis === 'along') {
                      clipped = buildClippedRect(rangeMin - pad, mid, fixedMin - clipPad, fixedMax + clipPad);
                    } else {
                      clipped = buildClippedRect(fixedMin - pad, fixedMax + pad, rangeMin - clipPad, mid);
                    }
                    const area = clipped ? turf.area(clipped) : 0;
                    if (area < targetArea) { lo = mid; } else { hi = mid; }
                  }
                  return (lo + hi) / 2;
                };

                // --- 4) Layout decision ---
                if (frontLotsMax >= lotCount) {
                  // MODE A: All lots fit side-by-side — split along the frontage for equal areas
                  const targetPerLot = totalAreaM2 / lotCount;
                  let prevSplit = minAlong;
                  for (let i = 0; i < lotCount; i++) {
                    let splitEnd: number;
                    if (i === lotCount - 1) {
                      splitEnd = maxAlong;
                    } else {
                      splitEnd = findEqualAreaSplit('along', prevSplit, maxAlong, minDepth, maxDepth, targetPerLot);
                    }
                    const a0 = i === 0 ? prevSplit - pad * edgeLen : prevSplit;
                    const a1 = i === lotCount - 1 ? splitEnd + pad * edgeLen : splitEnd;
                    const clipped = buildClippedRect(a0, a1, minDepth - clipPad, maxDepth + clipPad);
                    if (clipped) addLot(clipped, i, `Lot ${i + 1}`);
                    prevSplit = splitEnd;
                  }
                } else {
                  // MODE B: Battle-axe layout
                  //
                  // The driveway runs PERPENDICULAR to the street (along the depth axis),
                  // hugging one side boundary from the street all the way to the rear.
                  // This is how real battle-axe subdivisions work in SEQ:
                  //
                  //   ┌──────────┬───┐
                  //   │          │ D │  ← Driveway runs full depth along side boundary
                  //   │  Lot 1   │ r │
                  //   │ (front)  │ i │
                  //   ├──────────┤ v │
                  //   │          │ e │
                  //   │  Lot 2   │ w │
                  //   │ (rear)   │ a │
                  //   │          │ y │
                  //   └──────────┴───┘
                  //        STREET
                  //
                  const drivewayM = 3.5; // standard driveway width
                  const drivewayFrac = drivewayM / frontageM;
                  const drivewayDeg = drivewayFrac * frontageSpan;

                  const frontLotCount = Math.min(frontLotsMax, lotCount - 1);
                  const rearLotCount = lotCount - frontLotCount;

                  // Driveway strip: runs along one side (maxAlong edge) from street to rear
                  const drivewayAlongStart = maxAlong - drivewayDeg;

                  // The usable width for lots is everything minus the driveway
                  const lotAlongStart = minAlong;
                  const lotAlongEnd = drivewayAlongStart;

                  // Find depth split that balances area between front and rear lot rows
                  // Front lots get (frontLotCount / lotCount) share of the usable area
                  // (usable = total minus driveway area)
                  const usablePoly = buildClippedRect(lotAlongStart - pad, lotAlongEnd, minDepth - clipPad, maxDepth + clipPad);
                  const usableArea = usablePoly ? turf.area(usablePoly) : totalAreaM2;
                  const frontTargetArea = usableArea * (frontLotCount / lotCount);
                  const depthSplit = findEqualAreaSplit(
                    'depth', minDepth, maxDepth, lotAlongStart, lotAlongEnd, frontTargetArea,
                  );

                  let lotIdx = 0;

                  // Front lots: street to depthSplit, minus driveway width
                  if (frontLotCount === 1) {
                    const fl = buildClippedRect(lotAlongStart - pad, lotAlongEnd, minDepth - clipPad, depthSplit);
                    if (fl) addLot(fl, lotIdx, `Lot ${lotIdx + 1}`);
                    lotIdx++;
                  } else {
                    const frontTotalArea = (() => {
                      const c = buildClippedRect(lotAlongStart - pad, lotAlongEnd, minDepth - clipPad, depthSplit);
                      return c ? turf.area(c) : frontTargetArea;
                    })();
                    const frontPerLot = frontTotalArea / frontLotCount;
                    let prevFront = lotAlongStart;
                    for (let i = 0; i < frontLotCount; i++) {
                      let splitEnd: number;
                      if (i === frontLotCount - 1) {
                        splitEnd = lotAlongEnd;
                      } else {
                        splitEnd = findEqualAreaSplit('along', prevFront, lotAlongEnd, minDepth, depthSplit, frontPerLot);
                      }
                      const a0 = i === 0 ? prevFront - pad : prevFront;
                      const fl = buildClippedRect(a0, splitEnd, minDepth - clipPad, depthSplit);
                      if (fl) addLot(fl, lotIdx, `Lot ${lotIdx + 1}`);
                      lotIdx++;
                      prevFront = splitEnd;
                    }
                  }

                  // Rear lots: depthSplit to maxDepth, minus driveway width
                  if (rearLotCount === 1) {
                    const rl = buildClippedRect(lotAlongStart - pad, lotAlongEnd, depthSplit, maxDepth + clipPad);
                    if (rl) addLot(rl, lotIdx, `Lot ${lotIdx + 1}`);
                    lotIdx++;
                  } else {
                    const rearTotalArea = (() => {
                      const c = buildClippedRect(lotAlongStart - pad, lotAlongEnd, depthSplit, maxDepth + clipPad);
                      return c ? turf.area(c) : usableArea - frontTargetArea;
                    })();
                    const rearPerLot = rearTotalArea / rearLotCount;
                    let prevRear = lotAlongStart;
                    for (let i = 0; i < rearLotCount; i++) {
                      let splitEnd: number;
                      if (i === rearLotCount - 1) {
                        splitEnd = lotAlongEnd;
                      } else {
                        splitEnd = findEqualAreaSplit('along', prevRear, lotAlongEnd, depthSplit, maxDepth, rearPerLot);
                      }
                      const a0 = i === 0 ? prevRear - pad : prevRear;
                      const a1 = i === rearLotCount - 1 ? splitEnd + pad : splitEnd;
                      const rl = buildClippedRect(a0, a1, depthSplit, maxDepth + clipPad);
                      if (rl) addLot(rl, lotIdx, `Lot ${lotIdx + 1}`);
                      lotIdx++;
                      prevRear = splitEnd;
                    }
                  }

                  // Driveway / access easement: full depth along the side boundary
                  const drivewayPoly = buildClippedRect(drivewayAlongStart, maxAlong + pad, minDepth - clipPad, maxDepth + clipPad);
                  if (drivewayPoly) {
                    map.addSource('driveway', { type: 'geojson', data: drivewayPoly });
                    map.addLayer({ id: 'driveway-fill', type: 'fill', source: 'driveway', paint: { 'fill-color': '#9ca3af', 'fill-opacity': 0.3 } });
                    map.addLayer({ id: 'driveway-outline', type: 'line', source: 'driveway', paint: { 'line-color': '#6b7280', 'line-width': 1.5, 'line-opacity': 0.7, 'line-dasharray': [3, 2] } });
                    const dwC = turf.centroid(drivewayPoly);
                    labelFeatures.push({ ...dwC, properties: { label: rearLotCount > 1 ? 'Access\nEasement' : 'Driveway' } });
                  }
                }

                // Street frontage indicator (dashed amber line)
                map.addSource('street-frontage', {
                  type: 'geojson',
                  data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [ring[bestEdgeIdx], ring[bestEdgeIdx + 1]] }, properties: {} },
                });
                map.addLayer({
                  id: 'street-frontage-line', type: 'line', source: 'street-frontage',
                  paint: { 'line-color': '#f59e0b', 'line-width': 4, 'line-opacity': 0.9, 'line-dasharray': [2, 1] },
                });

                if (labelFeatures.length > 0) {
                  map.addSource('lot-labels-src', { type: 'geojson', data: { type: 'FeatureCollection', features: labelFeatures } });
                  map.addLayer({
                    id: 'lot-labels', type: 'symbol', source: 'lot-labels-src',
                    layout: { 'text-field': ['get', 'label'], 'text-size': 11, 'text-font': ['Open Sans Bold'], 'text-anchor': 'center' },
                    paint: { 'text-color': '#1B1464', 'text-halo-color': '#ffffff', 'text-halo-width': 2 },
                  });
                }
              } catch {
                // Turf not available or intersection failed — no subdivision overlay
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
  }, [lat, lng, parcelGeometry, subdivided, lotCount, overlays, zoneName, minFrontageM]);

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
