"use client";

interface HomeLoadingProps {
  progress: number;
  totalLetters: number;
  fullText: string;
}

export default function HomeLoading({ progress, totalLetters, fullText }: HomeLoadingProps) {
  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center overflow-hidden">
      {/* Dotted Circle */}
      <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-dashed border-white/20 "></div>

      {/* Centered Text with Letter-by-Letter Loading */}
      <div className="z-10 select-none flex flex-col items-center">
        <h1 className="text-2xl tracking-wide font-normal flex">
          {fullText.split("").map((char, index) => (
            <span
              key={index}
              className={`transition-colors duration-300 ${
                index < progress ? "text-white" : "text-zinc-600"
              }`}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Progress bar */}
        <div className="mt-8 w-48 h-[1px] bg-zinc-800 relative overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-75"
            style={{ width: `${(progress / totalLetters) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* CSS for slow spin - note: this needs to be in a global styles file or module.css */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}