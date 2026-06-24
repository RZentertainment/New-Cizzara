"use client";

import React, { RefObject } from "react";

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
          src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAre.mp4"
          loop
          muted
          playsInline
          autoPlay
        />
        <div className="absolute inset-0 bg-black/60"/>
      </div>

      {/* ── CONTENT (circles + text) — centred layout ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-7xl px-4">
        {/* Outer rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5 bg-[#2a2533]/80 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 bg-[#2a2533]/90 pointer-events-none" />
        
        {/* Inner image circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] overflow-hidden rounded-full bg-black/80 backdrop-blur-sm border border-white/20">
          <img
            src="https://cdn.cizzara.com/Cizzara-Latest/ChatGPT%20Image%20Jun%2015%2C%202026%2C%2002_23_58%20PM.png"
            alt="Studio Frame"
            className="w-full h-full object-cover opacity-80 mix-blend-screen"
          />
        </div>

        {/* Left text */}
        <div className="absolute top-1/2 left-[23%] -translate-y-1/2 text-white max-w-md drop-shadow-lg">
          <h4 className="text-sm md:text-base font-medium mb-4 tracking-wide">
            Creating The Next Iconic Story.
          </h4>
          <h1 className="text-5xl font-bold leading-tight mb-6 text-[#e9e9e9]">
            <span className="text-[#c91111]">Cizzara</span>
            <br />
            Film
            <br />
            Studio.
          </h1>
          <div className="space-y-1 mt-5">
            <h2 className="text-2xl md:text-3xl font-bold text-[#c9ba33] ml-5">
              Cinema
            </h2>
            <h2 className="text-2xl md:text-3xl font-bold text-[#a3a3a3] ml-10">
              Beyond
            </h2>
            <h2 className="text-2xl md:text-3xl font-bold text-[#a3a3a3] ml-10">
              Expectations.
            </h2>
          </div>
        </div>
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
        <div className="w-[28px] h-[28px] rounded-full border-[5px] border-[#5C4033] bg-[#3d2b1f] shadow-[0_4px_15px_rgba(0,0,0,0.6)] relative z-10 flex-shrink-0">
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
            className="w-[400px] h-auto object-contain hover:scale-105 transition-transform duration-300"
          />
          
          {/* Text on Bell */}
          <div
            className="absolute top-[80%] left-1/2 text-center pointer-events-none"
            style={{ transform: "translate(-50%, -50%) rotate(-18deg)" }}
          >
            <span className="block text-white text-[0.65rem] font-bold tracking-[0.22em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
              LAUNCH
            </span>
            <span className="block text-white/85 text-[0.6rem] font-bold tracking-[0.18em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
              EPISODE
            </span>
          </div>
          
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-full bg-yellow-400/10 blur-xl group-hover:opacity-60 opacity-0 transition-opacity duration-500 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default ServiceDefault;