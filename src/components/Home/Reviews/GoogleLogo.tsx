"use client";

import React, { useEffect, useRef } from "react";

// ─── Easing functions ────────────────────────────────────────────────────────

function easeOutElastic(t: number): number {
  const c4 = (2 * Math.PI) / 4.5;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

function easeOutBack(t: number, s = 1.4): number {
  return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ─── Core animation helper ────────────────────────────────────────────────────

function animateFn(
  duration: number,
  easing: (t: number) => number,
  onUpdate: (e: number, t: number) => void,
  onDone?: () => void
): void {
  const start = performance.now();
  function tick(now: number) {
    const t = Math.min((now - start) / duration, 1);
    const e = easing(t);
    onUpdate(e, t);
    if (t < 1) requestAnimationFrame(tick);
    else if (onDone) onDone();
  }
  requestAnimationFrame(tick);
}

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Bubble pop ───────────────────────────────────────────────────────────────

function spawnBubbles(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;
  const cx = 40, cy = 40;
  const count = 8;
  type Bubble = {
    x: number; y: number; vx: number; vy: number;
    r: number; opacity: number; color: string;
  };
  const bubbles: Bubble[] = [];
  for (let i = 0; i < count; i++) {
    const angle = ((Math.PI * 2) / count) * i + (Math.random() - 0.5) * 0.5;
    const speed = 0.7 + Math.random() * 1.1;
    const size = 2 + Math.random() * 4;
    const hue = 35 + Math.random() * 25;
    bubbles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: size, opacity: 1,
      color: `hsl(${hue},100%,68%)`,
    });
  }
  const start = performance.now();
  const dur = 480;
  function tick(now: number) {
    ctx.clearRect(0, 0, 80, 80);
    const t = Math.min((now - start) / dur, 1);
    bubbles.forEach((b) => {
      b.x += b.vx * (1 - t * 0.7);
      b.y += b.vy * (1 - t * 0.7) + 0.08;
      b.opacity = Math.max(0, (1 - t) * (1 - t));
      ctx.globalAlpha = b.opacity;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * (1 - t * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.globalAlpha = b.opacity * 0.4;
      ctx.beginPath();
      ctx.arc(b.x - b.r * 0.25, b.y - b.r * 0.25, b.r * 0.35 * (1 - t * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface StarRefSet {
  starEl: SVGSVGElement | null;
  fillEl: SVGPathElement | null;
  shineEl: SVGPathElement | null;
  clipRect: SVGRectElement | null;
  glowEl: HTMLDivElement | null;
  canvasEl: HTMLCanvasElement | null;
}

// ─── Star SVG component ───────────────────────────────────────────────────────

const STAR_PATH =
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

interface StarUnitProps {
  index: number;
  refs: React.MutableRefObject<StarRefSet[]>;
}

const StarUnit: React.FC<StarUnitProps> = ({ index, refs }) => {
  const starRef = useRef<SVGSVGElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const shineRef = useRef<SVGPathElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    refs.current[index] = {
      starEl: starRef.current,
      fillEl: fillRef.current,
      shineEl: shineRef.current,
      clipRect: clipRectRef.current,
      glowEl: glowRef.current,
      canvasEl: canvasRef.current,
    };
  });

  const gradId = `rg-${index}`;
  const clipId = `clip-${index}`;

  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      {/* Ambient glow */}
      <div
        ref={glowRef}
        className="absolute rounded-full pointer-events-none z-[1]"
        style={{
          inset: -8,
          background:
            "radial-gradient(circle, rgba(255,193,7,0.28) 0%, transparent 70%)",
          opacity: 0,
        }}
      />

      {/* Star SVG */}
      <svg
        ref={starRef}
        viewBox="0 0 24 24"
        className="w-10 h-10 relative z-[2]"
        style={{ transformOrigin: "center", willChange: "transform" }}
      >
        <defs>
          <radialGradient id={gradId} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#FFE57F" />
            <stop offset="100%" stopColor="#FFA000" />
          </radialGradient>
          <clipPath id={clipId}>
            <rect
              ref={clipRectRef}
              x="-30"
              y="-30"
              width="0"
              height="60"
              transform="rotate(-35,12,12)"
            />
          </clipPath>
        </defs>

        {/* Outline (empty state) */}
        <path
          d={STAR_PATH}
          fill="none"
          stroke="#3a3a3a"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {/* Gold fill */}
        <path
          ref={fillRef}
          d={STAR_PATH}
          fill={`url(#${gradId})`}
          style={{ opacity: 0, transformOrigin: "12px 12px" }}
        />

        {/* Shine sweep overlay */}
        <path
          ref={shineRef}
          d={STAR_PATH}
          fill="rgba(255,255,255,0.38)"
          clipPath={`url(#${clipId})`}
          style={{ opacity: 0 }}
        />
      </svg>

      {/* Bubble particle canvas */}
      <canvas
        ref={canvasRef}
        width={80}
        height={80}
        className="absolute pointer-events-none z-10"
        style={{ left: -20, top: -20, width: 80, height: 80 }}
      />
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const GoogleLogo: React.FC = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const starsRowRef = useRef<HTMLDivElement>(null);
  const starRefs = useRef<StarRefSet[]>(
    Array.from({ length: 5 }, () => ({
      starEl: null,
      fillEl: null,
      shineEl: null,
      clipRect: null,
      glowEl: null,
      canvasEl: null,
    }))
  );
  const hasRun = useRef(false);

  // Logo entrance
  async function runLogoEntrance(): Promise<void> {
    const el = logoRef.current;
    if (!el) return;
    return new Promise((resolve) => {
      animateFn(820, easeOutBack, (e) => {
        el.style.opacity = String(Math.min(e * 1.3, 1));
        el.style.transform = `scale(${lerp(0.85, 1, e)}) rotate(${lerp(3, 0, e)}deg)`;
        el.style.filter = `drop-shadow(0 0 ${e * 12}px rgba(66,133,244,${e * 0.5}))`;
      }, resolve);
    });
  }

  // Text reveal
  async function runTextReveal(): Promise<void> {
    const el = headingRef.current;
    if (!el) return;
    return new Promise((resolve) => {
      animateFn(600, easeOutCubic, (e) => {
        el.style.opacity = String(e);
        el.style.transform = `translateY(${lerp(20, 0, e)}px)`;
        el.style.filter = `blur(${lerp(8, 0, e)}px)`;
      }, resolve);
    });
  }

  // Diagonal shine sweep
  function runShine(idx: number): void {
    const { shineEl, clipRect } = starRefs.current[idx] ?? {};
    if (!shineEl || !clipRect) return;
    shineEl.style.opacity = "1";
    animateFn(260, easeInOutCubic, (e) => {
      clipRect.setAttribute("x", String(lerp(-30, 5, e)));
      clipRect.setAttribute("width", String(lerp(0, 28, e)));
    }, () => {
      animateFn(120, easeOutCubic, (e) => {
        shineEl.style.opacity = String((1 - e) * 0.38);
      });
    });
  }

  // Single star animation: anticipate → pop → settle
  async function animateStar(idx: number): Promise<void> {
    const { starEl, fillEl, glowEl, canvasEl } = starRefs.current[idx] ?? {};
    if (!starEl || !fillEl || !glowEl || !canvasEl) return;

    return new Promise((resolve) => {
      // 1. Anticipation squeeze
      animateFn(90, easeInOutCubic, (e) => {
        starEl.style.transform = `scale(${lerp(1, 0.88, e)})`;
      }, () => {
        // 2. Elastic pop + fill materialise
        animateFn(220, easeOutBack, (e) => {
          starEl.style.transform = `scale(${lerp(0.88, 1.28, e)})`;
          fillEl.style.opacity = String(Math.min(e * 1.5, 1));
          glowEl.style.opacity = String(e * 0.9);
        }, () => {
          runShine(idx);
          spawnBubbles(canvasEl);
          // 3. Elastic settle to 1
          animateFn(260, easeOutElastic, (e) => {
            starEl.style.transform = `scale(${lerp(1.28, 1, e)})`;
            glowEl.style.opacity = String(lerp(0.9, 0.22, e));
          }, () => {
            glowEl.style.opacity = "0.16";
            resolve();
          });
        });
      });
    });
  }

  // Final celebration: row pulse + logo breathing
  async function runCelebration(): Promise<void> {
    const row = starsRowRef.current;
    if (!row) return;

    await new Promise<void>((resolve) => {
      animateFn(340, easeOutBack, (e) => {
        row.style.transform = `scale(${lerp(1, 1.04, e)})`;
      }, () => {
        animateFn(300, easeOutCubic, (e) => {
          row.style.transform = `scale(${lerp(1.04, 1, e)})`;
        }, resolve);
      });
    });

    // Logo breathing loop
    let breath = 0, dir = 1;
    const breathe = () => {
      breath += dir * 0.008;
      if (breath >= 1) { breath = 1; dir = -1; }
      if (breath <= 0) { breath = 0; dir = 1; }
      if (logoRef.current) {
        logoRef.current.style.transform = `scale(${1 + breath * 0.02}) rotate(0deg)`;
      }
      requestAnimationFrame(breathe);
    };
    breathe();
  }

  // Master sequence
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    (async () => {
      await wait(180);
      await runLogoEntrance();
      await wait(80);
      await runTextReveal();
      await wait(200);
      for (let i = 0; i < 5; i++) {
        if (i > 0) await wait(120);
        await animateStar(i);
      }
      await wait(60);
      await runCelebration();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex height-20 items-center justify-center gap-6 md:gap-8 bg-[#0d0d0d] px-6 py-4 md:px-10 md:py-6 border border-[#838181] rounded-2xl w-fit mx-auto overflow-hidden">
      {/* Google G logo */}
      <div
        ref={logoRef}
        className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0"
        style={{
          opacity: 0,
          transform: "scale(0.85) rotate(3deg)",
          willChange: "transform, opacity, filter",
        }}
      >
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.56l7.97-5.97z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
      </div>

      {/* Text + stars */}
      <div className="flex flex-col items-start gap-2">
        <h3
          ref={headingRef}
          className="text-white text-xl md:text-3xl font-bold tracking-wide"
          style={{
            opacity: 0,
            transform: "translateY(20px)",
            filter: "blur(8px)",
            willChange: "transform, opacity, filter",
          }}
        >
          Loved By People
        </h3>

        <div
          ref={starsRowRef}
          className="flex gap-1.5"
          style={{ willChange: "transform" }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <StarUnit key={i} index={i} refs={starRefs} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleLogo;