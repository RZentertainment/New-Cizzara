"use client";
import React, { useEffect, useRef, useState } from "react";

interface AboutVideoProps {
  isRevealed: boolean;
  onClose: () => void;
}

/* ----------------------------------------------------------------------
   DATA
---------------------------------------------------------------------- */

interface Milestone {
  year: string;
  title: string;
  description: string;
  image: string;
  /** "up" = circle+capsule on top, year below. "down" = year on top, circle+capsule below. */
  pos: "up" | "down";
}

const MILESTONES: Milestone[] = [
  {
    year: "2017",
    title: "Launch of Cizzara Studios",
    description: "First ever in Vadodara inhouse Audio-Video services",
    image: "https://cdn.cizzara.com/services/de844019-df4f-499b-b2aa-fd7a6517062c.webp",
    pos: "up",
  },
  {
    year: "2019",
    title: "Babubhai Sentimental",
    description: "Released First Gujarati film entire post production done by Cizzara Studios",
    image: "https://cdn.cizzara.com/services/4b95f867-6433-43fe-92c8-10a0ddb02773.webp",
    pos: "down",
  },
  {
    year: "2021",
    title: "Social Media Managment Services",
    description: "One stop solution for all Social Media / Digital Marketing & Branding services From January 2021",
    image: "https://cdn.cizzara.com/services/c432724f-4317-4085-93da-7d7b50c0a80e.webp",
    pos: "up",
  },
  {
    year: "2022",
    title: "Aarvi Music Label",
    description: "Stand alone platform for Aspiring Artist",
    image: "https://cdn.cizzara.com/services/9dba5435-953e-43b3-96b7-55c28e140996.webp",
    pos: "down",
  },
  {
    year: "2023",
    title: "I Wish",
    description: "Released First Movie",
    image: "https://cdn.cizzara.com/services/430c82df-edcd-4fb5-8648-b2f56fc3fd66.webp",
    pos: "up",
  },
  {
    year: "2023",
    title: "The United Production",
    description: "A Platform launched by end of 2023 for Reality Shows & Events",
    image: "https://cdn.cizzara.com/services/c0eb3692-d8d1-4344-aaa3-2895ae494def.webp",
    pos: "down",
  },
  {
    year: "2024",
    title: "Guiltless Season 1",
    description: "Hindi Web Series It will release on OTT platforms",
    image: "https://cdn.cizzara.com/services/960363c1-17ef-484c-b72e-4e2de8ac7a5a.webp",
    pos: "up",
  },
];

const HEADLINE =
  "2017 — Founder and Director Mr. Amit Patel started the studio with a vision to create a production studio with all production as well as post-production facilities for the first time in Vadodara, Gujarat.";

/* ----------------------------------------------------------------------
   COMPONENT — same shell, name, props as the original
---------------------------------------------------------------------- */

export default function AboutVideo({ isRevealed, onClose }: AboutVideoProps) {
  const [headlineShown, setHeadlineShown] = useState(false);
  const [activeCount, setActiveCount] = useState(0); // how many milestones revealed so far
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Re-runs the full reveal sequence from scratch every single time
  // isRevealed becomes true — no "only once" gate. If the panel closes
  // mid-animation, everything is cleared and reset so the next open
  // always starts clean from the beginning.
  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    if (isRevealed) {
      setHeadlineShown(false);
      setActiveCount(0);

      const t0 = setTimeout(() => setHeadlineShown(true), 150);
      timeoutsRef.current.push(t0);

      const t1 = setTimeout(() => runSequence(), 900);
      timeoutsRef.current.push(t1);
    } else {
      setHeadlineShown(false);
      setActiveCount(0);
    }

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRevealed]);

  function runSequence() {
    let i = 0;
    const STEP_MS = 1000;
    function step() {
      i++;
      setActiveCount(i);
      if (i < MILESTONES.length) {
        const t = setTimeout(step, STEP_MS);
        timeoutsRef.current.push(t);
      }
    }
    step();
  }

  return (
    <section
      className="relative h-screen w-full flex-shrink-0 overflow-hidden cursor-close"
      style={{ scrollSnapAlign: "start", background: "#2b2826" }}
      onClick={onClose}
    >
      {/* film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay z-[1]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Headline */}
    <div
  className="absolute top-0 left-0 right-0 z-10 pt-8 md:pt-10 px-8 text-center pointer-events-none transition-opacity duration-700"
  style={{ opacity: headlineShown ? 1 : 0 }}
>
<p
  className="text-[#b0abab] text-sm md:text-base font-medium leading-snug max-w-5xl mx-auto"
  style={{ fontFamily: "'Inter', sans-serif" }}
>
  2017 — Founder and Director <span className="text-[#dbd9d9] font-bold">Mr. Amit Patel</span> started the studio with a vision to create a production studio with all production as well as post-production facilities for the first time in Vadodara, Gujarat.
</p>
  
 <div className="pointer-events-none flex justify-center mt-8">
  <div
    style={{ 
      opacity: activeCount >= MILESTONES.length ? 1 : 0,
      transition: 'opacity 0.7s'
    }}
  >
   <h2
  key={`typewriter-${isRevealed ? 'active' : 'inactive'}`}
  className="text-[#9e9a9a] text-2xl tracking-[0.15em] uppercase font-bold"
 style={{
  width: '350px', /* <--- Force a width larger than the text */
  display: 'inline-block',
  overflow: 'hidden',
  borderRight: '2px solid rgba(255, 255, 255, 0.7)',
  whiteSpace: 'nowrap',
  animation: activeCount >= MILESTONES.length ? 'typing 3s steps(26, end) forwards, blink-caret 0.75s step-end infinite' : 'none',
  fontFamily: "'Inter', sans-serif"
}}
>
  Journey to be continue...
</h2>
  </div>
</div>


  
</div>

      

      {/* Timeline row */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-[2.5vw] pointer-events-none">
        
        <div className="relative flex w-full max-w-[1500px] items-center justify-between">
          {MILESTONES.map((m, i) => (
            <React.Fragment key={i}>
              <Column milestone={m} revealed={i < activeCount} />
              {i < MILESTONES.length - 1 && (
                <Chevron revealed={i < activeCount} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bottom-right tag, matches reference */}
    

      {/* Close Hint — unchanged from original */}
      <div className="absolute bottom-8 left-0 right-0 z-20 text-center pointer-events-none">
        <p className="text-[0.6rem] tracking-[0.22em] uppercase text-white/40">
          Click anywhere to close
        </p>
      </div>
    </section>
  );
}



function Chevron({ revealed }: { revealed: boolean }) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center"
      style={{
        width: "min(2.2vw, 26px)",
        opacity: revealed ? 1 : 0,
        transform: `translateX(${revealed ? 0 : -8}px)`,
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
        <path d="M5 2l6 6-6 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}


function Column({ milestone, revealed }: { milestone: Milestone; revealed: boolean }) {
  const isUp = milestone.pos === "up";

  const circleSize = "min(8vw, 100px)";
  const capsuleWidth = "min(11.5vw, 150px)";
  const capsuleHeight = "min(26vh, 230px)";

  return (
    <div
      className="relative flex flex-col items-center flex-shrink-0"
      style={{ width: "min(13vw, 165px)" }}
    >
      <div
        className="flex flex-col items-center"
        style={{
          transform: isUp ? "translateY(0)" : "translateY(7vh)",
        }}
      >
        {isUp ? (
          <>
            {/* circle */}
            <Circle src={milestone.image} size={circleSize} revealed={revealed} delay={0} />
            {/* capsule */}
            <Capsule milestone={milestone} width={capsuleWidth} height={capsuleHeight} revealed={revealed} delay={0.15} />
            {/* year below */}
            <Year year={milestone.year} revealed={revealed} delay={0.05} />
          </>
        ) : (
          <>
            {/* year above */}
            <Year year={milestone.year} revealed={revealed} delay={0.05} flip />
            {/* circle */}
            <Circle src={milestone.image} size={circleSize} revealed={revealed} delay={0.1} />
            {/* capsule */}
            <Capsule milestone={milestone} width={capsuleWidth} height={capsuleHeight} revealed={revealed} delay={0.25} />
          </>
        )}
      </div>
    </div>
  );
}

function Circle({
  src,
  size,
  revealed,
  delay,
}: {
  src: string;
  size: string;
  revealed: boolean;
  delay: number;
}) {
  return (
    <div
      className="relative z-20 rounded-full overflow-hidden border-2 border-white"
      style={{
        width: size,
        height: size,
        opacity: revealed ? 1 : 0,
        transform: `scale(${revealed ? 1 : 0.7})`,
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s`,
        boxShadow: revealed ? "0 0 24px rgba(255,255,255,0.25)" : "none",
        marginBottom: "-1px",
      }}
    >
      <img src={src} alt="" className="h-full w-full object-cover" />
    </div>
  );
}

function Capsule({
  milestone,
  width,
  height,
  revealed,
  delay,
}: {
  milestone: Milestone;
  width: string;
  height: string;
  revealed: boolean;
  delay: number;
}) {
  return (
    <div
      className="relative flex items-start justify-center text-center px-3 pt-7 pb-4"
      style={{
        width,
        minHeight: height,
        borderRadius: "999px",
        border: "2px solid rgba(255,255,255,0.85)",
        marginTop: "-28px",
        opacity: revealed ? 1 : 0,
        transform: `scaleY(${revealed ? 1 : 0.4})`,
        transformOrigin: "top center",
        transition: `opacity 0.5s ease ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      <div>
        <h3
          className="text-white font-bold text-[0.78rem] md:text-[0.92rem] leading-tight mb-2 mt-5"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {milestone.title}
        </h3>
        <p className="text-white/85 text-[0.65rem] md:text-[0.72rem] leading-snug">
          {milestone.description}
        </p>
      </div>
    </div>
  );
}

function Year({
  year,
  revealed,
  delay,
  flip,
}: {
  year: string;
  revealed: boolean;
  delay: number;
  flip?: boolean;
}) {
  return (
    <span
      className={`font-extrabold text-white ${flip ? "mb-3" : "mt-3"}`}
      style={{
        fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)",
        opacity: revealed ? 1 : 0,
        transform: `translateY(${revealed ? 0 : flip ? -10 : 10}px)`,
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {year}
    </span>
  );
}