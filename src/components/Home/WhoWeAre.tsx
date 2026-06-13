"use client";

import { useState } from "react";

export default function WhoWeAre() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAre.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40 z-1"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-0 md:px-0">
        <div className="w-full flex flex-col items-center gap-0">
          
          {/* TELLING */}
          <div
            className="relative w-full flex flex-col items-center justify-center group cursor-default"
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Black Bar - Only appears on hover */}
            <div
              className={`absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm transition-all duration-500 ease-in-out ${
                hoveredIndex === 0 ? "h-[120%] opacity-60" : "h-0 opacity-0"
              }`}
              style={{ transformOrigin: "center" }}
            ></div>

            {/* Text */}
            <h2
              className={`relative text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.3em] md:tracking-[0.4em] text-white uppercase z-10 transition-all duration-500 ease-in-out ${
                hoveredIndex === 0 ? "text-white scale-105" : "text-white/90 scale-100"
              }`}
            >
              TELLING
            </h2>

            {/* Dotted Line - Gap only appears on hover */}
            <div
              className={`relative w-full transition-all duration-500 ease-in-out ${
                hoveredIndex === 0 ? "mt-8" : "mt-1"
              }`}
            >
              <div className="w-full border-t border-dotted border-white/30"></div>
            </div>
          </div>

          {/* FASCINATING */}
          <div
            className="relative w-full flex flex-col items-center justify-center group cursor-default"
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Black Bar - Only appears on hover */}
            <div
              className={`absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm transition-all duration-500 ease-in-out ${
                hoveredIndex === 1 ? "h-[120%] opacity-60" : "h-0 opacity-0"
              }`}
              style={{ transformOrigin: "center" }}
            ></div>

            {/* Text */}
            <h2
              className={`relative text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.3em] md:tracking-[0.4em] text-white uppercase z-10 transition-all duration-500 ease-in-out ${
                hoveredIndex === 1 ? "text-white scale-105" : "text-white/90 scale-100"
              }`}
            >
              FASCINATING
            </h2>

            {/* Dotted Line - Gap only appears on hover */}
            <div
              className={`relative w-full transition-all duration-500 ease-in-out ${
                hoveredIndex === 1 ? "mt-8" : "mt-1"
              }`}
            >
              <div className="w-full border-t border-dotted border-white/30"></div>
            </div>
          </div>

          {/* STORIES */}
          <div
            className="relative w-full flex flex-col items-center justify-center group cursor-default"
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Black Bar - Only appears on hover */}
            <div
              className={`absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm transition-all duration-500 ease-in-out ${
                hoveredIndex === 2 ? "h-[120%] opacity-60" : "h-0 opacity-0"
              }`}
              style={{ transformOrigin: "center" }}
            ></div>

            {/* Text */}
            <h2
              className={`relative text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.3em] md:tracking-[0.4em] text-white uppercase z-10 transition-all duration-500 ease-in-out ${
                hoveredIndex === 2 ? "text-white scale-105" : "text-white/90 scale-100"
              }`}
            >
              STORIES
            </h2>
          </div>

        </div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-[1px] bg-white/50"></div>
            <span className="text-[10px] md:text-xs tracking-[0.2em] text-white/70 uppercase">
              What is Cizzara Studio?
            </span>
            <div className="w-8 h-[1px] bg-white/50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}