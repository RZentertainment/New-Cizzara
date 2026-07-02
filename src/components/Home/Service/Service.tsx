"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import ServiceDetailPage from "./ServiceDetailPage";
import ServiceDefault from "./ServiceDefault";

const DETAIL_OPEN_SAFETY_MS = 2500; // if the overlay hasn't visibly resolved by then, treat state as stuck

const Service = ({ active }: { active: boolean }) => {
  // Bell → video flow keeps its own scroll-based view state.
  const [viewState, setViewState] = useState<"default" | "video">("default");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Card click → detail overlay flow is fully decoupled from the scroll
  // container. The overlay mounts/unmounts on top of everything and
  // animates itself (see ServiceDetailPage).
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Tracks when the overlay was last opened, so we can detect and recover
  // from a "stuck open" state (e.g. the mount animation silently failed
  // and the panel never became visible, but showDetail is still true).
  const detailOpenedAtRef = useRef<number | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize component.
  // NOTE: containerRef now wraps a single static h-screen panel
  // (ServiceDefault) — video/detail render as fixed siblings, not inside
  // this container. There's no multi-panel height to wait for, so we just
  // flip ready on the next frame once this section is active.
  useEffect(() => {
    if (!active) {
      setIsReady(false);
      return;
    }

    const id = requestAnimationFrame(() => {
      setIsReady(true);
      console.log("[Service] ready");
    });
    return () => cancelAnimationFrame(id);
  }, [active]);

  // Block scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !active) return;

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
  }, [active]);

  // Cleanup on deactivation
  useEffect(() => {
    if (!active) {
      tlRef.current?.kill();
      tlRef.current = null;
      videoRef.current?.pause();
      setViewState("default");
      setIsTransitioning(false);
      setIsReady(false);
      setShowDetail(false);
      setSelectedService(null);
      detailOpenedAtRef.current = null;
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
    }
  }, [active]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      tlRef.current?.kill();
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
    };
  }, []);

  const handleBellClick = useCallback(() => {
    if (!isReady || isTransitioning || showDetail) return;
    if (!bellRef.current || !ropeRef.current) return;

    setIsTransitioning(true);

    tlRef.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        setViewState("video");
        videoRef.current?.play().catch(() => {});
        setIsTransitioning(false);
      },
    });

    tl.to(ropeRef.current, { height: 30, duration: 0.15, ease: "power1.in" })
      .to(ropeRef.current, { height: 0, duration: 0.15, ease: "power1.out" }, "+=0.05")
      .to(bellRef.current, { y: 15, duration: 0.15, ease: "power1.in" }, "-=0.15")
      .to(bellRef.current, { y: 0, duration: 0.15, ease: "power1.out" }, "+=0.05");

    tlRef.current = tl;
  }, [isReady, isTransitioning, showDetail]);

  const handleCloseVideo = useCallback(() => {
    if (!isReady || isTransitioning || viewState !== "video") return;
    const el = containerRef.current;
    if (!el) return;

    setIsTransitioning(true);

    tlRef.current?.kill();

    videoRef.current?.pause();

    const tl = gsap.timeline({
      onComplete: () => {
        setViewState("default");
        setIsTransitioning(false);
      },
    });

    tl.to(el, {
      duration: 1.9,
      scrollTo: { y: window.innerHeight },
      ease: "power4.inOut",
    });

    tlRef.current = tl;
  }, [isReady, isTransitioning, viewState]);

  // ── Card click → open cinematic overlay ──────────────────────────────
  // No scrollTo, no container interaction — ServiceDetailPage mounts
  // fixed/z-999 above everything and slides itself into view.
  const handleServiceClick = useCallback(
    (service: any) => {
      const now = Date.now();
      const stuck =
        showDetail &&
        detailOpenedAtRef.current !== null &&
        now - detailOpenedAtRef.current > DETAIL_OPEN_SAFETY_MS;

      console.log("[Service] handleServiceClick called", {
        service: service?.title,
        isReady,
        isTransitioning,
        showDetail,
        stuck,
      });

      if (!isReady || isTransitioning) {
        console.log("[Service] handleServiceClick BLOCKED by guard (not ready / transitioning)");
        return;
      }

      if (showDetail && !stuck) {
        console.log("[Service] handleServiceClick BLOCKED by guard (already open)");
        return;
      }

      if (stuck) {
        console.warn(
          "[Service] Detected stuck showDetail state — forcing reset before reopening"
        );
      }

      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }

      setSelectedService(service);
      setShowDetail(true);
      detailOpenedAtRef.current = now;

      // Safety valve: if nothing clears showDetail within the window
      // (e.g. the overlay's mount animation threw, or it rendered but the
      // close button never fired due to some other issue), auto-recover
      // so the UI doesn't lock up permanently.
      safetyTimeoutRef.current = setTimeout(() => {
        console.warn(
          "[Service] showDetail safety timeout fired — this likely means ServiceDetailPage failed to mount/animate correctly. Check for console errors."
        );
      }, DETAIL_OPEN_SAFETY_MS);
    },
    [isReady, isTransitioning, showDetail]
  );

  // ── Close overlay ─────────────────────────────────────────────────────
  // Called by ServiceDetailPage's onComplete, AFTER its slide-up finishes.
  // We only clear state here — no animation logic lives in the parent.
  const handleCloseServiceDetail = useCallback(() => {
    setShowDetail(false);
    setSelectedService(null);
    detailOpenedAtRef.current = null;
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  }, []);

  if (!active) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white/30 text-xs tracking-widest uppercase">Service</div>
      </div>
    );
  }

  return (
    <>
      {/* Main container with ServiceDefault */}
      <div
        ref={containerRef}
        className="w-full h-screen overflow-hidden overscroll-none"
        style={{ overflowY: "hidden", overflowX: "hidden" }}
      >
        <ServiceDefault
          bellRef={bellRef}
          ropeRef={ropeRef}
          onBellClick={handleBellClick}
          onServiceClick={handleServiceClick}
        />
      </div>

      {viewState === "video" && (
        <ServiceDetailPage isVisible={true} videoRef={videoRef} onClose={handleCloseVideo} />
      )}

      {showDetail && selectedService && (
        <ServiceDetailPage service={selectedService} onClose={handleCloseServiceDetail} />
      )}

      <style jsx global>{`
        .cursor-close {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cg transform='translate(28,28)'%3E%3Cline x1='-12' y1='-12' x2='12' y2='12' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='12' y1='-12' x2='-12' y2='12' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E") 28 28, pointer !important;
        }
      `}</style>
    </>
  );
};

export default Service;