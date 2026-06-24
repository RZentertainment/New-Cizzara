"use client";
import React from "react";

interface AboutVideoProps {
  isRevealed: boolean;
  onClose: () => void;
}

export default function AboutVideo({ isRevealed, onClose }: AboutVideoProps) {
  return (
    <section
      className="relative h-screen w-full flex-shrink-0 overflow-hidden bg-black cursor-close"
      style={{ scrollSnapAlign: "start" }}
      onClick={onClose}
    >
      {/* Full Screen Video — click passes through to the section's onClose */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAre.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Subtle Overlay for readability if needed */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Close Hint */}
      <div className="absolute bottom-8 left-0 right-0 z-20 text-center pointer-events-none">
        <p className="text-[0.6rem] tracking-[0.22em] uppercase text-white/40">
          Click anywhere to close
        </p>
      </div>
    </section>
  );
}