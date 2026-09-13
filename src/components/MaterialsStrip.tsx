import { useRef, useState } from "react";
import { MATERIALS } from "../data";
import { useReveal } from "./useReveal";

export default function MaterialsStrip() {
  const sectionRef = useReveal();
  const stripRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartX(e.pageX - (stripRef.current?.offsetLeft ?? 0));
    setScrollLeft(stripRef.current?.scrollLeft ?? 0);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !stripRef.current) return;
    const x = e.pageX - stripRef.current.offsetLeft;
    stripRef.current.scrollLeft = scrollLeft - (x - startX);
  };
  const onMouseUp = () => setDragging(false);

  return (
    <section id="materials" ref={sectionRef} className="py-32 overflow-hidden">
      {/* Label */}
      <div className="px-8 max-w-[1400px] mx-auto mb-12">
        <p className="reveal text-[10px] tracking-[0.5em] uppercase text-[#c9a46a] mb-4" style={{ fontFamily: "var(--font-sans)" }}>
          Signature Finishes
        </p>
        <h2
          className="reveal text-[clamp(1.8rem,3.5vw,3rem)] font-light text-[#f0e8d5] leading-[1.1]"
          style={{ fontFamily: "var(--font-display)", animationDelay: "0.1s" }}
        >
          Materials & Craft
        </h2>
        <p className="reveal text-[12px] text-[#7a6e5e] mt-2" style={{ animationDelay: "0.2s", fontFamily: "var(--font-sans)" }}>
          Drag to explore →
        </p>
      </div>

      {/* Horizontal strip */}
      <div
        ref={stripRef}
        className="materials-strip flex gap-4 pl-8"
        style={{ cursor: dragging ? "grabbing" : "grab", userSelect: "none" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {[...MATERIALS, ...MATERIALS].map((mat, i) => (
          <MaterialCard key={i} mat={mat} />
        ))}
        <div className="w-8 flex-shrink-0" />
      </div>
    </section>
  );
}

function MaterialCard({ mat }: { mat: (typeof MATERIALS)[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative flex-shrink-0 overflow-hidden bg-[#141210]"
      style={{ width: 240, height: 340 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="Inspect"
    >
      <img
        src={mat.image}
        alt={mat.name}
        className="w-full h-full object-cover transition-transform duration-700"
        style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
        draggable={false}
      />
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: hovered
            ? "linear-gradient(to top, rgba(12,11,9,0.88) 0%, rgba(12,11,9,0.2) 60%, transparent 100%)"
            : "linear-gradient(to top, rgba(12,11,9,0.65) 0%, transparent 70%)",
        }}
      />
      <div className="absolute bottom-0 left-0 p-5">
        <div
          className="w-8 h-px bg-[#c9a46a] mb-3 transition-all duration-500"
          style={{ transform: hovered ? "scaleX(1)" : "scaleX(0.4)", transformOrigin: "left" }}
        />
        <p
          className="text-[9px] tracking-[0.4em] uppercase text-[#c9a46a]/70 mb-1"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {mat.subtitle}
        </p>
        <p
          className="text-base font-light text-[#f0e8d5] leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {mat.name}
        </p>
      </div>
    </div>
  );
}
