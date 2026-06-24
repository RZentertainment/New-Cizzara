"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface BlogPost {
  _id: string;
  name: string;
  description: string;
  imageUrls: string[];
}

const defaultPosts: BlogPost[] = [
  {
    _id: "post-1",
    name: "Digital AI Solutions",
    description: "Transforming Businesses",
    imageUrls: ["https://cdn.rzentertainment.group/blogs/04921f8b-bbb2-46ae-bd87-d2057c694fc1.webp"],
  },
  {
    _id: "post-2",
    name: "Creative Entrepreneurship",
    description: "Rise of Creators",
    imageUrls: ["https://cdn.rzentertainment.group/blogs/0b8e60a8-9bd8-4fa8-98a8-183a03056790.webp"],
  },
  {
    _id: "post-3",
    name: "Brand Storytelling",
    description: "Building Strong Brands",
    imageUrls: ["https://cdn.rzentertainment.group/blogs/1c7f379c-0118-4ec4-96f3-4a5f01be453d.webp"],
  },
  {
    _id: "post-4",
    name: "Digital Media Growth",
    description: "New Growth Engine",
    imageUrls: ["https://cdn.rzentertainment.group/blogs/1b8c2629-f028-42a9-a089-693ad8cd21ab.webp"],
  },
];

// ── Geometry ──────────────────────────────────────────────────────────────────
// Diamond mosaic: axis-aligned squares rotated 45°, packed edge-to-edge (rhombille
// tiling). Bounding box of each diamond = S × S. Row pitch = S/2, odd rows
// offset by S/2 horizontally — this is what makes every diamond touch exactly
// 4 neighbors with zero gaps and zero overlap.
//
// IMPORTANT: the lattice lines are NOT a separate SVG overlay anymore. A
// separately-computed grid has to stay in perfect phase with the tile pitch
// forever, and any future tweak to S/padding/spacing breaks that silently
// (which is exactly what happened: step was changed to S while tiles still
// use an S/2 pitch, so the lines hit only every other vertex).
//
// Instead, every diamond draws its OWN border: an outer diamond filled with
// the line color, with a slightly inset inner diamond on top holding the
// actual content. Because both diamonds come from the same tile's left/top/S,
// adjacent tiles' borders land on the exact same shared edge by construction
// — there is no second system that can drift out of sync.

const S = 380;          // cell size — tune for desired editorial scale
const LINE = 1;          // border thickness in px
const LINE_COLOR = "rgba(255,255,255,0.16)";
const LINE_COLOR_HOVER = "rgba(255,255,255,0.32)";

const DIAMOND_CLIP = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";

type Tile = {
  key: string;
  left: number;
  top: number;
  post: BlogPost | null;
};

const Blog: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const measure = useCallback(() => {
    if (!wrapRef.current) return;
    setVw(wrapRef.current.clientWidth);
    setVh(wrapRef.current.clientHeight);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [measure]);

  // ── Build the full-viewport diamond grid ──────────────────────────────────
  const tiles: Tile[] = [];

  if (vw > 0 && vh > 0) {
    const rowPitch = S / 2;

    // Overscan so partially-visible diamonds at the edges still render fully.
    const rowMin = Math.floor(-S / rowPitch) - 1;
    const rowMax = Math.ceil(vh / rowPitch) + 1;
    const colMin = -2;
    const colMax = Math.ceil(vw / S) + 2;

    // Center 2×2 block hosts the 4 real posts — every other cell is a
    // placeholder diamond, but built from the exact same geometry.
    const rowMid = Math.round(vh / 2 / rowPitch);
    const colMid = Math.round(vw / 2 / S);

    const postSlots: Record<string, BlogPost> = {
      [`${rowMid}-${colMid}`]: defaultPosts[0],
      [`${rowMid}-${colMid + 1}`]: defaultPosts[1],
      [`${rowMid + 1}-${colMid}`]: defaultPosts[2],
      [`${rowMid + 1}-${colMid + 1}`]: defaultPosts[3],
    };

    for (let row = rowMin; row <= rowMax; row++) {
      const xOffset = row % 2 !== 0 ? S / 2 : 0;
      for (let col = colMin; col <= colMax; col++) {
        const left = col * S + xOffset;
        const top = row * rowPitch;

        if (left + S < -S || left > vw + S || top + S < -S || top > vh + S) {
          continue;
        }

        const key = `${row}-${col}`;
        tiles.push({ key, left, top, post: postSlots[key] ?? null });
      }
    }
  }

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#000",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* 1. Video background */}
      <video
        autoPlay loop muted playsInline
        style={{ position: "absolute", inset: 0, zIndex: 0, width: "100%", height: "100%", objectFit: "cover" }}
      >
        <source src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAreVid1.mp4" type="video/mp4" />
      </video>

      {/* 2. Dark scrim */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "rgba(0,0,0,0.55)" }} />

      {/* 3. Self-aligning diamond lattice — border + content come from the same tile */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        {vw > 0 && tiles.map(({ key, left, top, post }) => {
          const isHovered = hoveredKey === key;
          const isPlaceholder = post === null;

          return (
            <div
              key={key}
              onMouseEnter={() => setHoveredKey(key)}
              onMouseLeave={() => setHoveredKey(null)}
              style={{
                position: "absolute",
                left,
                top,
                width: S,
                height: S,
                clipPath: DIAMOND_CLIP,
                background: isHovered ? LINE_COLOR_HOVER : LINE_COLOR,
                transition: "background 0.3s ease",
                cursor: isPlaceholder ? "default" : "pointer",
              }}
            >
              {/* Inset content diamond — same clip-path, smaller box, same center.
                  The thin sliver of the outer diamond left visible around it IS
                  the grid line, and it's guaranteed to meet the neighbor's sliver
                  exactly at the shared edge since both come from the same S. */}
              <div
                style={{
                  position: "absolute",
                  inset: LINE,
                  clipPath: DIAMOND_CLIP,
                  overflow: "hidden",
                }}
              >
                {/* Resting tint */}
                <div style={{
                  position: "absolute", inset: 0, zIndex: 0,
                  background: isPlaceholder
                    ? (isHovered ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.30)")
                    : "rgba(0,0,0,0.20)",
                  transition: "background 0.4s ease",
                }} />

                {!isPlaceholder && (
                  <>
                    {/* Blog image */}
                    <img
                      src={post!.imageUrls[0]}
                      alt=""
                      draggable={false}
                      style={{
                        position: "absolute", inset: 0, zIndex: 1,
                        width: "100%", height: "100%",
                        objectFit: "cover",
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? "scale(1.0)" : "scale(1.06)",
                        transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)",
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    />

                    {/* Gradient on hover */}
                    {isHovered && (
                      <div style={{
                        position: "absolute", inset: 0, zIndex: 2,
                        background: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 100%)",
                        pointerEvents: "none",
                      }} />
                    )}

                    {/* Text */}
                    <div style={{
                      position: "absolute", inset: 0, zIndex: 3,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      textAlign: "center",
                      paddingLeft:   S * 0.24,
                      paddingRight:  S * 0.24,
                      paddingTop:    S * 0.28,
                      paddingBottom: S * 0.28,
                      gap: 6,
                      pointerEvents: "none",
                    }}>
                      <p style={{
                        margin: 0, fontSize: 9, fontWeight: 300,
                        letterSpacing: "0.16em", textTransform: "uppercase",
                        color: isHovered ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.30)",
                        lineHeight: 1.5, transition: "color 0.4s",
                      }}>
                        {post!.description}
                      </p>
                      <h3 style={{
                        margin: 0, fontSize: 13, fontWeight: isHovered ? 400 : 300,
                        letterSpacing: "0.07em",
                        color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)",
                        lineHeight: 1.3, transition: "color 0.4s",
                      }}>
                        {post!.name}
                      </h3>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Blog;