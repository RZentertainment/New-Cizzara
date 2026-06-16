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
        
        {/* Decorative Diagonal Line */}
        <div className="absolute top-[34%] left-1/2 -translate-x-1/2 w-[80px] h-[1px] bg-white/40 rotate-[-20deg] pointer-events-none"></div>
        
  
        {/* Tagline */}
        <div className="mt-8 max-w-md">
          <p className="text-white/50 text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed">
            With finely crafted cinematography,<br />
            every frame tells a story of creativity and passion.
          </p>
        </div>

        {/* Launch Button */}
        <div className="mt-12">
          <button 
            className="px-8 py-3 border border-white/40 text-white text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-black"
          >
             Showreel
          </button>
        </div>

      </div>

    </section>
  );
}