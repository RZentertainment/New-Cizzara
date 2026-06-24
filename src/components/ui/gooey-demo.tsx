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
  className="relative flex flex-col items-center justify-center select-none"
  style={{
    zIndex: 20,
    pointerEvents: "none",
    fontFamily: "'Georgia', serif",
  }}
>
  {/* WE TRY TO */}
  <div className="absolute left-[-140px] top-0">
    <div className="border-t border-b border-white/40 py-1 px-2 inline-block">
      <span className="text-white text-[10px] md:text-xs tracking-[0.25em] uppercase leading-tight">
        WE TRY
        <br />
        TO
      </span>
    </div>  
  </div>

        {/* Grid text layout */}
        <div className="flex flex-col items-left mt-20 gap-2 md:gap-8">
          {/* Row 1: M A K E */}
          <div className="flex gap-4 md:gap-6 lg:gap-8">
            {['M', 'A', 'K', 'E'].map((char, index) => (
              <span 
                key={`row1-${index}`}
                className="text-white text-3xl md:text-5xl lg:text-5xl tracking-[0.2em] md:tracking-[0.3em] lg:tracking-[0.4em] font-light"
              >
                {char}
              </span>
            ))}
          </div>

          {/* Row 2: T H E - W E B */}
          <div className="flex gap-4 md:gap-6 lg:gap-8">
            {['T', 'H', 'E'].map((char, index) => (
              <span 
                key={`row2a-${index}`}
                className="text-white text-3xl md:text-5xl lg:text-5xl tracking-[0.2em] md:tracking-[0.3em] lg:tracking-[0.4em] font-light"
              >
                {char}
              </span>
            ))}
            <span className="text-white text-3xl md:text-5xl lg:text-5xl font-light">-</span>
            {['W', 'E', 'B'].map((char, index) => (
              <span 
                key={`row2b-${index}`}
                className="text-white text-3xl md:text-5xl lg:text-5xl tracking-[0.2em] md:tracking-[0.3em] lg:tracking-[0.4em] font-light"
              >
                {char}
              </span>
            ))}
          </div>

          {/* Row 3: A - B E T T E R */}
          <div className="flex gap-4 md:gap-6 lg:gap-8">
            <span className="text-white text-3xl md:text-5xl lg:text-5xl tracking-[0.2em] md:tracking-[0.3em] lg:tracking-[0.4em] font-light">A</span>
            <span className="text-white text-3xl md:text-5xl lg:text-5xl font-light">-</span>
            {['B', 'E', 'T', 'T', 'E', 'R'].map((char, index) => (
              <span 
                key={`row3-${index}`}
                className="text-white text-3xl md:text-5xl lg:text-5xl tracking-[0.2em] md:tracking-[0.3em] lg:tracking-[0.4em] font-light"
              >
                {char}
              </span>
            ))}
          </div>

          {/* Row 4: P L A C E */}
          <div className="flex gap-4 md:gap-6 lg:gap-8">
            {['P', 'L', 'A', 'C', 'E'].map((char, index) => (
              <span 
                key={`row4-${index}`}
                className="text-white text-3xl md:text-5xl lg:text-5xl tracking-[0.2em] md:tracking-[0.3em] lg:tracking-[0.4em] font-light"
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Hint text */}
        <div className="mt-12 md:mt-16">
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