"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TYPEWRITER_PHRASES = [
  "Cinematic Stories.",
  "Bold Visuals.",
  "Your Vision, Realized.",
];

const Contact = () => {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];
    const typingSpeed = isDeleting ? 40 : 80;
    const pauseAtEnd = 1400;
    const pauseAtStart = 400;

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), pauseAtEnd);
    } else if (isDeleting && displayText === "") {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
      }, pauseAtStart);
    } else {
      timeout = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? currentPhrase.slice(0, prev.length - 1)
            : currentPhrase.slice(0, prev.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <section
      id="contact"
      className="relative h-screen w-full flex-shrink-0 overflow-hidden bg-black"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src="https://cdn.cizzara.com/Cizzara-Latest/WhoWeAreVid1.mp4"
          type="video/mp4"
        />
        {/* Fallback for browsers that don't support video */}
        Your browser does not support the video tag.
      </video>

      {/* Video Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Glow Effects */}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-red-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-[380px] w-[380px] rounded-full bg-red-600/10 blur-[120px]" />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-7xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col justify-center space-y-8"
          >
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Get in Touch
              </h2>

              <div className="mt-3 h-6 font-mono text-sm text-red-500 sm:text-base">
                {displayText}
                <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-red-500 align-middle" />
              </div>

              <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-gray-400 sm:text-base">
                Have a project in mind? We&apos;d love to hear about it.
                Reach out to us and let&apos;s bring your vision to life.
              </p>
            </div>

            <div>
              <h3 className="font-mono text-sm uppercase tracking-widest text-gray-500">
                Follow
              </h3>
              <motion.div
                className="mt-4 flex gap-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.4 }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
              >
                <SocialLink
                  href="https://www.instagram.com/cizzarastudios"
                  label="Instagram"
                  icon="instagram"
                />
                <SocialLink
                  href="https://www.facebook.com/cizzarafilmstudio"
                  label="Facebook"
                  icon="facebook"
                />
                <SocialLink
                  href="https://www.youtube.com/@cizzarastudios"
                  label="YouTube"
                  icon="youtube"
                />
                <SocialLink
                  href="https://www.linkedin.com/company/cizzara-studios"
                  label="LinkedIn"
                  icon="linkedin"
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col justify-center rounded-xl border border-white/10 bg-[#111111]/80 backdrop-blur-sm p-8"
          >
            <h3 className="text-2xl font-bold text-white">Quick Contact</h3>

            <div className="mt-6 space-y-4 font-mono text-sm text-gray-300 sm:text-[15px]">
              <div className="flex items-start gap-3">
                <span className="flex h-4 w-5 shrink-0 items-center justify-center">
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </span>
                <div className="leading-relaxed">
                  <a
                    href="tel:+918155996855"
                    className="underline decoration-gray-600 underline-offset-4 hover:text-white hover:decoration-white transition-colors"
                  >
                    +91 8155996855
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-4 w-5 shrink-0 items-center justify-center">
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <div className="leading-relaxed">
                  <a
                    href="mailto:contact@cizzara.com"
                    className="hover:text-white transition-colors"
                  >
                    contact@cizzara.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-4 w-5 shrink-0 items-center justify-center">
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
                <div className="leading-relaxed">
                  <a
                    href="https://www.google.com/maps?cid=10398080447395302326"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    84CG+859 ITI, New Alkapuri, Laxmipura, Gotri, Vadodara,
                    Gujarat 391101
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-4 w-5 shrink-0 items-center justify-center">
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
                <div className="leading-relaxed">
                  <span>
                    Mon - Sat: 9:00 AM - 7:00 PM{" "}
                    <span className="text-gray-500">Sunday: Closed</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6">
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              </span>
              <p className="font-mono text-xs text-gray-500 sm:text-sm">
                Our team is here to assist you with any questions or
                inquiries.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

type SocialIconKey = "facebook" | "instagram" | "linkedin" | "youtube";

const SocialLink = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: SocialIconKey;
}) => {
  return (
    <motion.a
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-gray-400 hover:border-red-500 hover:text-white hover:bg-red-500/10 transition-colors duration-200"
      aria-label={label}
    >
      {icon === "facebook" && (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )}
      {icon === "instagram" && (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      )}
      {icon === "linkedin" && (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )}
      {icon === "youtube" && (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )}
    </motion.a>
  );
};

export default Contact;