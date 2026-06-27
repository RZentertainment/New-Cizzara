"use client";

import React, { useRef } from "react";

interface AboutDefaultProps {
  onReveal: () => void;
}

// Shared horizontal anchor so the line in this panel and the line in
// AboutTop sit in the exact same column at every breakpoint.
const LINE_LEFT = "clamp(40px, 9vw, 110px)";

export default function AboutDefault({ onReveal }: AboutDefaultProps) {
  const ropeRef = useRef<HTMLDivElement>(null);
  const medallionRef = useRef<HTMLButtonElement>(null);

  const handlePullClick = () => {
    // Smooth rope stretch only
    if (ropeRef.current) {
      const rope = ropeRef.current;
      const currentHeight = rope.offsetHeight;
      
      // Smooth stretch out
      rope.style.transition = "height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      rope.style.height = `${currentHeight + 50}px`;
      
      // Smooth return
      setTimeout(() => {
        rope.style.transition = "height 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        rope.style.height = `${currentHeight}px`;
      }, 100);
    }

    // Medallion pull effect - subtle, no flash
    if (medallionRef.current) {
      const medallion = medallionRef.current;
      
      // Subtle pull
      medallion.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      medallion.style.transform = "scale(1.05)";
      
      // Return
      setTimeout(() => {
        medallion.style.transition = "transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        medallion.style.transform = "scale(1)";
      }, 300);
    }

    // Trigger reveal
    setTimeout(() => {
      onReveal();
    }, 250);
  };

  return (
    <section
      className="relative h-screen w-full flex-shrink-0 overflow-hidden"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://cdn.cizzara.com/Cizzara-Latest/Abouts.jpg')" }}
      />

      {/* Dark left panel — scales with viewport instead of a huge fixed px value */}
      <div
        className="absolute top-0 left-0 bottom-0"
        style={{
          width: "clamp(1600px, 30vw, 1020px)",
          background: "linear-gradient(to right, rgba(0,0,0,0.92) 70%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* ── Dashed vertical line + medallion ────────────────────── */}
      <div
        className="absolute ml-71 top-0 bottom-0 flex flex-col items-center"
        style={{ left: LINE_LEFT }}
      >
        {/* Dashed line — top half (above medallion) */}
        <div
          ref={ropeRef}
          style={{
            flex: "0 0 auto",
            width: 1,
            height: "clamp(150px, 40vh, 300px)",
            borderLeft: "3px dashed rgba(255,255,255,0.5)",
          }}
        />

        {/* ── Circular logo medallion ────────────────────────── */}
   <button
  ref={medallionRef}
  onClick={handlePullClick}
  aria-label="Discover more about Cizzara Studios"
  className="cursor-pointer"
  style={{
    flexShrink: 0,
    width: "clamp(72px, 9vw, 108px)",
    height: "clamp(72px, 9vw, 108px)",
    borderRadius: "50%",
    outline: "none",
    position: "relative",
    zIndex: 20,

    // ✅ 3D raised medallion with border padding
    background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
    border: "3px solid rgba(255,255,255,0.3)",
    boxShadow: `
      inset 0 -8px 12px rgba(0,0,0,0.8),
      inset 0 8px 12px rgba(255,255,255,0.2),
      0 12px 24px rgba(0,0,0,0.6),
      0 4px 8px rgba(0,0,0,0.4)
    `,
    padding: "6px", // creates inner border/padding space
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    // ✅ Subtle 3D tilt for depth (optional, remove if you want flat face)
    transform: "perspective(600px) rotateX(1deg)",
    transition: "transform 0.15s ease",
  }}
>
  {/* Inner ring for extra depth */}
  <div
    style={{
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      background: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      border: "1px solid rgba(255,255,255,0.15)",
      boxShadow: "inset 0 4px 12px rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "4px",
    }}
  >
    <img
      src="https://cdn.cizzara.com/Logo/Cizzara_Studios_Final_Logo_txnyii.png"
      alt="Cizzara Studios"
      draggable={false}
      style={{
        width: "clamp(48px, 6vw, 78px)",
        height: "clamp(48px, 6vw, 78px)",
        objectFit: "contain",
        filter: "brightness(5)",
      }}
    />
  </div>
</button>

        {/* Dashed line — bottom half (below medallion) */}
       
      </div>

      {/* ── Caption text — anchored under the same line column ───── */}
      <div
        className="absolute"
        style={{
          left: LINE_LEFT,
          bottom: "clamp(290px, 10vh, 110px)",
          paddingLeft: "clamp(200px, 4vw, 56px)",
          maxWidth: "min(85vw, 560px)",
        }}
      >
        {[
          "CRAFTING CINEMATIC",
          "DIGITAL EXPERIENCES",
          "WITH PURPOSE.",
        ].map((line, i) => (
          <p
            key={i}
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "clamp(0.8rem, 2vw, 1.5rem)",
              letterSpacing: "0.16em",
              lineHeight: 1.7,
              fontWeight: 400,
              fontFamily: "'Inter','Helvetica Neue',sans-serif",
              textTransform: "uppercase",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            {line}
          </p>
        ))}
      </div>

      <div
        className="absolute bottom-0 right-0 z-10 flex items-end"
        style={{
          paddingBottom: "clamp(2rem,5vh,4rem)",
          paddingRight: "clamp(1.5rem,6vw,4rem)",
        }}
      >
        <div className="text-white text-right">
          <p
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.26em",
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              marginBottom: "1.2rem",
              fontFamily: "'Inter','Helvetica Neue',sans-serif",
            }}
          >
            About Us
          </p>
          <div
            style={{
              width: "clamp(140px,20vw,260px)",
              height: 1,
              background: "rgba(255,255,255,0.3)",
              marginLeft: "auto",
            }}
          />
        </div>
      </div>
    </section>
  );
}