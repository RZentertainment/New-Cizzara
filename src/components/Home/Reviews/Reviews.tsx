"use client";

import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import ReviewsList from "./ReviewsList";
import ReviewsDefault from "./Reviewsdefault";

gsap.registerPlugin(ScrollToPlugin);

type View = "VIEW_DEFAULT" | "VIEW_REVIEWS";

const reviewsData = [
  {
    _id: "6a06fb35c74f851db813e760",
    reviewText: "Really happy with the services and team of Cizzara. Will surely recommend to anyone looking for audio, video and branding solutions.",
    reviewerName: "Kishorji Dantani",
    reviewerImgUrl: "https://cdn.cizzara.com/reviews/d7b47561-173c-4f2d-a55e-81970ec3ad05.webp"
  },
  {
    _id: "6a06fc6fc74f851db813e764",
    reviewText: "Visited the studio I am pleased to see that this studio has established so many state of art facilities.. Amazed with Professional attitude, Quality Work, and unique techniques.......",
    reviewerName: "Krunali Trivedi",
    reviewerImgUrl: "https://cdn.cizzara.com/reviews/67a01eb9-056b-49bd-97b5-3277271fdf06.webp"
  },
  {
    _id: "6a06fcaac74f851db813e766",
    reviewText: "I've recorded my first Audio Podcast with Cizzara Film Studio and I must say it was an Amazing experience, not just of recording it but also of being with very talented people and learning a lot of things!! Their working pattern, communication pattern, their devotion to work is so disciplined and really appreciable!! Also the way they encourage artists and learners to grow is wonderful!! It was a Great time there!!😇",
    reviewerName: "Nitya Vakil",
    reviewerImgUrl: "https://cdn.cizzara.com/reviews/c9eb8505-1feb-4502-a93c-e288f17a6d9e.webp"
  },
  {
    _id: "6a06fcd1c74f851db813e768",
    reviewText: "I recently had the pleasure of working with Cizzara Film Studio for our marketing campaign, and the experience exceeded all expectations. From the initial consultation to the execution of the campaign, the team at Cizzara Film Studio demonstrated exceptional professionalism and creativity.",
    reviewerName: "Jatin Jethva",
    reviewerImgUrl: "https://cdn.cizzara.com/reviews/8ec595aa-9284-4e77-8d90-9e5422df070b.webp"
  },
  {
    _id: "6a06fd18c74f851db813e76a",
    reviewText: "One of the best studio of Vadodara city. The best ambience, the best team and most importantly, the best studio with all latest functionality. I just loved making myself recording for VO infront of mic at Cizzara Film Studio. Highly recommended :)",
    reviewerName: "Aayushi Vyas",
    reviewerImgUrl: "https://cdn.cizzara.com/reviews/28bdc2f4-bf9c-43fe-9014-5182d4fb0f12.webp"
  },
  {
    _id: "6a06fd73c74f851db813e76e",
    reviewText: "Will recommend this studio to all Business owners who r in need of Promotional content for sales and marketing, very happy with their service and hospitality. They are very creative and gives right suggestions as well. Keep it up. Special thanks to Amit bhai.",
    reviewerName: "oswald Massey",
    reviewerImgUrl: "https://cdn.cizzara.com/reviews/7bf3e10e-1439-4e08-9766-05415c384759.webp"
  }
];

const Reviews = ({ active }: { active: boolean }) => {
  const [isReviewsVisible, setIsReviewsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef    = useRef<HTMLDivElement>(null);

  const isTransitioningRef  = useRef(false);
  const isReadyRef          = useRef(false);
  const isReviewsVisibleRef = useRef(false);
  const tlRef               = useRef<gsap.core.Timeline | null>(null);
  const viewRef             = useRef<View>("VIEW_DEFAULT");

  useEffect(() => { isTransitioningRef.current  = isTransitioning;  }, [isTransitioning]);
  useEffect(() => { isReadyRef.current          = isReady;          }, [isReady]);
  useEffect(() => { isReviewsVisibleRef.current = isReviewsVisible; }, [isReviewsVisible]);

  const targetYFor = (view: View) => (view === "VIEW_DEFAULT" ? window.innerHeight : 0);

  // ─── CHANGE 1: useLayoutEffect for instant scroll-to-default on activation ──
  //
  // ROOT CAUSE of the 1-second flash:
  //
  // When the user navigates TO page 6 (Reviews), `active` flips true.
  // React re-renders, the `active ? full JSX : placeholder` branch switches,
  // and the real container div (with ReviewsList at y=0 and ReviewsDefault
  // at y=windowHeight) is inserted into the DOM.
  //
  // The OLD code used useEffect to then scrollTo(windowHeight). But useEffect
  // fires AFTER the browser has already painted the newly-inserted DOM —
  // meaning for ~1 frame (sometimes longer due to the RAF retry loop) the
  // browser shows scroll position y=0, which is exactly where ReviewsList
  // lives. That's the flash.
  //
  // The fix: use useLayoutEffect to set scrollTop = windowHeight
  // SYNCHRONOUSLY before the browser paints. This way the very first
  // rendered frame already shows ReviewsDefault, never ReviewsList.
  //
  // We still need the RAF retry for the scrollHeight check (the children
  // need to be laid out before scrollHeight is accurate), but we can do
  // an optimistic instant snap first, then confirm it once layout settles.
  useLayoutEffect(() => {
    if (!active || !containerRef.current) return;

    const el = containerRef.current;

    // ── Optimistic instant snap ──────────────────────────────────────────
    // At this point layout may not be complete yet (scrollHeight might
    // still be 0), but we can still write scrollTop. The browser will
    // clamp it to the valid range — if scrollHeight is already correct
    // this snaps perfectly; if not, the RAF retry below corrects it.
    // Either way, the FIRST PAINTED FRAME never shows y=0.
    el.scrollTop = window.innerHeight;

  }, [active]); // re-runs every time active toggles


  // ─── CHANGE 2: Keep the RAF retry for reliable scrollHeight confirmation ──
  //
  // The useLayoutEffect above handles the first-paint problem. This effect
  // handles the edge case where the children haven't finished laying out
  // yet (scrollHeight < windowHeight * 2). Once layout is confirmed, we
  // do a final authoritative snap and mark isReady.
  //
  // We removed the "scroll to 0 first then to windowHeight" pattern that
  // existed in the original — that two-step was itself causing a visible
  // intermediate position.
  useEffect(() => {
    if (!active || !containerRef.current) {
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
          // Authoritative snap — scrollHeight is now confirmed correct.
          // This is instant (behavior: "instant"), so no visible movement.
          containerRef.current.scrollTop = window.innerHeight;
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

  /* ── Lock out every native scroll vector (unchanged) ────────────── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !active) return;

    const blockWheel     = (e: WheelEvent)    => { e.preventDefault(); };
    const blockTouchMove = (e: TouchEvent)    => { e.preventDefault(); };
    const SCROLL_KEYS = new Set(["ArrowUp","ArrowDown"," ","Spacebar","PageUp","PageDown","Home","End"]);
    const blockKeys      = (e: KeyboardEvent) => { if (SCROLL_KEYS.has(e.key)) e.preventDefault(); };

    el.addEventListener("wheel",     blockWheel,     { passive: false });
    el.addEventListener("touchmove", blockTouchMove, { passive: false });
    document.addEventListener("keydown", blockKeys,  { passive: false });

    return () => {
      el.removeEventListener("wheel",     blockWheel);
      el.removeEventListener("touchmove", blockTouchMove);
      document.removeEventListener("keydown", blockKeys);
    };
  }, [active]);

  /* ── Drift correction (unchanged) ───────────────────────────────── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !active || !isReady) return;

    const correctDrift = () => {
      if (isTransitioningRef.current || !containerRef.current) return;
      const expected = targetYFor(viewRef.current);
      if (Math.abs(containerRef.current.scrollTop - expected) > 1) {
        containerRef.current.scrollTop = expected;
      }
    };

    window.addEventListener("resize", correctDrift);
    el.addEventListener("scroll", correctDrift, { passive: true });

    return () => {
      window.removeEventListener("resize", correctDrift);
      el.removeEventListener("scroll", correctDrift);
    };
  }, [active, isReady]);

  /* ── Reset when inactive (unchanged) ────────────────────────────── */
  useEffect(() => {
    if (!active) {
      tlRef.current?.kill();
      tlRef.current = null;

      setIsReviewsVisible(false);
      isReviewsVisibleRef.current = false;

      setIsTransitioning(false);
      isTransitioningRef.current = false;

      setIsReady(false);
      isReadyRef.current = false;

      viewRef.current = "VIEW_DEFAULT";

      // ── CHANGE 3: Reset scroll to 0 only when going INACTIVE ─────────
      //
      // The original reset also set scroll to 0 here. That's correct —
      // when the page is inactive the container is hidden anyway, so
      // resetting to 0 is fine and prepares it for the next activation
      // where useLayoutEffect will immediately snap it to windowHeight.
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
  }, [active]);

  useEffect(() => { return () => { tlRef.current?.kill(); }; }, []);

  /* ── Reviews click (unchanged) ──────────────────────────────────── */
  const handleReviewsClick = useCallback(() => {
    if (!isReadyRef.current || isTransitioningRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);
    tlRef.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        viewRef.current = "VIEW_REVIEWS";
        isReviewsVisibleRef.current = true;
        setIsReviewsVisible(true);
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      },
    });

    tl.to(el, { duration: 1.9, scrollTo: { y: 0 }, ease: "power4.inOut" });
    tlRef.current = tl;
  }, []);

  /* ── Close reviews (unchanged) ──────────────────────────────────── */
  const handleCloseReviews = useCallback(() => {
    if (!isReadyRef.current || isTransitioningRef.current || !isReviewsVisibleRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);
    tlRef.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        viewRef.current = "VIEW_DEFAULT";
        setIsReviewsVisible(false);
        isReviewsVisibleRef.current = false;
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      },
    });

    tl.to(el, { duration: 1.9, scrollTo: { y: window.innerHeight }, ease: "power4.inOut" });
    tlRef.current = tl;
  }, []);

  /* ── Inactive placeholder (unchanged) ───────────────────────────── */
  if (!active) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white/30 text-xs tracking-widest uppercase">Reviews</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden overscroll-none"
      style={{ overflowY: "hidden", overflowX: "hidden" }}
    >
      <ReviewsList
        isVisible={isReviewsVisible}
        onClose={handleCloseReviews}
        reviews={reviewsData}
      />

      <ReviewsDefault
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
};

export default Reviews;