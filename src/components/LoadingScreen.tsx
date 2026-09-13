import { useEffect, useState } from "react";

interface Props {
  onDone: () => void;
}

export default function LoadingScreen({ onDone }: Props) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 2600);
    const t2 = setTimeout(() => onDone(), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0c0b09] ${exiting ? "loading-screen-exit" : ""}`}
    >
      {/* RDS monogram SVG */}
      <svg
        viewBox="0 0 200 120"
        width="200"
        height="120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* R */}
        <path
          d="M 20 95 L 20 25 L 55 25 Q 78 25 78 50 Q 78 65 62 70 L 80 95"
          stroke="#c9a46a"
          strokeWidth="2"
          strokeLinecap="square"
          pathLength="1"
          className="monogram-path"
          style={{ animationDelay: "0s", animationDuration: "0.9s" }}
        />
        <line x1="20" y1="60" x2="65" y2="60"
          stroke="#c9a46a" strokeWidth="2"
          pathLength="1"
          className="monogram-path"
          style={{ animationDelay: "0.2s", animationDuration: "0.6s" }}
        />

        {/* D */}
        <path
          d="M 95 25 L 95 95 L 120 95 Q 155 95 155 60 Q 155 25 120 25 Z"
          stroke="#c9a46a"
          strokeWidth="2"
          strokeLinecap="square"
          pathLength="1"
          className="monogram-path"
          style={{ animationDelay: "0.5s", animationDuration: "1s" }}
        />

        {/* S */}
        <path
          d="M 178 35 Q 162 25 148 35 Q 134 48 155 60 Q 175 72 162 85 Q 148 95 132 88"
          stroke="#c9a46a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          className="monogram-path"
          style={{ animationDelay: "1s", animationDuration: "1s" }}
        />
      </svg>

      {/* Studio name */}
      <p
        className="mt-6 text-[11px] tracking-[0.5em] uppercase text-[#c9a46a]/60"
        style={{
          fontFamily: "var(--font-sans)",
          opacity: 0,
          animation: "fade-in-fill 0.6s ease 1.8s forwards",
        }}
      >
        Red Door Studio
      </p>

      {/* Thin gold line progress */}
      <div className="absolute bottom-0 left-0 h-px bg-[#c9a46a]/20 w-full">
        <div
          className="h-full bg-[#c9a46a]"
          style={{
            width: "0%",
            animation: "grow-line 2.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards",
          }}
        />
      </div>

      <style>{`
        @keyframes fade-in-fill {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes grow-line {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
