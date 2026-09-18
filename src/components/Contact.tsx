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
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(193, 134, 39, 0.05) 0%, transparent 70%)",
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
              <em style={{ fontStyle: "italic", color: "#ba842d" }}>your home?</em>
            </h2>

            {/* Magnetic button */}
            <div className="reveal inline-block" style={{ animationDelay: "0.2s" }}>
              <button
                ref={btnRef}
                className="contact-cta magnetic-btn relative group border border-[#c9a46a] text-[#c9a46a] text-[11px] tracking-[0.35em] uppercase px-10 py-5 overflow-hidden"
                style={{
                  fontFamily: "var(--font-sans)",
                  transform: `translate(${btnPos.x}px, ${btnPos.y}px)`,
                }}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                onClick={() => window.open(`https://wa.me/${STUDIO.whatsapp}?text=${encodeURIComponent("Hello Red Door Studio, I would like to book a consultation.")}`, "_blank", "noopener,noreferrer")}
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
            <div className="reveal mt-12 max-w-md" style={{ animationDelay: "0.25s" }}>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#7a6e5e] mb-3" style={{ fontFamily: "var(--font-sans)" }}>
                On the Web
              </p>
              <div className="border border-[#6b6254] bg-[#171512]">
                {[
                  { name: "Facebook", href: STUDIO.facebook, icon: <FacebookIcon /> },
                  { name: "Instagram", href: STUDIO.instagram, icon: <InstagramIcon /> },
                  { name: "Behance", href: STUDIO.behance, icon: <BehanceIcon /> },
                ].map(({ name, href, icon }, index, links) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-4 px-5 py-4 text-[#fffaf0] hover:bg-[#29251e] transition-colors ${index < links.length - 1 ? "border-b border-[#6b6254]" : ""}`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center text-[#fffaf0]">{icon}</span>
                    <span className="flex-1 text-[14px]" style={{ fontFamily: "var(--font-sans)" }}>{name}</span>
                    <span className="text-xl text-[#fffaf0]" aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
              <p className="mt-10 text-[11px] tracking-[0.25em] uppercase text-[#c9a46a]" style={{ fontFamily: "var(--font-sans)" }}>
                Ahmed Younis · Architect and Designer
              </p>
              <p className="contact-intro mt-4 max-w-sm text-[16px] leading-relaxed text-[#f0e8d5]/70" style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                Architect and founder of Red Door Studio, working on interior and exterior designs.
              </p>
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

function FacebookIcon() {
  return <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path className="fill-[#171512]" d="M13.4 19v-6h2l.3-2.3h-2.3V9.2c0-.7.2-1.2 1.2-1.2h1.2V6h-1.9c-2.1 0-3.2 1.2-3.2 3.2v1.5H9v2.3h1.7v6h2.7Z" /></svg>;
}

function BehanceIcon() {
  return <span className="text-[15px] font-bold leading-none" aria-hidden="true">Bē</span>;
}

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.8" r="1" className="fill-current stroke-none" /></svg>;
}
