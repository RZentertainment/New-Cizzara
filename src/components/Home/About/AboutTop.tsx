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

   <div
        className="absolute top-0 left-0 bottom-0"
        style={{
          width: "clamp(1600px, 30vw, 1020px)",
          background: "linear-gradient(to right, rgba(0,0,0,0.92) 70%, rgba(0,0,0,0) 100%)",
        }}
      />
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
  className="mt-0 flex shrink-0 items-center justify-center rounded-full pointer-events-auto animate-[bounce_3s_ease-in-out_infinite] cursor-pointer transition-colors duration-300"
  style={{
    width: "clamp(72px, 9vw, 108px)",
    height: "clamp(72px, 9vw, 108px)",
    outline: "none",
    position: "relative",
    zIndex: 20,

    // ✅ OUTER ring as main 3D feature
    background: "linear-gradient(145deg, #3a3a3a, #1a1a1a)",
    border: "4px solid rgba(255,255,255,0.4)",
    borderBottomColor: "rgba(255,255,255,0.1)",
    borderRightColor: "rgba(255,255,255,0.6)",
    boxShadow: `
      inset 0 -6px 10px rgba(0,0,0,0.9),
      inset 0 6px 10px rgba(255,255,255,0.1),
      0 12px 28px rgba(0,0,0,0.7),
      6px 8px 20px rgba(0,0,0,0.5)
    `,
    padding: "8px", // thick padding to make outer ring prominent
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "perspective(600px) rotateY(-2deg) rotateX(1deg)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  }}
>
  {/* INNER recessed area - looks like it's set into the ring */}
  <div
    style={{
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      background: "#2a1418",
      border: "1px solid rgba(0,0,0,0.6)",
      boxShadow: "inset 0 4px 12px rgba(0,0,0,0.8), 0 -2px 4px rgba(255,255,255,0.05)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px",
    }}
  >
    <span
      className="font-normal tracking-wide text-center"
      style={{
        fontSize: "clamp(0.80rem, 1.4vw, 1rem)",
        color: "#f4f0eb",
        textShadow: "0 2px 4px rgba(0,0,0,0.6)",
        letterSpacing: "0.05em",
      }}
    >
      See Journey
    </span>
  </div>
</button>
      </div>

      <div
        className="absolute bottom-0 ml-[337px] z-20 flex items-stretch pointer-events-none"
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
    className="font-normal tracking-tight"
    style={{
      fontSize: "clamp(1.4rem, 3.2vw, 2.1rem)",
      background: "linear-gradient(135deg, #f4f0eb 0%, #d4a373 50%, #f4f0eb 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      textShadow: "0 2px 20px rgba(212, 163, 115, 0.3)",
      letterSpacing: "0.02em",
      position: "relative",
      display: "inline-block",
    }}
  >
    About Us
    {/* Decorative underline */}
    <span
      style={{
        position: "absolute",
        bottom: "-4px",
        left: "0",
        width: "100%",
        height: "2px",
        background: "linear-gradient(90deg, transparent, #d4a373, transparent)",
        opacity: "0.6",
      }}
    />
  </h2>
  
  <p
    className="mt-5 font-light leading-relaxed"
    style={{
      fontSize: "clamp(1rem, 1.4vw, 1rem)",
      maxWidth: "min(80vw, 260px)",
      color: "#e4e4e4",
      background: "linear-gradient(180deg, #ffffff 0%, #e4e4e4 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      textShadow: "0 2px 30px rgba(255,255,255,0.1)",
      lineHeight: "1.8",
      position: "relative",
      paddingLeft: "16px",
      borderLeft: "2px solid rgba(212, 163, 115, 0.4)",
      transition: "border-left-color 0.3s ease",
    }}
    onMouseEnter={(e) => e.currentTarget.style.borderLeftColor = "rgba(212, 163, 115, 0.8)"}
    onMouseLeave={(e) => e.currentTarget.style.borderLeftColor = "rgba(212, 163, 115, 0.4)"}
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