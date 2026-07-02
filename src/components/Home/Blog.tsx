"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

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
    description: "Transforming Businesses\nAI-powered tools reshaping how companies operate, innovate, and scale in the digital age.",
    imageUrls: ["https://cdn.rzentertainment.group/blogs/04921f8b-bbb2-46ae-bd87-d2057c694fc1.webp"],
  },
  {
    _id: "post-2",
    name: "Creative Entrepreneurship",
    description: "Rise of Creators\nEmpowering independent creators to build sustainable businesses through authentic content and community.",
    imageUrls: ["https://cdn.rzentertainment.group/blogs/0b8e60a8-9bd8-4fa8-98a8-183a03056790.webp"],
  },
  {
    _id: "post-3",
    name: "Brand Storytelling",
    description: "Building Strong Brands\nCrafting compelling narratives that connect emotionally and create lasting brand loyalty.",
    imageUrls: ["https://cdn.rzentertainment.group/blogs/1c7f379c-0118-4ec4-96f3-4a5f01be453d.webp"],
  },
  {
    _id: "post-4",
    name: "Digital Media Growth",
    description: "New Growth Engine\nLeveraging digital platforms and data-driven strategies to accelerate business growth.",
    imageUrls: ["https://cdn.rzentertainment.group/blogs/1b8c2629-f028-42a9-a089-693ad8cd21ab.webp"],
  },
  {
    _id: "post-5",
    name: "Visual Identity Design",
    description: "Powerful Brand Building\nCreating memorable visual identities that differentiate brands and resonate with audiences.",
    imageUrls: ["https://cdn.cizzara.com/blogs/2263b0f3-f8b2-45bd-9912-4b264543b8ff.webp"],
  },
  {
    _id: "post-6",
    name: "Future of Entertainment",
    description: "Creativity Meets Tech\nWhere storytelling and emerging technology converge to create immersive entertainment experiences.",
    imageUrls: ["https://cdn.rzentertainment.group/blogs/37f3b1b1-db05-42c0-9679-bcc27cb56b2c.webp"],
  },
  {
    _id: "post-7",
    name: "Future of Entertainment",
    description: "Creativity Meets Tech\nWhere storytelling and emerging technology converge to create immersive entertainment experiences.",
    imageUrls: ["https://cdn.rzentertainment.group/blogs/37f3b1b1-db05-42c0-9679-bcc27cb56b2c.webp"],
  },
  {
    _id: "post-8",
    name: "Future of Entertainment",
    description: "Creativity Meets Tech\nWhere storytelling and emerging technology converge to create immersive entertainment experiences.",
    imageUrls: ["https://cdn.rzentertainment.group/blogs/37f3b1b1-db05-42c0-9679-bcc27cb56b2c.webp"],
  },
  {
    _id: "post-8",
    name: "Future of Entertainment",
    description: "Creativity Meets Tech\nWhere storytelling and emerging technology converge to create immersive entertainment experiences.",
    imageUrls: ["https://cdn.rzentertainment.group/blogs/37f3b1b1-db05-42c0-9679-bcc27cb56b2c.webp"],
  },
  {
    _id: "post-9",
    name: "Future of Entertainment",
    description: "Creativity Meets Tech\nWhere storytelling and emerging technology converge to create immersive entertainment experiences.",
    imageUrls: ["https://cdn.rzentertainment.group/blogs/37f3b1b1-db05-42c0-9679-bcc27cb56b2c.webp"],
  }
  // Add as many posts as you want — placement is fully automatic.
];

// ── Geometry ──────────────────────────────────────────────────────────────────
// Diamond mosaic: axis-aligned squares rotated 45°, packed edge-to-edge (rhombille
// tiling). Bounding box of each diamond = S × S. Row pitch = S/2, odd rows
// offset by S/2 horizontally — this is what makes every diamond touch exactly
// 4 neighbors with zero gaps and zero overlap.
//
// IMPORTANT: the lattice lines are NOT a separate SVG overlay anymore. A
// separately-computed grid has to stay in perfect phase with the tile pitch
// forever, and any future tweak to S/padding/spacing breaks that silently.
// Instead, every diamond draws its OWN border: an outer diamond filled with
// the line color, with a slightly inset inner diamond on top holding the
// actual content. Because both diamonds come from the same tile's left/top/S,
// adjacent tiles' borders land on the exact same shared edge by construction.

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

// ── Dynamic placement algorithm ─────────────────────────────────────────────
// In this rhombille tiling, a diamond only shares a full EDGE (not just a
// vertex) with 4 neighbors: two in the row above, two in the row below.
// Same-row diamonds only touch at a single point, so they are NOT edge
// neighbors — this matches the "touches exactly 4 neighbors" geometry above.
//
// Given the left/top formula used for tile placement:
//   left = col * S + (row is odd ? S/2 : 0)
//   top  = row * (S/2)
// the diamond at (row, col) shares an edge with:
//   - even row:  (row-1, col-1), (row-1, col), (row+1, col-1), (row+1, col)
//   - odd  row:  (row-1, col),   (row-1, col+1), (row+1, col), (row+1, col+1)
//
// A breadth-first traversal of this neighbor graph, starting from the center
// cell, visits cells in expanding concentric rings — exactly the "center →
// adjacent → outer rings" fill pattern we want, and critically: the visit
// order for the first N cells never changes as N grows, so existing posts
// never jump to a new cell when more posts are added.

function getEdgeNeighbors(row: number, col: number): Array<[number, number]> {
  const isOdd = row % 2 !== 0;
  const adjCols: [number, number] = isOdd ? [col, col + 1] : [col - 1, col];
  return [
    [row - 1, adjCols[0]],
    [row - 1, adjCols[1]],
    [row + 1, adjCols[0]],
    [row + 1, adjCols[1]],
  ];
}

/**
 * Deterministic BFS over the diamond adjacency graph, starting at
 * (centerRow, centerCol). Returns up to `count` cells in expanding-ring
 * order. Stable: generateCellOrder(r, c, N).slice(0, M) === generateCellOrder(r, c, M)
 * for any M <= N, so growing the post list never reshuffles earlier posts.
 */
function generateCellOrder(
  centerRow: number,
  centerCol: number,
  count: number
): Array<[number, number]> {
  if (count <= 0) return [];

  const key = (r: number, c: number) => `${r},${c}`;
  const visited = new Set<string>([key(centerRow, centerCol)]);
  const queue: Array<[number, number]> = [[centerRow, centerCol]];
  const order: Array<[number, number]> = [];
  let head = 0;

  while (head < queue.length && order.length < count) {
    const [r, c] = queue[head++];
    order.push([r, c]);

    for (const [nr, nc] of getEdgeNeighbors(r, c)) {
      const k = key(nr, nc);
      if (!visited.has(k)) {
        visited.add(k);
        queue.push([nr, nc]);
      }
    }
  }

  return order;
}

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

  const rowPitch = S / 2;

  // Center cell for this viewport — same formula as before.
  const rowMid = vh > 0 ? Math.round(vh / 2 / rowPitch) : 0;
  const colMid = vw > 0 ? Math.round(vw / 2 / S) : 0;

  // Data-driven slot map: assigns each post to the next-closest empty cell,
  // expanding outward in rings from the center. Only recomputes when the
  // center shifts or the post list changes.
  const postSlotMap = useMemo(() => {
    const map = new Map<string, BlogPost>();
    const cellOrder = generateCellOrder(rowMid, colMid, defaultPosts.length);
    cellOrder.forEach(([r, c], i) => {
      const post = defaultPosts[i];
      if (post) map.set(`${r}-${c}`, post);
    });
    return map;
  }, [rowMid, colMid]);

  // ── Build the full-viewport diamond grid ──────────────────────────────────
  const tiles: Tile[] = useMemo(() => {
    const result: Tile[] = [];
    if (vw <= 0 || vh <= 0) return result;

    // Overscan so partially-visible diamonds at the edges still render fully.
    const rowMin = Math.floor(-S / rowPitch) - 1;
    const rowMax = Math.ceil(vh / rowPitch) + 1;
    const colMin = -2;
    const colMax = Math.ceil(vw / S) + 2;

    for (let row = rowMin; row <= rowMax; row++) {
      const xOffset = row % 2 !== 0 ? S / 2 : 0;
      for (let col = colMin; col <= colMax; col++) {
        const left = col * S + xOffset;
        const top = row * rowPitch;

        if (left + S < -S || left > vw + S || top + S < -S || top > vh + S) {
          continue;
        }

        const key = `${row}-${col}`;
        result.push({ key, left, top, post: postSlotMap.get(key) ?? null });
      }
    }
    return result;
  }, [vw, vh, postSlotMap, rowPitch]);

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
                       <h3 style={{
                        margin: 0, fontSize: 13, fontWeight: isHovered ? 400 : 300,
                        letterSpacing: "0.07em",
                        color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)",
                        lineHeight: 1.3, transition: "color 0.4s",
                      }}>
                        {post!.name}
                      </h3>
                      <p style={{
                        margin: 0, fontSize: 13,
                        color: isHovered ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.30)",
                        lineHeight: 1.5, transition: "color 0.4s",
                      }}>
                        {post!.description}
                      </p>
                     
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