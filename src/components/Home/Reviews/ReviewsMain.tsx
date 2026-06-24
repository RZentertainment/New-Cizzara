"use client";

import React, { RefObject } from "react";

interface ReviewsMainProps {
  buttonRef: RefObject<HTMLDivElement | null>;
  onReviewsClick: () => void;
}

export default function ReviewsMain({ buttonRef, onReviewsClick }: ReviewsMainProps) {
  return (
    <section 
      className="relative h-screen w-full flex-shrink-0 overflow-hidden bg-black"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Dark Background with Glow */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Center Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        
        {/* Device Image */}
        <div className="relative mb-8">
          <div className="w-[120px] h-[160px] bg-gradient-to-b from-white/10 to-white/5 rounded-[30px] border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.3)]">
            <div className="text-center">
              <div className="text-[#60a5fa] text-3xl font-bold">5.2</div>
              <div className="text-white/30 text-[8px] uppercase tracking-wider mt-1">mmol/L</div>
            </div>
          </div>
          {/* Glow ring */}
          <div className="absolute inset-[-10px] rounded-[40px] border border-blue-500/20 animate-pulse"></div>
        </div>

        {/* Text */}
        <div className="text-center max-w-2xl px-4">
          <p className="text-white/60 text-xs md:text-sm uppercase tracking-[0.2em] mb-6">
            Picture an engaging interactive experience
          </p>
          <h1 className="text-white/80 text-xl md:text-2xl font-light tracking-[0.15em]">
            For the world's smallest glucose device
          </h1>
          
          {/* Reviews Trigger Button */}
          <div 
            ref={buttonRef}
            onClick={onReviewsClick}    
            className="mt-10 inline-block cursor-pointer group"
          >
            <div className="flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300">
              <span className="w-8 h-[1px] bg-white/30 group-hover:bg-white/60 transition-all duration-300"></span>
              <span className="text-xs uppercase tracking-[0.2em] font-medium">See Reviews</span>
              <span className="w-8 h-[1px] bg-white/30 group-hover:bg-white/60 transition-all duration-300"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}