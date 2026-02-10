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

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    // Multi-octave noise for rich, natural contour patterns
    const noise = (x: number, y: number, t: number): number => {
      // Primary large-scale terrain
      const s1 = Math.sin(x * 1.2 + t * 0.25) * 0.5;
      const s2 = Math.cos(y * 0.9 + t * 0.18) * 0.5;
      const s3 = Math.sin(x * 1.8 + y * 1.1 + t * 0.12) * 0.35;
      const s4 = Math.cos(x * 0.7 - y * 1.6 + t * 0.2) * 0.4;
      // Medium-scale ridges
      const s5 = Math.sin((x + y) * 1.1 + t * 0.08) * 0.25;
      const s6 = Math.cos((x * 1.5 - y * 0.8) + t * 0.15) * 0.2;
      // Fine detail
      const s7 = Math.sin(x * 2.5 + y * 2.2 + t * 0.1) * 0.15;
      const s8 = Math.cos(x * 3.0 - y * 1.8 + t * 0.06) * 0.1;
      return (s1 + s2 + s3 + s4 + s5 + s6 + s7 + s8) / 2.45;
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const xStep = 4;
      const yStep = 2;
      const tickHalf = 10;
      const numContours = 24;

      for (let c = 0; c < numContours; c++) {
        const threshold = (c / numContours) * 2 - 1;
        const isMajor = c % 4 === 0;
        const isMid = c % 2 === 0;

        // Higher base alpha so contours are actually visible
        const alpha = isMajor ? 0.14 : isMid ? 0.08 : 0.05;

        ctx.beginPath();
        ctx.strokeStyle = isMajor
          ? `rgba(184, 134, 11, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = isMajor ? 1.5 : isMid ? 1 : 0.7;

        for (let x = 0; x < w; x += xStep) {
          // Higher frequency = tighter contour spacing across the canvas
          const nxBase = x / w * 3.5;

          let prevVal: number | null = null;

          for (let y = 0; y < h; y += yStep) {
            const ny = y / h * 3.5;

            // Mouse influence — subtle terrain warp near cursor
            const dx = (x / w - mx) * 2;
            const dy = (y / h - my) * 2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.exp(-dist * dist * 1.8) * 0.5;

            const val = noise(nxBase, ny, time) + influence;

            // Detect threshold crossing between this sample and the previous
            if (prevVal !== null) {
              const crossed = (prevVal < threshold && val >= threshold) ||
                              (prevVal >= threshold && val < threshold);
              if (crossed) {
                // Interpolate exact crossing y position
                const t = (threshold - prevVal) / (val - prevVal);
                const crossY = (y - yStep) + t * yStep;

                // Draw a short vertical tick at the crossing point
                ctx.moveTo(x, crossY - tickHalf);
                ctx.lineTo(x, crossY + tickHalf);
              }
            }

            prevVal = val;
          }
        }

        ctx.stroke();
      }

      time += 0.006;
      animationId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    resize();
    draw();

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
      style={{ opacity: 0.7 }}
    />
  );
}
