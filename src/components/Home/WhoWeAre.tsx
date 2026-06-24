"use client";

import { useState, useEffect } from "react";

const items = [
  {
    label: "TELLING",
    description:
      "We craft narratives that cut through noise — sharp, intentional, and impossible to ignore. Every frame we produce begins with a story worth telling.",
  },
  {
    label: "FASCINATING",
    description:
      "We obsess over the details that make audiences lean in. Visuals, pacing, texture — everything is designed to hold attention and spark curiosity.",
  },
  {
    label: "STORIES",
    description:
      "Stories are the oldest technology humans have. At Cizzara Studio, we use them to connect brands with people on a level that data alone never can.",
  },
];

export default function WhoWeAre() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Handle click outside to close the active subtitle
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeIndex !== null) {
        setActiveIndex(null);
        setHoveredIndex(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeIndex]);

  // Handle click on individual items
  const handleClick = (i: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAre.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className="w-full flex flex-col items-center gap-0">
          {items.map((item, i) => {
            const isHovered = hoveredIndex === i;
            const isActive = activeIndex === i;

            return (
              <div
                key={item.label}
                className="relative w-full flex flex-col items-center justify-center cursor-pointer select-none"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={(e) => handleClick(i, e)}
              >
                {/* Expanding black bar on hover */}
                <div
                  className={`absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm transition-all duration-500 ease-in-out ${
                    isHovered || isActive
                      ? "opacity-60"
                      : "opacity-0"
                  }`}
                  style={{
                    height: isActive ? "100%" : isHovered ? "120%" : "0%",
                  }}
                />

                {/* Word */}
             <h2
  className={`relative z-10 text-2xl py-2 md:text-3xl lg:text-4xl
    font-light tracking-[0.4em] uppercase
    transition-all duration-500 ease-in-out
    ${
      isHovered || isActive
        ? "text-white scale-105"
        : "text-white/90 scale-100"
    }
  `}
>
  {item.label}
</h2>

                {/* Expandable description */}
                <div
                  className="relative z-10 w-full overflow-hidden transition-all duration-500 ease-in-out"
                  style={{
                    maxHeight: isActive ? "200px" : "0px",
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  <p className="text-white/80 text-sm md:text-base font-light tracking-wider text-center px-8 md:px-24 lg:px-48 pb-5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Dotted divider — maintains consistent gap */}
                {i < items.length - 1 && (
  <div className="absolute bottom-0 left-0 w-full">
    <div className="w-full border-t border-dotted border-white/30" />
  </div>
)}
              </div>
            );
          })}
        </div>

<div className="absolute bottom-36 left-1/2 -translate-x-1/2">
  <div className="flex flex-col items-center gap-4">
    {/* Indicator */}
    <div className="relative py-4">
      {/* Top line */}
      <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-[115%] h-px bg-white/30" />

      {/* Boxes */}
      <div className="flex items-center gap-[2px] animate-sway">
        {/* Left box */}
        <div className="w-16 h-9 border border-white/30" />

        {/* Center box */}
        <div className="relative w-16 h-9 border border-white flex items-center justify-center">
          {/* Left arrow */}
          <div className="absolute -left-5 text-white/60">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>

          {/* Hand icon */}
          <div className="text-white">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 11V5a1.5 1.5 0 1 1 3 0v6" />
              <path d="M12 11V4a1.5 1.5 0 1 1 3 0v7" />
              <path d="M15 11V6a1.5 1.5 0 1 1 3 0v5" />
              <path d="M18 11V9a1.5 1.5 0 1 1 3 0v6c0 3.314-2.686 6-6 6h-4c-2.761 0-5-2.239-5-5v-5a1.5 1.5 0 1 1 3 0v3" />
            </svg>
          </div>

          {/* Right arrow */}
          <div className="absolute -right-5 text-white/60">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Right box */}
        <div className="w-16 h-9 border border-white/30" />
      </div>

      {/* Bottom line */}
      <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-[115%] h-px bg-white/30" />
    </div>

    {/* Text */}
    <span className="text-[10px] md:text-[11px] tracking-[0.25em] text-white/50 uppercase font-medium">
      DRAG TO BROWSE
    </span>
  </div>
</div>
      </div>
    </section>
  );
} 