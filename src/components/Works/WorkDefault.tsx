"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FaAngleRight } from "react-icons/fa6";

interface WorkDefaultProps {
  onRevealComplete: () => void;
  isRevealed: boolean;
  resetKey: number;
}

const COMPLETE_THRESHOLD = 90; // % of track before auto-completion kicks in

export default function WorkDefault({
  onRevealComplete,
  isRevealed,
  resetKey,
}: WorkDefaultProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);

  const isDraggingRef = useRef(false);
  const isLockedRef = useRef(false); // locked once auto-complete / reveal fires
  const percentRef = useRef(0);

  const [, forceRender] = useState(0);

  const setVisualPercent = useCallback((percent: number) => {
    percentRef.current = percent;
    if (handleRef.current) {
      handleRef.current.style.left = `${percent}%`;
    }
    if (fillRef.current) {
      fillRef.current.style.width = `${percent}%`;
    }
  }, []);

  // Reset handle to 0% whenever the parent tells us the panel has closed.
  useEffect(() => {
    isLockedRef.current = false;
    gsap.killTweensOf({ p: percentRef.current });
    setVisualPercent(0);
    forceRender((n) => n + 1);
  }, [resetKey, setVisualPercent]);

  const getPercentFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    return Math.min(100, Math.max(0, raw));
  }, []);

  const completeToEnd = useCallback(() => {
    isLockedRef.current = true;
    const proxy = { p: percentRef.current };
    gsap.to(proxy, {
      p: 100,
      duration: 0.3,
      ease: "power2.out",
      onUpdate: () => setVisualPercent(proxy.p),
      onComplete: () => {
        onRevealComplete();
      },
    });
  }, [onRevealComplete, setVisualPercent]);

  const springBack = useCallback(() => {
    const proxy = { p: percentRef.current };
    gsap.to(proxy, {
      p: 0,
      duration: 0.5,
      ease: "power3.out",
      onUpdate: () => setVisualPercent(proxy.p),
    });
  }, [setVisualPercent]);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDraggingRef.current || isLockedRef.current) return;
      const percent = getPercentFromClientX(e.clientX);
      setVisualPercent(percent);
    },
    [getPercentFromClientX, setVisualPercent]
  );

  const onPointerUp = useCallback(() => {
    if (!isDraggingRef.current || isLockedRef.current) return;
    isDraggingRef.current = false;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);

    if (percentRef.current >= COMPLETE_THRESHOLD) {
      completeToEnd();
    } else {
      springBack();
    }
  }, [completeToEnd, onPointerMove, springBack]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isLockedRef.current) return;
      e.preventDefault();
      isDraggingRef.current = true;
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    [onPointerMove, onPointerUp]
  );

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(120%_100%_at_50%_30%,#1a1717_0%,#0c0b0b_65%)]">
      {/* ambient glow behind the mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(38rem_26rem_at_50%_42%,rgba(161,93,78,0.14),transparent_70%)]"
      />

      <div className="relative z-10 flex items-center justify-center">
        <div className="flex h-[clamp(11rem,18vw,15rem)] w-[clamp(11rem,18vw,15rem)] items-center justify-center rounded-full bg-[linear-gradient(160deg,#e2dfda_0%,#cfccc6_100%)] shadow-[0_2rem_4rem_-1.5rem_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.4)]">
          <span className="font-serif text-[clamp(1.9rem,2.6vw,2.6rem)] font-medium tracking-wide text-[#171514]">
            Work
          </span>
        </div>
      </div>

      <div
        aria-hidden={isRevealed}
        className={`absolute bottom-[18%] left-1/2 z-10 w-[min(92vw,34rem)] -translate-x-1/2 transition-opacity duration-300 ${
          isRevealed
            ? "pointer-events-none invisible opacity-0"
            : "visible opacity-100"
        }`}
      >
        <div className="flex items-center gap-18 rounded-full border border-white/10 bg-[#141212] px-3 py-3">
          <div className="flex select-none items-center gap-1 whitespace-nowrap rounded-full bg-[linear-gradient(160deg,#b1685a_0%,#8f4d40_100%)] px-3 py-2 font-sans text-xs font-medium uppercase tracking-[0.08em] text-[#f1e9e5]">
            <span className="font-serif opacity-70">&lsaquo;</span>
            <span>Move</span>
            <span className="font-serif opacity-70">&rsaquo;</span>
          </div>

          <div ref={trackRef} className="relative h-[2px] flex-1 bg-white/20">
            <div
              ref={fillRef}
              className="absolute left-0 top-0 h-full w-0 bg-[linear-gradient(90deg,#8f4d40,#d0a08f)]"
            />
<div
  ref={handleRef}
  onPointerDown={onPointerDown}
  role="slider"
  aria-label="Drag to reveal our work"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={Math.round(percentRef.current)}
  tabIndex={0}
  style={{ touchAction: "none" }}
  className="absolute left-0 top-1/2 h-10 w-20 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full bg-[#af1919] shadow-[0_0_0_4px_rgba(244,241,236,0.12)] active:cursor-grabbing flex items-center justify-center text-white text-sm font-medium"
>
  <FaAngleRight className="ml-1 text-base opacity-80" />
</div>
          </div>

          <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center">
            <span className="absolute h-full w-full rounded-full border border-white/60" />
            <span className="absolute h-[62%] w-[62%] rounded-full border border-white/60" />
            <span className="absolute h-[22%] w-[22%] rounded-full bg-white/85" />
          </div>
        </div>
      </div>
    </section>
  );
}