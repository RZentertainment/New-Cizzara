"use client";

import React from "react";

interface AboutDefaultProps {
  onReveal: () => void;
}

// Shared horizontal anchor so the line in this panel and the line in
// AboutTop sit in the exact same column at every breakpoint.
const LINE_LEFT = "clamp(40px, 9vw, 110px)";

export default function AboutDefault({ onReveal }: AboutDefaultProps) {
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
          width: "clamp(220px, 30vw, 420px)",
          background: "linear-gradient(to right, rgba(0,0,0,0.92) 70%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* ── Dashed vertical line + medallion ────────────────────── */}
      <div
        className="absolute ml-31 top-0 bottom-0 flex flex-col items-center"
        style={{ left: LINE_LEFT }}
      >
        {/* Dashed line — top half (above medallion) */}
        <div
          style={{
            flex: "0 0 auto",
            width: 1,
            height: "clamp(150px, 40vh, 300px)",
            borderLeft: "3px dashed rgba(255,255,255,0.5)",
          }}
        />

        {/* ── Circular logo medallion ────────────────────────── */}
        <button
          onClick={onReveal}
          aria-label="Discover more about Cizzara Studios"
          className="transition-[border-color,box-shadow,transform] duration-300 ease-out hover:scale-105"
          style={{
            flexShrink: 0,
            width: "clamp(72px, 9vw, 108px)",
            height: "clamp(72px, 9vw, 108px)",
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.55)",
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            outline: "none",
            position: "relative",
            zIndex: 20,
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
              filter: "brightness(2)",
            }}
          />
        </button>
      </div>

      {/* ── Caption text — anchored under the same line column ───── */}
      <div
        className="absolute"
        style={{
          left: LINE_LEFT,
          bottom: "clamp(390px, 10vh, 110px)",
          paddingLeft: "clamp(20px, 4vw, 56px)",
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

      {/* ── About Us eyebrow + divider ───────────────────────────── */}
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