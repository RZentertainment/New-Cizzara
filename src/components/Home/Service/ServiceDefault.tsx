"use client";

import React, { RefObject } from "react";
import ServiceRotation from "./ServiceRotation";

interface ServiceDefaultProps {
  bellRef: RefObject<HTMLDivElement | null>;
  ropeRef: RefObject<HTMLDivElement | null>;
  onBellClick: () => void;
}

const ServiceDefault = ({ bellRef, ropeRef, onBellClick }: ServiceDefaultProps) => {
  return (
    <section
      className="relative h-screen w-full flex-shrink-0 overflow-hidden bg-[#120d0d]"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAreVid1.mp4"
          loop
          muted
          playsInline
          autoPlay
        />
        <div className="absolute inset-0 bg-black/60"/>
      </div>

      {/* ── CONTENT (circles + text) — centred layout ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-7xl px-4">
        {/* Inner image circle */}
         <ServiceRotation/>

       
      </div>

      {/* ── BELL & ROPE SYSTEM ── */}
      <div
        className="absolute z-30 flex flex-col items-center"
        style={{
          top: "0",
          left: "52%",
        }}
      >
        {/* Pulley ring */}
        <div className="w-[28px] h-[28px] rounded-full border-[5px] border-[#5C4033]  relative z-10 flex-shrink-0">
          <div className="absolute inset-0 rounded-full border-[2px] border-[#8B7355]/30" />
        </div>

        {/* Rope — GSAP animates height 0 → subtle pull down on click */}
        <div
          ref={ropeRef}
          className="relative flex-shrink-0"
          style={{ height: "0px", width: "11px", overflow: "hidden" }}
        >
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg,transparent,transparent 7px,#000 7px,#000 8px)",
              }}
            />
          </div>
        </div>

        {/* Bell - no bounce, just click animation handled by parent */}
        <div
          ref={bellRef}
          className="cursor-pointer relative group flex-shrink-0"
          style={{ marginTop: "-3px", transformOrigin: "top center" }}
          onClick={onBellClick}
        >
          {/* Shadow */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[120%] h-auto rounded-[50%] bg-black/40 blur-md pointer-events-none" />
          
          {/* Bell Image - NO continuous bounce */}
          <img
            src="https://cdn.cizzara.com/Cizzara-Latest/b.png"
            alt="Launch Bell"
            className="w-[400px] h-auto object-contain"
          />
          
          {/* Text on Bell */}
          <div
            className="absolute top-[80%] left-1/2 text-center pointer-events-none"
            style={{ transform: "translate(-50%, -50%) rotate(-18deg)" }}
          >
            <span className="block text-white text-[0.65rem] font-bold tracking-[0.22em] uppercase">
              LAUNCH
            </span>
            <span className="block text-white/85 text-[0.6rem] font-bold tracking-[0.18em] uppercase">
              EPISODE
            </span>
          </div>
          
          {/* Glow effect on hover */}
        </div>
      </div>
    </section>
  );
};

export default ServiceDefault;