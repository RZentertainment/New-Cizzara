"use client";

import { useEffect, useRef, useCallback } from "react";

interface GridCell {
  x: number;
  y: number;
  timestamp: number;
}

interface WaveCell {
  x: number;
  y: number;
  delay: number;
  startedAt: number;
}

export interface PixelRevealCanvasProps {
  pixelSize?: number;
  trailLength?: number;
  onRevealComplete?: () => void;
}

const PixelRevealCanvas: React.FC<PixelRevealCanvasProps> = ({
  pixelSize = 64,
  trailLength = 22,
  onRevealComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef<number>(0);

  // Mouse-trail state
  const trailRef = useRef<GridCell[]>([]);
  const lastCellRef = useRef<{ x: number; y: number } | null>(null);

  // Dimensions cache
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });

  const isCompletedRef = useRef(false);
  const isAnimatingRef = useRef(false);

  const waveCellsRef = useRef<WaveCell[]>([]);
  const waveTriggeredAtRef = useRef<number>(0);
  const waveMaxDelayRef = useRef<number>(0);
  
  /** Per-cell fade duration (ms) */
  const FADE_DURATION = 300;
  /** Wave propagation speed: ms per pixel of distance from click */
  const WAVE_SPEED = 1.4; // lower = faster spread

  // ── Canvas init ────────────────────────────────────────────────────────────

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

    // Solid black overlay on init
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
  }, []);

  // ── Grid helpers ───────────────────────────────────────────────────────────

  const snapToGrid = useCallback(
    (clientX: number, clientY: number, rect: DOMRect) => ({
      x: Math.floor((clientX - rect.left) / pixelSize),
      y: Math.floor((clientY - rect.top) / pixelSize),
    }),
    [pixelSize]
  );

  // ── Click → build wave ──────────────────────────────────────────────────────

  const triggerWave = useCallback(
    (clickX: number, clickY: number) => {
      if (isCompletedRef.current || isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      const { width, height } = dimensionsRef.current;
      const cols = Math.ceil(width / pixelSize);
      const rows = Math.ceil(height / pixelSize);

      // Grid cell of the click origin
      const originCol = Math.floor(clickX / pixelSize);
      const originRow = Math.floor(clickY / pixelSize);

      const cells: WaveCell[] = [];
      let maxDelay = 0;
      const now = performance.now();

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const dx = col - originCol;
          const dy = row - originRow;
          // Euclidean distance in grid-cell units → convert to px
          const distPx = Math.sqrt(dx * dx + dy * dy) * pixelSize;
          const delay = distPx * WAVE_SPEED;
          if (delay > maxDelay) maxDelay = delay;
          cells.push({ x: col, y: row, delay, startedAt: now });
        }
      }

      waveCellsRef.current = cells;
      waveMaxDelayRef.current = maxDelay;
      waveTriggeredAtRef.current = now;
    },
    [pixelSize]
  );

  // ── Render loop ────────────────────────────────────────────────────────────

  const render = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const { width, height } = dimensionsRef.current;
    const now = performance.now();

    if (isCompletedRef.current) {
      // Fully revealed — clear canvas entirely and stop loop
      ctx.clearRect(0, 0, width, height);
      return;
    }

    if (isAnimatingRef.current) {
      // ── Wave cascade phase ────────────────────────────────────────────────
      // Draw black overlay; then erase each cell as its delay elapses
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "destination-out";

      let allGone = true;

      for (const cell of waveCellsRef.current) {
        const elapsed = now - cell.startedAt - cell.delay;
        if (elapsed < 0) {
          // Not yet started — cell is still fully black
          allGone = false;
          continue;
        }
        const progress = Math.min(elapsed / FADE_DURATION, 1);
        if (progress < 1) allGone = false;

        // Easing: ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        ctx.globalAlpha = eased;
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(
          cell.x * pixelSize,
          cell.y * pixelSize,
          pixelSize,
          pixelSize
        );
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (allGone) {
        // Animation complete
        isCompletedRef.current = true;
        isAnimatingRef.current = false;
        ctx.clearRect(0, 0, width, height);
        onRevealComplete?.();
        return; // Stop the RAF loop
      }
    } else {
      // ── Normal mouse-trail phase ──────────────────────────────────────────
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "destination-out";

      for (const cell of trailRef.current) {
        const age = now - cell.timestamp;
        const maxAge = 1200;
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

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      trailRef.current = trailRef.current.filter(
        (c) => now - c.timestamp < 1200
      );
    }

    rafRef.current = requestAnimationFrame(render);
  }, [pixelSize, onRevealComplete]);

  // ── React event handlers ──────────────────────────────────────────────────

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isCompletedRef.current || isAnimatingRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const { x, y } = snapToGrid(e.clientX, e.clientY, rect);

      const last = lastCellRef.current;
      if (last && last.x === x && last.y === y) return;
      lastCellRef.current = { x, y };

      const now = performance.now();
      trailRef.current = trailRef.current.filter(
        (c) => !(c.x === x && c.y === y)
      );
      trailRef.current.push({ x, y, timestamp: now });
      if (trailRef.current.length > trailLength * 3) {
        trailRef.current = trailRef.current.slice(-trailLength * 3);
      }
    },
    [snapToGrid, trailLength]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isCompletedRef.current || isAnimatingRef.current) return;
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
      trailRef.current.push({ x, y, timestamp: now });
    },
    [snapToGrid]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isCompletedRef.current || isAnimatingRef.current) return;
      triggerWave(e.clientX, e.clientY);
      // Kick render loop back on (it might be idle when trail is empty)
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(render);
    },
    [triggerWave, render]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (isCompletedRef.current || isAnimatingRef.current) return;
      const touch = e.changedTouches[0];
      if (!touch) return;
      triggerWave(touch.clientX, touch.clientY);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(render);
    },
    [triggerWave, render]
  );

  // ── Resize handler ────────────────────────────────────────────────────────

  const handleResize = useCallback(() => {
    if (isCompletedRef.current) return;
    trailRef.current = [];
    lastCellRef.current = null;
    waveCellsRef.current = [];
    isAnimatingRef.current = false;
    initCanvas();
  }, [initCanvas]);

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  useEffect(() => {
    initCanvas();
    rafRef.current = requestAnimationFrame(render);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [initCanvas, render, handleResize]); // ✅ Fixed: only 3 stable dependencies

  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 10 }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};

export { PixelRevealCanvas };