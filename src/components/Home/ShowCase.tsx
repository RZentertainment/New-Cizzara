"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

type View = "VIEW_DEFAULT" | "VIEW_VIDEO";

const ShowCase = () => {
  const [showVideo, setShowVideo] = useState(false); // unrelated hover-preview video (grid tile)
  const [isRevealed, setIsRevealed] = useState(false); // top cinematic video panel
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  // Refs mirror state so GSAP callbacks / rAF loops / event listeners
  // never read stale values.
  const isTransitioningRef = useRef(false);
  const isReadyRef = useRef(false);
  const isRevealedRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Single source of truth for the current panel.
  const viewRef = useRef<View>("VIEW_DEFAULT");

  useEffect(() => { isTransitioningRef.current = isTransitioning; }, [isTransitioning]);
  useEffect(() => { isReadyRef.current = isReady; }, [isReady]);
  useEffect(() => { isRevealedRef.current = isRevealed; }, [isRevealed]);

  const targetYFor = (view: View) => (view === "VIEW_DEFAULT" ? window.innerHeight : 0);

  /* ── Unrelated grid-tile hover preview (kept as-is) ─────────────── */
  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      setShowVideo(true);
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setShowVideo(false);
  };

  /* ── Deterministic initialization (no setTimeout) ────────────────
     Video panel is always mounted (opacity-toggled, not display-
     toggled — see render below), so the container is reliably
     2 viewports tall once painted. Wait for that, plus two rAFs for
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
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  /* ── Reveal: Default → Video ──────────────────────────────────────── */
  const handleRevealClick = useCallback(() => {
    if (!isReadyRef.current || isTransitioningRef.current || isRevealedRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    tlRef.current?.kill();

    setIsRevealed(true);
    isRevealedRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        viewRef.current = "VIEW_VIDEO";
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      },
    });

    tl.to(el, {
      duration: 2.0,
      scrollTo: { y: 0 },
      ease: "power4.inOut",
    });

    tlRef.current = tl;
  }, []);

  /* ── Close: Video → Default, unmount only after ──────────────────── */
  const handleClose = useCallback(() => {
    if (!isReadyRef.current || isTransitioningRef.current || !isRevealedRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    tlRef.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        viewRef.current = "VIEW_DEFAULT";
        setIsRevealed(false);
        isRevealedRef.current = false;
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      },
    });

    tl.to(el, {
      duration: 2,
      scrollTo: { y: window.innerHeight },
      ease: "power4.inOut",
    });

    tlRef.current = tl;
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden overscroll-none"
      // scrollSnapType removed — vertical position is now exclusively
      // programmatic (View type above), driven only by button clicks.
      style={{ overflowY: "hidden", overflowX: "hidden" }}
    >
      {/* TOP SECTION - Video (Revealed on click). Always mounted so the
          container's scrollable height is constant; visibility toggles
          via opacity only, never display, so nothing shifts on mount. */}
      <section
        className={`relative h-screen w-full flex-shrink-0 overflow-hidden bg-black transition-opacity duration-300 ${
          isRevealed ? "opacity-100 pointer-events-auto cursor-close" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
        aria-hidden={!isRevealed}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAreVid1.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
          <h2 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase mb-4">
            Our Vision
          </h2>
          <p className="text-white/70 text-sm md:text-base max-w-md mx-auto px-4 text-center">
            Watch our story come to life through motion
          </p>
        </div>

        <div
          className={`absolute bottom-8 left-0 right-0 z-20 text-center transition-all duration-500 pointer-events-none ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-white/50 text-xs uppercase tracking-[0.2em]">
            Click anywhere to close
          </p>
        </div>
      </section>

      {/* BOTTOM SECTION - Original Grid (Always visible) */}
      <section className="relative h-screen w-full flex-shrink-0 overflow-hidden bg-white">
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-0">
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src="https://cdn.cizzara.com/Cizzara-Latest/photo1.jpg"
              alt="Man sitting in grass"
              fill
              className="object-cover object-top"
              priority
            />
          </div>

          <div
            className="relative w-full h-full overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {!showVideo ? (
              <Image
                src="https://cdn.cizzara.com/Cizzara-Latest/video1.jpg"
                alt="Tea table with book and cup"
                fill
                priority
                className="object-cover object-top transition-opacity duration-500"
              />
            ) : (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source
                  src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAreVid1.mp4"
                  type="video/mp4"
                />
              </video>
            )}
          </div>

          <div className="relative w-full h-full overflow-hidden bg-[#e8e5e0]">
            <Image
              src="https://cdn.cizzara.com/Cizzara-Latest/video2.jpg"
              alt="Coat rack"
              fill
              className="object-cover object-top"
            />
          </div>

          <div className="w-full h-full flex bg-[#f8f7f3]">
            <div className="w-1/2 flex flex-col">
              <div className="h-1/2 relative group overflow-hidden bg-[#f8f7f3]">
                <div className="absolute inset-0 z-10 overflow-hidden">
                  <div className="absolute top-0 -left-[120%] h-full w-[120%] skew-x-[-25deg] bg-black transition-all duration-1000 ease-out group-hover:left-[-10%]" />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12 transition-opacity duration-500 group-hover:opacity-0 z-20">
                  <p className="text-[11px] uppercase tracking-[0.45em] leading-[2] text-[#666666] font-light">
                    TO CAPTURE THE BEAUTY
                    <br />
                    OF A POETIC FEELING,
                    <br />
                    TO CREATE A MEMORABLE MESSAGE,
                    <br />
                    WE WORK WITH CAMILLE MAROTTE
                  </p>

                  <div className="w-10 h-px bg-[#cfcfcf] my-8" />

                  <h2 className="text-[34px] tracking-[0.35em] uppercase font-light text-[#1f1f1f]">
                    RALPH LAUREN
                  </h2>
                </div>

                <button
                  onClick={handleRevealClick}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center text-white opacity-0 transition-all duration-700 delay-300 group-hover:opacity-100 cursor-pointer w-full h-full"
                >
                  <h3
                    className="text-5xl italic font-semibold mb-4 translate-y-6 transition-all duration-700 group-hover:translate-y-0"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Launch
                  </h3>

                  <p
                    className="text-xl italic translate-y-6 transition-all duration-700 delay-100 group-hover:translate-y-0"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Ralph Lauren, forget me not
                  </p>

                  <div className="mt-6 translate-y-6 transition-all duration-700 delay-200 group-hover:translate-y-0">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-80 hover:opacity-100"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="10 8 16 12 10 16 10 8" />
                    </svg>
                  </div>
                </button>
              </div>

              <div className="h-1/2 relative">
                <Image
                  src="https://cdn.cizzara.com/Cizzara-Latest/photo2.jpg"
                  alt="Editorial Detail"
                  fill
                  sizes="50vw"
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>

            <div className="w-1/2 h-full relative">
              <Image
                src="https://cdn.cizzara.com/Cizzara-Latest/photo3.jpg"
                alt="Coat Stand"
                fill
                sizes="50vw"
                className="object-cover object-top"
                priority
              />
            </div>
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
};

export default ShowCase;