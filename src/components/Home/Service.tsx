// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import gsap from "gsap";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// // Register GSAP plugins
// gsap.registerPlugin(ScrollToPlugin);

// const Service = () => {
//   const [isVideoVisible, setIsVideoVisible] = useState(false);
//   const [isTransitioning, setIsTransitioning] = useState(false);
  
//   // Refs for animations
//   const bellRef = useRef<HTMLDivElement>(null);
//   const ropeRef = useRef<HTMLDivElement>(null);
//   const videoSectionRef = useRef<HTMLDivElement>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const mainContentRef = useRef<HTMLDivElement>(null);

//   // Handle Bell Click - Open Video Section
//   const handleBellClick = () => {
//     if (isTransitioning) return;
//     setIsTransitioning(true);
    
//     setIsVideoVisible(true);
    
//     // Animate Bell dropping down (Rope extends) AND scroll to top
//     const tl = gsap.timeline();
    
//     tl.to(bellRef.current, {
//       y: 200,
//       duration: 0.8,
//       ease: "power2.inOut",
//     })
//     .to(ropeRef.current, {
//       height: 200,
//       duration: 0.6,
//       ease: "power2.inOut",
//     }, "-=0.4")
//     .to(containerRef.current, {
//       duration: 2.0,
//       scrollTo: {
//         y: 0,
//       },
//       ease: "power4.inOut",
//       onComplete: () => {
//         // Play video after scroll completes
//         if (videoRef.current) {
//           videoRef.current.play().catch(() => {});
//         }
//         setIsTransitioning(false);
//       }
//     });
//   };

//   // Handle Close Video
//   const handleCloseVideo = () => {
//     if (isTransitioning) return;
//     setIsTransitioning(true);
    
//     if (videoRef.current) {
//       videoRef.current.pause();
//     }

//     // Scroll back to bottom first (with top section still visible)
//     if (containerRef.current) {
//       gsap.to(containerRef.current, {
//         duration: 2.0,
//         scrollTo: {
//           y: window.innerHeight,
//         },
//         ease: "power4.inOut",
//         onComplete: () => {
//           // Only hide the top section AFTER the scroll animation completes
//           setIsVideoVisible(false);
//           // Bring Bell back up
//           const tl = gsap.timeline({
//             onComplete: () => {
//               setIsTransitioning(false);
//             }
//           });

//           tl.to(bellRef.current, {
//             y: 0,
//             duration: 0.8,
//             ease: "power2.inOut",
//           })
//           .to(ropeRef.current, {
//             height: 0,
//             duration: 0.6,
//             ease: "power2.inOut",
//           }, "-=0.4");
//         }
//       });
//     }
//   };

//   // Auto-scroll to bottom on load
//   useEffect(() => {
//     if (containerRef.current) {
//       setTimeout(() => {
//         containerRef.current?.scrollTo({ top: window.innerHeight, behavior: "instant" });
//       }, 50);
//     }
//   }, []);

//   return (
//     <div 
//       ref={containerRef}
//       className="w-full h-screen overflow-y-auto overflow-x-hidden"
//       style={{ scrollSnapType: 'y mandatory' }}
//     >
//       {/* Top Section - Video (Hidden by default, appears on click) */}
//       <section
//         id="service-video"
//         ref={videoSectionRef}
//         className={`relative h-screen w-full flex-shrink-0 overflow-hidden bg-black ${
//           isVideoVisible ? "block" : "hidden"
//         } ${isVideoVisible ? "cursor-close" : ""}`}
//         onClick={handleCloseVideo}
//         style={{ scrollSnapAlign: 'start' }}
//       >
//         <video
//           ref={videoRef}
//           muted
//           loop
//           playsInline
//           preload="metadata"
//           className="absolute inset-0 w-full h-full object-cover pointer-events-none"
//         >
//           <source
//             src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAre.mp4"
//             type="video/mp4"
//           />
//         </video>

//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black/20 pointer-events-none" />

//         {/* Content */}
//         <div className="relative z-10 flex h-full items-center justify-center pointer-events-none">
//           <h2 className="text-white text-5xl md:text-7xl font-light tracking-[0.3em] uppercase">
//             Studio
//           </h2>
//         </div>

//         {/* Hint text */}
//         <div 
//           className={`absolute bottom-8 left-0 right-0 z-20 text-center transition-all duration-500 pointer-events-none ${
//             isVideoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
//           }`}
//         >
//           <p className="text-white/50 text-xs uppercase tracking-[0.2em]">
//             Click anywhere to close
//           </p>
//         </div>
//       </section>

//       {/* Bottom Section - Always visible */}
//       <section 
//         ref={mainContentRef}
//         className="relative h-screen w-full flex-shrink-0 overflow-hidden bg-[#120d0d]"
//         style={{ scrollSnapAlign: 'start' }}
//       >
//         {/* Background Video (Dimmed) */}
//         <div className="absolute inset-0">
//           <video 
//             className="w-full h-full object-cover"
//             src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAre.mp4"
//             loop
//             muted
//             playsInline
//             autoPlay
//           />
//           <div className="absolute inset-0 bg-black/60"></div>
//         </div>

//         {/* MAIN UI CONTENT */}
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-7xl px-4">
          
//           {/* Background Concentric Circles */}
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5 bg-[#2a2533]/80 pointer-events-none"></div>
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 bg-[#2a2533]/90 pointer-events-none"></div>
          
//           {/* The Rounded Cutout Image (The Frame) */}
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] overflow-hidden rounded-full bg-black/80 backdrop-blur-sm border border-white/20">
//             <img 
//               src="https://cdn.cizzara.com/Cizzara-Latest/ChatGPT%20Image%20Jun%2015%2C%202026%2C%2002_23_58%20PM.png" 
//               alt="Studio Frame"
//               className="w-full h-full object-cover opacity-80 mix-blend-screen"
//             />
//           </div>

//           {/* Text Content - Left Aligned */}
//           <div className="absolute top-1/2 left-[23%] -translate-y-1/2 text-[#ffffff] max-w-md drop-shadow-lg pl-4 md:pl-0">
//             <h4 className="text-sm md:text-base font-medium mb-4 tracking-wide">
//               Creating The Next Iconic Story.
//             </h4>
//             <h1 className="text-5xl md:text-5xl font-bold leading-tight mb-6 text-[#e9e9e9]">
//               <span className="text-[#c91111]">Cizzara</span> <br />
//               Film <br />
//               Studio.
//             </h1>
//             <div className="space-y-1 mt-5">
//               <h2 className="text-2xl md:text-3xl font-bold text-[#c9ba33] ml-5">
//                 Cinema
//               </h2>
//               <h2 className="text-2xl md:text-3xl font-bold text-[#a3a3a3] ml-10">
//                 Beyond
//               </h2>
//               <h2 className="text-2xl md:text-3xl font-bold text-[#a3a3a3] ml-10">
//                 Expectations.
//               </h2>
//             </div>
//           </div>

//     {/* BELL & ROPE SYSTEM - POSITIONED AT TOP */}
// <div className="absolute top-[5%] right-[20%] z-30 flex flex-col items-center">
  
//   {/* TOP PULLEY / RING */}
//   <div className="w-[30px] h-[30px] rounded-full border-[6px] border-[#5C4033] bg-[#3d2b1f] shadow-[0_4px_15px_rgba(0,0,0,0.5)] relative z-10 mb-[-2px] ml-1">
//     <div className="absolute inset-0 rounded-full border-[2px] border-[#8B7355]/30"></div>
//   </div>

//   {/* ROPE */}
//   <div 
//     ref={ropeRef}
//     className="relative flex flex-col items-center ml-2.2"
//     style={{ height: '0px', minHeight: '0px' }}
//   >
//     <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col items-center">
//       <div className="absolute left-0 w-[3px] h-full bg-gradient-to-b from-[#a0845c] via-[#6b4f32] to-[#3d2b1f] rounded-full opacity-70"></div>
//       <div className="absolute left-1/2 -translate-x-1/2 w-[6px] h-full bg-gradient-to-b from-[#c4a87a] via-[#8B7355] to-[#5C4033] rounded-full"></div>
//       <div className="absolute right-0 w-[3px] h-full bg-gradient-to-b from-[#a0845c] via-[#6b4f32] to-[#3d2b1f] rounded-full opacity-70"></div>
//       <div className="absolute inset-0 opacity-20" style={{
//         backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, #000 8px, #000 10px)'
//       }}></div>
//     </div>
//   </div>

//   <div 
//     ref={bellRef}
//     className="cursor-pointer relative group mt-[-4px] mr-5.5"
//     onClick={handleBellClick}
//   >
//     <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[120%] h-[20px] rounded-[50%] bg-black/40 blur-md"></div>
    
//     <div className="relative">
//       <img 
//         src="https://cdn.cizzara.com/Cizzara-Latest/bell.png" 
//         alt="Bell"
//         className="w-[250px] h-auto object-contain"
//       />
      
//       {/* Launch Label ON Bell */}
//       <div className="absolute top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] flex items-center gap-2">
//         <span className="w-4 h-[1px] bg-yellow-400/70"></span>
//         <span className="text-white text-xl font-bold tracking-[0.2em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
//           Launch
//         </span>
//         <span className="w-4 h-[1px] bg-yellow-400/70"></span>
//       </div>
//     </div>

//     <div className="absolute inset-0 rounded-full bg-yellow-400/15 blur-2xl group-hover:opacity-60 opacity-0 transition-opacity duration-500 pointer-events-none"></div>
//   </div>
// </div>
//         </div>
//       </section>

//       {/* Custom cursor style for close */}
//       <style jsx global>{`
//         .cursor-close {
//           cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cdefs%3E%3ClinearGradient id='gold' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f5e6b8;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23fcf3da;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23e8d5a3;stop-opacity:1' /%3E%3C/linearGradient%3E%3Cfilter id='shadow' x='-20%25' y='-20%25' width='140%25' height='140%25'%3E%3CfeDropShadow dx='0' dy='3' stdDeviation='8' flood-color='black' flood-opacity='0.4'/%3E%3C/filter%3E%3C/defs%3E%3Ccircle cx='28' cy='28' r='26' fill='url(%23gold)' stroke='%23b8943a' stroke-width='1.5' filter='url(%23shadow)'/%3E%3Ccircle cx='28' cy='28' r='22' fill='none' stroke='%23b8943a' stroke-width='0.5' opacity='0.4'/%3E%3Cg transform='translate(28,28)'%3E%3Cline x1='-10' y1='-10' x2='10' y2='10' stroke='%23222222' stroke-width='2.5' stroke-linecap='round'/%3E%3Cline x1='10' y1='-10' x2='-10' y2='10' stroke='%23222222' stroke-width='2.5' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E") 28 28, pointer !important;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Service;






"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import HomeLoading from "@/components/HomeLoading";

gsap.registerPlugin(ScrollToPlugin);

const Service = ({ active }: { active: boolean }) => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const bellRef     = useRef<HTMLDivElement>(null);
  const ropeRef     = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const containerRef= useRef<HTMLDivElement>(null);

  /* Loading counter */
  useEffect(() => {
    if (!active) return;
    const startTime = Date.now();
    const duration  = 2500;
    const total     = 7;
    let id: number;
    const run = () => {
      const p = Math.min((Date.now() - startTime) / duration * 100, 100);
      setLoadingProgress(Math.floor(p / 100 * total));
      if (p < 100) { id = requestAnimationFrame(run); }
      else setTimeout(() => setIsLoading(false), 400);
    };
    id = requestAnimationFrame(run);
    return () => cancelAnimationFrame(id);
  }, [active]);

  /* Jump to main section on load */
  useEffect(() => {
    if (active && !isLoading && containerRef.current) {
      setTimeout(() => containerRef.current!.scrollTo({ top: window.innerHeight, behavior: "instant" }), 50);
    }
  }, [active, isLoading]);

  /* Reset on deactivate */
  useEffect(() => {
    if (!active) {
      videoRef.current?.pause();
      setIsVideoVisible(false);
      setIsTransitioning(false);
      setIsLoading(true);
      setLoadingProgress(0);
      if (bellRef.current)  gsap.set(bellRef.current,  { y: 0, rotation: 0 });
      if (ropeRef.current)  gsap.set(ropeRef.current,  { height: 0 });
    }
  }, [active]);

  const drop = 180;
const handleBellClick = () => {
  if (isTransitioning || isLoading) return;
  setIsTransitioning(true);
  setIsVideoVisible(true);

  gsap.timeline()
    .to(ropeRef.current, { 
      height: 220, 
      duration: 1.5,        // Slower rope extension
      ease: "power1.inOut"  // Smooth easing
    })
    .to(bellRef.current, { 
      y: 120, 
      duration: 2.0,        // Slower bell drop
      ease: "power1.inOut"  // Smooth easing instead of elastic
    }, "-=0.8")             // Overlap slightly
    .to(containerRef.current, {
      duration: 2.5,        // Slower scroll
      scrollTo: { y: 0 },
      ease: "power2.inOut",
      onComplete: () => {
        videoRef.current?.play().catch(() => {});
        setIsTransitioning(false);
      }
    }, "-=0.5");
};

  const handleCloseVideo = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    videoRef.current?.pause();

    gsap.to(containerRef.current, {
      duration: 2.0, scrollTo: { y: window.innerHeight }, ease: "power4.inOut",
      onComplete: () => {
        setIsVideoVisible(false);
        gsap.timeline({ onComplete: () => setIsTransitioning(false) })
          .to(bellRef.current,  { y: 0,      rotation: 0, duration: 0.8, ease: "power2.inOut" })
          .to(ropeRef.current,  { height: 0,              duration: 0.6, ease: "power2.inOut" }, "-=0.4");
      }
    });
  };

  if (!active) return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <div className="text-white/30 text-xs tracking-widest uppercase">Service</div>
    </div>
  );

  if (isLoading) return (
    <HomeLoading progress={loadingProgress} totalLetters={7} fullText="Service" />
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-auto overflow-x-hidden"
      style={{ scrollSnapType: "y mandatory" }}
    >

      {/* ── TOP: VIDEO SECTION ── */}
      <section
        className={`relative h-screen w-full flex-shrink-0 overflow-hidden bg-black ${
          isVideoVisible ? "block cursor-close" : "hidden"
        }`}
        onClick={handleCloseVideo}
        style={{ scrollSnapAlign: "start" }}
      >
        <video ref={videoRef} muted loop playsInline preload="metadata"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none">
          <source src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAre.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <div className="relative z-10 flex h-full items-center justify-center pointer-events-none">
          <h2 className="text-white text-5xl md:text-7xl font-light tracking-[0.3em] uppercase">Studio</h2>
        </div>
        <p className={`absolute bottom-8 left-0 right-0 z-20 text-center text-white/50 text-xs uppercase tracking-[0.2em] pointer-events-none transition-all duration-500 ${
          isVideoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>Click anywhere to close</p>
      </section>

      {/* ── BOTTOM: MAIN SECTION ── */}
      <section
        className="relative h-screen w-full flex-shrink-0 overflow-hidden bg-[#120d0d]"
        style={{ scrollSnapAlign: "start" }}
      >
        {/* BG video */}
        <div className="absolute inset-0">
          <video className="w-full h-full object-cover" src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAre.mp4"
            loop muted playsInline autoPlay />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* ── CONTENT (circles + text) — centred layout ── */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-7xl px-4">
          {/* Outer rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5 bg-[#2a2533]/80 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 bg-[#2a2533]/90 pointer-events-none" />
          {/* Inner image circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] overflow-hidden rounded-full bg-black/80 backdrop-blur-sm border border-white/20">
            <img src="https://cdn.cizzara.com/Cizzara-Latest/ChatGPT%20Image%20Jun%2015%2C%202026%2C%2002_23_58%20PM.png"
              alt="Studio Frame" className="w-full h-full object-cover opacity-80 mix-blend-screen" />
          </div>
          {/* Left text */}
          <div className="absolute top-1/2 left-[23%] -translate-y-1/2 text-white max-w-md drop-shadow-lg">
            <h4 className="text-sm md:text-base font-medium mb-4 tracking-wide">Creating The Next Iconic Story.</h4>
            <h1 className="text-5xl font-bold leading-tight mb-6 text-[#e9e9e9]">
              <span className="text-[#c91111]">Cizzara</span><br />Film<br />Studio.
            </h1>
            <div className="space-y-1 mt-5">
              <h2 className="text-2xl md:text-3xl font-bold text-[#c9ba33] ml-5">Cinema</h2>
              <h2 className="text-2xl md:text-3xl font-bold text-[#a3a3a3] ml-10">Beyond</h2>
              <h2 className="text-2xl md:text-3xl font-bold text-[#a3a3a3] ml-10">Expectations.</h2>
            </div>
          </div>
        </div>

    
        <div
          className="absolute z-30 flex flex-col items-center"
          style={{
            top:  "0",       /* pulley ring touches the very top edge of the section */
            left: "52%",     /* right edge of the 400px circle centered at 50%       */
          }}
        >
          {/* Pulley ring */}
          <div className="w-[28px] h-[28px] rounded-full border-[5px] border-[#5C4033] bg-[#3d2b1f] shadow-[0_4px_15px_rgba(0,0,0,0.6)] relative z-10 flex-shrink-0">
            <div className="absolute inset-0 rounded-full border-[2px] border-[#8B7355]/30" />
          </div>

          {/* Rope — GSAP animates height 0 → 220px */}
          <div
            ref={ropeRef}
            className="relative flex-shrink-0"
            style={{ height: "0px", width: "11px", overflow: "hidden" }}
          >
            <div className="absolute inset-0">
              <div className="absolute left-0    w-[3px] h-full bg-gradient-to-b from-[#b09060] via-[#6b4f32] to-[#3d2b1f] rounded-full opacity-65" />
              <div className="absolute left-1/2 -translate-x-1/2 w-[6px] h-full bg-gradient-to-b from-[#d4b880] via-[#8B7355] to-[#5C4033] rounded-full" />
              <div className="absolute right-0   w-[3px] h-full bg-gradient-to-b from-[#b09060] via-[#6b4f32] to-[#3d2b1f] rounded-full opacity-65" />
              <div className="absolute inset-0 opacity-15"
                style={{ backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 7px,#000 7px,#000 8px)" }} />
            </div>
          </div>

          <div
            ref={bellRef}
            className="cursor-pointer relative group flex-shrink-0"
            style={{ marginTop: "-3px", transformOrigin: "top center" }}
            onClick={handleBellClick}
          >
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[120%] h-auto rounded-[50%] bg-black/40 blur-md pointer-events-none" />
            <img
              src="https://cdn.cizzara.com/Cizzara-Latest/b.png"
              alt="Launch Bell"
              className="w-[400px] h-auto object-contain"
            />
            <div
              className="absolute top-[80%] left-1/2 text-center pointer-events-none"
              style={{ transform: "translate(-50%, -50%) rotate(-18deg)" }}
            >
              <span className="block text-white text-[0.65rem] font-bold tracking-[0.22em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">LAUNCH</span>
              <span className="block text-white/85 text-[0.6rem] font-bold tracking-[0.18em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">EPISODE</span>
            </div>
          </div>
        </div>

      </section>
  <style jsx global>{`
  .cursor-close {
    cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cg transform='translate(28,28)'%3E%3Cline x1='-12' y1='-12' x2='12' y2='12' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='12' y1='-12' x2='-12' y2='12' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E") 28 28, pointer !important;
  }
`}</style>
    </div>
  );
};  

export default Service;