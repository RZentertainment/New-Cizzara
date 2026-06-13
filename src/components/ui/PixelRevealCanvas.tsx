"use client";

import { useEffect, useRef, useCallback } from "react";

interface PixelRevealCanvasProps {
  pixelSize?: number;
  trailLength?: number;
}

interface GridCell {
  x: number;
  y: number;
  opacity: number;
  timestamp: number;
}

const PixelRevealCanvas: React.FC<PixelRevealCanvasProps> = ({
  pixelSize = 64,
  trailLength = 18,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef<number>(0);
  const trailRef = useRef<GridCell[]>([]);
  const lastCellRef = useRef<{ x: number; y: number } | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });

  // Initialize canvas with solid black fill
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    dimensionsRef.current = { width, height, dpr };

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctxRef.current = ctx;

    // Fill entirely black on init
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
  }, []);

  // Snap mouse position to pixel grid
  const snapToGrid = useCallback(
    (clientX: number, clientY: number, rect: DOMRect) => {
      const x = Math.floor((clientX - rect.left) / pixelSize);
      const y = Math.floor((clientY - rect.top) / pixelSize);
      return { x, y };
    },
    [pixelSize]
  );

  // Render loop using requestAnimationFrame
  const render = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const { width, height } = dimensionsRef.current;
    const now = performance.now();

    // Redraw the full black overlay
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    // Erase squares for each trail cell using destination-out
    ctx.globalCompositeOperation = "destination-out";

    for (const cell of trailRef.current) {
      const age = now - cell.timestamp;
      const maxAge = 1200; // ms trail persists
      const alpha = Math.max(0, 1 - age / maxAge);

      if (alpha <= 0) continue;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fillRect(
        cell.x * pixelSize,
        cell.y * pixelSize,
        pixelSize,
        pixelSize
      );
    }

    // Reset composite op and alpha
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    // Prune expired cells
    trailRef.current = trailRef.current.filter(
      (c) => now - c.timestamp < 1200
    );

    rafRef.current = requestAnimationFrame(render);
  }, [pixelSize]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const { x, y } = snapToGrid(e.clientX, e.clientY, rect);

      const last = lastCellRef.current;
      if (last && last.x === x && last.y === y) return;

      lastCellRef.current = { x, y };

      const now = performance.now();

      // Remove existing entry for this cell (refresh it)
      trailRef.current = trailRef.current.filter(
        (c) => !(c.x === x && c.y === y)
      );

      trailRef.current.push({ x, y, opacity: 1, timestamp: now });

      // Keep trail bounded
      if (trailRef.current.length > trailLength * 3) {
        trailRef.current = trailRef.current.slice(-trailLength * 3);
      }
    },
    [snapToGrid, trailLength]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || !e.touches[0]) return;

      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const { x, y } = snapToGrid(touch.clientX, touch.clientY, rect);

      const last = lastCellRef.current;
      if (last && last.x === x && last.y === y) return;

      lastCellRef.current = { x, y };
      const now = performance.now();

      trailRef.current = trailRef.current.filter(
        (c) => !(c.x === x && c.y === y)
      );
      trailRef.current.push({ x, y, opacity: 1, timestamp: now });
    },
    [snapToGrid]
  );

  const handleResize = useCallback(() => {
    trailRef.current = [];
    lastCellRef.current = null;
    initCanvas();
  }, [initCanvas]);

  useEffect(() => {
    initCanvas();
    rafRef.current = requestAnimationFrame(render);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [initCanvas, render, handleMouseMove, handleTouchMove, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
};

export { PixelRevealCanvas };
export type { PixelRevealCanvasProps };