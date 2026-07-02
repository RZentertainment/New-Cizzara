"use client";

import React, { RefObject, useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import ServicePage from "./ServicePage";

interface ServiceDetailPageProps {
  isVisible?: boolean;
  videoRef?: RefObject<HTMLVideoElement | null>;
  service?: any;
  onClose: () => void;
}

const ServiceDetailPage = ({
  isVisible = true,
  videoRef,
  service,
  onClose,
}: ServiceDetailPageProps) => {
  const detailRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  // Portals need a browser document — guard against SSR / first paint.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // ── SERVICE MODE: cinematic slide-down overlay ──────────────────────────
  // Visibility is driven by plain CSS transition classes tied to React
  // state (`entered`), NOT by a GSAP tween. This was previously animated
  // via gsap.fromTo(yPercent -100 -> 0), but that left the panel stuck
  // invisible in some cases with no thrown error (likely a Strict-Mode
  // double-effect race killing/restarting the tween mid-flight). CSS
  // transitions triggered by a boolean class can't get stuck like that —
  // the browser guarantees the transition resolves to its end state.
  //
  // The actual visual design/content lives entirely in <ServicePage />
  // (title char-split, clip-path hero reveal, skewed category chips,
  // gallery grid, etc.) — this component is purely the fixed/portal shell
  // + open/close slide mechanics. `playKey` is bumped once the shell has
  // finished sliding into place, which kicks off ServicePage's own GSAP
  // content choreography at the right moment.
  const [entered, setEntered] = useState(false);
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    if (!service) {
      setEntered(false);
      return;
    }
    closingRef.current = false;
    setEntered(false);
    // Flip to entered on the next frame so the initial "off-screen" class
    // actually paints first, guaranteeing the transition runs.
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [service]);

  // Bump playKey once the shell has actually entered, so ServicePage's
  // content animation starts as the panel arrives rather than underneath it.
  useEffect(() => {
    if (entered) {
      setPlayKey((k) => k + 1);
    }
  }, [entered]);

  const handleClose = useCallback(() => {
    if (!service) {
      // Video mode: parent (Service.tsx) already owns the close animation
      // via scrollTo — just forward the click.
      onClose();
      return;
    }

    if (closingRef.current) return;
    closingRef.current = true;

    setEntered(false); // triggers the reverse CSS transition

    // Match the CSS transition duration below (700ms) with a small buffer.
    window.setTimeout(() => {
      onClose();
    }, 750);
  }, [service, onClose]);

  // ── VIDEO MODE fade-in: must live above any conditional return so hook
  // order stays stable between service-mode and video-mode renders. ──────
  useEffect(() => {
    if (service) return; // service mode handles its own animation above
    if (isVisible && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [isVisible, service]);

  // ── SERVICE DETAIL (slide-down fullscreen panel) ────────────────────────
  if (service) {
    if (!mounted) return null;

    const panel = (
      <section
        ref={detailRef as RefObject<HTMLElement>}
        className={`fixed inset-0 z-[999] h-screen w-full overflow-hidden bg-black transition-transform duration-700 ease-out ${
          entered ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          backfaceVisibility: "hidden",
          willChange: "transform",
        }}
      >
        <ServicePage service={service} onClose={handleClose} playKey={playKey} />
      </section>
    );

    // Portal straight to <body> so this panel is never affected by any
    // transform/overflow set on ancestors elsewhere in the horizontal
    // scroll page (which would otherwise silently break position:fixed).
    return createPortal(panel, document.body);
  }

  // ── VIDEO MODE: unchanged, still driven by isVisible + Service.tsx's
  // scrollTo timeline. Left as-is so the bell interaction keeps working. ──
  if (!mounted) return null;

  const videoPanel = (
    <section
      className={`fixed inset-0 z-50 h-screen w-full flex-shrink-0 overflow-hidden bg-black transition-opacity duration-300 ${
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{ scrollSnapAlign: "start" }}
      aria-hidden={!isVisible}
    >
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div className="relative z-10 flex h-full items-center justify-center pointer-events-none">
        <h2 className="text-5xl font-light uppercase tracking-[0.3em] text-white md:text-7xl">
          Studio
        </h2>
      </div>

      <button
        className="absolute top-6 right-6 z-20 text-white/60 hover:text-white transition-colors"
        onClick={handleClose}
        aria-label="Close video"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </section>
  );

  return createPortal(videoPanel, document.body);
};

export default ServiceDetailPage;