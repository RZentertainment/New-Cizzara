import Image from 'next/image';
import React, { useState, useRef } from "react";

const ShowCase = () => {

    const [showVideo, setShowVideo] = useState(false);
const hoverTimer = useRef<NodeJS.Timeout | null>(null);

const handleMouseEnter = () => {
  hoverTimer.current = setTimeout(() => {
    setShowVideo(true);
  }, 3000);
};

const handleMouseLeave = () => {
  if (hoverTimer.current) clearTimeout(hoverTimer.current);
  setShowVideo(false);
};
  return (
    <section className="w-full h-screen overflow-hidden bg-white">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-0">
        
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src="https://cdn.cizzara.com/Cizzara-Latest/photo1.jpg"
            alt="Man sitting in grass"
            fill
            className="object-cover object-top"
            priority
          />
        </div>

     <div
  className="relative w-full h-full overflow-hidden"
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
  {!showVideo ? (
    <Image
      src="https://cdn.cizzara.com/Cizzara-Latest/video1.jpg"
      alt="Tea table with book and cup"
      fill
      priority
      className="object-cover object-top transition-opacity duration-500"
    />
  ) : (
    <video
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source
        src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAreVid1.mp4"
        type="video/mp4"
      />
    </video>
  )}
</div>

        <div className="relative w-full h-full overflow-hidden bg-[#e8e5e0]">
          <Image
            src="https://cdn.cizzara.com/Cizzara-Latest/video2.jpg"
            alt="Coat rack"
            fill
            className="object-cover object-top"
          />
        </div>

        <div className="w-full h-full flex bg-[#f8f7f3]">
          
          <div className="w-1/2 flex flex-col">
            
        <div className="h-1/2 relative group overflow-hidden bg-[#f8f7f3]">

  {/* Sliding Black Layer */}
  <div className="absolute inset-0 z-10 overflow-hidden">
    <div className="absolute top-0 -left-[120%] h-full w-[120%] skew-x-[-25deg] bg-black transition-all duration-1000 ease-out group-hover:left-[-10%]" />
  </div>

  {/* Default Content */}
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12 transition-opacity duration-500 group-hover:opacity-0 z-20">
    <p className="text-[11px] uppercase tracking-[0.45em] leading-[2] text-[#666666] font-light">
      TO CAPTURE THE BEAUTY
      <br />
      OF A POETIC FEELING,
      <br />
      TO CREATE A MEMORABLE MESSAGE,
      <br />
      WE WORK WITH CAMILLE MAROTTE
    </p>

    <div className="w-10 h-px bg-[#cfcfcf] my-8" />

    <h2 className="text-[34px] tracking-[0.35em] uppercase font-light text-[#1f1f1f]">
      RALPH LAUREN
    </h2>
  </div>

  {/* Hover Content */}
  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-white opacity-0 transition-all duration-700 delay-300 group-hover:opacity-100">
    <h3
      className="text-5xl italic font-semibold mb-4 translate-y-6 transition-all duration-700 group-hover:translate-y-0"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      Launch
    </h3>

    <p
      className="text-xl italic translate-y-6 transition-all duration-700 delay-100 group-hover:translate-y-0"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      Ralph Lauren, forget me not
    </p>
  </div>

</div>

            {/* BOTTOM IMAGE */}
            <div className="h-1/2 relative">
              <Image
                src="https://cdn.cizzara.com/Cizzara-Latest/photo2.jpg"
                alt="Editorial Detail"
                fill
                sizes="50vw"
                className="object-cover object-top"
                priority
              />
            </div>

          </div>

          {/* RIGHT SIDE of bottom right */}
          <div className="w-1/2 h-full relative">
            <Image
              src="https://cdn.cizzara.com/Cizzara-Latest/photo3.jpg"
              alt="Coat Stand"
              fill
              sizes="50vw"
              className="object-cover object-top"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default ShowCase;