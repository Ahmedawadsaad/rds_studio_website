import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReveal } from "../components/useReveal";
import { getProjects, type Project } from "../lib/api";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [floorTab, setFloorTab] = useState(0);
  const [entered, setEntered] = useState(false);
  const revealRef = useReveal();

  useEffect(() => {
    const loadProject = async () => {
      const allProjects = await getProjects();
      setProject(allProjects.find((p) => p.id === id) || null);
    };

    loadProject();
    window.scrollTo(0, 0);
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0b09]">
        <p className="text-[#7a6e5e]" style={{ fontFamily: "var(--font-sans)" }}>
          Project not found.{" "}
          <button onClick={() => navigate("/")} className="text-[#c9a46a] underline">
            Go back
          </button>
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#0c0b09]"
      style={{ opacity: entered ? 1 : 0, transition: "opacity 0.6s ease" }}
    >
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center gap-4 px-8 h-[68px] bg-[#0c0b09]/90 backdrop-blur-md border-b border-[#282318]">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-[#7a6e5e] hover:text-[#c9a46a] transition-colors"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <span className="text-base">←</span>
          Back to Projects
        </button>
        <span className="text-[#282318] mx-2">|</span>
        <span
          className="text-[11px] tracking-[0.2em] uppercase text-[#f0e8d5]/40"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {project.name}
        </span>
      </div>

      <div className="relative h-[70vh] overflow-hidden bg-[#141210] pt-[68px]">
        <img
          src={project.heroImage}
          alt={project.name}
          className="w-full h-full object-cover"
          style={{ transform: "scale(1.04)", transformOrigin: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-transparent to-[#0c0b09]/30" />
        <div className="absolute bottom-12 left-8 md:left-16">
          <p
            className="text-[10px] tracking-[0.5em] uppercase text-[#c9a46a] mb-3"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {project.category} · {project.year} · {project.area}
          </p>
          <h1
            className="text-[clamp(2rem,5vw,4rem)] font-light text-[#f0e8d5] leading-[1.05]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.name}
          </h1>
          <p
            className="text-[13px] text-[#f0e8d5]/50 mt-2"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            {project.location}
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 py-20" ref={revealRef}>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16">
          <p
            className="reveal text-[1.05rem] text-[#c4b89a]/70 leading-[1.8] font-light"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {project.description}
          </p>
          <div className="reveal flex flex-col gap-4" style={{ animationDelay: "0.1s" }}>
            {[
              ["Project", project.name],
              ["Location", project.location],
              ["Year", String(project.year)],
              ["Area", project.area],
              ["Type", project.category],
              ["Studio", "Red Door Studio"],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between border-b border-[#282318] pb-3">
                <span
                  className="text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {k}
                </span>
                <span
                  className="text-[12px] text-[#f0e8d5]/60"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {project.floorPlans.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-8 pb-24">
          <p
            className="text-[10px] tracking-[0.5em] uppercase text-[#c9a46a] mb-8"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Floor Plans
          </p>

          <div className="flex gap-0 border-b border-[#282318] mb-10">
            {project.floorPlans.map((fp, i) => (
              <button
                key={fp.label}
                onClick={() => setFloorTab(i)}
                className={`px-6 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors ${
                  floorTab === i
                    ? "text-[#c9a46a] border-b-2 border-[#c9a46a]"
                    : "text-[#7a6e5e] hover:text-[#f0e8d5]"
                }`}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {fp.label}
              </button>
            ))}
          </div>

          <div className="relative aspect-[16/9] bg-[#141210] overflow-hidden border border-[#282318]">
            <img
              src={project.floorPlans[floorTab].image}
              alt={project.floorPlans[floorTab].label}
              className="w-full h-full object-cover transition-opacity duration-300"
              style={{ filter: "brightness(0.85) contrast(1.1)" }}
            />
            <div className="absolute top-4 left-4">
              <span
                className="text-[9px] tracking-[0.4em] uppercase text-[#c9a46a]/50 bg-[#0c0b09]/80 px-3 py-1.5"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {project.floorPlans[floorTab].label} — Red Door Studio
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-8 pb-32">
        <p
          className="text-[10px] tracking-[0.5em] uppercase text-[#c9a46a] mb-12"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Room by Room
        </p>

        {project.rooms.map((room, ri) => (
          <RoomSection key={room.name} room={room} index={ri} />
        ))}
      </div>
    </div>
  );
}

function RoomSection({ room, index }: { room: { name: string; images: string[]; materials?: string[] }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mb-24"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`,
      }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-6 h-px bg-[#c9a46a]" />
        <p
          className="text-[10px] tracking-[0.5em] uppercase text-[#c9a46a]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {room.name}
        </p>
      </div>

      <div className={`grid gap-4 ${room.images.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
        {room.images.map((img, i) => (
          <div key={i} className="relative overflow-hidden bg-[#141210] aspect-[4/3]">
            <img src={img} alt={`${room.name} ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {room.materials && room.materials.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-5">
          {room.materials.map((m) => (
            <span
              key={m}
              className="text-[10px] tracking-[0.2em] uppercase border border-[#282318] text-[#7a6e5e] px-4 py-2"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

