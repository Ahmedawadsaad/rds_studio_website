import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { STUDIO } from "../data";
import BrandLogo from "./BrandLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("rds-theme") || "dark");
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

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("rds-theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${theme === "light" ? "theme-light-navbar" : ""}`}
      style={{
        background: theme === "light" ? "#d2c6b5" : (scrolled || menuOpen ? "rgba(12,11,9,0.96)" : "transparent"),
        borderBottom: theme === "light" || scrolled ? "1px solid rgba(92,79,63,0.35)" : "1px solid transparent",
        backdropFilter: theme === "light" || scrolled || menuOpen ? "blur(16px)" : "none",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between h-[68px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <BrandLogo compact light={theme === "light"} />
        </Link>

        {/* Desktop nav */}
        {!isAdmin && (
          <div className="hidden md:flex items-center gap-8">
            {[
              ["Projects", "projects"],
              ["About", "about"],
              ["Services", "services"],
              ["Contact", "contact"],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="nav-link text-[11px] tracking-[0.25em] uppercase text-[#f0e8d5]/70 hover:text-[#c9a46a] transition-colors duration-300"
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
              onClick={() => window.open(`https://wa.me/${STUDIO.whatsapp}?text=${encodeURIComponent("Hello Red Door Studio, I would like to book a consultation.")}`, "_blank", "noopener,noreferrer")}
              className="nav-consultation hidden md:block text-[11px] tracking-[0.25em] uppercase border border-[#c9a46a]/40 text-[#c9a46a] px-5 py-2 hover:bg-[#c9a46a] hover:text-[#0c0b09] transition-all duration-300"
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

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c9a46a]/50 text-[#c9a46a] transition-colors hover:bg-[#c9a46a] hover:text-[#0c0b09]"
          >
            {theme === "dark" ? "☼" : "◐"}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              className={`block w-5 h-px ${theme === "light" ? "bg-[#242321]" : "bg-[#f0e8d5]"} transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-5 h-px ${theme === "light" ? "bg-[#242321]" : "bg-[#f0e8d5]"} transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-px ${theme === "light" ? "bg-[#242321]" : "bg-[#f0e8d5]"} transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
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
            ["About", "about"],
            ["Services", "services"],
            ["Contact", "contact"],
          ].map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="nav-link text-left text-[13px] tracking-[0.2em] uppercase text-[#f0e8d5]/70 hover:text-[#c9a46a] transition-colors"
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
