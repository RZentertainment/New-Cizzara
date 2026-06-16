"use client";

import { useState } from "react";

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
  // Fix: Explicitly type the state as number | null
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Fix: Add type annotation for the parameter 'i'
  const handleClick = (i: number) => {
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
                onClick={() => handleClick(i)}
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
                  className={`relative text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.3em] md:tracking-[0.4em] uppercase z-10 transition-all duration-500 ease-in-out ${
                    isHovered || isActive
                      ? "text-white scale-105"
                      : "text-white/90 scale-100"
                  }`}
                  style={{ paddingTop: isActive ? "1.5rem" : "0.5rem", paddingBottom: "0.5rem" }}
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

                {/* Dotted divider — gap increases on hover/active */}
                {i < items.length - 1 && (
                  <div
                    className={`relative w-full transition-all duration-500 ease-in-out ${
                      isHovered || isActive ? "mt-6" : "mt-1"
                    }`}
                  >
                    <div className="w-full border-t border-dotted border-white/30" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom label */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-[1px] bg-white/50" />
            <span className="text-[10px] md:text-xs tracking-[0.2em] text-white/70 uppercase">
              What is Cizzara Studio?
            </span>
            <div className="w-8 h-[1px] bg-white/50" />
          </div>
        </div>
      </div>
    </section>
  );
}