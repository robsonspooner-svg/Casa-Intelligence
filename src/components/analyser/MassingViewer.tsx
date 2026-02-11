'use client';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import * as turf from '@turf/turf';
import { Box, Eye } from 'lucide-react';
import type { SiteParameters } from './ParameterPanel';
import { TYPICAL_SETBACKS, type ProductType } from '@/lib/feasibility-calc';

// ─── Material Presets ───────────────────────────────────────
const MATERIAL_PRESETS = {
  modern: { wall: '#1B1464', roof: '#374151', wallOver: '#dc2626', roofOver: '#991b1b' },
  traditional: { wall: '#78350f', roof: '#7f1d1d', wallOver: '#dc2626', roofOver: '#991b1b' },
  coastal: { wall: '#e2e8f0', roof: '#64748b', wallOver: '#fca5a5', roofOver: '#991b1b' },
};

// ─── Types ──────────────────────────────────────────────────
interface MassingViewerProps {
  params: SiteParameters;
  parcelGeometry: GeoJSON.Geometry | null;
  maxHeight: number | null;
  maxRealisticUnits?: number | null;
}

interface BuildingState {
  id: string;
  position: [number, number, number];
  width: number;
  depth: number;
  height: number;
  isOverHeight: boolean;
  isGhost: boolean;
}

// ─── Coordinate Helpers ─────────────────────────────────────
function computeCentroid(geometry: GeoJSON.Geometry): { lng: number; lat: number } | null {
  if (geometry.type !== 'Polygon' || !geometry.coordinates?.[0]) return null;
  const ring = geometry.coordinates[0];
  return {
    lng: ring.reduce((s, c) => s + c[0], 0) / ring.length,
    lat: ring.reduce((s, c) => s + c[1], 0) / ring.length,
  };
}

function geoToLocal(
  geometry: GeoJSON.Geometry,
  centroidOverride?: { lng: number; lat: number }
): { points: [number, number][]; width: number; depth: number } {
  if (geometry.type !== 'Polygon' || !geometry.coordinates || !geometry.coordinates[0]) {
    return { points: [], width: 40, depth: 25 };
  }
  const ring = geometry.coordinates[0];
  const centLng = centroidOverride?.lng ?? ring.reduce((s, c) => s + c[0], 0) / ring.length;
  const centLat = centroidOverride?.lat ?? ring.reduce((s, c) => s + c[1], 0) / ring.length;
  const mPerDegLat = 111320;
  const mPerDegLng = 111320 * Math.cos((centLat * Math.PI) / 180);
  const points: [number, number][] = ring.map((coord) => [
    (coord[0] - centLng) * mPerDegLng,
    (coord[1] - centLat) * mPerDegLat,
  ]);
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const width = Math.max(...xs) - Math.min(...xs);
  const depth = Math.max(...ys) - Math.min(...ys);
  return { points, width, depth };
}

// ─── Setback Polygon (turf.buffer inset) ────────────────────
function computeSetbackPolygon(
  geometry: GeoJSON.Geometry,
  productType: string,
  centroid: { lng: number; lat: number }
): [number, number][] | null {
  if (geometry.type !== 'Polygon') return null;
  const setbacks = TYPICAL_SETBACKS[productType as ProductType] || TYPICAL_SETBACKS.low_rise_apartment;
  const minSetback = Math.min(setbacks.front, setbacks.side, setbacks.rear);
  try {
    const feature = turf.feature(geometry);
    const buffered = turf.buffer(feature, -minSetback, { units: 'meters', steps: 16 });
    if (!buffered) return null;
    let ring: GeoJSON.Position[];
    if (buffered.geometry.type === 'MultiPolygon') {
      // Take the largest polygon
      let largest = buffered.geometry.coordinates[0];
      let largestArea = 0;
      for (const coords of buffered.geometry.coordinates) {
        const a = turf.area(turf.polygon(coords));
        if (a > largestArea) { largest = coords; largestArea = a; }
      }
      ring = largest[0];
    } else {
      ring = buffered.geometry.coordinates[0];
    }
    const mPerDegLat = 111320;
    const mPerDegLng = 111320 * Math.cos((centroid.lat * Math.PI) / 180);
    return ring.map(coord => [
      (coord[0] - centroid.lng) * mPerDegLng,
      (coord[1] - centroid.lat) * mPerDegLat,
    ] as [number, number]);
  } catch {
    return null;
  }
}

// ─── Building Layout Algorithm ──────────────────────────────
function computeBuildings(
  params: SiteParameters,
  parcelGeometry: GeoJSON.Geometry | null,
  maxHeight: number | null,
  setbackLocalPoints: [number, number][] | null,
  maxRealisticUnits?: number | null,
): BuildingState[] {
  const storeyHeight = 3.2;
  const buildingHeight = params.storeys * storeyHeight;
  const isOverHeight = maxHeight !== null && buildingHeight > maxHeight;
  const { numberOfUnits, floorAreaPerUnit } = params;

  // Compute usable area from setback polygon or fallback to bounding box
  let usableWidth: number;
  let usableDepth: number;
  if (setbackLocalPoints && setbackLocalPoints.length >= 3) {
    const xs = setbackLocalPoints.map(p => p[0]);
    const ys = setbackLocalPoints.map(p => p[1]);
    usableWidth = Math.max(...xs) - Math.min(...xs);
    usableDepth = Math.max(...ys) - Math.min(...ys);
  } else {
    let parcelWidth = 40;
    let parcelDepth = 25;
    if (parcelGeometry) {
      const local = geoToLocal(parcelGeometry);
      parcelWidth = local.width;
      parcelDepth = local.depth;
    }
    const setbacks = TYPICAL_SETBACKS[params.productType as ProductType] || TYPICAL_SETBACKS.low_rise_apartment;
    usableWidth = Math.max(parcelWidth - setbacks.side * 2, 8);
    usableDepth = Math.max(parcelDepth - setbacks.front - setbacks.rear, 8);
  }

  const unitFootprint = floorAreaPerUnit / params.storeys;
  const unitsPerBuilding = Math.max(1, Math.ceil(params.storeys <= 2 ? 1 : params.storeys <= 4 ? 4 : 8));
  const numBuildings = Math.max(1, Math.ceil(numberOfUnits / unitsPerBuilding));
  const buildingFootprint = unitFootprint * Math.min(unitsPerBuilding, numberOfUnits);
  const aspect = 1.6;
  let bWidth = Math.sqrt(buildingFootprint * aspect);
  let bDepth = buildingFootprint / bWidth;
  bWidth = Math.min(bWidth, usableWidth);
  bDepth = Math.min(bDepth, usableDepth);

  const gap = 3;
  const cols = Math.max(1, Math.floor((usableWidth + gap) / (bWidth + gap)));
  const rows = Math.max(1, Math.ceil(numBuildings / cols));
  const offsetX = -(Math.min(cols, numBuildings) * (bWidth + gap) - gap) / 2 + bWidth / 2;
  const offsetZ = -(rows * (bDepth + gap) - gap) / 2 + bDepth / 2;

  // Determine which buildings are "ghost" (over density cap)
  const maxRealBuildings = maxRealisticUnits != null
    ? Math.max(1, Math.ceil(maxRealisticUnits / unitsPerBuilding))
    : numBuildings;

  const result: BuildingState[] = [];
  for (let i = 0; i < numBuildings; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    result.push({
      id: `b-${i}`,
      position: [offsetX + col * (bWidth + gap), 0, offsetZ + row * (bDepth + gap)],
      width: bWidth,
      depth: bDepth,
      height: buildingHeight,
      isOverHeight,
      isGhost: i >= maxRealBuildings,
    });
  }
  return result;
}

// ─── 3D Scene Components ────────────────────────────────────
function ParcelGround({ geometry, centroid }: { geometry: GeoJSON.Geometry | null; centroid?: { lng: number; lat: number } }) {
  const shape = useMemo(() => {
    if (!geometry) {
      const s = new THREE.Shape();
      s.moveTo(-20, -12.5); s.lineTo(20, -12.5); s.lineTo(20, 12.5); s.lineTo(-20, 12.5); s.closePath();
      return s;
    }
    const { points } = geoToLocal(geometry, centroid);
    if (points.length < 3) {
      const s = new THREE.Shape();
      s.moveTo(-20, -12.5); s.lineTo(20, -12.5); s.lineTo(20, 12.5); s.lineTo(-20, 12.5); s.closePath();
      return s;
    }
    const s = new THREE.Shape();
    s.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) s.lineTo(points[i][0], points[i][1]);
    s.closePath();
    return s;
  }, [geometry, centroid]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color="#e8e5dc" transparent opacity={0.8} />
    </mesh>
  );
}

function ParcelOutline({ geometry, centroid }: { geometry: GeoJSON.Geometry | null; centroid?: { lng: number; lat: number } }) {
  const linePoints = useMemo((): [number, number, number][] => {
    if (!geometry) {
      return [[-20, 0.02, -12.5], [20, 0.02, -12.5], [20, 0.02, 12.5], [-20, 0.02, 12.5], [-20, 0.02, -12.5]];
    }
    const { points } = geoToLocal(geometry, centroid);
    if (points.length < 3) return [];
    return points.map((p) => [p[0], 0.02, -p[1]] as [number, number, number]);
  }, [geometry, centroid]);
  if (linePoints.length < 2) return null;
  return <Line points={linePoints} color="#1B1464" lineWidth={2} />;
}

function SetbackOutline({ setbackLocalPoints }: { setbackLocalPoints: [number, number][] | null }) {
  const linePoints = useMemo((): [number, number, number][] => {
    if (!setbackLocalPoints || setbackLocalPoints.length < 3) return [];
    return setbackLocalPoints.map((p) => [p[0], 0.03, -p[1]] as [number, number, number]);
  }, [setbackLocalPoints]);
  if (linePoints.length < 2) return null;
  return <Line points={linePoints} color="#B8860B" lineWidth={1.5} dashed dashSize={1} gapSize={0.5} />;
}

// ─── Roof Geometry ──────────────────────────────────────────
function RoofMesh({ width, depth, height, roofType, color }: {
  width: number; depth: number; height: number; roofType: string; color: string;
}) {
  if (roofType === 'gable') {
    const peakHeight = Math.min(width * 0.25, 3);
    const geo = useMemo(() => {
      const shape = new THREE.Shape();
      shape.moveTo(-width / 2, 0);
      shape.lineTo(0, peakHeight);
      shape.lineTo(width / 2, 0);
      shape.closePath();
      return new THREE.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: false });
    }, [width, depth, peakHeight]);
    return (
      <mesh geometry={geo} position={[0, height, -depth / 2]} rotation={[0, 0, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    );
  }
  if (roofType === 'hip') {
    const peakHeight = Math.min(width * 0.2, 2.5);
    const geo = useMemo(() => {
      const vertices = new Float32Array([
        // Base
        -width / 2, 0, -depth / 2,
        width / 2, 0, -depth / 2,
        width / 2, 0, depth / 2,
        -width / 2, 0, depth / 2,
        // Ridge (shorter line at top)
        -width / 4, peakHeight, 0,
        width / 4, peakHeight, 0,
      ]);
      const indices = [
        0, 1, 5, 0, 5, 4, // front slope
        1, 2, 5,           // right end
        2, 3, 4, 2, 4, 5,  // back slope
        3, 0, 4,            // left end
      ];
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      g.setIndex(indices);
      g.computeVertexNormals();
      return g;
    }, [width, depth, peakHeight]);
    return (
      <mesh geometry={geo} position={[0, height, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
    );
  }
  // Flat roof — thin slab
  return (
    <mesh position={[0, height + 0.15, 0]} castShadow>
      <boxGeometry args={[width + 0.3, 0.3, depth + 0.3]} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
  );
}

// ─── Single Building ────────────────────────────────────────
function BuildingVolume({
  building,
  isSelected,
  roofType,
  materialPreset,
  onClick,
}: {
  building: BuildingState;
  isSelected: boolean;
  roofType: string;
  materialPreset: string;
  onClick?: () => void;
}) {
  const preset = MATERIAL_PRESETS[materialPreset as keyof typeof MATERIAL_PRESETS] || MATERIAL_PRESETS.modern;
  const isGhost = building.isGhost;
  const wallColor = isGhost ? '#dc2626' : building.isOverHeight ? preset.wallOver : preset.wall;
  const roofColor = isGhost ? '#991b1b' : building.isOverHeight ? preset.roofOver : preset.roof;
  const wallOpacity = isGhost ? 0.25 : building.isOverHeight ? 0.7 : 0.85;
  const wireColor = isGhost ? '#fca5a5' : isSelected ? '#ffffff' : building.isOverHeight ? '#fca5a5' : '#4338ca';

  return (
    <group position={building.position}>
      {/* Wall */}
      <mesh
        position={[0, building.height / 2, 0]}
        castShadow={!isGhost}
        receiveShadow={!isGhost}
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      >
        <boxGeometry args={[building.width, building.height, building.depth]} />
        <meshStandardMaterial
          color={wallColor}
          transparent
          opacity={wallOpacity}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Wireframe */}
      <mesh position={[0, building.height / 2, 0]}>
        <boxGeometry args={[building.width, building.height, building.depth]} />
        <meshBasicMaterial
          color={wireColor}
          wireframe
          transparent={isGhost}
          opacity={isGhost ? 0.4 : 1}
        />
      </mesh>
      {/* Roof — skip for ghosts */}
      {!isGhost && (
        <RoofMesh
          width={building.width}
          depth={building.depth}
          height={building.height}
          roofType={roofType}
          color={roofColor}
        />
      )}
    </group>
  );
}

// ─── Draggable Building (plan view) ─────────────────────────
function DraggableBuildingVolume({
  building,
  isSelected,
  roofType,
  materialPreset,
  onSelect,
  onPositionChange,
  onDragStart,
  onDragEnd,
}: {
  building: BuildingState;
  isSelected: boolean;
  roofType: string;
  materialPreset: string;
  onSelect: () => void;
  onPositionChange: (pos: [number, number, number]) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; z: number; pointerX: number; pointerZ: number } | null>(null);
  const { camera, raycaster, gl } = useThree();
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onSelect();
    isDraggingRef.current = true;
    onDragStart();

    // Store starting position
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeRef.current, intersection);
    dragStartRef.current = {
      x: building.position[0],
      z: building.position[2],
      pointerX: intersection.x,
      pointerZ: intersection.z,
    };

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current || !dragStartRef.current) return;
      const rect = gl.domElement.getBoundingClientRect();
      const mouseX = ((moveEvent.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((moveEvent.clientY - rect.top) / rect.height) * 2 + 1;
      const ray = new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersection = new THREE.Vector3();
      ray.ray.intersectPlane(planeRef.current, intersection);
      if (intersection) {
        const dx = intersection.x - dragStartRef.current.pointerX;
        const dz = intersection.z - dragStartRef.current.pointerZ;
        onPositionChange([
          dragStartRef.current.x + dx,
          0,
          dragStartRef.current.z + dz,
        ]);
      }
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      dragStartRef.current = null;
      onDragEnd();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }, [building.position, camera, gl, onDragEnd, onDragStart, onPositionChange, onSelect, raycaster]);

  const preset = MATERIAL_PRESETS[materialPreset as keyof typeof MATERIAL_PRESETS] || MATERIAL_PRESETS.modern;
  const isGhost = building.isGhost;
  const wallColor = isGhost ? '#dc2626' : building.isOverHeight ? preset.wallOver : preset.wall;
  const roofColor = isGhost ? '#991b1b' : building.isOverHeight ? preset.roofOver : preset.roof;

  return (
    <group ref={groupRef} position={building.position}>
      <mesh
        position={[0, building.height / 2, 0]}
        onPointerDown={handlePointerDown}
        castShadow={!isGhost}
      >
        <boxGeometry args={[building.width, building.height, building.depth]} />
        <meshStandardMaterial
          color={wallColor}
          transparent
          opacity={isGhost ? 0.25 : 0.85}
          roughness={0.3}
        />
      </mesh>
      {/* Selection outline */}
      <mesh position={[0, building.height / 2, 0]}>
        <boxGeometry args={[building.width + 0.2, building.height + 0.2, building.depth + 0.2]} />
        <meshBasicMaterial
          color={isGhost ? '#fca5a5' : isSelected ? '#6366f1' : '#4338ca'}
          wireframe
          transparent={isGhost}
          opacity={isGhost ? 0.4 : 1}
        />
      </mesh>
      {/* Roof */}
      {!isGhost && (
        <RoofMesh
          width={building.width}
          depth={building.depth}
          height={building.height}
          roofType={roofType}
          color={roofColor}
        />
      )}
      {/* Selection indicator */}
      {isSelected && (
        <Html position={[0, building.height + 1.5, 0]} center>
          <div className="bg-indigo-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
            Drag to move
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── Snap Guides ────────────────────────────────────────────
function SnapGuides({ buildings, selectedId }: { buildings: BuildingState[]; selectedId: string | null }) {
  const guides = useMemo(() => {
    if (!selectedId) return [];
    const selected = buildings.find(b => b.id === selectedId);
    if (!selected) return [];
    const lines: { points: [number, number, number][] }[] = [];
    const threshold = 0.5;
    for (const other of buildings) {
      if (other.id === selectedId) continue;
      // X alignment (centers)
      if (Math.abs(selected.position[0] - other.position[0]) < threshold) {
        lines.push({
          points: [
            [selected.position[0], 0.1, Math.min(selected.position[2], other.position[2]) - 5],
            [selected.position[0], 0.1, Math.max(selected.position[2], other.position[2]) + 5],
          ],
        });
      }
      // Z alignment (centers)
      if (Math.abs(selected.position[2] - other.position[2]) < threshold) {
        lines.push({
          points: [
            [Math.min(selected.position[0], other.position[0]) - 5, 0.1, selected.position[2]],
            [Math.max(selected.position[0], other.position[0]) + 5, 0.1, selected.position[2]],
          ],
        });
      }
    }
    return lines;
  }, [buildings, selectedId]);

  return (
    <>
      {guides.map((g, i) => (
        <Line key={i} points={g.points} color="#10b981" lineWidth={0.5} dashed dashSize={0.3} gapSize={0.2} />
      ))}
    </>
  );
}

// ─── Site Layout Overlay (plan view) ────────────────────────
function SiteLayoutOverlay({
  buildings,
  parcelGeometry,
  centroid,
}: {
  buildings: BuildingState[];
  parcelGeometry: GeoJSON.Geometry | null;
  centroid?: { lng: number; lat: number };
}) {
  const elements = useMemo(() => {
    if (!parcelGeometry || buildings.length === 0) return null;
    const { points } = geoToLocal(parcelGeometry, centroid);
    if (points.length < 3) return null;

    // Find the "front" edge — the edge with the most negative Y in local space (closest to street)
    const ys = points.map(p => p[1]);
    const minY = Math.min(...ys);
    const frontPoints = points.filter(p => Math.abs(p[1] - minY) < 2);
    const frontMidX = frontPoints.length > 0
      ? frontPoints.reduce((s, p) => s + p[0], 0) / frontPoints.length
      : 0;

    // Nearest building to front
    const nearestBuilding = buildings.reduce((closest, b) => {
      const dist = Math.abs(b.position[2] - (-minY));
      return dist < Math.abs(closest.position[2] - (-minY)) ? b : closest;
    }, buildings[0]);

    // Driveway from front edge midpoint to nearest building
    const drivewayWidth = 3.5;
    const drivewayStartZ = -minY;
    const drivewayEndZ = nearestBuilding.position[2] + nearestBuilding.depth / 2 + 1;

    // Parking spots along one side of driveway
    const parkingSpots: { x: number; z: number }[] = [];
    const spotW = 2.6;
    const spotD = 5.4;
    const numSpots = Math.min(buildings.length, 6);
    for (let i = 0; i < numSpots; i++) {
      parkingSpots.push({
        x: frontMidX + drivewayWidth / 2 + spotW / 2 + 0.5,
        z: drivewayStartZ - (i * (spotW + 0.3)) - spotW / 2,
      });
    }

    return { frontMidX, drivewayWidth, drivewayStartZ, drivewayEndZ, parkingSpots, spotW, spotD };
  }, [buildings, parcelGeometry, centroid]);

  if (!elements) return null;
  const { frontMidX, drivewayWidth, drivewayStartZ, drivewayEndZ, parkingSpots, spotW, spotD } = elements;

  const drivewayLength = Math.abs(drivewayEndZ - drivewayStartZ);
  const drivewayMidZ = (drivewayStartZ + drivewayEndZ) / 2;

  return (
    <group>
      {/* Driveway */}
      <mesh position={[frontMidX, 0.005, drivewayMidZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[drivewayWidth, drivewayLength]} />
        <meshStandardMaterial color="#9ca3af" transparent opacity={0.6} />
      </mesh>

      {/* Parking spots */}
      {parkingSpots.map((spot, i) => (
        <group key={i}>
          <mesh position={[spot.x, 0.005, spot.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[spotD, spotW]} />
            <meshStandardMaterial color="#d1d5db" transparent opacity={0.4} />
          </mesh>
          <Line
            points={[
              [spot.x - spotD / 2, 0.01, spot.z - spotW / 2],
              [spot.x + spotD / 2, 0.01, spot.z - spotW / 2],
              [spot.x + spotD / 2, 0.01, spot.z + spotW / 2],
              [spot.x - spotD / 2, 0.01, spot.z + spotW / 2],
              [spot.x - spotD / 2, 0.01, spot.z - spotW / 2],
            ]}
            color="#ffffff"
            lineWidth={1}
          />
        </group>
      ))}

      {/* Labels */}
      <Html position={[frontMidX, 0.1, drivewayMidZ]} center>
        <span className="text-[7px] text-gray-500 font-mono whitespace-nowrap select-none bg-white/80 px-1 rounded">
          Driveway
        </span>
      </Html>
    </group>
  );
}

// ─── Height Ruler ───────────────────────────────────────────
function HeightRuler({
  maxHeight,
  parcelGeometry,
  buildingHeight,
  centroid,
}: {
  maxHeight: number;
  parcelGeometry: GeoJSON.Geometry | null;
  buildingHeight: number;
  centroid?: { lng: number; lat: number };
}) {
  let w = 40;
  let d = 25;
  if (parcelGeometry) {
    const local = geoToLocal(parcelGeometry, centroid);
    w = local.width;
    d = local.depth;
  }
  const rulerX = w / 2 + 2;
  const rulerZ = -d / 2;
  const topMark = Math.ceil(maxHeight / 5) * 5 + 5;
  const ticks: number[] = [];
  for (let h = 0; h <= topMark; h += 5) ticks.push(h);
  const ringHw = w / 2 + 1;
  const ringHd = d / 2 + 1;
  const ringPoints: [number, number, number][] = [
    [-ringHw, maxHeight, -ringHd], [ringHw, maxHeight, -ringHd],
    [ringHw, maxHeight, ringHd], [-ringHw, maxHeight, ringHd], [-ringHw, maxHeight, -ringHd],
  ];

  return (
    <group>
      <Line points={[[rulerX, 0, rulerZ], [rulerX, topMark, rulerZ]]} color="#94a3b8" lineWidth={1} />
      {ticks.map((h) => (
        <group key={h}>
          <Line points={[[rulerX - 0.5, h, rulerZ], [rulerX + 0.5, h, rulerZ]]} color="#94a3b8" lineWidth={1} />
          <Html position={[rulerX + 2.5, h, rulerZ]} center>
            <span className="text-[8px] text-slate-400 font-mono whitespace-nowrap select-none">{h}m</span>
          </Html>
        </group>
      ))}
      <Line points={ringPoints} color="#ef4444" lineWidth={1.5} dashed dashSize={1.5} gapSize={1} />
      <Html position={[ringHw + 3, maxHeight, -ringHd]} center>
        <div className="bg-red-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap shadow-sm">{maxHeight}m limit</div>
      </Html>
      <Line points={[[rulerX - 1, buildingHeight, rulerZ], [rulerX + 1, buildingHeight, rulerZ]]} color={buildingHeight > maxHeight ? '#ef4444' : '#1B1464'} lineWidth={2} />
      <Html position={[rulerX + 4.5, buildingHeight, rulerZ]} center>
        <div className={`text-[9px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap shadow-sm ${buildingHeight > maxHeight ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-indigo-100 text-indigo-700 border border-indigo-300'}`}>{buildingHeight.toFixed(1)}m</div>
      </Html>
    </group>
  );
}

function GroundGrid() {
  return <gridHelper args={[100, 20, '#d4d4d4', '#e5e5e5']} position={[0, -0.02, 0]} />;
}

function AutoFitCamera({ parcelGeometry, centroid }: { parcelGeometry: GeoJSON.Geometry | null; centroid?: { lng: number; lat: number } }) {
  const { camera } = useThree();
  useEffect(() => {
    let dist = 60;
    if (parcelGeometry) {
      const local = geoToLocal(parcelGeometry, centroid);
      dist = Math.max(local.width, local.depth) * 1.5;
    }
    // Always reset to a clean 3D perspective position
    camera.position.set(dist * 0.6, dist * 0.5, dist * 0.6);
    camera.up.set(0, 1, 0); // Ensure Y-up orientation for 3D view
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount — runs fresh each time 3D canvas remounts
  return null;
}

function PlanViewCamera({ parcelGeometry, centroid, zoom }: { parcelGeometry: GeoJSON.Geometry | null; centroid?: { lng: number; lat: number }; zoom: number }) {
  const { camera } = useThree();
  useEffect(() => {
    // Position directly above looking straight down
    camera.position.set(0, 200, 0);
    camera.up.set(0, 0, -1); // Z-axis points "up" on screen for proper north orientation
    camera.lookAt(0, 0, 0);
    // Set zoom for orthographic camera
    if ('zoom' in camera) {
      (camera as THREE.OrthographicCamera).zoom = zoom;
    }
    camera.updateProjectionMatrix();
  }, [camera, parcelGeometry, centroid, zoom]);
  return null;
}

// ─── Main Component ─────────────────────────────────────────
export default function MassingViewer({ params, parcelGeometry, maxHeight, maxRealisticUnits }: MassingViewerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'plan'>('3d');
  const [buildings, setBuildings] = useState<BuildingState[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  // Compute centroid and setback polygon
  const centroid = useMemo(() => parcelGeometry ? computeCentroid(parcelGeometry) : null, [parcelGeometry]);
  const setbackLocalPoints = useMemo(() => {
    if (!parcelGeometry || !centroid) return null;
    return computeSetbackPolygon(parcelGeometry, params.productType, centroid);
  }, [parcelGeometry, centroid, params.productType]);

  // Reset buildings when params change
  useEffect(() => {
    const newBuildings = computeBuildings(params, parcelGeometry, maxHeight, setbackLocalPoints, maxRealisticUnits);
    setBuildings(newBuildings);
    setSelectedId(null);
  }, [params, parcelGeometry, maxHeight, setbackLocalPoints, maxRealisticUnits]);

  const updateBuildingPosition = useCallback((id: string, pos: [number, number, number]) => {
    setBuildings(prev => prev.map(b => b.id === id ? { ...b, position: pos } : b));
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-surface rounded-xl border border-border/50 h-full min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-casa-navy/5 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-casa-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0022 16z" />
            </svg>
          </div>
          <p className="text-xs text-text-secondary">Loading 3D viewer...</p>
        </div>
      </div>
    );
  }

  const storeyHeight = 3.2;
  const buildingHeight = params.storeys * storeyHeight;
  const isOverHeight = maxHeight !== null && buildingHeight > maxHeight;
  const cObj = centroid ?? undefined;

  let orthoZoom = 8;
  if (parcelGeometry && centroid) {
    const local = geoToLocal(parcelGeometry, centroid);
    const maxDim = Math.max(local.width, local.depth);
    orthoZoom = Math.max(4, 400 / maxDim);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-text-primary">3D Massing Study</h3>
        <div className="flex items-center gap-1">
          <button onClick={() => setViewMode('3d')} className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${viewMode === '3d' ? 'bg-casa-navy text-white' : 'bg-subtle text-text-tertiary hover:text-text-secondary'}`}>
            <Box className="w-3 h-3" /> 3D
          </button>
          <button onClick={() => setViewMode('plan')} className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${viewMode === 'plan' ? 'bg-casa-navy text-white' : 'bg-subtle text-text-tertiary hover:text-text-secondary'}`}>
            <Eye className="w-3 h-3" /> Plan
          </button>
          {isOverHeight && (
            <span className="text-[9px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full ml-1">Exceeds height limit</span>
          )}
        </div>
      </div>

      <div className="bg-[#f8f7f5] rounded-xl border border-border/50 overflow-hidden relative flex-1 min-h-[300px]">
        {viewMode === '3d' ? (
          <Canvas shadows camera={{ position: [40, 30, 40], fov: 45, near: 0.1, far: 2000 }} gl={{ antialias: true, alpha: true }}>
            <color attach="background" args={['#f8f7f5']} />
            <fog attach="fog" args={['#f8f7f5', 300, 600]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[60, 80, 40]} intensity={1.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-far={400} shadow-camera-left={-120} shadow-camera-right={120} shadow-camera-top={120} shadow-camera-bottom={-120} />
            <AutoFitCamera parcelGeometry={parcelGeometry} centroid={cObj} />
            <GroundGrid />
            <ParcelGround geometry={parcelGeometry} centroid={cObj} />
            <ParcelOutline geometry={parcelGeometry} centroid={cObj} />
            <SetbackOutline setbackLocalPoints={setbackLocalPoints} />
            {buildings.map((b) => (
              <BuildingVolume key={b.id} building={b} isSelected={false} roofType={params.roofType} materialPreset={params.materialPreset} />
            ))}
            {maxHeight !== null && (
              <HeightRuler maxHeight={maxHeight} parcelGeometry={parcelGeometry} buildingHeight={buildingHeight} centroid={cObj} />
            )}
            <ContactShadows position={[0, -0.01, 0]} opacity={0.3} scale={100} blur={2} far={40} />
            <OrbitControls enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 2 - 0.05} minDistance={5} maxDistance={500} />
          </Canvas>
        ) : (
          <Canvas orthographic camera={{ zoom: orthoZoom, position: [0, 200, 0], up: [0, 0, -1], near: 0.1, far: 500 }} gl={{ antialias: true, alpha: true }}>
            <color attach="background" args={['#f8f7f5']} />
            <ambientLight intensity={0.7} />
            <directionalLight position={[0, 50, 0]} intensity={0.8} />
            <PlanViewCamera parcelGeometry={parcelGeometry} centroid={cObj} zoom={orthoZoom} />
            <GroundGrid />
            <ParcelGround geometry={parcelGeometry} centroid={cObj} />
            <ParcelOutline geometry={parcelGeometry} centroid={cObj} />
            <SetbackOutline setbackLocalPoints={setbackLocalPoints} />
            {buildings.map((b) => (
              <DraggableBuildingVolume
                key={b.id}
                building={b}
                isSelected={b.id === selectedId}
                roofType={params.roofType}
                materialPreset={params.materialPreset}
                onSelect={() => setSelectedId(b.id)}
                onPositionChange={(pos) => updateBuildingPosition(b.id, pos)}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
              />
            ))}
            <SnapGuides buildings={buildings} selectedId={selectedId} />
            <OrbitControls enablePan enableZoom enableRotate={false} enabled={!isDragging} minZoom={2} maxZoom={50} />
          </Canvas>
        )}

        {/* Legend */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-[9px] space-y-0.5 shadow-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: MATERIAL_PRESETS[params.materialPreset as keyof typeof MATERIAL_PRESETS]?.wall || '#1B1464' }} />
            <span className="text-text-secondary">Building ({buildingHeight.toFixed(1)}m)</span>
          </div>
          {maxHeight !== null && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-0.5" style={{ borderTop: '1.5px dashed #ef4444' }} />
              <span className="text-text-secondary">Height limit ({maxHeight}m)</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#e8e5dc] border border-[#ccc]" />
            <span className="text-text-secondary">Parcel</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-0.5" style={{ borderTop: '1.5px dashed #B8860B' }} />
            <span className="text-text-secondary">Setback</span>
          </div>
          {buildings.some(b => b.isGhost) && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-red-500/25 border border-red-300" />
              <span className="text-red-600">Over capacity</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-[9px] text-text-tertiary leading-relaxed mt-1">
        Indicative massing only. {viewMode === '3d' ? 'Drag to rotate, scroll to zoom.' : 'Click a building to select, drag to reposition. Scroll to zoom.'}
      </p>
    </div>
  );
}
