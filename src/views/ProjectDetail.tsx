import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReveal } from "../components/useReveal";
import { getProject, type Project } from "../lib/api";
import { PROJECTS } from "../data";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const localProject = id ? PROJECTS.find((item) => item.id === id) || null : null;
  const [project, setProject] = useState<Project | null>(localProject);
  const [loading, setLoading] = useState(!localProject);
  const [floorTab, setFloorTab] = useState(0);
  const [roomFilter, setRoomFilter] = useState<RoomFilter>("all");
  const [entered, setEntered] = useState(false);
  const revealRef = useReveal();

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const cachedProject = PROJECTS.find((item) => item.id === id) || null;
      setProject(cachedProject);
      setLoading(!cachedProject);
      try {
        setProject(await getProject(id));
      } catch {
        if (!cachedProject) setProject(null);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
    window.scrollTo(0, 0);
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0b09]">
        <p className="text-[#7a6e5e]" style={{ fontFamily: "var(--font-sans)" }}>
          Loading project...
        </p>
      </div>
    );
  }

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
          className="detail-header-title text-[11px] tracking-[0.2em] uppercase text-[#f0e8d5]/70"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {project.name}
        </span>
      </div>

      <div className="relative h-[50vh] min-h-[360px] overflow-hidden bg-[#141210] pt-[68px]">
        <img
          src={project.heroImage}
          alt={project.name}
          className="w-full h-full object-cover"
          style={{ transform: "scale(1.04)", transformOrigin: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-transparent to-[#0c0b09]/30" />
        <div className="absolute bottom-8 left-8 md:left-16">
          <p
            className="detail-hero-meta text-[10px] tracking-[0.5em] uppercase text-[#c9a46a] mb-3"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {project.category} · {project.year} · {project.area}
          </p>
          <h1
            className="detail-hero-title text-[clamp(2rem,5vw,4rem)] font-light text-[#f0e8d5] leading-[1.05]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.name}
          </h1>
          <p
            className="detail-hero-location text-[13px] text-[#f0e8d5]/75 mt-2"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            {project.location}
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 py-6" ref={revealRef}>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10">
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

      <div className="max-w-[1200px] mx-auto px-8 pb-20">
        <p
          className="text-[10px] tracking-[0.5em] uppercase text-[#c9a46a] mb-6"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Room by Room
        </p>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-[#282318] pb-4">
          {ROOM_FILTERS.map((filter) => {
            const count = filter === "all" ? project.rooms.length : project.rooms.filter((room) => getRoomFilter(room.name) === filter).length;
            if (filter !== "all" && count === 0) return null;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setRoomFilter(filter)}
                className={`px-4 py-2 text-[10px] tracking-[0.25em] uppercase transition-colors ${
                  roomFilter === filter
                    ? "bg-[#c9a46a] text-[#0c0b09]"
                    : "border border-[#282318] text-[#7a6e5e] hover:border-[#c9a46a] hover:text-[#c9a46a]"
                }`}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {ROOM_FILTER_LABELS[filter]} {count}
              </button>
            );
          })}
        </div>

        {project.rooms
          .filter((room) => roomFilter === "all" || getRoomFilter(room.name) === roomFilter)
          .map((room, ri) => (
            <RoomSection key={room.name} room={room} index={ri} />
          ))}
      </div>
    </div>
  );
}

type RoomFilter = "all" | "rooms" | "bathrooms" | "pools";

const ROOM_FILTERS: RoomFilter[] = ["all", "rooms", "bathrooms", "pools"];

const ROOM_FILTER_LABELS: Record<RoomFilter, string> = {
  all: "All",
  rooms: "Rooms",
  bathrooms: "Bathrooms",
  pools: "Pools",
};

function getRoomFilter(name: string): Exclude<RoomFilter, "all"> {
  const normalized = name.toLowerCase();
  if (normalized.includes("bath") || normalized.includes("حمام")) return "bathrooms";
  if (normalized.includes("pool") || normalized.includes("swim") || normalized.includes("حوض")) return "pools";
  return "rooms";
}

function RoomSection({ room, index }: { room: { name: string; images: string[]; materials?: string[] }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

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
      className="mb-16"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`,
      }}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="w-6 h-px bg-[#c9a46a]" />
        <p
          className="text-[10px] tracking-[0.5em] uppercase text-[#c9a46a]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {room.name}
        </p>
      </div>

      <div className="relative aspect-[16/9] overflow-hidden bg-[#141210]">
        {room.images.map((image, imageIndex) => (
          <img
            key={image}
            src={image}
            alt={`${room.name} ${imageIndex + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              imageIndex === activeImage ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={imageIndex !== activeImage}
          />
        ))}
        {room.images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous room image"
              onClick={() => setActiveImage((current) => (current - 1 + room.images.length) % room.images.length)}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-[#f0e8d5]/40 bg-[#0c0b09]/60 text-xl text-[#f0e8d5] transition-colors hover:border-[#c9a46a] hover:text-[#c9a46a]"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next room image"
              onClick={() => setActiveImage((current) => (current + 1) % room.images.length)}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-[#f0e8d5]/40 bg-[#0c0b09]/60 text-xl text-[#f0e8d5] transition-colors hover:border-[#c9a46a] hover:text-[#c9a46a]"
            >
              →
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0c0b09]/70 px-3 py-1 text-[10px] tracking-[0.2em] text-[#f0e8d5]" style={{ fontFamily: "var(--font-sans)" }}>
              {activeImage + 1} / {room.images.length}
            </div>
          </>
        )}
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

