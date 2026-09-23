import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useReveal } from "../components/useReveal";
import { cacheProject, getProject, type Project } from "../lib/api";
import { PROJECTS } from "../data";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const routeProject = (location.state as { project?: Project } | null)?.project;
  const localProject = (routeProject?.id === id ? routeProject : id ? PROJECTS.find((item) => item.id === id) : null) || null;
  const [project, setProject] = useState<Project | null>(localProject);
  const [loading, setLoading] = useState(!localProject);
  const [floorTab, setFloorTab] = useState(0);
  const [roomFilter, setRoomFilter] = useState<RoomFilter>("all");
  const [contentView, setContentView] = useState<ContentView>("overview");
  const [entered, setEntered] = useState(false);
  const revealRef = useReveal();

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const cachedProject = routeProject?.id === id ? routeProject : PROJECTS.find((item) => item.id === id) || null;
      if (cachedProject) cacheProject(cachedProject);
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
  }, [id, routeProject]);

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
      <div className="detail-topbar fixed top-0 left-0 right-0 z-50 flex h-[68px] items-center gap-2 border-b border-[#282318] bg-[#0c0b09]/90 px-4 backdrop-blur-md sm:gap-4 sm:px-8">
        <button
          onClick={() => navigate("/")}
          className="detail-back-button flex items-center gap-2 text-[9px] tracking-[0.18em] uppercase text-[#7a6e5e] transition-colors hover:text-[#c9a46a] sm:gap-3 sm:text-[11px] sm:tracking-[0.3em]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <span className="text-base">←</span>
          Back to Projects
        </button>
        <span className="detail-topbar-divider mx-1 text-[#282318] sm:mx-2">|</span>
        <span
          className="detail-header-title truncate text-[9px] tracking-[0.14em] uppercase text-[#f0e8d5]/70 sm:text-[11px] sm:tracking-[0.2em]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {project.name}
        </span>
      </div>

      <div className="relative overflow-hidden bg-[#141210] pt-[68px]">
        <img
          src={project.heroImage}
          alt={project.name}
          fetchPriority="high"
          decoding="async"
          className="block h-auto max-h-[70svh] w-full object-contain sm:max-h-[75svh]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09]/85 via-transparent to-[#0c0b09]/30" />
        <div className="absolute bottom-4 left-4 right-4 sm:left-5 sm:right-auto md:bottom-6 md:left-16">
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

      <div className="max-w-[1200px] mx-auto px-4 py-6 sm:px-8" ref={revealRef}>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10">
          <p
            className="text-[1.05rem] text-[#c4b89a]/70 leading-[1.8] font-light"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {project.description || "Project details will be available soon."}
          </p>
          <div className="flex flex-col gap-4">
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
                  {v || "Not provided"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 pb-10 sm:px-8">
        <div className="flex flex-wrap gap-2 border-b border-[#282318] pb-5">
          <ContentTab active={contentView === "overview"} onClick={() => setContentView("overview")}>Full Project</ContentTab>
          {project.rooms.length > 0 && <ContentTab active={contentView === "spaces"} onClick={() => setContentView("spaces")}>Browse by Space</ContentTab>}
          {project.floorPlans.length > 0 && <ContentTab active={contentView === "plans"} onClick={() => setContentView("plans")}>Floor Plans</ContentTab>}
        </div>
      </div>

      {contentView === "overview" && (
        <div className="max-w-[1200px] mx-auto px-4 pb-20 sm:px-8">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#c9a46a] mb-6" style={{ fontFamily: "var(--font-sans)" }}>Full Project View</p>
          <div className="relative overflow-hidden border border-[#282318] bg-[#141210]">
            <img src={project.heroImage} alt={`${project.name} full project`} decoding="async" className="block h-auto max-h-[75svh] w-full object-contain" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09]/75 via-transparent" />
            <p className="absolute bottom-5 left-5 text-[11px] tracking-[0.25em] uppercase text-[#f0e8d5]" style={{ fontFamily: "var(--font-sans)" }}>
              {project.rooms.length} spaces · {project.floorPlans.length} floor plan{project.floorPlans.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      )}

      {contentView === "plans" && project.floorPlans.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-4 pb-24 sm:px-8">
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

      {contentView === "spaces" && <div className="max-w-[1200px] mx-auto px-4 pb-20 sm:px-8">
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
      </div>}
    </div>
  );
}

type RoomFilter = "all" | "rooms" | "bathrooms" | "pools";
type ContentView = "overview" | "spaces" | "plans";

function ContentTab({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-[10px] tracking-[0.22em] uppercase transition-colors ${active ? "bg-[#c9a46a] text-[#0c0b09]" : "border border-[#282318] text-[#7a6e5e] hover:border-[#c9a46a] hover:text-[#c9a46a]"}`}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {children}
    </button>
  );
}

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
        <button
          type="button"
          aria-label={`Zoom ${room.name} image`}
          onClick={() => setPreviewImage(room.images[activeImage])}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#f0e8d5]/40 bg-[#0c0b09]/70 text-[#f0e8d5] backdrop-blur-sm transition-all hover:scale-105 hover:border-[#c9a46a] hover:bg-[#c9a46a] hover:text-[#0c0b09] focus:outline-none focus:ring-2 focus:ring-[#c9a46a]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.7">
            <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
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

      {previewImage && <RoomImagePreview image={previewImage} roomName={room.name} onClose={() => setPreviewImage(null)} />}

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

function RoomImagePreview({ image, roomName, onClose }: { image: string; roomName: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "+" || event.key === "=") setZoom((value) => Math.min(3, value + 0.25));
      if (event.key === "-") setZoom((value) => Math.max(1, value - 0.25));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    createPortal(<div role="dialog" aria-modal="true" aria-label={`${roomName} image preview`} className="fixed inset-0 z-[100] flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-black" onClick={onClose}>
      <div className="relative h-full w-full" onClick={(event) => event.stopPropagation()}>
        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between gap-3 bg-gradient-to-b from-black/70 to-transparent p-4 text-white sm:p-6">
          <div className="min-w-0">
            <p className="truncate text-sm sm:text-base" style={{ fontFamily: "var(--font-display)" }}>{roomName}</p>
            <p className="mt-1 text-[9px] tracking-[0.25em] uppercase text-[#c9a46a]" style={{ fontFamily: "var(--font-sans)" }}>Image Preview</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close image preview" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#f0e8d5]/35 text-xl transition-colors hover:border-[#c9a46a] hover:text-[#c9a46a]">×</button>
        </div>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black">
          <img
            src={image}
            alt={roomName}
            className="h-full w-full select-none object-contain transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoom})` }}
            onWheel={(event) => {
              event.preventDefault();
              setZoom((value) => Math.min(3, Math.max(1, value + (event.deltaY < 0 ? 0.2 : -0.2))));
            }}
          />
        </div>
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/25 bg-black/75 p-1.5 text-white backdrop-blur-md" style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}>
          <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.25))} disabled={zoom === 1} aria-label="Zoom out" className="h-11 w-11 rounded-full text-xl text-[#f0e8d5] disabled:opacity-35">−</button>
          <button type="button" onClick={() => setZoom(1)} className="min-w-14 px-2 text-[10px] tracking-[0.12em] text-[#c9a46a]">{Math.round(zoom * 100)}%</button>
          <button type="button" onClick={() => setZoom((value) => Math.min(3, value + 0.25))} disabled={zoom === 3} aria-label="Zoom in" className="h-11 w-11 rounded-full text-xl text-[#f0e8d5] disabled:opacity-35">+</button>
        </div>
      </div>
    </div>, document.body)
  );
}
