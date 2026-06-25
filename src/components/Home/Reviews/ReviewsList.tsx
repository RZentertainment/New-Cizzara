"use client";

import React, { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Review {
  _id: string;
  reviewText: string;
  reviewerName: string;
  reviewerImgUrl: string;
}

interface ReviewsListProps {
  isVisible: boolean;
  onClose: () => void;
  reviews: Review[];
}

// ─── Google Icon ──────────────────────────────────────────────────────────────

const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// ─── Review Card ──────────────────────────────────────────────────────────────

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="relative min-w-[320px] md:min-w-[380px] rounded-xl p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-default">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
          <img
            src={review.reviewerImgUrl}
            alt={review.reviewerName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name + Badge */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-base truncate">
            {review.reviewerName}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <GoogleIcon />
            <span className="text-white/40 text-xs">Google Review</span>
          </div>
        </div>

        {/* Stars */}
        <div className="flex gap-0.5 flex-shrink-0">
          {[...Array(5)].map((_, i) => (
            <svg key={i} viewBox="0 0 24 24" width="14" height="14" fill="#FFC107">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Review Text */}
      <p className="text-sm leading-relaxed text-white/70">
        <span className="text-white/30 text-xl mr-1 font-serif">"</span>
        {review.reviewText}
        <span className="text-white/30 text-xl ml-1 font-serif">"</span>
      </p>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ReviewsList: React.FC<ReviewsListProps> = ({ isVisible, onClose, reviews }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent flash by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check scroll position to enable/disable buttons
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  // Add scroll event listener
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    
    el.addEventListener('scroll', checkScroll);
    // Initial check after render
    setTimeout(checkScroll, 100);
    
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  // Reset scroll when component becomes visible
  useEffect(() => {
    if (isVisible && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      // Re-check scroll position after reset
      setTimeout(checkScroll, 200);
    }
  }, [isVisible]);

  // Scroll functions
  const scrollLeft = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = el.firstChild ? (el.firstChild as HTMLElement).offsetWidth : 320;
    const gap = 24; // gap-6 in Tailwind = 24px
    el.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
  };

  const scrollRight = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = el.firstChild ? (el.firstChild as HTMLElement).offsetWidth : 320;
    const gap = 24; // gap-6 in Tailwind = 24px
    el.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
  };

  // If not mounted yet, render nothing to prevent white flash
  if (!mounted) return null;

  return (
    <section
      className="relative h-screen w-full flex-shrink-0 bg-[#050508]"
      onClick={onClose}
      style={{
        scrollSnapAlign: "start",
      }}
    >
      {/* Content */}
      <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-4 py-16 md:px-8">
        <div className="max-w-7xl w-full">
          
          {/* Heading */}
          <div className="text-center mb-10">
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2">
              Testimonials
            </p>
            <h2 className="text-white text-3xl md:text-4xl font-light tracking-wide">
              What Our Clients Say
            </h2>
          </div>

          {/* Carousel Container */}
          <div className="relative group">
            {/* Scroll Track */}
            <div
              ref={scrollContainerRef}
              className="flex flex-row gap-6 overflow-x-auto scroll-smooth pb-6 px-2"
              style={{
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Hide scrollbar for Chrome/Safari/Opera */}
              <style>{`
                .flex::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>

            {/* Slide Buttons - Positioned below the reviews */}
            <div 
              className="flex justify-center gap-4 mt-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => { 
                  e.stopPropagation();
                  scrollLeft(); 
                }}
                className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 ${
                  canScrollLeft ? 'opacity-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                onClick={(e) => { 
                  e.stopPropagation();
                  scrollRight(); 
                }}
                className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 ${
                  canScrollRight ? 'opacity-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Close Hint */}
          <div className="text-center mt-6">
            <p className="text-white/20 text-xs uppercase tracking-[0.2em]">
              Click anywhere to close
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsList;