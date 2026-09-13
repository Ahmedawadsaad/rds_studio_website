import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState("");
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const projectCard = target.closest("[data-cursor]");
      if (projectCard) {
        setLabel((projectCard as HTMLElement).dataset.cursor || "");
        setHovering(true);
      }
    };
    const onLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor]")) {
        setHovering(false);
        setLabel("");
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);

    const animate = () => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div
          className="rounded-full bg-[#c9a46a] transition-all duration-200"
          style={{
            width: hovering ? 0 : 6,
            height: hovering ? 0 : 6,
            marginLeft: hovering ? 0 : -3,
            marginTop: hovering ? 0 : -3,
          }}
        />
      </div>

      {/* ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div
          className="flex items-center justify-center rounded-full border border-[#c9a46a] transition-all duration-300"
          style={{
            width: hovering ? 88 : 32,
            height: hovering ? 88 : 32,
            marginLeft: hovering ? -44 : -16,
            marginTop: hovering ? -44 : -16,
            background: hovering ? "rgba(201,164,106,0.12)" : "transparent",
          }}
        >
          {hovering && (
            <span
              className="text-[10px] tracking-[0.15em] uppercase text-[#c9a46a] font-medium"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {label || "View"}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
