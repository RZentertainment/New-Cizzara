"use client";
import React from "react";

interface AboutTopProps {
  isRevealed: boolean;
  onClose: () => void;
  onVideoOpen: () => void;
}

// Must match the LINE_LEFT value in AboutDefault.tsx exactly so the
// vertical line lands in the same column across both panels.
const LINE_LEFT = "clamp(40px, 9vw, 110px)";

export default function AboutTop({ isRevealed, onClose, onVideoOpen }: AboutTopProps) {
  if (!isRevealed) return null;

  return (
    <section
      className="relative h-screen w-full flex-shrink-0 overflow-hidden bg-[#f4f0eb]"
      style={{ scrollSnapAlign: "start" }}
      onClick={onClose}
    >
      {/* Background Image - full bleed, face on the right */}
      <div
        className="absolute inset-0 bg-cover bg-[center_top]"
        style={{
          backgroundImage: "url('https://cdn.cizzara.com/Cizzara-Latest/top.jpg')",
        }}
      />

      <div className="absolute inset-y-0 left-0 w-[55%] sm:w-[48%] md:w-[40%] bg-gradient-to-r from-black via-black/90 to-transparent pointer-events-none z-10" />

      {/* Fade the image into the light background on the left */}
      <div className="absolute inset-y-0 left-0 w-[40%] sm:w-[34%] bg-gradient-to-r from-[#f4f0eb] via-[#f4f0eb] to-transparent pointer-events-none" />

     <div
  className="absolute top-0 z-20 ml-[277px] flex flex-col items-center pointer-events-none"
  style={{ left: LINE_LEFT }}
>
      <div
  style={{
    height: "clamp(110px, 24vh, 190px)",
    borderLeft: "3px dashed #8F8686",
  }}
/>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onVideoOpen();
          }}
          className="mt-0 flex shrink-0 items-center justify-center rounded-full border-2 border-[#a0a0a0] bg-[#2a1418] text-[#f4f0eb] shadow-lg pointer-events-auto animate-[bounce_3s_ease-in-out_infinite] cursor-pointer hover:border-white transition-colors duration-300"
          style={{
            width: "clamp(72px, 9vw, 108px)",
            height: "clamp(72px, 9vw, 108px)",
          }}
        >
          <span
            className="font-normal tracking-wide text-center"
            style={{ fontSize: "clamp(0.62rem, 1.4vw, 0.8rem)" }}
          >
            See Journey
          </span>
        </button>
      </div>

      <div
        className="absolute bottom-0 ml-[177px] z-20 flex items-stretch pointer-events-none"
        style={{
          left: LINE_LEFT,
          gap: "clamp(56px, 3vw, 32px)",
          maxWidth: "min(85vw, 420px)",
        }}
      >
        <div
          style={{
            flex: "0 0 auto",
            width: 1,
            height: "clamp(220px, 45vh, 400px)",
            borderLeft: "3px dashed rgba(255,255,255,0.5)",
          }}
        />

        <div style={{ paddingBottom: "clamp(2rem, 14%, 4rem)" }}>
          <h2
            className="font-normal text-[#b9b9b9] tracking-tight"
            style={{ fontSize: "clamp(1.4rem, 3.2vw, 2.1rem)" }}
          >
            About Us
          </h2>
          <p
            className="mt-5 text-[#b3b2b2] font-light leading-relaxed"
            style={{
              fontSize: "clamp(0.8rem, 1.4vw, 0.95rem)",
              maxWidth: "min(80vw, 260px)",
            }}
          >
            At Cizzara Studios, we shape those stories into powerful visual
            experiences, driven by emotion, crafted with precision, and
            designed to resonate.
          </p>
        </div>
      </div>
    </section>
  );
}