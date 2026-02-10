'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedContours() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let lastFrameTime = 0;
    const FRAME_INTERVAL = 1000 / 30; // Cap at 30fps — the slow drift doesn't need 60

    // Render at half resolution for performance, CSS scales it up
    const RENDER_SCALE = 0.5;

    let renderW = 0;
    let renderH = 0;
    let displayW = 0;
    let displayH = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      displayW = rect.width;
      displayH = rect.height;
      renderW = Math.ceil(displayW * RENDER_SCALE);
      renderH = Math.ceil(displayH * RENDER_SCALE);
      canvas.width = renderW;
      canvas.height = renderH;
    };

    // Multi-octave noise for rich, natural contour patterns
    const noise = (x: number, y: number, t: number): number => {
      const s1 = Math.sin(x * 1.2 + t * 0.25) * 0.5;
      const s2 = Math.cos(y * 0.9 + t * 0.18) * 0.5;
      const s3 = Math.sin(x * 1.8 + y * 1.1 + t * 0.12) * 0.35;
      const s4 = Math.cos(x * 0.7 - y * 1.6 + t * 0.2) * 0.4;
      const s5 = Math.sin((x + y) * 1.1 + t * 0.08) * 0.25;
      const s6 = Math.cos((x * 1.5 - y * 0.8) + t * 0.15) * 0.2;
      const s7 = Math.sin(x * 2.5 + y * 2.2 + t * 0.1) * 0.15;
      const s8 = Math.cos(x * 3.0 - y * 1.8 + t * 0.06) * 0.1;
      return (s1 + s2 + s3 + s4 + s5 + s6 + s7 + s8) / 2.45;
    };

    // Grid step in render-space pixels
    const xStep = 3; // ~6px display equiv at half res
    const yStep = 2; // ~4px display equiv
    const tickHalf = 5; // ~10px display equiv

    const draw = (timestamp: number) => {
      animationId = requestAnimationFrame(draw);

      // Throttle to 30fps
      if (timestamp - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = timestamp;

      if (renderW === 0 || renderH === 0) return;

      ctx.clearRect(0, 0, renderW, renderH);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Step 1: Compute noise field once — reuse for all 24 contour levels
      const cols = Math.ceil(renderW / xStep);
      const rows = Math.ceil(renderH / yStep);
      const field = new Float32Array(cols * rows);

      for (let xi = 0; xi < cols; xi++) {
        const x = xi * xStep;
        const nx = (x / renderW) * 3.5;
        const mxDx = (x / renderW - mx) * 2;

        for (let yi = 0; yi < rows; yi++) {
          const y = yi * yStep;
          const ny = (y / renderH) * 3.5;

          const myDy = (y / renderH - my) * 2;
          const distSq = mxDx * mxDx + myDy * myDy;
          const influence = Math.exp(-distSq * 1.8) * 0.5;

          field[xi * rows + yi] = noise(nx, ny, time) + influence;
        }
      }

      // Step 2: March contours against pre-computed field
      const numContours = 24;

      for (let c = 0; c < numContours; c++) {
        const threshold = (c / numContours) * 2 - 1;
        const isMajor = c % 4 === 0;
        const isMid = c % 2 === 0;
        const alpha = isMajor ? 0.14 : isMid ? 0.08 : 0.05;

        ctx.beginPath();
        ctx.strokeStyle = isMajor
          ? `rgba(184, 134, 11, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = isMajor ? 1.5 : isMid ? 1 : 0.7;

        for (let xi = 0; xi < cols; xi++) {
          const x = xi * xStep;
          const colOffset = xi * rows;

          for (let yi = 1; yi < rows; yi++) {
            const val = field[colOffset + yi];
            const prevVal = field[colOffset + yi - 1];

            const crossed = (prevVal < threshold && val >= threshold) ||
                            (prevVal >= threshold && val < threshold);
            if (crossed) {
              const t = (threshold - prevVal) / (val - prevVal);
              const crossY = ((yi - 1) + t) * yStep;
              ctx.moveTo(x, crossY - tickHalf);
              ctx.lineTo(x, crossY + tickHalf);
            }
          }
        }

        ctx.stroke();
      }

      time += 0.006;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    resize();
    animationId = requestAnimationFrame(draw);

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7, imageRendering: 'auto' }}
    />
  );
}
