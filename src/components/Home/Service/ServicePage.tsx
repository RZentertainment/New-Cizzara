"use client";

import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { ServiceData } from "@/types/service";
import Link from "next/link";


interface ServicePageProps {
  service: ServiceData;
  onClose: () => void;
  /** Bumped by the overlay once the slide-down finishes, to kick off content reveal */
  playKey: number;
}

const ServicePage: React.FC<ServicePageProps> = ({ service, onClose, playKey }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const categoriesWrapRef = useRef<HTMLDivElement>(null);
  const galleryWrapRef = useRef<HTMLDivElement>(null);

  const ctxRef = useRef<gsap.Context | null>(null);

  // ── Lightbox: click a gallery thumbnail to view it full size ───────────
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const openLightbox = useCallback((src: string) => {
    setLightboxSrc(src);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxSrc(null);
  }, []);

  // Close on Escape while the lightbox is open
  useEffect(() => {
    if (!lightboxSrc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxSrc, closeLightbox]);

  useLayoutEffect(() => {
    if (!rootRef.current || playKey === 0) return;

    ctxRef.current?.revert();

    ctxRef.current = gsap.context(() => {
      // Split title into characters
      if (titleRef.current) {
        const text = titleRef.current.textContent || "";
        titleRef.current.innerHTML = text
          .split("")
          .map((ch) =>
            ch === " "
              ? `<span class="inline-block">&nbsp;</span>`
              : `<span class="inline-block opacity-0" style="transform:translateY(40px)">${ch}</span>`
          )
          .join("");
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Hero image — clip-path reveal + scale
      if (heroImgRef.current) {
        tl.fromTo(
          heroImgRef.current,
          { clipPath: "inset(0% 0% 100% 0%)", opacity: 0, scale: 1.15 },
          { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, scale: 1, duration: 1.1, ease: "power4.out" },
          0
        );
      }

      // Title chars
      if (titleRef.current) {
        tl.to(
          titleRef.current.querySelectorAll("span"),
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.025, ease: "power3.out" },
          0.3
        );
      }

      // Subtitle / description fade up
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.55
        );
      }
      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.65
        );
      }

      // CTA
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
          0.8
        );
      }

      // Categories — one after another (only the original set carries the
      // data-category-chip marker; the duplicated marquee-loop copies are
      // left untouched so this selector doesn't double-animate them)
      if (categoriesWrapRef.current) {
        const chips = categoriesWrapRef.current.querySelectorAll("[data-category-chip]");
        tl.fromTo(
          chips,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
          0.9
        );
      }

      // Gallery — staggered opacity/scale (same original-only targeting)
      if (galleryWrapRef.current) {
        const imgs = galleryWrapRef.current.querySelectorAll("[data-gallery-item]");
        tl.fromTo(
          imgs,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
          1.1
        );
      }
    }, rootRef);

    return () => ctxRef.current?.revert();
  }, [playKey, service]);

  return (
    <div
      ref={rootRef}
      className="w-full h-full overflow-y-auto overflow-x-hidden bg-[#000000] text-white font-sans antialiased selection:bg-[#a31621] selection:text-white"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close service page"
        className="fixed top-5 right-5 sm:top-8 sm:right-8 z-[60] w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#C8A96A]/50 bg-black/40 backdrop-blur-sm flex items-center justify-center text-[#E8D5A3] hover:bg-[#C8A96A]/15 hover:border-[#C8A96A] transition-colors"
      >
        <span className="text-xl leading-none">&times;</span>
      </button>

      {/* Hero */}
      <section className="pt-6 sm:pt-8 md:pt-10 pb-6 sm:pb-8 md:pb-10">
        <div className="px-4 sm:px-6 md:px-12 lg:px-16 max-w-[1400px] mt-2">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 xl:gap-16">
            <div className="flex-1">
              <div
                ref={heroImgRef}
                className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] bg-black p-[1px] sm:p-[2px]"
                style={{ willChange: "transform, opacity, clip-path" }}
              >
                <img
                  src={service.heroImage}
                  alt={service.title}
                  className="w-full h-full object-cover rounded-xs"
                  loading="eager"
                />
              </div>
            </div>

            <div className="flex-1 lg:max-w-[45%] flex flex-col pt-0 sm:pt-1">
              <h1
                ref={titleRef}
                className="text-[28px] sm:text-[30px] md:text-[30px] lg:text-[40px] font-bold leading-[0.9] mb-4 sm:mb-5 md:mb-6 text-white uppercase"
              >
                {service.title}
              </h1>
              <p
                ref={subtitleRef}
                className="text-[16px] sm:text-[18px] md:text-[20px] text-gray-200 mb-4 sm:mb-5 md:mb-6 leading-tight font-light"
              >
                {service.subtitle}
              </p>
              <p
                ref={descRef}
                className="text-[13px] sm:text-[14px] text-gray-400 mb-6 md:mb-8 leading-relaxed font-light"
              >
                {service.description}
              </p>

              <div ref={ctaRef}>
                <p className="text-[14px] sm:text-[15px] text-gray-300 font-light mb-3 sm:mb-4">
                  Interested in{" "}
                  <span className="text-white font-medium uppercase">{service.title}?</span>
                </p>
                  <Link
                    href="https://docs.google.com/forms/d/e/1FAIpQLSc-ZnrC6ZnNE-ZjijZ4EQVcu5AFt9vtprAGZyLZrdpAaMnf4w/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="px-6 py-3 border border-[#C8A96A] text-[#E8D5A3] uppercase text-xs tracking-widest hover:bg-[#C8A96A]/10 transition-colors">
                      Book Now
                    </button>
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories — infinite left-to-right auto-scroll marquee */}
      <div ref={categoriesWrapRef} className="relative bg-[#0a0a0a] overflow-hidden">
        <div className="marquee-track marquee-categories flex w-max gap-2 py-4 px-4 sm:px-6 md:px-12">
          {[...service.categories, ...service.categories].map((cat, i) => (
            <span
              key={i}
              data-category-chip={i < service.categories.length ? "" : undefined}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-[13px] tracking-wide text-[#d4c5a9] border border-[#b8860b]/60 -skew-x-12 shrink-0"
            >
              <span className="inline-block skew-x-12">{cat}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Gallery — infinite left-to-right auto-scroll marquee */}
      <div ref={galleryWrapRef} className="w-full bg-[#0a0a0a] pt-4 sm:pt-6 pb-12 sm:pb-16 overflow-hidden">
        <div className="marquee-track marquee-gallery flex w-max gap-2 sm:gap-3 px-4 sm:px-6 md:px-12">
          {[...service.galleryImages, ...service.galleryImages].map((src, i) => (
            <div
              key={i}
              data-gallery-item={i < service.galleryImages.length ? "" : undefined}
              onClick={() => openLightbox(src)}
              className="w-[180px] h-[110px] sm:w-[220px] sm:h-[135px] md:w-[250px] md:h-[150px] lg:w-[270px] lg:h-[160px] overflow-hidden bg-black shrink-0 cursor-pointer"
            >
              <img
                src={src}
                alt={`${service.title} shot ${(i % service.galleryImages.length) + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox — full-size image viewer, opened by clicking a gallery thumbnail */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label="Close image"
            className="absolute top-5 right-5 sm:top-8 sm:right-8 z-[101] w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#C8A96A]/50 bg-black/40 backdrop-blur-sm flex items-center justify-center text-[#E8D5A3] hover:bg-[#C8A96A]/15 hover:border-[#C8A96A] transition-colors"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
          <img
            src={lightboxSrc}
            alt={`${service.title} full size`}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      <style jsx>{`
        /* Content is duplicated once in JSX above, so translating exactly
           50% of the track's own width moves through one full
           original-length set before looping — the loop point is
           therefore seamless in both directions. */
        @keyframes marquee-left-to-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        @keyframes marquee-right-to-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-track {
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        /* Categories scroll left → right */
        .marquee-categories {
          animation-name: marquee-left-to-right;
          animation-duration: 40s;
        }

        /* Gallery scrolls the opposite way: right → left */
        .marquee-gallery {
          animation-name: marquee-right-to-left;
          animation-duration: 40s;
        }
      `}</style>
    </div>
  );
};

export default ServicePage;