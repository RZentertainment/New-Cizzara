"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import HomeLoading from "@/components/HomeLoading";
import WhoWeAre from "@/components/Home/WhoWeAre";
import ShowCase from "@/components/Home/ShowCase";
import StudioOverview from "@/components/Home/StudioOverview";
import About from "@/components/Home/About/About";
import { Visuals } from "@/components/Visuals";
import ShowReel from "@/components/Home/ShowReel";
import Focuse from "@/components/Home/Focuse";
import Blog from "@/components/Home/Blog";
import Clients from "@/components/Home/Clients";
import Service from "@/components/Home/Service/Service";
import Reviews from "@/components/Home/Reviews/Reviews";
import ServiceRotation from "@/components/Home/Service/ServiceRotation";

export default function CizzaraStudioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Refs for values needed in callbacks (avoids stale closures)
  const currentPageRef = useRef(currentPage);
  const isAnimatingRef = useRef(isAnimating);
  
  // Keep refs in sync
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);
  
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  const totalPages = 11; // Updated to 5 pages (0, 1, 2, 3, 4)
  const fullText = "CizzaraStudio";
  const totalLetters = fullText.length;

  // Loading animation
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2500;
    let animationFrameId: number;

    const animateLetters = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      const lettersCompleted = Math.floor((currentProgress / 100) * totalLetters);
      setProgress(lettersCompleted);

      if (currentProgress < 100) {
        animationFrameId = requestAnimationFrame(animateLetters);
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 400);
      }
    };

    animationFrameId = requestAnimationFrame(animateLetters);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Go to specific page — uses refs to avoid stale closures
  const goToPage = useCallback((pageIndex: number, smooth = true) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // Clear any existing animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    setIsAnimating(true);
    isAnimatingRef.current = true;
    
    const pageWidth = window.innerWidth;
    const targetScroll = pageIndex * pageWidth;
    
    container.scrollTo({
      left: targetScroll,
      behavior: smooth ? 'smooth' : 'auto'
    });
    
    animationTimeoutRef.current = setTimeout(() => {
      setCurrentPage(pageIndex);
      currentPageRef.current = pageIndex;
      setDragOffset(0);
      setIsAnimating(false);
      isAnimatingRef.current = false;
      animationTimeoutRef.current = null;
    }, smooth ? 600 : 0);
  }, []); // Empty deps — safe because we use refs

  // Handle drag start
  const handleDragStart = useCallback((clientX: number) => {
    if (isAnimatingRef.current) return;
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
  }, []);

  // Handle drag move
  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging || isAnimatingRef.current || !scrollContainerRef.current) return;
    
    const deltaX = clientX - startX;
    const maxDrag = window.innerWidth * 0.4;
    
    const clampedDrag = Math.max(-maxDrag, Math.min(maxDrag, deltaX));
    setDragOffset(clampedDrag);
    
    const currentScroll = currentPageRef.current * window.innerWidth;
    scrollContainerRef.current.scrollLeft = currentScroll - clampedDrag;
  }, [isDragging, startX]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!isDragging || isAnimatingRef.current) return;
    setIsDragging(false);
    
    const threshold = window.innerWidth * 0.15;
    const current = currentPageRef.current;
    
    if (dragOffset > threshold && current > 0) {
      goToPage(current - 1);
    } else if (dragOffset < -threshold && current < totalPages - 1) {
      goToPage(current + 1);
    } else {
      goToPage(current);
    }
  }, [isDragging, dragOffset, goToPage, totalPages]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  }, [handleDragStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    handleDragMove(e.clientX);
  }, [isDragging, handleDragMove]);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  }, [handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Keyboard navigation — uses refs, stable effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimatingRef.current) return;
      
      const current = currentPageRef.current;
      
      if (e.key === 'ArrowRight' && current < totalPages - 1) {
        goToPage(current + 1);
      } else if (e.key === 'ArrowLeft' && current > 0) {
        goToPage(current - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPage, totalPages]); // Stable: goToPage has [] deps, totalPages is constant

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <HomeLoading 
        progress={progress} 
        totalLetters={totalLetters} 
        fullText={fullText} 
      />
    );
  }
  

  return (
    <main className="w-full min-h-screen">
      {/* Main Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className={`w-full h-full overflow-hidden select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-nowrap h-full">
        
          <div className="w-screen h-full flex-shrink-0">
            <WhoWeAre />
          </div>
          
          <div className="w-screen h-full flex-shrink-0">
            <ShowCase />
          </div>
          
<div className="w-screen h-full flex-shrink-0">
  <StudioOverview active={currentPage === 2} /> 
</div>
 <div className="w-screen h-full flex-shrink-0">
  <Visuals active={currentPage === 3} />
</div>
          <div className="w-screen h-full flex-shrink-0">
            <About />
          </div>
<div className="w-screen h-full flex-shrink-0">
  <Service active={currentPage === 5} /> 
</div>
           <div className="w-screen h-full flex-shrink-0">
  <Reviews active={currentPage === 6} /> 
</div>
            <div className="w-screen h-full flex-shrink-0">
            <ShowReel />
          </div>
          <div className="w-screen h-full flex-shrink-0">
            <Focuse />
          </div>

  <div className="w-screen h-full flex-shrink-0">
          <Blog/>
          </div>

            <div className="w-screen h-full flex-shrink-0">
          <Clients/>
          </div>

         
        </div>
      </div>

      {/* Page Indicator Numbers */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i)}
            disabled={isAnimating}
            aria-label={`Go to page ${i + 1}`}
            aria-current={currentPage === i ? "page" : undefined}
            className={`w-10 h-10 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              currentPage === i 
                ? "bg-black text-white" 
                : "bg-black/50 text-white/50 hover:bg-black/70 hover:text-white/80"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 0 || isAnimating}
        aria-label="Previous page"
        className={`fixed left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/5 backdrop-blur-sm text-white/70 transition-all duration-300 hover:bg-white/20 hover:text-white ${
          currentPage === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages - 1 || isAnimating}
        aria-label="Next page"
        className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/5 backdrop-blur-sm text-white/70 transition-all duration-300 hover:bg-white/20 hover:text-white ${
          currentPage === totalPages - 1 ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Page Number */}
      <div className="fixed bottom-8 right-8 z-50 text-white/30 text-xs tracking-widest font-light">
        {String(currentPage + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
      </div>
    </main>
  );
}