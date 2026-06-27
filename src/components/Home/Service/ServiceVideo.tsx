"use client";
import React, { RefObject } from "react";

interface ServiceVideoProps {
  isVisible: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  onClose: () => void;
}

const ServiceVideo = ({ isVisible, videoRef, onClose }: ServiceVideoProps) => {
  return (
 
    <section
      className={`relative h-screen w-full flex-shrink-0 overflow-hidden bg-black transition-opacity duration-300 ${
        isVisible ? "opacity-100 pointer-events-auto cursor-close" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
      style={{ scrollSnapAlign: "start" }}
      aria-hidden={!isVisible}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source
          src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAreVid1.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div className="relative z-10 flex h-full items-center justify-center pointer-events-none">
        <h2 className="text-white text-5xl md:text-7xl font-light tracking-[0.3em] uppercase">
          Studio
        </h2>
      </div>
      <p
        className={`absolute bottom-8 left-0 right-0 z-20 text-center text-white/50 text-xs uppercase tracking-[0.2em] pointer-events-none transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        Click anywhere to close
      </p>
    </section>
  );
};

export default ServiceVideo;