"use client";

import React, { useRef, useEffect } from "react";

export default function ShowReel() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play video on load
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">

      {/* 1. Background Video */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://cdn.cizzara.com/Cizzara-Latest/Showreel%2020s(2).mp4"
          type="video/mp4"
        />
      </video>

      {/* 2. Overlay for text readability */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      {/* 3. Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">

        {/* Title block: "CITY of Light" with flanking diagonal lines */}
        <div className="relative flex flex-col items-center">

          {/* Diagonal line — upper left, slanting down-right into the title */}

          {/* "CITY of" line */}
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-white text-2xl md:text-3xl tracking-[0.25em] uppercase">
              City
            </span>
            <span className="font-serif italic text-white/90 text-2xl md:text-3xl">
              of
            </span>
          </div>

          {/* "Light" — large italic serif */}
          <h1 className="font-serif italic text-white text-6xl md:text-7xl leading-none -mt-1">
            Light
          </h1>

          {/* Diagonal line — lower right, slanting down-right out of the title */}
        </div>

        {/* Tagline */}
        <div className="mt-8 max-w-md">
          <p className="text-white/60 text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed">
            With finely crafted cinematography,<br />
            every frame tells a story of creativity and passion.
          </p>
        </div>

        {/* Launch Button */}
        <div className="mt-12">
          <button
            className="px-8 py-3 border border-white/40 text-white text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-black"
          >
            <span className="font-bold">Launch</span>{" "}
            <span className="italic font-serif not-italic md:italic">Showreel</span>
          </button>
        </div>

      </div>

    </section>
  );
}