"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin);

// Google SVG Icon
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const reviewsData = [
  {
    _id: "6a06fb35c74f851db813e760",
    reviewText: "Really happy with the services and team of Cizzara. Will surely recommend to anyone looking for audio, video and branding solutions.",
    reviewerName: "Kishorji Dantani",
    reviewerImgUrl: "https://cdn.cizzara.com/reviews/d7b47561-173c-4f2d-a55e-81970ec3ad05.webp"
  },
  {
    _id: "6a06fc6fc74f851db813e764",
    reviewText: "Visited the studio I am pleased to see that this studio has established so many state of art facilities.. Amazed with Professional attitude, Quality Work, and unique techniques.......",
    reviewerName: "Krunali Trivedi",
    reviewerImgUrl: "https://cdn.cizzara.com/reviews/67a01eb9-056b-49bd-97b5-3277271fdf06.webp"
  },
  {
    _id: "6a06fcaac74f851db813e766",
    reviewText: "I've recorded my first Audio Podcast with Cizzara Film Studio and I must say it was an Amazing experience, not just of recording it but also of being with very talented people and learning a lot of things!! Their working pattern, communication pattern, their devotion to work is so disciplined and really appreciable!! Also the way they encourage artists and learners to grow is wonderful!! It was a Great time there!!😇",
    reviewerName: "Nitya Vakil",
    reviewerImgUrl: "https://cdn.cizzara.com/reviews/c9eb8505-1feb-4502-a93c-e288f17a6d9e.webp"
  },
  {
    _id: "6a06fcd1c74f851db813e768",
    reviewText: "I recently had the pleasure of working with Cizzara Film Studio for our marketing campaign, and the experience exceeded all expectations. From the initial consultation to the execution of the campaign, the team at Cizzara Film Studio demonstrated exceptional professionalism and creativity.",
    reviewerName: "Jatin Jethva",
    reviewerImgUrl: "https://cdn.cizzara.com/reviews/8ec595aa-9284-4e77-8d90-9e5422df070b.webp"
  },
  {
    _id: "6a06fd18c74f851db813e76a",
    reviewText: "One of the best studio of Vadodara city. The best ambience, the best team and most importantly, the best studio with all latest functionality. I just loved making myself recording for VO infront of mic at Cizzara Film Studio. Highly recommended :)",
    reviewerName: "Aayushi Vyas",
    reviewerImgUrl: "https://cdn.cizzara.com/reviews/28bdc2f4-bf9c-43fe-9014-5182d4fb0f12.webp"
  },
  {
    _id: "6a06fd73c74f851db813e76e",
    reviewText: "Will recommend this studio to all Business owners who r in need of Promotional content for sales and marketing, very happy with their service and hospitality. They are very creative and gives right suggestions as well. Keep it up. Special thanks to Amit bhai.",
    reviewerName: "oswald Massey",
    reviewerImgUrl: "https://cdn.cizzara.com/reviews/7bf3e10e-1439-4e08-9766-05415c384759.webp"
  }
];

export default function Reviews() {
  const [isReviewsVisible, setIsReviewsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const reviewsSectionRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Handle Click - Show Reviews from top
  const handleReviewsClick = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setIsReviewsVisible(true);
    
    // Scroll to top to show reviews
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

  // Handle Close - Scroll back to main content
  const handleClose = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        duration: 2.0,
        scrollTo: {
          y: window.innerHeight,
        },
        ease: "power4.inOut",
        onComplete: () => {
          setIsReviewsVisible(false);
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
      className="w-full h-screen overflow-y-auto overflow-x-hidden bg-black"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {/* Reviews Section - Hidden by default, appears on click */}
      <section
        id="reviews-section"
        ref={reviewsSectionRef}
        className={`relative h-screen w-full flex-shrink-0 overflow-hidden bg-black ${
          isReviewsVisible ? "block" : "hidden"
        } ${isReviewsVisible ? "cursor-close" : ""}`}
        onClick={handleClose}
        style={{ scrollSnapAlign: 'start' }}
      >
        {/* Dark Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div className="max-w-6xl w-full">
            <h2 className="text-white/50 text-xs uppercase tracking-[0.3em] text-center mb-8">
              What Our Clients Say
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviewsData.map((review) => (
                <div 
                  key={review._id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
                      <img 
                        src={review.reviewerImgUrl} 
                        alt={review.reviewerName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-sm">{review.reviewerName}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <GoogleIcon />
                        <span className="text-white/40 text-xs">Google Review</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                    "{review.reviewText}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hint text */}
        <div className="absolute bottom-8 left-0 right-0 z-20 text-center">
          <p className="text-white/30 text-xs uppercase tracking-[0.2em]">
            Click anywhere to close
          </p>
        </div>
      </section>

      {/* Main Content Section - Always visible */}
      <section 
        ref={mainContentRef}
        className="relative h-screen w-full flex-shrink-0 overflow-hidden bg-black"
        style={{ scrollSnapAlign: 'start' }}
      >
        {/* Dark Background with Glow */}
        <div className="absolute inset-0 bg-black"></div>
        
        {/* Center Glow Effect - Like the glucose device image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none"></div>

        {/* Main Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          
          {/* Device Image (Using a glucose meter-like icon or placeholder) */}
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
              onClick={handleReviewsClick}
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
    </div>
  );
}