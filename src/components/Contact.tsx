import { useRef, useState } from "react";
import { STUDIO } from "../data";
import { useReveal } from "./useReveal";

export default function Contact() {
  const ref = useReveal();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
    setBtnPos({ x, y });
  };
  const onMouseLeave = () => setBtnPos({ x: 0, y: 0 });

  return (
    <section id="contact" ref={ref} className="relative py-40 px-8 overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,164,106,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1400px] mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left — CTA */}
          <div>
            <p className="reveal text-[10px] tracking-[0.5em] uppercase text-[#c9a46a] mb-6" style={{ fontFamily: "var(--font-sans)" }}>
              Begin a Project
            </p>
            <h2
              className="reveal text-[clamp(2rem,4vw,3.8rem)] font-light text-[#f0e8d5] leading-[1.05] mb-10"
              style={{ fontFamily: "var(--font-display)", animationDelay: "0.1s" }}
            >
              Ready to design
              <br />
              <em style={{ fontStyle: "italic", color: "#c9a46a" }}>your home?</em>
            </h2>

            {/* Magnetic button */}
            <div className="reveal inline-block" style={{ animationDelay: "0.2s" }}>
              <button
                ref={btnRef}
                className="magnetic-btn relative group border border-[#c9a46a] text-[#c9a46a] text-[11px] tracking-[0.35em] uppercase px-10 py-5 overflow-hidden"
                style={{
                  fontFamily: "var(--font-sans)",
                  transform: `translate(${btnPos.x}px, ${btnPos.y}px)`,
                }}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                onClick={() => window.open(`mailto:${STUDIO.email}?subject=Consultation Request`, "_blank")}
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-[#0c0b09]">
                  Book a Consultation
                </span>
                <div
                  className="absolute inset-0 bg-[#c9a46a] transition-transform duration-400 origin-bottom"
                  style={{ transform: "scaleY(0)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scaleY(1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scaleY(0)";
                  }}
                />
              </button>
            </div>

            {/* Social */}
            <div className="reveal flex items-center gap-6 mt-12" style={{ animationDelay: "0.25s" }}>
              <a
                href={STUDIO.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] hover:text-[#c9a46a] transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Instagram
              </a>
              <span className="w-4 h-px bg-[#282318]" />
              <a
                href={STUDIO.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] hover:text-[#c9a46a] transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Right — info */}
          <div className="reveal flex flex-col justify-end gap-10 lg:pt-20" style={{ animationDelay: "0.15s" }}>
            {[
              {
                label: "Email",
                value: STUDIO.email,
                href: `mailto:${STUDIO.email}`,
              },
              {
                label: "Phone",
                value: STUDIO.phone,
                href: `tel:${STUDIO.phone.replace(/\s/g, "")}`,
              },
              {
                label: "Studio Address",
                value: STUDIO.address,
                href: null,
              },
            ].map(({ label, value, href }) => (
              <div key={label} className="border-b border-[#282318] pb-6">
                <p
                  className="text-[9px] tracking-[0.4em] uppercase text-[#7a6e5e] mb-2"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    className="text-[15px] text-[#f0e8d5]/80 hover:text-[#c9a46a] transition-colors"
                    style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
                  >
                    {value}
                  </a>
                ) : (
                  <p
                    className="text-[14px] text-[#f0e8d5]/60 leading-relaxed"
                    style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
                  >
                    {value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
