"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import ServiceVideo from "./ServiceVideo";
import ServiceDefault from "./ServiceDefault";

gsap.registerPlugin(ScrollToPlugin);

type View = "VIEW_DEFAULT" | "VIEW_VIDEO";

const Service = ({ active }: { active: boolean }) => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<HTMLDivElement>(null);

  // Refs mirror state so GSAP callbacks / rAF loops / event listeners
  // never read stale values.
  const isTransitioningRef = useRef(false);
  const isReadyRef = useRef(false);
  const isVideoVisibleRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Single source of truth for the current panel — programmatic states,
  // not scroll destinations.
  const viewRef = useRef<View>("VIEW_DEFAULT");

  useEffect(() => { isTransitioningRef.current = isTransitioning; }, [isTransitioning]);
  useEffect(() => { isReadyRef.current = isReady; }, [isReady]);
  useEffect(() => { isVideoVisibleRef.current = isVideoVisible; }, [isVideoVisible]);

  const targetYFor = (view: View) => (view === "VIEW_DEFAULT" ? window.innerHeight : 0);

  /* ── Deterministic initialization (no setTimeout) ───────────────── */
  useEffect(() => {
    if (!active) {
      setIsReady(false);
      isReadyRef.current = false;
      return;
    }

    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;

    const tryInit = () => {
      if (cancelled) return;
      const el = containerRef.current;

      if (!el || el.scrollHeight < window.innerHeight * 2) {
        raf1 = requestAnimationFrame(tryInit);
        return;
      }

      raf2 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          if (cancelled || !containerRef.current) return;
          viewRef.current = "VIEW_DEFAULT";
          containerRef.current.scrollTo({ top: window.innerHeight, behavior: "instant" });
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
  }, [active]);

  /* ── Lock out every native scroll vector ─────────────────────────
     Wheel, touch, and keyboard scrolling are all preventDefault'd at
     the container (and keyboard at document, since focus may not sit
     on the container). Listeners are non-passive so preventDefault
     actually works for wheel/touchmove. None of this interrupts a
     running GSAP timeline, since GSAP drives scrollTop directly via
     style/JS, not through a native scroll event. ───────────────────── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !active) return;

    const blockWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    const blockTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    // Keys that would otherwise scroll the page/container.
    const SCROLL_KEYS = new Set([
      "ArrowUp",
      "ArrowDown",
      " ",
      "Spacebar",
      "PageUp",
      "PageDown",
      "Home",
      "End",
    ]);

    const blockKeys = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) {
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", blockWheel, { passive: false });
    el.addEventListener("touchmove", blockTouchMove, { passive: false });
    document.addEventListener("keydown", blockKeys, { passive: false });

    return () => {
      el.removeEventListener("wheel", blockWheel);
      el.removeEventListener("touchmove", blockTouchMove);
      document.removeEventListener("keydown", blockKeys);
    };
  }, [active]);

  /* ── Drift correction ─────────────────────────────────────────────
     If anything ever nudges scrollTop away from the current view's
     resting position (e.g. a resize, or any stray native scroll that
     slips through), snap it back — but never while a GSAP timeline is
     actively driving the scroll. ───────────────────────────────────── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !active || !isReady) return;

    const correctDrift = () => {
      if (isTransitioningRef.current || !containerRef.current) return;
      const expected = targetYFor(viewRef.current);
      if (Math.abs(containerRef.current.scrollTop - expected) > 1) {
        containerRef.current.scrollTo({ top: expected, behavior: "instant" });
      }
    };

    const onResize = () => correctDrift();
    // Defensive net: catches any scroll event that wasn't preventDefault'd
    // (e.g. programmatic scrolls from outside this component).
    const onScroll = () => correctDrift();

    window.addEventListener("resize", onResize);
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      el.removeEventListener("scroll", onScroll);
    };
  }, [active, isReady]);

  /* ── Reset everything when this page goes inactive ──────────────── */
  useEffect(() => {
    if (!active) {
      tlRef.current?.kill();
      tlRef.current = null;

      videoRef.current?.pause();

      setIsVideoVisible(false);
      isVideoVisibleRef.current = false;

      setIsTransitioning(false);
      isTransitioningRef.current = false;

      setIsReady(false);
      isReadyRef.current = false;

      viewRef.current = "VIEW_DEFAULT";

      if (bellRef.current) gsap.set(bellRef.current, { y: 0 });
      if (ropeRef.current) gsap.set(ropeRef.current, { height: 0 });

      if (containerRef.current) {
        containerRef.current.scrollTo({ top: 0, behavior: "instant" });
      }
    }
  }, [active]);

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  /* ── Bell click: ONE master timeline → VIEW_VIDEO ────────────────── */
  const handleBellClick = useCallback(() => {
    if (!isReadyRef.current || isTransitioningRef.current) return;
    const el = containerRef.current;
    if (!el || !bellRef.current || !ropeRef.current) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    tlRef.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        viewRef.current = "VIEW_VIDEO";
        videoRef.current?.play().catch(() => {});
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      },
    });

    tl.to(ropeRef.current, { height: 30, duration: 0.15, ease: "power1.in" })
      .to(ropeRef.current, { height: 0, duration: 0.15, ease: "power1.out" }, "+=0.05")
      .to(bellRef.current, { y: 15, duration: 0.15, ease: "power1.in" }, "-=0.15")
      .to(bellRef.current, { y: 0, duration: 0.15, ease: "power1.out" }, "+=0.05")
      .call(() => {
        setIsVideoVisible(true);
        isVideoVisibleRef.current = true;
      })
      .to(
        el,
        {
          duration: 1.9,
          scrollTo: { y: 0 },
          ease: "power4.inOut",
        },
        "-=0.1"
      );

    tlRef.current = tl;
  }, []);

  /* ── Video click: slide back → VIEW_DEFAULT, unmount only after ──── */
  const handleCloseVideo = useCallback(() => {
    if (!isReadyRef.current || isTransitioningRef.current || !isVideoVisibleRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    tlRef.current?.kill();

    videoRef.current?.pause();

    const tl = gsap.timeline({
      onComplete: () => {
        viewRef.current = "VIEW_DEFAULT";
        setIsVideoVisible(false);
        isVideoVisibleRef.current = false;
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      },
    });

    tl.to(el, {
      duration: 1.9,
      scrollTo: { y: window.innerHeight },
      ease: "power4.inOut",
    });

    tlRef.current = tl;
  }, []);

  if (!active) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white/30 text-xs tracking-widest uppercase">Service</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden overscroll-none"
      style={{ overflowY: "hidden", overflowX: "hidden" }}
    >
      <ServiceVideo
        isVisible={isVideoVisible}
        videoRef={videoRef}
        onClose={handleCloseVideo}
      />

      <ServiceDefault
        bellRef={bellRef}
        ropeRef={ropeRef}
        onBellClick={handleBellClick}
      />

      <style jsx global>{`
        .cursor-close {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cg transform='translate(28,28)'%3E%3Cline x1='-12' y1='-12' x2='12' y2='12' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='12' y1='-12' x2='-12' y2='12' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E") 28 28, pointer !important;
        }
      `}</style>
    </div>
  );
};

export default Service;