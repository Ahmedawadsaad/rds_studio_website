import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { cacheProject, getCachedCategories, getCachedProjects, getCategories, getProjects, prefetchProject, type Category, type Project } from "../lib/api";
import { CARD_WIDTHS, imageSrcSet, optimizedImage } from "../lib/images";

const defaultCategories: Category[] = [
  { id: "all", name: "All Projects", count: 0 },
];

// Where the visitor was in the grid when they opened a project, so Back returns them there.
const RETURN_KEY = "rds-projects-return";
type ReturnState = { y: number; category: string };

function readReturnState(): ReturnState | null {
  try {
    const raw = sessionStorage.getItem(RETURN_KEY);
    return raw ? (JSON.parse(raw) as ReturnState) : null;
  } catch {
    return null;
  }
}

function clearReturnState() {
  try {
    sessionStorage.removeItem(RETURN_KEY);
  } catch {
    // Nothing to clear.
  }
}

function saveReturnState(state: ReturnState) {
  try {
    sessionStorage.setItem(RETURN_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable; Back will land at the top of the grid instead.
  }
}

function buildCategories(projects: Project[], categories: Category[]) {
  return [
    { id: "all", name: "All Projects", count: projects.length },
    ...categories.filter((category) => category.id !== "all"),
  ];
}

function filterProjects(projects: Project[], category: string) {
  return category === "all" ? projects : projects.filter((p) => p.category === category);
}

export default function ProjectsGrid() {
  const navigationType = useNavigationType();
  const location = useLocation();
  const [returnState] = useState(() => {
    const saved = readReturnState();
    if ((location.state as { fromProject?: boolean } | null)?.fromProject) return saved || { y: -1, category: "all" };
    return navigationType === "POP" ? saved : null;
  });
  const [cachedProjects] = useState(getCachedProjects);
  const [activeCategory, setActiveCategory] = useState(returnState?.category || "all");
  const [projects, setProjects] = useState<Project[]>(cachedProjects || []);
  const [categories, setCategories] = useState<Category[]>(() =>
    cachedProjects ? buildCategories(cachedProjects, getCachedCategories() || []) : defaultCategories
  );
  const [displayed, setDisplayed] = useState<Project[]>(() => filterProjects(cachedProjects || [], activeCategory));
  const [animating, setAnimating] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef(projects);
  const categoryRef = useRef(activeCategory);
  const restoredRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    clearReturnState();
    const load = async () => {
      const [projectData, categoryData] = await Promise.all([getProjects(), getCategories()]);
      projectsRef.current = projectData;
      setProjects(projectData);
      setCategories(buildCategories(projectData, categoryData));
      setDisplayed(filterProjects(projectData, categoryRef.current));
    };

    load();
  }, []);

  useEffect(() => {
    if (categoryRef.current === activeCategory) return;
    categoryRef.current = activeCategory;
    setAnimating(true);
    const t = setTimeout(() => {
      setDisplayed(filterProjects(projectsRef.current, activeCategory));
      setAnimating(false);
    }, 220);
    return () => clearTimeout(t);
  }, [activeCategory]);

  // Restore the grid position once the cards are on the page, before the browser paints.
  useLayoutEffect(() => {
    if (!returnState || restoredRef.current || displayed.length === 0) return;
    restoredRef.current = true;
    const top = returnState.y >= 0 ? returnState.y : (sectionRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
    window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
  }, [displayed, returnState]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="pb-16 pt-24 px-4 sm:px-8 max-w-[1400px] mx-auto">
      <div className="mb-16">
        <p className="reveal text-[10px] tracking-[0.5em] uppercase text-[#c9a46a] mb-4" style={{ fontFamily: "var(--font-sans)" }}>
          Our Projects
        </p>
        <h2
          className="reveal text-[clamp(2rem,4vw,3.5rem)] font-light text-[#f0e8d5] leading-[1.1]"
          style={{ fontFamily: "var(--font-display)", animationDelay: "0.1s" }}
        >
          Explore our projects
          <br />
          <em style={{ fontStyle: "italic", color: "#c9a46a" }}>from concept to completion</em>
        </h2>
      </div>

      <div className="reveal flex flex-wrap gap-0 mb-12 border-b border-[#282318]" style={{ animationDelay: "0.15s" }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`relative px-5 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors duration-200 ${
              activeCategory === cat.id
                ? "text-[#c9a46a] filter-tab-active"
                : "text-[#7a6e5e] hover:text-[#f0e8d5]"
            }`}
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#282318] transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}
      >
        {displayed.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            onOpen={() => {
              saveReturnState({ y: window.scrollY, category: activeCategory });
              cacheProject(project);
              navigate(`/project/${project.id}`, { state: { project } });
            }}
            onPreload={() => prefetchProject(project.id)}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  onOpen,
  onPreload,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
  onPreload: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 80);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className={`relative aspect-[4/3] overflow-hidden bg-[#141210] ${visible ? "grid-item-enter" : "opacity-0"}`}
      style={{ animationDelay: `${index * 0.07}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerEnter={onPreload}
      onTouchStart={onPreload}
      onClick={onOpen}
      data-cursor="Open"
    >
      <img
        src={optimizedImage(project.thumbnail, 828)}
        srcSet={imageSrcSet(project.thumbnail, CARD_WIDTHS)}
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        alt={project.name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-700"
        style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
      />
      {/* Overlay */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: hovered
            ? "linear-gradient(to top, rgba(12,11,9,0.92) 0%, rgba(12,11,9,0.3) 55%, transparent 100%)"
            : "linear-gradient(to top, rgba(12,11,9,0.75) 0%, rgba(12,11,9,0.1) 60%, transparent 100%)",
        }}
      />

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div
          className="transition-all duration-400"
          style={{ transform: hovered ? "translateY(0)" : "translateY(6px)" }}
        >
          <div className="flex items-end justify-between">
            <div>
              <p
                className="project-card-meta text-[9px] tracking-[0.4em] uppercase text-[#c9a46a] mb-2"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {project.category} · {project.year}
              </p>
              <h3
                className="project-card-title text-xl font-light text-[#f0e8d5] leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {project.name}
              </h3>
              <p
                className="project-card-location text-[11px] text-[#f0e8d5]/75 mt-1"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {project.location}
              </p>
              {project.description && (
                <p
                  className="project-card-description mt-2 max-w-[28rem] text-[11px] leading-relaxed text-[#f0e8d5]/75"
                  style={{
                    fontFamily: "var(--font-sans)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {project.description}
                </p>
              )}
            </div>
            <div
              className="w-10 h-px bg-[#c9a46a] transition-all duration-500"
              style={{ transform: hovered ? "scaleX(1)" : "scaleX(0)", transformOrigin: "right" }}
            />
          </div>

          {/* Area tag */}
          <div
            className="mt-3 transition-all duration-400"
            style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)" }}
          >
            <span
              className="text-[9px] tracking-[0.3em] uppercase border border-[#c9a46a]/30 text-[#c9a46a]/70 px-3 py-1"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {project.area}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
