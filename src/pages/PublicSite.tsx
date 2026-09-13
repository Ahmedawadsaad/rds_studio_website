import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProjectsGrid from "../components/ProjectsGrid";
import MaterialsStrip from "../components/MaterialsStrip";
import About from "../components/About";
import Services from "../components/Services";
import Contact from "../components/Contact";
import { Link } from "react-router-dom";
import { STUDIO } from "../data";

export default function PublicSite() {
  return (
    <div className="bg-[#0c0b09]">
      <Navbar />
      <Hero />
      <ProjectsGrid />
      <MaterialsStrip />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#282318] px-8 py-10">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
            <rect x="1" y="1" width="26" height="26" stroke="#c9a46a" strokeWidth="1.2" />
            <rect x="5" y="5" width="18" height="18" fill="#c9a46a" fillOpacity="0.12" />
            <line x1="1" y1="14" x2="27" y2="14" stroke="#c9a46a" strokeWidth="0.6" />
            <line x1="14" y1="1" x2="14" y2="27" stroke="#c9a46a" strokeWidth="0.6" />
          </svg>
          <span
            className="text-[11px] tracking-[0.3em] uppercase text-[#f0e8d5]/40"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {STUDIO.name} · Cairo, Egypt
          </span>
        </div>
        <p
          className="text-[10px] tracking-[0.15em] text-[#7a6e5e]/50"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          © {new Date().getFullYear()} Red Door Studio. All rights reserved. &nbsp;·&nbsp;{" "}
          <Link to="/admin" className="hover:text-[#c9a46a] transition-colors">Admin</Link>
        </p>
        <div className="flex items-center gap-4">
          <a
            href={STUDIO.instagram}
            className="text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] hover:text-[#c9a46a] transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Instagram
          </a>
          <a
            href={STUDIO.facebook}
            className="text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] hover:text-[#c9a46a] transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}
