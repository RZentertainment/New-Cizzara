"use client";

import React, { RefObject, useEffect, useLayoutEffect, useRef } from "react";
import { DottedSurface } from "@/components/ui/dotted-surface";
import GoogleLogo from "./GoogleLogo";
import gsap from "gsap";

interface Review {
  _id: string;
  reviewText: string;
  reviewerName: string;
  reviewerImgUrl: string;
}

interface ReviewsDefaultProps {
  buttonRef: RefObject<HTMLDivElement | null>;
  onReviewsClick: () => void;
  reviews?: Review[];
}

const ReviewsDefault = ({ 
  buttonRef, 
  onReviewsClick,
  reviews = []
}: ReviewsDefaultProps) => {
  
  const containerRef     = useRef<HTMLDivElement>(null);
  const subHeadingRef    = useRef<HTMLParagraphElement>(null);
  const mainHeadingRef   = useRef<HTMLHeadingElement>(null);
  const googleLogoRef    = useRef<HTMLDivElement>(null);
  const ratingRef        = useRef<HTMLDivElement>(null);
  const exploreButtonRef = useRef<HTMLDivElement>(null);

  // ─── CHANGE 1: useLayoutEffect + gsap.set() ───────────────────────────────
  //
  // WHY useLayoutEffect instead of useEffect:
  //   useEffect fires AFTER the browser has already painted the first frame.
  //   That one-frame gap is exactly what causes the FOUC — the user sees the
  //   element at full opacity for one frame before GSAP hides it.
  //
  //   useLayoutEffect fires SYNCHRONOUSLY after the DOM is mutated but
  //   BEFORE the browser paints. So gsap.set() runs before the first pixel
  //   is drawn — the element is invisible from frame zero.
  //
  // WHY gsap.set() instead of inline CSS:
  //   gsap.set() writes the same inline style that GSAP's fromTo will later
  //   overwrite, guaranteeing the start state is 100% consistent with what
  //   the animation expects. No risk of specificity conflicts with Tailwind.
  //
  // STRICT MODE NOTE:
  //   React Strict Mode calls useLayoutEffect twice in dev (mount → unmount
  //   → remount). We store the GSAP context in a ref so the cleanup function
  //   always kills the correct instance, preventing double-animation ghosts.
  //
  // NEXT.JS / SSR NOTE:
  //   useLayoutEffect is safe here because this file is "use client" and
  //   these refs are null during SSR, so gsap.set() is never called server-
  //   side. No hydration mismatch is possible.

  const gsapCtxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    // Collect all the elements we need to pre-hide.
    const els = [
      subHeadingRef.current,
      mainHeadingRef.current,
      googleLogoRef.current,
      ratingRef.current,
      exploreButtonRef.current,
    ];

    // Guard: if any ref isn't ready yet, bail — the effect will re-run
    // when refs populate (they always do on the initial mount in practice).
    if (els.some((el) => !el)) return;

    // ── CHANGE 2: gsap.set() — write the hidden "from" state immediately ──
    //
    // These values must exactly match the `fromTo` starting values below
    // so GSAP picks up from the same position it set. If they diverge,
    // you'd see a jump at animation start.
    gsap.set(subHeadingRef.current,  { opacity: 0, y: 30 });
    gsap.set(mainHeadingRef.current, { opacity: 0, y: 40 });
    gsap.set(googleLogoRef.current,  { opacity: 0, scale: 0.8 });
    gsap.set(ratingRef.current,      { opacity: 0, y: 20 });
    gsap.set(exploreButtonRef.current, { opacity: 0, y: 20 });

    // ── CHANGE 3: Wrap in gsap.context() ─────────────────────────────────
    //
    // gsap.context() scopes all tweens to this component instance.
    // ctx.revert() in the cleanup kills every tween in the scope,
    // including the gsap.set() calls above, restoring original inline
    // styles. This is the correct Strict Mode / hot-reload pattern.
    gsapCtxRef.current = gsap.context(() => {

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // ── CHANGE 4: fromTo → to ──────────────────────────────────────────
      //
      // Because gsap.set() above already wrote the "from" values, we only
      // need `to()` calls. Using `fromTo()` here still works but would
      // redundantly overwrite the inline style GSAP already set.
      // Switching to `to()` is cleaner and removes any risk of a one-frame
      // flicker caused by fromTo re-applying the start state mid-animation.

      tl.to(subHeadingRef.current,
        { opacity: 1, y: 0, duration: 0.8 }
      );

      tl.to(mainHeadingRef.current,
        { opacity: 1, y: 0, duration: 1 },
        "-=0.4"
      );

      tl.to(googleLogoRef.current,
        { opacity: 1, scale: 1, duration: 0.8 },
        "-=0.3"
      );

      tl.to(ratingRef.current,
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.4"
      );

      // Explore button was not previously animated — adding it to the
      // sequence so it also fades in rather than popping in unanimated.
      tl.to(exploreButtonRef.current,
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );

    }, containerRef); // ← scope to containerRef

    return () => {
      // ── CHANGE 5: ctx.revert() instead of ctx.revert() via closure ────
      //
      // Storing the context in a ref (not a local variable captured by
      // closure) means the cleanup always kills the most recent context,
      // even after Strict Mode's double-invoke.
      gsapCtxRef.current?.revert();
      gsapCtxRef.current = null;
    };
  }, []); // empty deps — run once on mount, clean up on unmount

  return (
    <section
      className="relative h-screen w-full flex-shrink-0 overflow-hidden"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Dotted Surface Background */}
      <DottedSurface 
        className="absolute inset-0" 
        dotColor="#60a5fa"
        backgroundColor="#000000"
        dotSize={12}
        dotOpacity={0.9}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Container */}
      <div
        ref={containerRef}
        className="relative z-10 flex h-full flex-col items-center justify-start pt-24 px-4"
      >
        {/* Rating + Heading */}
        <div className="flex flex-col items-center text-center">

          {/*
            ── CHANGE 6: Remove Tailwind opacity classes from animated els ──
            
            Before, elements had no explicit opacity in JSX, so they rendered
            at opacity:1 (the browser default) before GSAP ran. Now that
            gsap.set() handles the initial opacity:0, we must NOT also set
            opacity via a Tailwind class — that would fight GSAP's inline
            style and potentially win due to specificity.
            
            Rule: for any element GSAP animates, let GSAP own opacity/transform
            entirely. Don't set those properties in JSX/CSS too.
          */}

          <p
            ref={subHeadingRef}
            className="mt-5 text-xs uppercase tracking-[0.35em] text-white/50"
            // opacity and y-transform are owned by GSAP — set via gsap.set()
          >
            REAL PEOPLE. REAL RESULTS.
          </p>

          <h1
            ref={mainHeadingRef}
            className="mt-6 text-5xl md:text-6xl font-light leading-tight text-white"
          >
            Crafting Digital Experiences
            <br />
            That Clients Love to Talk About.
          </h1>
        </div>

        {/* Google Logo */}
        <div
          ref={googleLogoRef}
          className="mt-8 scale-85"
          // scale and opacity owned by GSAP
        >
          <GoogleLogo />
        </div>

        {/* Rating & "See all" Section */}
        <div
          ref={ratingRef}
          className="flex flex-row items-center gap-6 mt-8 text-white/70"
          // opacity and y owned by GSAP
        >
          {/* Left: Rating */}
          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold">5.0</span>
            <div className="text-yellow-400 text-lg">
              ★★★★★
            </div>
          </div>

          {/* Right: Text + Button */}
          <div className="flex items-center gap-4 border-l border-white/20 pl-6">
            <span className="text-sm">
              Based on 130+ Google Reviews
            </span>
          </div>
        </div>

        {/*
          ── CHANGE 7: Move buttonRef to exploreButtonRef ──────────────────
          
          The original buttonRef was passed in via props (used by the parent
          for scroll positioning). We keep buttonRef on the outer div as
          before, and add our own exploreButtonRef for GSAP animation.
          Both refs point to the same element — that's intentional and safe.
        */}
        <div
          ref={(node) => {
            // Assign both refs to the same DOM node
            (buttonRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            (exploreButtonRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          onClick={onReviewsClick}
          className="group cursor-pointer"
          // opacity and y owned by GSAP
        >
          <div className="flex items-center gap-4 mt-10 rounded-full border bg-[#000] text-white border-white/20 px-6 py-3 transition-all duration-300 hover:border-white hover:bg-white hover:text-black">
            <span className="text-sm uppercase tracking-[0.2em]">
              Explore Reviews
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              ↗
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsDefault;