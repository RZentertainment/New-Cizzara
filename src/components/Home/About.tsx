"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle reveal - show top portion
  const handleRevealClick = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setIsRevealed(true);
    
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        duration: 2.0,
        scrollTo: {
          y: 0,
        },
        ease: "power4.inOut",
        onComplete: () => {
          setIsTransitioning(false);
        }
      });
    }
  };

  // Handle close - scroll back to bottom portion
  const handleClose = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    // Scroll back to bottom first (with top section still visible)
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        duration: 2,
        scrollTo: {
          y: window.innerHeight,
        },
        ease: "power4.inOut",
        onComplete: () => {
          // Only hide the top section AFTER the scroll animation completes
          setIsRevealed(false);
          setIsTransitioning(false);
        }
      });
    }
  };

  // Auto-scroll to bottom on load
  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollTo({ top: window.innerHeight, behavior: "instant" });
      }, 50);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-screen overflow-y-auto overflow-x-hidden"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {/* Top Section - Revealed on click */}
      <section
        id="about-top"
        ref={sectionRef}
        className={`relative h-screen w-full flex-shrink-0 overflow-hidden bg-black transition-all duration-700 ${
          isRevealed ? "block" : "hidden"
        } ${isRevealed ? "cursor-close" : ""}`}
        onClick={handleClose}
        style={{ scrollSnapAlign: 'start' }}
      >
        {/* Single image - showing top portion */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://cdn.cizzara.com/Cizzara-Latest/Abouts.jpg')",
            backgroundPosition: "center 0%",
            backgroundSize: "cover",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex h-full items-center justify-center pointer-events-none">
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase mb-4">
              About Us
            </h2>
            <p className="text-white/70 text-sm md:text-base max-w-md mx-auto px-4">
              Discover the story behind our creative journey
            </p>
          </div>
        </div>

        {/* Hint text */}
        <div 
          className={`absolute bottom-8 left-0 right-0 z-20 text-center transition-all duration-500 pointer-events-none ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-white/50 text-xs uppercase tracking-[0.2em]">
            Click anywhere to close
          </p>
        </div>
      </section>

      {/* Bottom Section - Always visible */}
      <section 
        id="about-bottom"
        className="relative h-screen w-full flex-shrink-0 overflow-hidden"
        style={{ scrollSnapAlign: 'start' }}
      >
        {/* Single image - showing bottom portion */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://cdn.cizzara.com/Cizzara-Latest/Abouts.jpg')",
            backgroundPosition: "center 100%",
            backgroundSize: "cover",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 flex h-full items-center">
          <div className="ml-[8vw] max-w-[520px] text-white">
            {/* Small Label */}
            <p className="mb-8 ml-2 text-xs uppercase tracking-[0.25em] font-medium">
              ABOUT US
            </p>

            {/* Heading */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[0.95] tracking-[-0.03em]">
              More than
              <br />
              just a studio
              <br />
              it's a vision.
            </h2>

            {/* Divider */}
            <div className="mt-10 mb-10 h-px w-full max-w-[420px] bg-white/70" />

            {/* Reveal Button */}
            <button
              onClick={handleRevealClick}
              className="group relative inline-block w-80 h-20 cursor-pointer"
            >
              {/* Expanding Circle */}
              <span className="absolute left-0 top-0 flex h-20 w-20 items-center rounded-full bg-white transition-all duration-700 ease-[cubic-bezier(0.65,0,0.076,1)] group-hover:w-full">
                {/* Arrow */}
                <span className="absolute left-6 h-[3px] w-7 bg-black">
                  <span className="absolute right-0 top-[-6px] h-4 w-4 rotate-45 border-r-[3px] border-t-[3px] border-black" />
                </span>
              </span>

              {/* Text */}
              <span className="absolute inset-0 ml-16 flex items-center justify-center text-lg font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-700 group-hover:text-black">
                Discover More
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Custom cursor style for close */}
      <style jsx global>{`
        .cursor-close {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cdefs%3E%3ClinearGradient id='gold' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f5e6b8;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23fcf3da;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23e8d5a3;stop-opacity:1' /%3E%3C/linearGradient%3E%3Cfilter id='shadow' x='-20%25' y='-20%25' width='140%25' height='140%25'%3E%3CfeDropShadow dx='0' dy='3' stdDeviation='8' flood-color='black' flood-opacity='0.4'/%3E%3C/filter%3E%3C/defs%3E%3Ccircle cx='28' cy='28' r='26' fill='url(%23gold)' stroke='%23b8943a' stroke-width='1.5' filter='url(%23shadow)'/%3E%3Ccircle cx='28' cy='28' r='22' fill='none' stroke='%23b8943a' stroke-width='0.5' opacity='0.4'/%3E%3Cg transform='translate(28,28)'%3E%3Cline x1='-10' y1='-10' x2='10' y2='10' stroke='%23222222' stroke-width='2.5' stroke-linecap='round'/%3E%3Cline x1='10' y1='-10' x2='-10' y2='10' stroke='%23222222' stroke-width='2.5' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E") 28 28, pointer !important;
        }
      `}</style>
    </div>
  );
}