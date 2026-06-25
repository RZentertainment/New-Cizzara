"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

/**
 * CizzaraLogo — Black Negative cinematic studio ident
 * --------------------------------------------------------------
 * Resized to fit perfectly inside a 320x320px box.
 */

const EASE_LUX = [0.16, 1, 0.3, 1] as const;

interface CizzaraLogoProps {
  /** Called once the ident has fully settled into its idle state */
  onComplete?: () => void;
  /** Skip straight to the settled state (used for prefers-reduced-motion or replays) */
  skipIntro?: boolean;
}

/* ----------------------------------------------------------------
   Dust particles — ambient ABOVE the spotlight, drifting upward
   ---------------------------------------------------------------- */
function DustField({ count = 26 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: 20 + Math.random() * 70,
        size: 1 + Math.random() * 2.2,
        duration: 10 + Math.random() * 14,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 40,
        opacity: 0.12 + Math.random() * 0.22,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="cz-dust"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              "--cz-duration": `${p.duration}s`,
              "--cz-delay": `${p.delay}s`,
              "--cz-drift": `${p.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------
   Phoenix mark — Scaled down to fit the 320px box
   ---------------------------------------------------------------- */
const LOGO_SRC =
  "https://cdn.cizzara.com/Logo/Cizzara_Studios_Final_Logo_txnyii.png";

function PhoenixMark() {
  return (
    <img
      src={LOGO_SRC}
      alt="Cizzara Studios"
      draggable={false}
      className="w-[60%] h-[60%] object-contain select-none"
      style={{
        filter:
          "drop-shadow(0 0 12px rgba(178,52,36,0.55)) drop-shadow(0 0 24px rgba(178,52,36,0.25))",
      }}
    />
  );
}

/* ----------------------------------------------------------------
   Wordmark — Resized to fit smaller container
   ---------------------------------------------------------------- */
function Wordmark({ start }: { start: boolean }) {
  const line1 = "CIZZARA".split("");
  const line2 = "STUDIOS".split("");

  const container: Variants = {
    hidden: {},
    show: {
      transition: { delayChildren: 0.04, staggerChildren: 0.07 },
    },
  };

  const letter: Variants = {
    hidden: { opacity: 0, y: 4, letterSpacing: "0.6em" },
    show: {
      opacity: 1,
      y: 0,
      letterSpacing: "0.42em",
      transition: { duration: 0.7, ease: EASE_LUX },
    },
  };

  const subLetter: Variants = {
    hidden: { opacity: 0, y: 4, letterSpacing: "0.6em" },
    show: {
      opacity: 1,
      y: 0,
      letterSpacing: "0.42em",
      transition: { duration: 0.6, ease: EASE_LUX },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={start ? "show" : "hidden"}
      variants={container}
      className="flex flex-col items-center gap-1 select-none"
      style={{
        fontFamily:
          "'Cormorant Garamond', 'Times New Roman', Georgia, serif",
      }}
    >
      <div className="flex justify-center">
        {line1.map((ch, i) => (
          <motion.span
            key={i}
            variants={letter}
            className="text-[clamp(0.7rem, 2vmin, 1.2rem)] font-medium text-[#f2ede4]"
            style={{ marginRight: "0.42em" }}
          >
            {ch}
          </motion.span>
        ))}
      </div>
      <div className="flex justify-center">
        {line2.map((ch, i) => (
          <motion.span
            key={i}
            variants={subLetter}
            className="text-[clamp(0.7rem, 2vmin, 1.2rem)] font-medium text-[#f2ede4]"
            style={{ marginRight: "0.42em" }}
          >
            {ch}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------
   Main component
   ---------------------------------------------------------------- */
export default function CizzaraLogo({
  onComplete,
  skipIntro = false,
}: CizzaraLogoProps) {
  const prefersReduced = useReducedMotion();
  const reduced = skipIntro || prefersReduced;

  const [phase, setPhase] = useState<"logo" | "type" | "settled">(
    reduced ? "settled" : "logo"
  );

  useEffect(() => {
    if (reduced) {
      onComplete?.();
      return;
    }
    const t1 = setTimeout(() => setPhase("type"), 2600);
    const t2 = setTimeout(() => {
      setPhase("settled");
      onComplete?.();
    }, 4300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    // Locked to exactly 320x320px, centered
    <div className="relative w-[320px] h-[320px] max-w-[320px] max-h-[320px] bg-[#050505] overflow-hidden flex items-center justify-center rounded-2xl">
      
      {/* film grain */}
      <div className="cz-grain absolute inset-0 pointer-events-none" />

      {/* volumetric top spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: reduced ? 0.9 : 1 }}
        transition={{ duration: 1.6, delay: reduced ? 0 : 0.3, ease: EASE_LUX }}
        style={{
          background:
            "radial-gradient(60% 55% at 50% 0%, rgba(255,250,240,0.16) 0%, rgba(255,250,240,0.05) 35%, rgba(0,0,0,0) 70%)",
        }}
      />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: reduced ? 0.5 : 0.65 }}
        transition={{ duration: 1.8, delay: reduced ? 0 : 0.4, ease: EASE_LUX }}
        style={{
          width: "38%",
          height: "100%",
          background:
            "linear-gradient(to bottom, rgba(255,248,235,0.10), rgba(255,248,235,0) 70%)",
          clipPath: "polygon(46% 0%, 54% 0%, 78% 100%, 22% 100%)",
          filter: "blur(6px)",
        }}
      />

      {/* dust */}
      <DustField />

      {/* ember bloom behind logo — breathes once settled */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: "46%",
          height: "46%",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle, rgba(178,52,36,0.42) 0%, rgba(120,20,16,0.18) 45%, rgba(0,0,0,0) 75%)",
          filter: "blur(14px)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          phase === "logo"
            ? { opacity: 0, scale: 0.8 }
            : phase === "type"
            ? { opacity: 0.85, scale: 1 }
            : {
                opacity: [0.65, 0.9, 0.65],
                scale: [1, 1.05, 1],
              }
        }
        transition={
          phase === "settled"
            ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 1.4, delay: reduced ? 0 : 0.9, ease: EASE_LUX }
        }
      />

      {/* lens flare — fires once during the reveal */}
      {!reduced && (
        <motion.div
          className="absolute left-1/2 top-1/2 pointer-events-none"
          initial={{ opacity: 0, scale: 0.4, rotate: -18 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.4, 1.6, 1.9] }}
          transition={{ duration: 1.1, delay: 1.9, ease: "easeOut" }}
          style={{
            width: "70%",
            height: "2px",
            translateX: "-50%",
            translateY: "-50%",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,247,235,0.9) 50%, rgba(255,255,255,0) 100%)",
            filter: "blur(0.6px)",
          }}
        />
      )}
      {!reduced && (
        <motion.div
          className="absolute left-1/2 top-1/2 pointer-events-none rounded-full"
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.2, 1, 1.3] }}
          transition={{ duration: 0.9, delay: 1.95, ease: "easeOut" }}
          style={{
            width: "10%",
            height: "10%",
            translateX: "-50%",
            translateY: "-50%",
            background:
              "radial-gradient(circle, rgba(255,250,240,0.95) 0%, rgba(255,250,240,0) 70%)",
            filter: "blur(2px)",
          }}
        />
      )}

      {/* logo + wordmark stack */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <motion.div
          initial={{
            clipPath: "circle(0% at 50% 55%)",
            opacity: 0,
            scale: 0.88,
            filter: "blur(10px)",
          }}
          animate={{
            clipPath: reduced
              ? "circle(80% at 50% 55%)"
              : "circle(75% at 50% 55%)",
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: reduced ? 0.01 : 1.8,
            delay: reduced ? 0 : 1.0,
            ease: EASE_LUX,
          }}
        >
          <PhoenixMark />
        </motion.div>

        <Wordmark start={reduced || phase !== "logo"} />
      </div>

      <style>{`
        .cz-grain {
          background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"
          )}");
          background-size: 140px 140px;
          opacity: 0.5;
          mix-blend-mode: overlay;
          animation: cz-grain-shift 1s steps(6) infinite;
        }
        @keyframes cz-grain-shift {
          0%   { transform: translate(0,0); }
          20%  { transform: translate(-1%, 1%); }
          40%  { transform: translate(1%, -1%); }
          60%  { transform: translate(-1%, -1%); }
          80%  { transform: translate(1%, 1%); }
          100% { transform: translate(0,0); }
        }
        .cz-dust {
          position: absolute;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(255,250,240,0.9), rgba(255,250,240,0) 70%);
          animation: cz-float var(--cz-duration) ease-in-out var(--cz-delay) infinite;
        }
        @keyframes cz-float {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          15%  { opacity: 1; }
          50%  { transform: translateY(calc(-1 * var(--cz-drift, 20px))) translateX(calc(var(--cz-drift, 20px) * 0.3)); }
          85%  { opacity: 0.7; }
          100% { transform: translateY(calc(-2 * var(--cz-drift, 20px))) translateX(calc(var(--cz-drift, 20px) * 0.6)); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cz-dust, .cz-grain { animation: none !important; }
        }
      `}</style>
    </div>
  );
}