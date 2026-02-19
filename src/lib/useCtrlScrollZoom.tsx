'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook that prevents scroll-zoom on interactive map/3D containers unless Ctrl (or Cmd) is held.
 * Shows a brief tooltip overlay when user scrolls without modifier key.
 *
 * For MapLibre maps: pass the map instance via setMap() after initialization.
 * The hook will disable scrollZoom on the map and re-enable only while Ctrl is held.
 *
 * For non-MapLibre containers (e.g. Three.js canvas):
 * The hook intercepts wheel events on containerRef and forwards scroll to the page.
 */
export function useCtrlScrollZoom<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);
  const mapInstanceRef = useRef<{ scrollZoom: { enable(): void; disable(): void } } | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimer = useRef<NodeJS.Timeout | null>(null);

  const setMap = useCallback((map: { scrollZoom: { enable(): void; disable(): void } } | null) => {
    mapInstanceRef.current = map;
    if (map) {
      map.scrollZoom.disable();
    }
  }, []);

  const showTip = useCallback(() => {
    setShowTooltip(true);
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => setShowTooltip(false), 1500);
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Allow zoom — re-enable map scrollZoom temporarily
      if (mapInstanceRef.current) {
        mapInstanceRef.current.scrollZoom.enable();
        // Disable again after a short delay so next non-ctrl scroll is blocked
        setTimeout(() => {
          if (mapInstanceRef.current) mapInstanceRef.current.scrollZoom.disable();
        }, 200);
      }
      return;
    }

    // No modifier key — block map zoom, scroll the page instead
    e.preventDefault();
    e.stopPropagation();
    showTip();
    window.scrollBy({ top: e.deltaY, behavior: 'auto' });
  }, [showTip]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    };
  }, [handleWheel]);

  return { containerRef, showTooltip, setMap };
}

export function CtrlScrollTooltip() {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
      <div className="bg-black/70 text-white text-xs px-4 py-2 rounded-lg backdrop-blur-sm animate-fade-in">
        Hold <kbd className="mx-1 px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono">Ctrl</kbd> to zoom
      </div>
    </div>
  );
}
