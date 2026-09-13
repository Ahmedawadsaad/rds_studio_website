import { useState } from "react";
import { SERVICES } from "../data";
import { useReveal } from "./useReveal";

export default function Services() {
  const ref = useReveal();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="services" ref={ref} className="py-32 px-8 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16">
        {/* Left label */}
        <div>
          <p className="reveal text-[10px] tracking-[0.5em] uppercase text-[#c9a46a] mb-4" style={{ fontFamily: "var(--font-sans)" }}>
            What We Do
          </p>
          <h2
            className="reveal text-[clamp(2rem,3.5vw,3rem)] font-light text-[#f0e8d5] leading-[1.1] sticky top-24"
            style={{ fontFamily: "var(--font-display)", animationDelay: "0.1s" }}
          >
            Services &<br />
            <em style={{ fontStyle: "italic", color: "#c9a46a" }}>Specialisms</em>
          </h2>
        </div>

        {/* Accordion */}
        <div className="reveal border-t border-[#282318]" style={{ animationDelay: "0.15s" }}>
          {SERVICES.map((svc, i) => (
            <div key={svc.title} className="border-b border-[#282318]">
              <button
                className="w-full flex items-center justify-between py-7 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="flex items-center gap-6">
                  <span
                    className="text-[10px] tracking-[0.3em] text-[#7a6e5e] w-8"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-[1.1rem] font-light transition-colors duration-200 ${open === i ? "text-[#c9a46a]" : "text-[#f0e8d5] group-hover:text-[#c9a46a]"}`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {svc.title}
                  </span>
                </div>
                <span
                  className="text-[#c9a46a]/60 text-xl transition-transform duration-300"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>

              <div
                className="overflow-hidden transition-all duration-400"
                style={{ maxHeight: open === i ? 200 : 0 }}
              >
                <p
                  className="pb-8 pl-14 text-[13px] text-[#c4b89a]/60 leading-relaxed max-w-xl"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
                >
                  {svc.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
