"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

type View = "VIEW_OVERVIEW" | "VIEW_VIDEO";

export default function StudioOverview({ active = false }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Refs mirror state so GSAP callbacks / rAF loops / event listeners
  // never read stale values.
  const isTransitioningRef = useRef(false);
  const isReadyRef = useRef(false);
  const isVideoVisibleRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Single source of truth for the current panel.
  const viewRef = useRef<View>("VIEW_OVERVIEW");

  useEffect(() => { isTransitioningRef.current = isTransitioning; }, [isTransitioning]);
  useEffect(() => { isReadyRef.current = isReady; }, [isReady]);
  useEffect(() => { isVideoVisibleRef.current = isVideoVisible; }, [isVideoVisible]);

  const targetYFor = (view: View) => (view === "VIEW_OVERVIEW" ? window.innerHeight : 0);

  /* ── Video autoplay/pause follows visibility ─────────────────────── */
  useEffect(() => {
    if (isVideoVisible) {
      videoRef.current?.play().catch(() => {});
    } else {
      videoRef.current?.pause();
    }
  }, [isVideoVisible]);

  /* ── Deterministic initialization (no setTimeout) ─────────────────
     Video panel is always mounted (opacity-toggled, not display-
     toggled — see render below), so the container is reliably 2
     viewports tall once painted. Wait for that, plus two rAFs for
     paint confirmation, before snapping scroll and flipping isReady. */
  useEffect(() => {
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
          viewRef.current = "VIEW_OVERVIEW";
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
  }, []);

  /* ── Lock out every native scroll vector ──────────────────────────
     Wheel, touch, and keyboard scrolling are all preventDefault'd.
     GSAP drives scrollTop directly, so none of this interrupts a
     running timeline. ───────────────────────────────────────────────── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const blockWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    const blockTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

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
  }, []);

  /* ── Drift correction ──────────────────────────────────────────────
     Snap scrollTop back to the current view's resting position if it
     ever drifts (resize, stray external scroll) — never while a GSAP
     timeline is actively driving the scroll. ─────────────────────────── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isReady) return;

    const correctDrift = () => {
      if (isTransitioningRef.current || !containerRef.current) return;
      const expected = targetYFor(viewRef.current);
      if (Math.abs(containerRef.current.scrollTop - expected) > 1) {
        containerRef.current.scrollTo({ top: expected, behavior: "instant" });
      }
    };

    const onResize = () => correctDrift();
    const onScroll = () => correctDrift();

    window.addEventListener("resize", onResize);
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      el.removeEventListener("scroll", onScroll);
    };
  }, [isReady]);

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  /* ── Explore Studio: Overview → Video. One master timeline; the
     video panel mounts (opacity-toggled) immediately before the slide
     so it never flashes in ahead of the GSAP scroll. ────────────────── */
  const handleExploreClick = useCallback(() => {
    if (!isReadyRef.current || isTransitioningRef.current || isVideoVisibleRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    tlRef.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        viewRef.current = "VIEW_VIDEO";
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      },
    });

    tl.call(() => {
      setIsVideoVisible(true);
      isVideoVisibleRef.current = true;
    }).to(el, {
      duration: 1.8,
      scrollTo: { y: 0 },
      ease: "power3.inOut",
    });

    tlRef.current = tl;
  }, []);

  /* ── Close: Video → Overview, unmount only after ──────────────────── */
  const handleClose = useCallback(() => {
    if (!isReadyRef.current || isTransitioningRef.current || !isVideoVisibleRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    tlRef.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        viewRef.current = "VIEW_OVERVIEW";
        setIsVideoVisible(false);
        isVideoVisibleRef.current = false;
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      },
    });

    tl.to(el, {
      duration: 1.5,
      scrollTo: { y: window.innerHeight },
      ease: "power3.inOut",
    });

    tlRef.current = tl;
  }, []);

  /* ── Set initial hidden state for the text/button reveal ──────────── */
  useEffect(() => {
    gsap.set(textRef.current, { x: -100, opacity: 0 });
    gsap.set(buttonRef.current, { x: -100, opacity: 0 });
  }, []);

  /* ── Animate text/button in when this page becomes active ─────────── */
  useEffect(() => {
    if (active && !hasAnimated) {
      const tl = gsap.timeline({
        onComplete: () => {
          setHasAnimated(true);
        },
      });

      tl.to(textRef.current, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      }).to(
        buttonRef.current,
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.3"
      );
    } else if (!active && hasAnimated) {
      gsap.set(textRef.current, { x: -100, opacity: 0 });
      gsap.set(buttonRef.current, { x: -100, opacity: 0 });
      setHasAnimated(false);
    }
  }, [active, hasAnimated]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden overscroll-none"
      // scrollSnapType removed — vertical position is now exclusively
      // programmatic (View type above), driven only by button clicks.
      style={{ overflowY: "hidden", overflowX: "hidden" }}
    >
      {/* Video Section — always mounted, opacity-toggled (never display)
          so the container's scrollable height is constant. */}
      <section
        id="studio-video"
        ref={sectionRef}
        className={`relative h-screen w-full flex-shrink-0 overflow-hidden bg-black group transition-opacity duration-300 ${
          isVideoVisible ? "opacity-100 pointer-events-auto cursor-close" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
        aria-hidden={!isVideoVisible}
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source
            src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAre.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <div className="relative z-10 flex h-full items-center justify-center pointer-events-none">
          <h2 className="text-white text-5xl md:text-7xl font-light tracking-[0.3em] uppercase">
            Studio
          </h2>
        </div>

        <div
          className={`absolute bottom-8 left-0 right-0 z-20 text-center transition-all duration-500 pointer-events-none ${
            isVideoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-white/50 text-xs uppercase tracking-[0.2em]">
            Click anywhere to close
          </p>
        </div>
      </section>

      {/* Studio Overview Section - Always visible */}
      <section
        id="studio-overview"
        ref={overviewRef}
        className="relative h-screen w-full flex-shrink-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://cdn.cizzara.com/Cizzara-Latest/StudioOverview.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 flex h-full items-center">
          <div className="ml-[8vw] max-w-[520px] text-white">
            <div ref={textRef}>
              <p className="mb-8 ml-2 text-xs uppercase tracking-[0.25em] font-medium">
                STUDIO OVERVIEW
              </p>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[0.95] tracking-[-0.03em]">
                Creating stories
                <br />
                that become
                <br />
                experiences.
              </h2>

              <div className="mt-10 mb-10 h-px w-full max-w-[420px] bg-white/70" />
            </div>

            <button
              ref={buttonRef}
              onClick={handleExploreClick}
              className="group relative inline-block w-80 h-20 cursor-pointer"
            >
              <span className="absolute left-0 top-0 flex h-20 w-20 items-center rounded-full bg-white transition-all duration-700 ease-[cubic-bezier(0.65,0,0.076,1)] group-hover:w-full">
                <span className="absolute left-6 h-[3px] w-7 bg-black">
                  <span className="absolute right-0 top-[-6px] h-4 w-4 rotate-45 border-r-[3px] border-t-[3px] border-black" />
                </span>
              </span>

              <span className="absolute inset-0 ml-16 flex items-center justify-center text-lg font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-700 group-hover:text-black">
                Explore Studio
              </span>
            </button>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .cursor-close {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cg transform='translate(28,28)'%3E%3Cline x1='-12' y1='-12' x2='12' y2='12' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='12' y1='-12' x2='-12' y2='12' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E") 28 28, pointer !important;
        }
      `}</style>
    </div>
  );
}