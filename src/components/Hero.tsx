import { useEffect, useRef, useState } from "react";
import { STUDIO } from "../data";
import { getSiteSettings } from "../lib/api";

/* Contemporary villa elevation paths — each draws in sequence */
const VILLA_PATHS: { d: string; delay: number }[] = [
  // Ground line
  { d: "M 0 445 L 900 445", delay: 0.0 },
  // Foundation slab
  { d: "M 60 445 L 60 430 L 840 430 L 840 445", delay: 0.1 },
  // Main body perimeter
  { d: "M 60 430 L 60 270 L 840 270 L 840 430", delay: 0.2 },
  // Roof slab (canopy overhang)
  { d: "M 28 270 L 872 270", delay: 0.38 },
  // Second canopy shadow line
  { d: "M 28 262 L 872 262", delay: 0.42 },
  // Upper tower / setback left wall
  { d: "M 175 270 L 175 148 L 592 148 L 592 270", delay: 0.52 },
  // Upper tower roof
  { d: "M 148 148 L 620 148", delay: 0.68 },
  // Upper tower roof shadow
  { d: "M 148 140 L 620 140", delay: 0.72 },
  // Large left window
  { d: "M 82 285 L 82 415 L 162 415 L 162 285 Z", delay: 0.8 },
  // Second window
  { d: "M 182 285 L 182 415 L 265 415 L 265 285 Z", delay: 0.88 },
  // Narrow vertical window (accent)
  { d: "M 285 285 L 285 375 L 318 375 L 318 285 Z", delay: 0.95 },
  // Door frame
  { d: "M 406 430 L 406 338 L 494 338 L 494 430", delay: 1.02 },
  // Door threshold
  { d: "M 395 338 L 505 338", delay: 1.1 },
  // Right windows
  { d: "M 562 285 L 562 390 L 648 390 L 648 285 Z", delay: 1.15 },
  { d: "M 668 285 L 668 390 L 755 285 Z", delay: 1.22 },
  { d: "M 755 285 L 755 390 L 828 390 L 828 285 Z", delay: 1.28 },
  // Upper floor windows
  { d: "M 210 162 L 210 252 L 328 252 L 328 162 Z", delay: 1.35 },
  { d: "M 355 162 L 355 252 L 465 252 L 465 162 Z", delay: 1.42 },
  // Upper vertical accent
  { d: "M 488 162 L 488 252 L 510 252 L 510 162 Z", delay: 1.48 },
  // Left side detail lines
  { d: "M 28 355 L 60 355", delay: 1.55 },
  { d: "M 28 385 L 60 385", delay: 1.58 },
  // Right side detail
  { d: "M 840 355 L 872 355", delay: 1.55 },
  { d: "M 840 385 L 872 385", delay: 1.58 },
  // Steps
  { d: "M 372 430 L 372 448 L 528 448 L 528 430", delay: 1.62 },
  { d: "M 388 448 L 388 462 L 512 462 L 512 448", delay: 1.68 },
  // Left terrace line
  { d: "M 0 462 L 60 462", delay: 1.72 },
  // Right terrace
  { d: "M 840 462 L 900 462", delay: 1.72 },
  // Structural column left
  { d: "M 138 270 L 138 430", delay: 1.76 },
  // Structural column right
  { d: "M 762 270 L 762 430", delay: 1.76 },
];

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&h=1400&fit=crop&auto=format");

  useEffect(() => {
    const t = setTimeout(() => setDrawing(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    getSiteSettings().then((settings) => setHeroImage(settings.heroImage)).catch(() => undefined);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const h = sectionRef.current.offsetHeight;
      const vh = window.innerHeight;
      const scrolled = -rect.top;
      const max = h - vh;
      setProgress(Math.max(0, Math.min(1, scrolled / max)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const photoOpacity = Math.min(1, Math.max(0, (progress - 0.08) / 0.5));
  const svgOpacity = Math.max(0, 1 - progress / 0.45);
  const headlineOpacity = Math.max(0, 1 - progress / 0.28);
  const headlineY = progress * -70;
  const photoScale = 1 + Math.max(0, progress - 0.1) * 0.18;
  const scrollIndicatorOpacity = Math.max(0, 1 - progress * 6);

  return (
    <div ref={sectionRef} style={{ height: "320vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#0c0b09]">

        {/* Photo layer — fades in as you scroll */}
        <div
          className="absolute inset-0 transition-none"
          style={{ opacity: photoOpacity }}
        >
          <img
            src={heroImage}
            alt="Red Door Studio villa"
            className="w-full h-full object-cover"
            style={{ transform: `scale(${photoScale})`, transformOrigin: "center center" }}
          />
          {/* Darkening overlay — lightens as photo appears for drama */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(12,11,9,${0.65 - photoOpacity * 0.25}) 0%, rgba(12,11,9,${0.4 - photoOpacity * 0.15}) 60%, rgba(12,11,9,0.7) 100%)`,
            }}
          />
          {/* Warm gold tint that fades as photo solidifies */}
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background: "rgba(201,164,106,0.15)",
              opacity: Math.max(0, 1 - photoOpacity * 2),
            }}
          />
        </div>

        {/* SVG villa line art */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: svgOpacity }}
        >
          {/* Subtle grid background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(201,164,106,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,164,106,0.04) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <svg
            viewBox="0 0 900 480"
            className="w-full max-w-[820px] px-6 md:px-12"
            fill="none"
            stroke="#c9a46a"
            strokeWidth="1.2"
            strokeLinecap="square"
          >
            {drawing &&
              VILLA_PATHS.map((p, i) => (
                <path
                  key={i}
                  d={p.d}
                  pathLength="1"
                  className="villa-path"
                  style={{ animationDelay: `${p.delay}s` }}
                />
              ))}

            {/* Compass rose — decorative bottom-right */}
            {drawing && (
              <g opacity="0.5" style={{ animation: "draw-path 1s ease 2.2s forwards", strokeDasharray: 1, strokeDashoffset: 1 }}>
                <line x1="858" y1="420" x2="858" y2="400" stroke="#c9a46a" strokeWidth="0.8" pathLength="1" className="villa-path" style={{ animationDelay: "1.9s" }} />
                <line x1="848" y1="410" x2="868" y2="410" stroke="#c9a46a" strokeWidth="0.8" pathLength="1" className="villa-path" style={{ animationDelay: "1.95s" }} />
                <circle cx="858" cy="410" r="8" stroke="#c9a46a" strokeWidth="0.6" pathLength="1" className="villa-path" style={{ animationDelay: "2.0s" }} />
              </g>
            )}

            {/* Scale bar */}
            {drawing && (
              <>
                <line x1="40" y1="478" x2="140" y2="478" stroke="#c9a46a" strokeWidth="0.6" pathLength="1" className="villa-path" style={{ animationDelay: "2.0s" }} />
                <line x1="40" y1="474" x2="40" y2="478" stroke="#c9a46a" strokeWidth="0.6" pathLength="1" className="villa-path" style={{ animationDelay: "2.05s" }} />
                <line x1="90" y1="474" x2="90" y2="478" stroke="#c9a46a" strokeWidth="0.6" pathLength="1" className="villa-path" style={{ animationDelay: "2.1s" }} />
                <line x1="140" y1="474" x2="140" y2="478" stroke="#c9a46a" strokeWidth="0.6" pathLength="1" className="villa-path" style={{ animationDelay: "2.15s" }} />
              </>
            )}
          </svg>

        </div>

        {/* Headline */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-24 text-center px-8 pointer-events-none"
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
          }}
        >
          <p
            className="text-[10px] tracking-[0.55em] uppercase text-[#c9a46a] mb-6"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Red Door Studio — Cairo
          </p>
          <h1
            className="text-[clamp(2.4rem,6vw,5.5rem)] leading-[1.05] font-light text-[#f0e8d5] max-w-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            We Design Homes{" "}
            <em className="italic text-[#c9a46a] not-italic" style={{ fontStyle: "italic" }}>
              From
            </em>{" "}
            the Ground Up
          </h1>
          <p
            className="mt-6 text-[13px] text-[#f0e8d5]/45 max-w-sm leading-relaxed"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            Full-service architecture & interior design for the complete villa —
            from structural drawings to the last drawer pull.
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <span
            className="text-[9px] tracking-[0.5em] uppercase text-[#f0e8d5]/30"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Scroll
          </span>
          <div className="w-px h-10 bg-[#c9a46a]/20 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full bg-[#c9a46a]"
              style={{
                height: "40%",
                animation: "scroll-line 1.8s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-line {
          0%   { top: -40%; }
          100% { top: 140%; }
        }
      `}</style>
    </div>
  );
}
