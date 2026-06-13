"use client";

import { useEffect, useState, useRef } from "react";
import HomeLoading from "@/components/HomeLoading";
import WhoWeAre from "@/components/Home/WhoWeAre";
import ShowCase from "@/components/Home/ShowCase";
import StudioOverview from "@/components/Home/StudioOverview";
    import { Visuals } from "@/components/Visuals"

export default function CizzaraStudioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const fullText = "CizzaraStudio";
  const totalLetters = fullText.length;

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2500;

    const animateLetters = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      const lettersCompleted = Math.floor((currentProgress / 100) * totalLetters);
      setProgress(lettersCompleted);

      if (currentProgress < 100) {
        requestAnimationFrame(animateLetters);
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 400);
      }
    };

    requestAnimationFrame(animateLetters);
  }, []);

  // Go to specific page
  const goToPage = (pageIndex: number, smooth = true) => {
    if (isAnimating || !scrollContainerRef.current) return;
    setIsAnimating(true);
    
    const pageWidth = window.innerWidth;
    const targetScroll = pageIndex * pageWidth;
    
    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: smooth ? 'smooth' : 'auto'
    });
    
    setTimeout(() => {
      setCurrentPage(pageIndex);
      setDragOffset(0);
      setIsAnimating(false);
    }, 600);
  };

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimating) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
  };

  // Handle drag move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isAnimating || !scrollContainerRef.current) return;
    
    const deltaX = e.clientX - startX;
    const maxDrag = window.innerWidth * 0.4; // Max 40% drag before flip
    
    // Clamp the drag offset
    const clampedDrag = Math.max(-maxDrag, Math.min(maxDrag, deltaX));
    setDragOffset(clampedDrag);
    
    // Apply transform for visual feedback
    const currentScroll = currentPage * window.innerWidth;
    scrollContainerRef.current.scrollLeft = currentScroll - clampedDrag;
  };

  // Handle drag end
  const handleMouseUp = () => {
    if (!isDragging || isAnimating) return;
    setIsDragging(false);
    
    // Determine if we should flip
    const threshold = window.innerWidth * 0.15; // 15% threshold
    
    if (dragOffset > threshold && currentPage > 0) {
      // Flip to previous page
      goToPage(currentPage - 1);
    } else if (dragOffset < -threshold && currentPage < 2) {
      // Flip to next page
      goToPage(currentPage + 1);
    } else {
      // Snap back to current page
      goToPage(currentPage);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentPage < 2) {
        goToPage(currentPage + 1);
      } else if (e.key === 'ArrowLeft' && currentPage > 0) {
        goToPage(currentPage - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isAnimating]);

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
    // <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">
    //   {/* Main Scroll Container */}
    //   <div 
    //     ref={scrollContainerRef}
    //     className={`w-full h-full overflow-hidden ${
    //       isDragging ? "cursor-grabbing" : "cursor-grab"
    //     }`}
    //     onMouseDown={handleMouseDown}
    //     onMouseMove={handleMouseMove}
    //     onMouseUp={handleMouseUp}
    //     onMouseLeave={handleMouseUp}
    //   >
    //     <div className="flex flex-nowrap h-full">
    //       {/* Page 1 - WhoWeAre */}
    //       <div className="w-screen h-full flex-shrink-0">
    //         <WhoWeAre />
    //       </div>
          
    //       {/* Page 2 - ShowCase */}
    //       <div className="w-screen h-full flex-shrink-0">
    //         <ShowCase />
    //       </div>
          
    //       {/* Page 3 - StudioOverview */}
    //       <div className="w-screen h-full flex-shrink-0">
    //         <StudioOverview />
    //       </div>
    //     </div>
    //   </div>

    //   {/* Page Indicator Numbers - Updated */}
    //   <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
    //     {[0, 1, 2].map((page) => (
    //       <button
    //         key={page}
    //         onClick={() => goToPage(page)}
    //         className={`w-10 h-10 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
    //           currentPage === page 
    //             ? "bg-black text-white" 
    //             : "bg-black/50 text-white/50 hover:bg-black/70 hover:text-white/80"
    //         }`}
    //       >
    //         {page + 1}
    //       </button>
    //     ))}
    //   </div>

    //   {/* Navigation Arrows */}
    //   <button
    //     onClick={() => goToPage(currentPage - 1)}
    //     className={`fixed left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/5 backdrop-blur-sm text-white/70 transition-all duration-300 hover:bg-white/20 hover:text-white ${
    //       currentPage === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
    //     }`}
    //   >
    //     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    //       <polyline points="15 18 9 12 15 6" />
    //     </svg>
    //   </button>

    //   <button
    //     onClick={() => goToPage(currentPage + 1)}
    //     className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/5 backdrop-blur-sm text-white/70 transition-all duration-300 hover:bg-white/20 hover:text-white ${
    //       currentPage === 2 ? "opacity-0 pointer-events-none" : "opacity-100"
    //     }`}
    //   >
    //     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    //       <polyline points="9 18 15 12 9 6" />
    //     </svg>
    //   </button>

    //   {/* Page Number */}
    //   <div className="fixed bottom-8 right-8 z-50 text-white/30 text-xs tracking-widest font-light">
    //     {String(currentPage + 1).padStart(2, '0')} / 03
    //   </div>
    // </div>



    <main className="w-full min-h-screen">
      <Visuals />
    </main>
  

  );
}