




"use client";

import { useEffect, useRef, useState } from "react";
import { PixelRevealCanvas } from "./PixelRevealCanvas";

function GooeyDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [pixelSize, setPixelSize] = useState(64);

  // Responsive pixel size
  useEffect(() => {
    const update = () => {
      setPixelSize(window.innerWidth < 768 ? 52 : 72);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Ensure video plays (browsers may block autoplay)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      // Autoplay blocked — silently ignore; muted loop will still work on interaction
    });
  }, []);

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* ── Video layer (z-0) ── */}
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

      {/* ── Canvas pixel-reveal black overlay (z-10) ── */}
      <PixelRevealCanvas pixelSize={pixelSize} trailLength={22} />

      {/* ── Text layer (z-20) — always fully visible ── */}
      <div
        className="relative flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ zIndex: 20, pointerEvents: "none" }}
      >
        <p
          className="
            text-white
            text-[clamp(2rem,6vw,5rem)]
            font-bold
            leading-[1.1]
            tracking-tight
            max-w-[720px]
            select-none
          "
          style={{
            textShadow: "0 2px 40px rgba(0,0,0,0.7), 0 0 80px rgba(0,0,0,0.4)",
            fontFamily: "'Georgia', serif",
          }}
        >
          Speaking things into existence
        </p>

        <span
          className="text-white/50 text-sm tracking-[0.25em] uppercase"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          Move your cursor to reveal
        </span>
      </div>
    </div>
  );
}

export { GooeyDemo };