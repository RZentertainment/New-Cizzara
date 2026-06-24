"use client";

import { useState, useRef, useEffect } from "react";

export default function Focuse() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [ripple, setRipple] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCenterClick = () => {
    setRipple(true);
    setTimeout(() => {
      setRipple(false);
      setIsVideoOpen(true);
    }, 400);
  };

  const handleCloseVideo = () => {
    setIsVideoOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Lock body scroll when modal open
  useEffect(() => {
    if (isVideoOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isVideoOpen]);

  return (
    <>
      {/* ── SECTION ── */}
      <section
        className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
        style={{
          backgroundImage: "url('https://cdn.cizzara.com/Cizzara-Latest/photo1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* ── HEADLINE ── */}
        <h1
          className="relative z-10 text-white text-center font-light tracking-[0.35em] uppercase text-sm md:text-base lg:text-lg mb-16 md:mb-24 px-4"
          style={{ fontFamily: "'Courier New', monospace", letterSpacing: "0.35em" }}
        >
          Capturing The Richness Of A Major Event
        </h1>

        {/* ── CIRCLE CLUSTER ── */}
        <div className="relative z-10 flex items-center justify-center w-full">

          {/* Vertical side label — ESC-STOCKHOLM */}
          <div
            className="absolute left-[calc(50%-260px)] md:left-[calc(50%-300px)] top-1/2 -translate-y-1/2"
            style={{ transform: "translateY(-50%) translateX(-120px)" }}
          >
            <span
              className="text-white/50 text-[10px] tracking-[0.3em] uppercase"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
                fontFamily: "'Courier New', monospace",
              }}
            >
              ESC-Stockholm
            </span>
          </div>

          {/* Circle container */}
          <div
            className="relative flex items-center justify-center cursor-pointer select-none"
            style={{ width: 320, height: 320 }}
            onClick={handleCenterClick}
          >
            {/* ── Outermost thin dashed circle ── */}
            <svg
              className="absolute inset-0"
              width="320"
              height="320"
              viewBox="0 0 320 320"
            >
              <circle
                cx="160"
                cy="160"
                r="152"
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
                strokeDasharray="6 6"
              />
            </svg>

            {/* ── Outer solid white arc ring ── */}
            <svg
              className="absolute"
              style={{ width: 260, height: 260, top: 30, left: 30 }}
              viewBox="0 0 260 260"
            >
              {/* Full solid ring — thick white */}
              <circle
                cx="130"
                cy="130"
                r="120"
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="14"
                strokeLinecap="round"
                /* show only top ~270° arc, gap at bottom-left */
                strokeDasharray="650 100"
                strokeDashoffset="25"
              />
            </svg>

            {/* ── Inner dashed circle ── */}
            <svg
              className="absolute"
              style={{ width: 200, height: 200, top: 60, left: 60 }}
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r="93"
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1"
                strokeDasharray="5 5"
              />
            </svg>

            {/* ── Center red circle ── */}
            <div
              className="absolute rounded-full flex flex-col items-center justify-center"
              style={{
                width: 148,
                height: 148,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle at 40% 35%, #e05c5c 0%, #c0392b 60%, #96251b 100%)",
                boxShadow: "0 0 40px rgba(192,57,43,0.5), inset 0 0 20px rgba(0,0,0,0.3)",
              }}
            >
              {/* inner dashed ring on red */}
              <svg className="absolute inset-0 w-full h-full">
                <circle
                  cx="74"
                  cy="74"
                  r="68"
                  fill="none"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              </svg>

              <span
                className="text-white font-bold tracking-[0.2em] uppercase text-sm relative z-10"
                style={{ fontFamily: "'Courier New', monospace" }}
              >
                Cizzara
              </span>
              <span
                className="text-white/70 tracking-[0.12em] uppercase text-[8px] mt-1 text-center leading-tight relative z-10 px-2"
                style={{ fontFamily: "'Courier New', monospace" }}
              >
                Who We Are
              </span>

              {/* ripple on click */}
              {ripple && (
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ background: "rgba(255,255,255,0.3)" }}
                />
              )}
            </div>

            {/* Hover glow ring */}
            <div
              className="absolute rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                width: 170,
                height: 170,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 30px 8px rgba(192,57,43,0.4)",
              }}
            />
          </div>

          {/* Horizontal line extending right from circle */}
          <div className="flex items-center ml-2">
            <div className="w-px h-px" />
            <div
              className="h-px bg-white/40"
              style={{ width: "80px" }}
            />
            {/* small tick */}
            <div className="w-1 h-3 bg-white/40" />
          </div>
        </div>

        {/* ── DESCRIPTION TEXT ── */}
        <p
          className="relative z-10 text-white/55 text-center text-[10px] tracking-[0.2em] uppercase mt-16 md:mt-20 max-w-xs"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          The well-known French pharmaceutical company Sanofi
          <br />
          shows their latest innovations.
        </p>

        {/* ── BOTTOM MENU HINT ── */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 text-white/30 text-[9px] tracking-[0.5em] uppercase"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          Menu
        </div>
      </section>

      {/* ── VIDEO MODAL (slides down from top) ── */}
      <div
        className={`fixed inset-0 z-50 flex flex-col transition-all duration-500 ease-in-out ${
          isVideoOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.92)" }}
      >
        {/* Close button */}
        <div className="flex justify-end p-5">
          <button
            onClick={handleCloseVideo}
            aria-label="Close video"
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video */}
        <div className="flex-1 flex items-center justify-center px-4 pb-8">
          <video
            ref={videoRef}
            src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAre.mp4"
            className="w-full max-w-5xl rounded-lg shadow-2xl"
            style={{ maxHeight: "80vh" }}
            controls
            autoPlay={isVideoOpen}
          />
        </div>
      </div>
    </>
  );
}