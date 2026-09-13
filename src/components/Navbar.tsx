import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { STUDIO } from "../data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled || menuOpen ? "rgba(12,11,9,0.96)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(40,35,24,0.8)" : "1px solid transparent",
        backdropFilter: scrolled || menuOpen ? "blur(16px)" : "none",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between h-[68px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect
              x="1"
              y="1"
              width="26"
              height="26"
              stroke="#c9a46a"
              strokeWidth="1.2"
            />
            <rect
              x="5"
              y="5"
              width="18"
              height="18"
              fill="#c9a46a"
              fillOpacity="0.12"
            />
            <line x1="1" y1="14" x2="27" y2="14" stroke="#c9a46a" strokeWidth="0.6" />
            <line x1="14" y1="1" x2="14" y2="27" stroke="#c9a46a" strokeWidth="0.6" />
          </svg>
          <span
            className="text-[13px] tracking-[0.35em] uppercase text-[#f0e8d5]/90 transition-colors group-hover:text-[#c9a46a]"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
          >
            {STUDIO.shortName}
          </span>
        </Link>

        {/* Desktop nav */}
        {!isAdmin && (
          <div className="hidden md:flex items-center gap-8">
            {[
              ["Projects", "projects"],
              ["Materials", "materials"],
              ["About", "about"],
              ["Services", "services"],
              ["Contact", "contact"],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-[11px] tracking-[0.25em] uppercase text-[#f0e8d5]/50 hover:text-[#c9a46a] transition-colors duration-300"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-6">
          {!isAdmin && (
            <button
              onClick={() => scrollTo("contact")}
              className="hidden md:block text-[11px] tracking-[0.25em] uppercase border border-[#c9a46a]/40 text-[#c9a46a] px-5 py-2 hover:bg-[#c9a46a] hover:text-[#0c0b09] transition-all duration-300"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Book a Consultation
            </button>
          )}

          {isAdmin && (
            <Link
              to="/"
              className="text-[11px] tracking-[0.25em] uppercase text-[#7a6e5e] hover:text-[#c9a46a] transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              ← Public Site
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              className={`block w-5 h-px bg-[#f0e8d5] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-5 h-px bg-[#f0e8d5] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-px bg-[#f0e8d5] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-400 overflow-hidden ${menuOpen ? "max-h-96" : "max-h-0"}`}
        style={{ background: "rgba(12,11,9,0.98)" }}
      >
        <div className="px-8 pb-8 pt-2 flex flex-col gap-5">
          {[
            ["Projects", "projects"],
            ["Materials", "materials"],
            ["About", "about"],
            ["Services", "services"],
            ["Contact", "contact"],
          ].map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-left text-[13px] tracking-[0.2em] uppercase text-[#f0e8d5]/60 hover:text-[#c9a46a] transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
