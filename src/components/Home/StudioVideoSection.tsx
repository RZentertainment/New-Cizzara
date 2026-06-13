"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function StudioVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Video autoplay when section comes into view
    if (videoRef.current && sectionRef.current) {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          videoRef.current?.play().catch(() => {});
        },
        onLeave: () => {
          videoRef.current?.pause();
        },
        onEnterBack: () => {
          videoRef.current?.play().catch(() => {});
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="studio-video"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAre.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <h2 className="text-white text-5xl md:text-7xl font-light tracking-[0.3em] uppercase">
          Studio
        </h2>
      </div>
    </section>
  );
}