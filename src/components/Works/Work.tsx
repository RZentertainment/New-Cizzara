"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import WorkDefault from "./WorkDefault";
import WorksTop from "./WorksTop";

/**
 * Work
 * ----
 * Two full-height sections live inside a single overflow-hidden scroll
 * container:
 *
 *   [ WorksTop   ]  <- mounted only while revealed, sits ABOVE default
 *   [ WorkDefault]  <- always mounted, the resting/hero state
 *
 * Reveal:
 *  1. Mount WorksTop (flushSync so the DOM height exists before we touch scroll)
 *  2. Instantly jump scrollTop to one container-height (so the viewport is
 *     still framing WorkDefault, no visual change yet)
 *  3. Tween scrollTop back to 0 with GSAP -> WorksTop slides down into frame
 *
 * Close:
 *  1. Tween scrollTop from 0 -> one container-height -> WorksTop slides
 *     back up and out of frame
 *  2. Unmount WorksTop, snap scrollTop back to 0 instantly
 */
export default function Work() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isAnimatingRef = useRef(false);

  const [isTopMounted, setIsTopMounted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const getUnit = useCallback(() => {
    return containerRef.current?.clientHeight ?? window.innerHeight;
  }, []);

  const handleReveal = useCallback(() => {
    const container = containerRef.current;
    if (!container || isAnimatingRef.current || isTopMounted) return;

    isAnimatingRef.current = true;
    setIsRevealed(true);

    // 1. Mount the top section synchronously so its height exists in the DOM
    //    before we do any scroll math.
    flushSync(() => {
      setIsTopMounted(true);
    });

    const unit = getUnit();

    // 2. Instant, invisible correction: park the scroll at the default
    //    section so nothing visually changes yet.
    container.scrollTop = unit;

    // 3. Animate back to 0 — the top section physically slides down.
    gsap.killTweensOf(container);
    gsap.to(container, {
      scrollTop: 0,
      duration: 1.95,
      ease: "power4.inOut",
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
  }, [getUnit, isTopMounted]);

  const handleClose = useCallback(() => {
    const container = containerRef.current;
    if (!container || isAnimatingRef.current || !isTopMounted) return;

    isAnimatingRef.current = true;
    const unit = getUnit();

    gsap.killTweensOf(container);
    gsap.to(container, {
      scrollTop: unit,
      duration: 1.9,
      ease: "power4.inOut",
      onComplete: () => {
        // Unmount + reset scroll instantly, then release the guard.
        flushSync(() => {
          setIsTopMounted(false);
        });
        container.scrollTop = 0;
        setIsRevealed(false);
        setResetKey((k) => k + 1);
        isAnimatingRef.current = false;
      },
    });
  }, [getUnit, isTopMounted]);

  // Keep the resting scroll position correct on resize while collapsed.
  useEffect(() => {
    const onResize = () => {
      if (!isTopMounted && containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isTopMounted]);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#0c0b0b] [scroll-behavior:auto]"
      aria-live="polite"
    >
      {isTopMounted && <WorksTop onClose={handleClose} />}
      <WorkDefault
        onRevealComplete={handleReveal}
        isRevealed={isRevealed}
        resetKey={resetKey}
      />
    </div>
  );
}