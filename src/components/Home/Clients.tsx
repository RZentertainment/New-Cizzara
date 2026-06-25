"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const VIDEO_SRC = "https://cdn.cizzara.com/Cizzara-Latest/WhoWeAreVid1.mp4";

const LOGOS: string[] = [
  "https://cdn.cizzara.com/clients/c7c2f718-23ae-4bea-8555-ae85a3015b9b.webp",
  "https://cdn.cizzara.com/clients/4f7dc7aa-8b26-4ec3-9a2d-b64df55be2a1.webp",
  "https://cdn.cizzara.com/clients/c0523e27-7594-4049-bb95-b03238866368.webp",
  "https://cdn.cizzara.com/clients/4f460f0b-b3df-411b-bfb8-6874148efa46.webp",
  "https://cdn.cizzara.com/clients/628c4be8-310e-4d46-b35d-a022e36306c7.webp",
  "https://cdn.cizzara.com/clients/8e503146-66a5-45bf-99f1-7f89da316b46.webp",
  "https://cdn.cizzara.com/clients/90493c27-0817-4f8e-9904-2ce06fde98a1.webp",
  "https://cdn.cizzara.com/clients/d6afa3f9-a17a-4522-81be-367e20e66f54.webp",
  "https://cdn.cizzara.com/clients/1b4aab59-4a32-48d4-b855-b5494f2ceb06.webp",
  "https://cdn.cizzara.com/clients/a8cc8168-7b5d-4dea-854b-73e60aab5292.webp",
  "https://cdn.cizzara.com/clients/5fea009d-65dd-4e46-9812-e1ff645f4054.webp",
  "https://cdn.cizzara.com/clients/8c4728a0-3425-4956-b876-6b3cb2282672.webp",
  "https://cdn.cizzara.com/clients/4fcf9eb8-aeca-4233-8122-5acc3a974f9a.webp",
  "https://cdn.cizzara.com/clients/fa9bc296-9bbb-499e-8795-747fd12f7c82.webp",
  "https://cdn.cizzara.com/clients/9af965a0-2279-4ac0-8826-e5b672d65928.webp",
  "https://cdn.cizzara.com/clients/a2225c78-f89b-45d6-94b2-03eb6c6dd687.webp",
  "https://cdn.cizzara.com/clients/f2008847-c995-40df-b9e0-f302690238eb.webp",
  "https://cdn.cizzara.com/clients/cf7cc09e-4aee-47cc-b3f9-86d3511a52c8.webp",
  "https://cdn.cizzara.com/clients/83d04ad9-1e24-4660-bff0-d1ef1645c6cd.webp",
  "https://cdn.cizzara.com/clients/9ed0bc35-9edf-40fd-b90d-d9c83e8e24a4.webp",
  "https://cdn.cizzara.com/clients/6450a24f-1920-4fc5-b952-4d1ac3598c8d.webp",
  "https://cdn.cizzara.com/clients/befdb48e-4e54-4023-8ce6-c37e41e6c300.webp",
  "https://cdn.cizzara.com/clients/3dff300d-d49f-4b57-8d4d-ef6dfddcc48b.webp",
];

const UNIQUE_LOGOS: string[] = Array.from(new Set(LOGOS));

interface Cell {
  row: number;
  col: number;
  x: number;
  y: number;
  isCenter: boolean;
  ring: number; 
  logoIndex: number | null;
}

const DIAMOND_CLIP = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";

const Clients: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  const [cells, setCells] = useState<Cell[]>([]);
  const [size, setSize] = useState(192);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);

  const logoRefs = useRef<Map<string, HTMLImageElement>>(new Map());
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const driftTweenRef = useRef<gsap.core.Tween | null>(null);
  const breatheTweenRef = useRef<gsap.core.Tween | null>(null);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      UNIQUE_LOGOS.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = src;
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
      )
    ).then(() => {
      if (!cancelled) setImagesLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);


  const buildGrid = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const w = section.clientWidth;
    const h = section.clientHeight;

    const cellSize = 192;
    setSize(cellSize);

    const cx = w / 2;
    const cy = h / 2;

    const rowPitch = cellSize / 2;
    const rowCount = Math.ceil(h / rowPitch) + 4;
    const colCount = Math.ceil(w / cellSize) + 4;

    type Raw = { row: number; col: number; x: number; y: number; isCenter: boolean; dist: number };
    const raw: Raw[] = [];

    for (let row = -rowCount; row <= rowCount; row++) {
      const isOddRow = (((row % 2) + 2) % 2) === 1;
      const xOffset = isOddRow ? cellSize / 2 : 0;

      for (let col = -colCount; col <= colCount; col++) {
        const x = cx - cellSize / 2 + col * cellSize + xOffset;
        const y = cy - cellSize / 2 + row * rowPitch;

        if (x + cellSize < 0 || x > w || y + cellSize < 0 || y > h) continue;

        const centerX = x + cellSize / 2;
        const centerY = y + cellSize / 2;
        const dist = Math.hypot(centerX - cx, centerY - cy);
        const isCenter = row === 0 && col === 0;

        raw.push({ row, col, x, y, isCenter, dist });
      }
    }

    // Fill the cluster by true pixel distance from "Clients" outward —
    // since the lattice now tessellates with no gaps, the nearest N cells
    // form one solid, unbroken diamond-shaped block around the center.
    const ordered = raw
      .filter((c) => !c.isCenter)
      .sort((a, b) => a.dist - b.dist);

    const logoCount = UNIQUE_LOGOS.length;
    const ringStep = cellSize * 0.9; // bucket width for stagger grouping
    const logoIndexByKey = new Map<string, number>();
    const ringByKey = new Map<string, number>();

    ordered.forEach((c, i) => {
      const key = `${c.row}-${c.col}`;
      ringByKey.set(key, Math.floor(c.dist / ringStep));
      if (i < logoCount) logoIndexByKey.set(key, i);
    });

    const built: Cell[] = raw.map((c) => {
      const key = `${c.row}-${c.col}`;
      return {
        row: c.row,
        col: c.col,
        x: c.x,
        y: c.y,
        isCenter: c.isCenter,
        ring: c.isCenter ? 0 : ringByKey.get(key) ?? 0,
        logoIndex: c.isCenter ? null : logoIndexByKey.get(key) ?? null,
      };
    });

    setCells(built);
  }, []);

  useEffect(() => {
    buildGrid();
    const handleResize = () => buildGrid();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [buildGrid]);

  useEffect(() => {
    const grid = gridRef.current;
    const center = centerRef.current;
    if (!grid || !center) return;

    driftTweenRef.current = gsap.to(grid, {
      y: 8,
      duration: 8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    breatheTweenRef.current = gsap.to(center, {
      scale: 1.03,
      boxShadow: "0 0 60px 12px rgba(255,255,255,0.35)",
      duration: 2.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      driftTweenRef.current?.kill();
      breatheTweenRef.current?.kill();
    };
  }, [cells.length]);

  const maxRing = cells.length > 0 ? Math.max(...cells.map((c) => c.ring)) : 0;

  const handleDiamondClick = useCallback(() => {
    const center = centerRef.current;
    if (!center) return;

    gsap.fromTo(
      center,
      { scale: 1 },
      { scale: 0.95, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 }
    );

    activeTimelineRef.current?.kill();

    const nextOpen = !isOpen;
    setIsAnimating(true);
    setIsOpen(nextOpen);

    const logoCells = cells.filter((c) => c.logoIndex !== null);
    const logoEls = logoCells
      .map((c) => logoRefs.current.get(`${c.row}-${c.col}`))
      .filter(Boolean) as HTMLImageElement[];

    const ringOf = (el: HTMLImageElement) => {
      const key = el.dataset.ring;
      return key ? parseInt(key, 10) : 0;
    };

    const tl = gsap.timeline({
      onUpdate: function () {
        setRevealProgress(this.progress());
      },
      onComplete: () => {
        setIsAnimating(false);
        setRevealProgress(nextOpen ? 1 : 0);
      },
    });
    activeTimelineRef.current = tl;

    if (nextOpen) {
      // Reveal: center ring outward, organic bloom.
      tl.set(logoEls, { display: "block" });
      tl.to(logoEls, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power4.out",
        stagger: (index, target) => ringOf(target as HTMLImageElement) * 0.05,
      });
    } else {
      // Hide: outer rings first, center-most last.
      tl.to(logoEls, {
        opacity: 0,
        scale: 0.6,
        filter: "blur(8px)",
        duration: 0.7,
        ease: "power3.in",
        stagger: (index, target) =>
          (maxRing - ringOf(target as HTMLImageElement)) * 0.03,
      }).set(logoEls, { display: "none" });
    }
  }, [cells, isOpen, maxRing]);

  const handleHoverIn = (cellEl: HTMLDivElement | null, imgEl: HTMLImageElement | null) => {
    if (cellEl) {
      gsap.to(cellEl, {
        boxShadow: "0 0 24px 4px rgba(255,255,255,0.45)",
        borderColor: "rgba(255,255,255,0.9)",
        duration: 0.35,
        ease: "power2.out",
      });
    }
    if (imgEl) {
      gsap.to(imgEl, { scale: 1.08, duration: 0.35, ease: "power2.out" });
    }
  };

  const handleHoverOut = (cellEl: HTMLDivElement | null, imgEl: HTMLImageElement | null) => {
    if (cellEl) {
      gsap.to(cellEl, {
        boxShadow: "0 0 0px 0px rgba(255,255,255,0)",
        borderColor: "rgba(255,255,255,0.28)",
        duration: 0.35,
        ease: "power2.out",
      });
    }
    if (imgEl) {
      gsap.to(imgEl, { scale: 1, duration: 0.35, ease: "power2.out" });
    }
  };

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black font-sans"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-10 bg-black/40" />

      {/* Diamond grid — interlocking lattice, tiles the full viewport with no gaps. */}
      <div
        ref={gridRef}
        className="absolute inset-0 z-20"
        aria-hidden={!imagesLoaded}
      >
        {cells.map((cell) => {
          const key = `${cell.row}-${cell.col}`;

          if (cell.isCenter) {
            return (
              <div
                key={key}
                ref={centerRef}
                onClick={handleDiamondClick}
                role="button"
                tabIndex={0}
                aria-pressed={isOpen}
                aria-label={isOpen ? "Hide client logos" : "Show client logos"}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleDiamondClick();
                  }
                }}
                className="absolute flex cursor-pointer items-center justify-center bg-white/10"
                style={{
                  left: cell.x,
                  top: cell.y,
                  width: size,
                  height: size,
                  clipPath: DIAMOND_CLIP,
                  border: "2px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 0 40px 8px rgba(255,255,255,0.25)",
                  zIndex: 10,
                }}
              >
                <span className="select-none text-base font-medium tracking-wide text-white">
                  Clients
                </span>
              </div>
            );
          }

          const logo =
            cell.logoIndex !== null ? UNIQUE_LOGOS[cell.logoIndex] : null;

          return (
            <div
              key={key}
              ref={(el) => {
                if (el) cellRefs.current.set(key, el);
                else cellRefs.current.delete(key);
              }}
              onMouseEnter={(e) => handleHoverIn(e.currentTarget, logoRefs.current.get(key) ?? null)}
              onMouseLeave={(e) => handleHoverOut(e.currentTarget, logoRefs.current.get(key) ?? null)}
              className="absolute flex items-center justify-center border"
              style={{
                left: cell.x,
                top: cell.y,
                width: size,
                height: size,
                clipPath: DIAMOND_CLIP,
                borderColor: cell.logoIndex !== null ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.14)",
                borderWidth: 1,
                backgroundColor: cell.logoIndex !== null ? "rgba(255,255,255,0.03)" : "transparent",
                zIndex: 5,
              }}
            >
              {logo && (
                <img
                  ref={(el) => {
                    if (el) logoRefs.current.set(key, el);
                    else logoRefs.current.delete(key);
                  }}
                  data-ring={cell.ring}
                  src={logo}
                  alt="Client logo"
                  draggable={false}
                  className="pointer-events-none h-full w-full select-none object-contain"
                  style={{
                    padding: "20%",
                    display: "none",
                    opacity: 0,
                    transform: "scale(0.6)",
                    filter: "blur(8px)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Clients;