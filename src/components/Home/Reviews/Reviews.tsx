"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import ReviewsMain from "./ReviewsMain";
import ReviewsList from "./ReviewsList";

gsap.registerPlugin(ScrollToPlugin);

export default function Reviews() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const [isReviewsVisible, setIsReviewsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Refs mirror state so GSAP callbacks never read stale values
  const isTransitioningRef = useRef(false);
  const isReadyRef = useRef(false);
  const isReviewsVisibleRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => { isTransitioningRef.current = isTransitioning; }, [isTransitioning]);
  useEffect(() => { isReadyRef.current = isReady; }, [isReady]);
  useEffect(() => { isReviewsVisibleRef.current = isReviewsVisible; }, [isReviewsVisible]);

  /* ── Deterministic initialization ────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;

    const tryInit = () => {
      if (cancelled) return;
      const el = containerRef.current;

      if (!el || el.scrollHeight < window.innerHeight) {
        raf1 = requestAnimationFrame(tryInit);
        return;
      }

      el.style.overflow = "hidden";

      raf2 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          if (cancelled || !containerRef.current) return;
          containerRef.current.scrollTo({ top: window.innerHeight, behavior: "instant" });
          containerRef.current.style.overflow = "hidden";
          setIsReady(true);
          isReadyRef.current = true;
        });
      });
    };

    tryInit();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  /* ── Core transition runner ─────────────────────────────────── */
  const runPanelTransition = useCallback(
    (opts: {
      mount?: () => void;
      instantYBeforeAnimate?: number;
      targetY: number;
      duration: number;
      unmount?: () => void;
      instantYAfterUnmount?: number;
    }) => {
      const el = containerRef.current;
      if (!el || isTransitioningRef.current) return;

      isTransitioningRef.current = true;
      setIsTransitioning(true);

      tlRef.current?.kill();

      if (opts.mount) {
        flushSync(opts.mount);
      }

      el.style.overflow = "auto";

      if (typeof opts.instantYBeforeAnimate === "number") {
        el.scrollTo({ top: opts.instantYBeforeAnimate, behavior: "instant" });
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (opts.unmount) {
            flushSync(opts.unmount);
            if (typeof opts.instantYAfterUnmount === "number" && containerRef.current) {
              containerRef.current.scrollTo({
                top: opts.instantYAfterUnmount,
                behavior: "instant",
              });
            }
          }

          if (containerRef.current) {
            containerRef.current.style.overflow = "hidden";
          }
          isTransitioningRef.current = false;
          setIsTransitioning(false);
        },
      });

      tl.to(el, {
        duration: opts.duration,
        scrollTo: { y: opts.targetY },
        ease: "power4.inOut",
      });

      tlRef.current = tl;
    },
    []
  );

  /* ── Default → Reviews: mount Reviews above Default, snap to keep
     Default visually anchored, then slide up to reveal Reviews ──── */
  const handleReviewsClick = useCallback(() => {
    if (!isReadyRef.current || isTransitioningRef.current || isReviewsVisibleRef.current) return;

    runPanelTransition({
      mount: () => {
        setIsReviewsVisible(true);
        isReviewsVisibleRef.current = true;
      },
      instantYBeforeAnimate: window.innerHeight,
      targetY: 0,
      duration: 1.9,
    });
  }, [runPanelTransition]);

  /* ── Reviews → Default: slide down to Default's slot, then unmount
     Reviews and snap back to window.innerHeight so Default lands cleanly ── */
  const handleClose = useCallback(() => {
    if (!isReadyRef.current || isTransitioningRef.current || !isReviewsVisibleRef.current) return;

    runPanelTransition({
      targetY: window.innerHeight,
      duration: 1.9,
      unmount: () => {
        setIsReviewsVisible(false);
        isReviewsVisibleRef.current = false;
      },
      instantYAfterUnmount: window.innerHeight,
    });
  }, [runPanelTransition]);

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-auto overflow-x-hidden bg-black"
      style={{
        scrollSnapType: "y mandatory",
        overflow: "hidden",
      }}
    >
      {/* Reviews List Section — appears on click */}
      {isReviewsVisible && (
        <ReviewsList
          isVisible={isReviewsVisible}
          onClose={handleClose}
        />
      )}

      {/* Main Content Section — always visible */}
      <ReviewsMain
        buttonRef={buttonRef}
        onReviewsClick={handleReviewsClick}
      />

      <style jsx global>{`
        .cursor-close {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cg transform='translate(28,28)'%3E%3Cline x1='-12' y1='-12' x2='12' y2='12' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='12' y1='-12' x2='-12' y2='12' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E") 28 28, pointer !important;
        }
      `}</style>
    </div>
  );
}