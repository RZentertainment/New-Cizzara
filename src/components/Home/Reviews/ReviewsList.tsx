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
    <div className="relative min-w-[320px] md:min-w-[380px] rounded-xl p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-default select-none">
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
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // Prevent flash by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep a ref mirror of isPaused so the RAF loop can read it without
  // needing to be a dependency of the animation effect (that was what
  // caused the loop to be torn down + rebuilt on every hover before).
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Triple the reviews for infinite scrolling effect
  const tripledReviews = React.useMemo(() => {
    if (reviews.length === 0) return [];
    return [...reviews, ...reviews, ...reviews];
  }, [reviews]);

  // Auto-scroll engine — single effect handles both initial positioning
  // and the animation loop, so there's no race between two timers.
  useEffect(() => {
    if (!isVisible || !scrollContainerRef.current || tripledReviews.length === 0) return;

    const el = scrollContainerRef.current;
    const scrollSpeed = 1.5; // pixels per ~16ms frame
    let lastTime = 0;
    let rafId = 0;
    let ready = false;

    const oneSetWidth = () => el.scrollWidth / 3;

    // Retried every frame (instead of a single timed guess) so a slow
    // reflow/font-swap/layout pass can never permanently miss the window
    // and leave `ready` stuck false.
    const tryBecomeReady = () => {
      if (el.scrollWidth > el.clientWidth) {
        el.scrollLeft = oneSetWidth();
        ready = true;
      }
    };

    const animate = (timestamp: number) => {
      if (!ready) {
        tryBecomeReady();
        rafId = requestAnimationFrame(animate);
        return;
      }

      if (isPausedRef.current) {
        // Reset lastTime so resuming doesn't jump forward by the
        // elapsed paused duration.
        lastTime = 0;
        rafId = requestAnimationFrame(animate);
        return;
      }

      if (lastTime === 0) lastTime = timestamp;
      // Cap the delta so a frame after the tab/window was backgrounded
      // (rAF pauses entirely while hidden) never tries to jump several
      // sets' worth of pixels in a single step.
      const deltaTime = Math.min(timestamp - lastTime, 100);
      lastTime = timestamp;

      el.scrollLeft += scrollSpeed * (deltaTime / 16);

      const setWidth = oneSetWidth();
      // Wrap seamlessly within the middle set. `while` (not a single if)
      // so it always fully corrects even after a multi-set overshoot.
      while (el.scrollLeft >= setWidth * 2) el.scrollLeft -= setWidth;
      while (el.scrollLeft <= 0) el.scrollLeft += setWidth;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    // Belt-and-suspenders: explicitly reset the timing baseline when the
    // tab regains visibility, on top of the per-frame cap above.
    const handleVisibility = () => {
      if (!document.hidden) lastTime = 0;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // Intentionally NOT depending on isPaused — see isPausedRef above.
  }, [isVisible, tripledReviews.length]);

  // If not mounted yet or no reviews, render nothing
  if (!mounted || tripledReviews.length === 0) return null;

  return (
    <section
      className="relative h-screen w-full flex-shrink-0 bg-[#050508] cursor-pointer"
      style={{
        scrollSnapAlign: "start",
      }}
      onClick={onClose}
    >
      {/* Content */}
      <div className="relative z-10 flex min-h-full flex-col items-center justify-center py-16 w-full">
        <div className="w-full">
          
          {/* Heading */}
          <div className="text-center mb-10 px-4 md:px-8">
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2">
              Testimonials
            </p>
            <h2 className="text-white text-3xl md:text-4xl font-light tracking-wide">
              What Our Clients Say
            </h2>
          </div>

          {/* Carousel Container */}
          <div className="relative group w-full">
            {/* Scroll Track - Infinite Carousel */}
            <div
              ref={scrollContainerRef}
              className="flex flex-row gap-6 overflow-x-auto pb-6 px-4 md:px-8 hide-scrollbar w-full"
              style={{
                scrollBehavior: "auto",
                cursor: isPaused ? "default" : "grab",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {tripledReviews.map((review, index) => (
                <ReviewCard key={`${review._id}-${index}`} review={review} />
              ))}
            </div>

            {/* Navigation Buttons - Click to jump 3 reviews */}
            <div 
              className="flex justify-center gap-4 mt-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (scrollContainerRef.current) {
                    const el = scrollContainerRef.current;
                    const children = Array.from(el.children) as HTMLElement[];
                    if (children.length >= 3) {
                      const cardWidth = children[0].offsetWidth;
                      const gap = 24;
                      const threeCardsWidth = cardWidth * 3 + gap * 2;
                      el.scrollBy({ left: -threeCardsWidth, behavior: "smooth" });
                    }
                  }
                }}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (scrollContainerRef.current) {
                    const el = scrollContainerRef.current;
                    const children = Array.from(el.children) as HTMLElement[];
                    if (children.length >= 3) {
                      const cardWidth = children[0].offsetWidth;
                      const gap = 24;
                      const threeCardsWidth = cardWidth * 3 + gap * 2;
                      el.scrollBy({ left: threeCardsWidth, behavior: "smooth" });
                    }
                  }
                }}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              {/* Pause/Play button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
              >
                {isPaused ? (
                  // Play triangle — shown while paused, click to resume
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
                  </svg>
                ) : (
                  // Pause bars — shown while playing, click to pause
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                  </svg>
                )}
              </button>
            </div>

            {/* Google Reviews Badge */}
            <div
              className="mt-8 flex w-full justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href="https://share.google/AB13tjWNbhWD2fGX5"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-[#2b292b] px-5 py-3 text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:border-white/25 hover:bg-[#343234] hover:scale-[1.02]"
              >
                {/* Google Logo */}
                <img
                  src="https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png"
                  alt="Google"
                  className="h-7 w-7"
                />

                {/* Rating */}
                <span className="text-xl font-bold">5</span>

                {/* Stars */}
                <div className="flex items-center gap-0.5 text-[#FFC107] text-lg">
                  ★★★★★
                </div>

                {/* Reviews */}
                <span className="text-[17px] font-medium text-white/70">
                  from <span className="text-white">134 reviews</span>
                </span>

                {/* External Link Icon */}
                <svg
                  className="h-4 w-4 text-white/50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M14 3h7v7" />
                  <path d="M10 14L21 3" />
                  <path d="M21 14v7h-7" />
                  <path d="M3 10V3h7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Close Hint */}
          <div 
            className="text-center mt-6 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <p className="text-white/20 text-xs uppercase tracking-[0.2em]">
              Click here to close
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ReviewsList;