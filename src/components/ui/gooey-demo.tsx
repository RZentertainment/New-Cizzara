"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PixelRevealCanvas } from "./PixelRevealCanvas";

function GooeyDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [pixelSize, setPixelSize] = useState(110);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const update = () =>
      setPixelSize(window.innerWidth < 768 ? 80 : 110);
    update();

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  // ── Listen for the first click to flip isAnimating ─────────────────────────
  useEffect(() => {
    if (isCompleted) return;
    const onFirstClick = () => {
      if (!isAnimating && !isCompleted) setIsAnimating(true);
    };
    window.addEventListener("click", onFirstClick, { once: true });
    window.addEventListener("touchend", onFirstClick, { once: true });
    return () => {
      window.removeEventListener("click", onFirstClick);
      window.removeEventListener("touchend", onFirstClick);
    };
  }, [isAnimating, isCompleted]);

  const handleRevealComplete = useCallback(() => {
    setIsAnimating(false);
    setIsCompleted(true);
  }, []);

  const hintText = isCompleted
    ? null
    : isAnimating
    ? "Revealing…"
    : "Click anywhere to reveal";

  return (
    <div
      className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-black"
      style={{ cursor: isCompleted ? "default" : "none" }}
    >
      {!isCompleted && <CursorDot />}

      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source
          src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAre.mp4"
          type="video/mp4"
        />
      </video>

      {!isCompleted && (
        <PixelRevealCanvas
          pixelSize={pixelSize}
          trailLength={22}
          onRevealComplete={handleRevealComplete}
        />
      )}

      <div
        className="relative flex flex-col items-center justify-center gap-5 px-6 text-center select-none"
        style={{ zIndex: 20, pointerEvents: "none" }}
      >
        <p
          className="text-white font-bold leading-[1.1] tracking-tight max-w-[720px]"
          style={{
            fontSize: "clamp(2rem, 6vw, 5rem)",
            textShadow:
              "0 2px 40px rgba(0,0,0,0.8), 0 0 80px rgba(0,0,0,0.5)",
            fontFamily: "'Georgia', serif",
          }}
        >
          Speaking things into existence
        </p>

        <span
          className="text-sm tracking-[0.22em] uppercase transition-opacity duration-700"
          style={{
            fontFamily: "system-ui, sans-serif",
            color: isCompleted ? "transparent" : "rgba(255,255,255,0.45)",
            opacity: isCompleted ? 0 : 1,
          }}
        >
          {hintText ?? ""}
        </span>
      </div>
    </div>
  );
}

function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    const loop = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${posRef.current.x - 6}px, ${posRef.current.y - 6}px)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 w-3 h-3 rounded-full bg-white pointer-events-none mix-blend-difference"
      style={{ zIndex: 50, willChange: "transform" }}
    />
  );
}

export { GooeyDemo };