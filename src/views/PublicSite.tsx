import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProjectsGrid from "../components/ProjectsGrid";
import About from "../components/About";
import Services from "../components/Services";
import Contact from "../components/Contact";
import { Link } from "react-router-dom";
import { STUDIO } from "../data";
import BrandLogo from "../components/BrandLogo";

export default function PublicSite() {
  return (
    <div className="bg-[#0c0b09]">
      <Navbar />
      <Hero />
      <ProjectsGrid />
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
          <BrandLogo compact />
          <span
            className="footer-brand-text text-[11px] tracking-[0.3em] uppercase text-[#f0e8d5]/70"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {STUDIO.name} · Cairo, Egypt
          </span>
        </div>
        <p
          className="footer-legal text-[10px] tracking-[0.15em] text-[#7a6e5e]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          © {new Date().getFullYear()} Red Door Studio. All rights reserved. &nbsp;·&nbsp;{" "}
          <Link to="/admin" className="hover:text-[#c9a46a] transition-colors">Admin</Link>
        </p>
        <div className="flex items-center gap-4">
          <a
            href={STUDIO.instagram}
            className="footer-link text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] hover:text-[#c9a46a] transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Instagram
          </a>
          <a
            href={STUDIO.facebook}
            className="footer-link text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] hover:text-[#c9a46a] transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Facebook
          </a>
          <a
            href={STUDIO.behance}
            target="_blank"
            rel="noreferrer"
            className="footer-link text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] hover:text-[#c9a46a] transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Behance
          </a>
        </div>
      </div>
    </footer>
  );
}
