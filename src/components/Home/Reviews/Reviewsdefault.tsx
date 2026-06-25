"use client";

import React, { RefObject, useEffect, useRef } from "react";
import { DottedSurface } from "@/components/ui/dotted-surface";
import GoogleLogo from "./GoogleLogo";
import gsap from "gsap";

interface Review {
  _id: string;
  reviewText: string;
  reviewerName: string;
  reviewerImgUrl: string;
}

interface ReviewsDefaultProps {
  buttonRef: RefObject<HTMLDivElement | null>;
  onReviewsClick: () => void;
  reviews?: Review[];
}

const ReviewsDefault = ({ 
  buttonRef, 
  onReviewsClick,
  reviews = []
}: ReviewsDefaultProps) => {
  
  // --- Refs for GSAP to target ---
  const containerRef = useRef<HTMLDivElement>(null);
  const subHeadingRef = useRef<HTMLParagraphElement>(null);
  const mainHeadingRef = useRef<HTMLHeadingElement>(null);
  const googleLogoRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);

  // --- GSAP Animation Effect ---
  useEffect(() => {
    // Create a timeline for sequential, smooth animations
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
      });

      // 1. Fade in and slide up the sub-heading
      tl.fromTo(subHeadingRef.current, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8 }
      );

      // 2. Fade in and slide up the main heading
      tl.fromTo(mainHeadingRef.current, 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 1 },
        "-=0.4" 
      );

      // 3. Pop in the Google Logo with scale
      tl.fromTo(googleLogoRef.current, 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 0.8 },
        "-=0.3"
      );

      // 4. Stagger in the Rating Stars, Text, and New Button
      tl.fromTo(ratingRef.current, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.4"
      );

    }, containerRef);

    // Cleanup to prevent animation conflicts on unmount
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="relative h-screen w-full flex-shrink-0 overflow-hidden"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Dotted Surface Background */}
      <DottedSurface 
        className="absolute inset-0" 
        dotColor="#60a5fa"
        backgroundColor="#000000"
        dotSize={12}
        dotOpacity={0.9}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content Container with GSAP ref */}
      <div 
        ref={containerRef}
        className="relative z-10 flex h-full flex-col items-center justify-start pt-24 px-4"
      >
        {/* Rating + Heading */}
        <div className="flex flex-col items-center text-center">
        
          <p 
            ref={subHeadingRef}
            className="mt-5 text-xs uppercase tracking-[0.35em] text-white/50"
          >
            REAL PEOPLE. REAL RESULTS.
          </p>

          <h1 
            ref={mainHeadingRef}
            className="mt-6 text-5xl md:text-6xl font-light leading-tight text-white"
          >
            Crafting Digital Experiences
            <br />
            That Clients Love to Talk About.
          </h1>
        </div>

        {/* Google Logo */}
        <div 
          ref={googleLogoRef}
          className="mt-8 scale-85"
        >
          <GoogleLogo />
        </div>

        {/* Rating & "See all" Section */}
        <div 
          ref={ratingRef}
          className="flex flex-row items-center gap-6 mt-8 text-white/70"
        >
          {/* Left: Rating */}
          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold">5.0</span>
            <div className="text-yellow-400 text-lg">
              ★★★★★
            </div>
          </div>

          {/* Right: Text + Button */}
          <div className="flex items-center gap-4 border-l border-white/20 pl-6">
            <span className="text-sm">
              Based on 130+ Google Reviews
            </span>

           
          </div>

          
        </div>


        <div
  ref={buttonRef}
  onClick={onReviewsClick}
  className="group cursor-pointer"
>
  <div className="flex items-center gap-4 mt-10 rounded-full border bg-[#000] text-white border-white/20 px-6 py-3 transition-all duration-300 hover:border-white hover:bg-white hover:text-black">
    <span className="text-sm uppercase tracking-[0.2em]">
      Explore Reviews
    </span>

    <span className="transition-transform duration-300 group-hover:translate-x-1">
      ↗
    </span>
  </div>
</div>
      </div>
    </section>
  );
};

export default ReviewsDefault;