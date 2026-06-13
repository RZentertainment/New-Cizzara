"use client"

import { useScreenSize } from "./use-screen-size"
import { PixelTrail } from "./pixel-trail"
import { GooeyFilter } from "./gooey-filter"

function GooeyDemo() {
  const screenSize = useScreenSize()

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-center gap-8 bg-black text-center text-pretty overflow-hidden">
      {/* Video background - autoplaying */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover absolute inset-0 opacity-70 z-0"
      >
        <source 
          src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAre.mp4" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>

      {/* Gooey filter */}
      <GooeyFilter id="gooey-filter-pixel-trail" strength={5} />

      {/* Pixel trail overlay with gooey filter */}
      <div
        className="absolute inset-0 z-10"
        style={{ filter: "url(#gooey-filter-pixel-trail)" }}
      >
        <PixelTrail
          pixelSize={screenSize.lessThan(`md`) ? 24 : 32}
          fadeDuration={0}
          delay={500}
          pixelClassName="bg-white"
        />
      </div>

      {/* Text overlay */}
      <p className="text-white text-5xl md:text-7xl z-20 font-calendas w-full md:w-1/2 font-bold px-4">
        Speaking things into existence
        <span className="font-overusedGrotesk"></span>
      </p>
    </div>
  )
}

export { GooeyDemo }