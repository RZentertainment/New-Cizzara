"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import AboutTop from "./AboutTop";
import AboutDefault from "./AboutDefault";
import AboutVideo from "./AboutVideo";

gsap.registerPlugin(ScrollToPlugin);

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isRevealed, setIsRevealed] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Refs mirror state so GSAP callbacks / rAF loops never read stale values.
  const isTransitioningRef = useRef(false);
  const isReadyRef = useRef(false);
  const isRevealedRef = useRef(false);
  const isVideoOpenRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => { isTransitioningRef.current = isTransitioning; }, [isTransitioning]);
  useEffect(() => { isReadyRef.current = isReady; }, [isReady]);
  useEffect(() => { isRevealedRef.current = isRevealed; }, [isRevealed]);
  useEffect(() => { isVideoOpenRef.current = isVideoOpen; }, [isVideoOpen]);

  /* ── Deterministic initialization ──────────────────────────────
     On first mount only AboutDefault exists, so the container is
     exactly one viewport tall. We wait for that height to actually
     be committed/painted (no arbitrary setTimeout), then mark ready.
     Default sits in slot 0 at this point, so resting scroll is 0. ── */
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
          containerRef.current.scrollTo({ top: 0, behavior: "instant" });
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

  /* ── Core transition runner ───────────────────────────────────
     Handles the full lifecycle of a panel change:
       1. optionally mount a new panel ABOVE the current view
          (flushSync so the DOM is updated before we measure/snap)
       2. instantly snap scrollTop so the newly-shifted layout still
          shows exactly what was on screen a moment ago (no jump)
       3. animate via a single gsap timeline to targetY
       4. optionally unmount panel(s) that are now above the resting
          view, then instantly snap scrollTop back down to compensate
     isTransitioningRef gates entry so nothing can overlap. ───────── */
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

  /* ── Default → About: mount About above Default, snap to keep
     Default visually anchored, then slide up to reveal About. ──── */
  const handleReveal = useCallback(() => {
    if (!isReadyRef.current || isTransitioningRef.current || isRevealedRef.current) return;

    runPanelTransition({
      mount: () => {
        setIsRevealed(true);
        isRevealedRef.current = true;
      },
      instantYBeforeAnimate: window.innerHeight,
      targetY: 0,
      duration: 1.9,
    });
  }, [runPanelTransition]);

  /* ── About → Default: slide down to Default's slot, then unmount
     About and snap back to 0 so Default lands in slot 0 cleanly. ── */
  const handleClose = useCallback(() => {
    if (!isReadyRef.current || isTransitioningRef.current || !isRevealedRef.current) return;

    runPanelTransition({
      targetY: window.innerHeight,
      duration: 1.9,
      unmount: () => {
        setIsRevealed(false);
        isRevealedRef.current = false;
      },
      instantYAfterUnmount: 0,
    });
  }, [runPanelTransition]);

  /* ── About → Video: mount Video above About, snap to keep About
     visually anchored, then slide up to reveal Video. ───────────── */
  const handleVideoOpen = useCallback(() => {
    if (!isReadyRef.current || isTransitioningRef.current) return;

    runPanelTransition({
      mount: () => {
        setIsVideoOpen(true);
        isVideoOpenRef.current = true;
      },
      instantYBeforeAnimate: window.innerHeight,
      targetY: 0,
      duration: 1.8,
    });
  }, [runPanelTransition]);

  /* ── Video → Default directly: slide straight through About's
     slot down to Default's slot, then unmount both Video and About
     and snap back to 0 so Default lands in slot 0 cleanly. ──────── */
  const handleVideoClose = useCallback(() => {
    if (!isReadyRef.current || isTransitioningRef.current || !isVideoOpenRef.current) return;

    runPanelTransition({
      targetY: window.innerHeight * 2,
      duration: 2.2,
      unmount: () => {
        setIsVideoOpen(false);
        isVideoOpenRef.current = false;
        setIsRevealed(false);
        isRevealedRef.current = false;
      },
      instantYAfterUnmount: 0,
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
      className="w-full h-screen overflow-y-auto overflow-x-hidden"
      style={{
        scrollSnapType: "y mandatory",
        overflow: "hidden",
      }}
    >
      {/* Video Section — slot 0 while open */}
      {isVideoOpen && (
        <AboutVideo isRevealed={isVideoOpen} onClose={handleVideoClose} />
      )}

      {/* About Section — stays mounted under the video while it's open,
          so Video → Default can slide straight through without a flash. */}
      {(isRevealed || isVideoOpen) && (
        <AboutTop
          isRevealed={isRevealed || isVideoOpen}
          onClose={handleClose}
          onVideoOpen={handleVideoOpen}
        />
      )}

      {/* Default Section — always present */}  
      <AboutDefault onReveal={handleReveal} />

      <style jsx global>{`
        .cursor-close {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cg transform='translate(28,28)'%3E%3Cline x1='-12' y1='-12' x2='12' y2='12' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='12' y1='-12' x2='-12' y2='12' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E") 28 28, pointer !important;
        }
      `}</style>
    </div>
  );
}