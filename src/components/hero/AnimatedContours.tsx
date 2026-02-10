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

    // Simple noise function (no external dependency)
    const noise = (x: number, y: number, t: number): number => {
      const sx = Math.sin(x * 0.8 + t * 0.3) * 0.5;
      const sy = Math.cos(y * 0.6 + t * 0.2) * 0.5;
      const s1 = Math.sin(x * 1.4 + y * 0.9 + t * 0.15) * 0.3;
      const s2 = Math.cos(x * 0.5 - y * 1.3 + t * 0.25) * 0.4;
      const s3 = Math.sin((x + y) * 0.7 + t * 0.1) * 0.3;
      return (sx + sy + s1 + s2 + s3) / 2;
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const xStep = 6; // Horizontal spacing between vertical hash columns
      const yStep = 2; // Vertical scan resolution (fine for accurate crossing detection)
      const tickHalf = 9; // Half-height of each vertical tick mark (3× for wider contours)
      const numContours = 12;

      for (let c = 0; c < numContours; c++) {
        const threshold = (c / numContours) * 2 - 1;
        const alpha = 0.03 + (c % 3 === 0 ? 0.04 : 0);

        ctx.beginPath();
        ctx.strokeStyle = c % 4 === 0
          ? `rgba(184, 134, 11, ${alpha * 1.5})`
          : `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = c % 3 === 0 ? 1.2 : 0.6;

        for (let x = 0; x < w; x += xStep) {
          const nxBase = x / w * 1.33; // Stretched 3× wider (was 4)

          let prevVal: number | null = null;

          for (let y = 0; y < h; y += yStep) {
            const ny = y / h * 1.33; // Stretched 3× wider (was 4)

            // Mouse influence
            const dx = (x / w - mx) * 2;
            const dy = (y / h - my) * 2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.exp(-dist * dist * 2) * 0.4;

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

      time += 0.008;
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
      style={{ opacity: 0.6 }}
    />
  );
}
