import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addCategory, createProject, deleteCategory, deleteProject, getCategories, getProjects, loginAdmin, updateSiteSettings, type Category, type Project } from "../lib/api";

type AdminView = "dashboard" | "projects" | "new-project" | "categories" | "site-settings";

type AdminSession = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    companyName: string;
  };
};

const STORAGE_KEYS = {
  token: "rds-admin-token",
};

const Icon = {
  grid: "⊞",
  folder: "◫",
  tag: "◈",
  eye: "◎",
  logout: "◁",
  plus: "+",
  trash: "✕",
};

function AdminLogin({ onLogin }: { onLogin: (session: AdminSession) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const session = await loginAdmin(email, password);
      localStorage.setItem(STORAGE_KEYS.token, session.token);
      onLogin(session);
    } catch {
      setError("Invalid credentials. Use the seeded admin account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0b09] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#11100d] border border-[#282318] p-8">
        <div className="flex flex-col items-center mb-8">
          <svg width="36" height="36" viewBox="0 0 28 28" fill="none" className="mb-4">
            <rect x="1" y="1" width="26" height="26" stroke="#c9a46a" strokeWidth="1.5" />
            <rect x="5" y="5" width="18" height="18" fill="#c9a46a" fillOpacity="0.12" />
            <line x1="1" y1="14" x2="27" y2="14" stroke="#c9a46a" strokeWidth="0.8" />
            <line x1="14" y1="1" x2="14" y2="27" stroke="#c9a46a" strokeWidth="0.8" />
          </svg>
          <h1 className="text-[13px] tracking-[0.4em] uppercase text-[#f0e8d5]/60" style={{ fontFamily: "var(--font-sans)" }}>Red Door Studio</h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] mt-1" style={{ fontFamily: "var(--font-sans)" }}>Admin Portal</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] mb-2" style={{ fontFamily: "var(--font-sans)" }}>Email</label>
            <input
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#141210] border border-[#282318] text-[#f0e8d5] text-[13px] px-4 py-3 focus:outline-none focus:border-[#c9a46a]"
              style={{ fontFamily: "var(--font-sans)" }}
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] mb-2" style={{ fontFamily: "var(--font-sans)" }}>Password</label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#141210] border border-[#282318] text-[#f0e8d5] text-[13px] px-4 py-3 focus:outline-none focus:border-[#c9a46a]"
              style={{ fontFamily: "var(--font-sans)" }}
            />
          </div>

          {error && <p className="text-[11px] text-red-400/80" style={{ fontFamily: "var(--font-sans)" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a46a] text-[#0c0b09] text-[11px] tracking-[0.35em] uppercase py-4 mt-2 hover:bg-[#b8904f] transition-colors disabled:opacity-60"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Sidebar({ view, setView, onLogout }: { view: AdminView; setView: (v: AdminView) => void; onLogout: () => void }) {
  const links: { id: AdminView; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: Icon.grid },
    { id: "projects", label: "Projects", icon: Icon.folder },
    { id: "categories", label: "Categories", icon: Icon.tag },
    { id: "site-settings", label: "Site Settings", icon: "◉" },
  ];

  return (
    <aside className="w-full md:w-[220px] shrink-0 bg-[#0e0d0b] border-b md:border-b-0 md:border-r border-[#282318] flex flex-col md:h-full">
      <div className="px-6 py-5 border-b border-[#282318]">
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <rect x="1" y="1" width="26" height="26" stroke="#c9a46a" strokeWidth="1.2" />
            <rect x="5" y="5" width="18" height="18" fill="#c9a46a" fillOpacity="0.1" />
            <line x1="1" y1="14" x2="27" y2="14" stroke="#c9a46a" strokeWidth="0.6" />
            <line x1="14" y1="1" x2="14" y2="27" stroke="#c9a46a" strokeWidth="0.6" />
          </svg>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a46a]" style={{ fontFamily: "var(--font-sans)" }}>RDS</p>
            <p className="text-[8px] tracking-[0.2em] uppercase text-[#3a3530]" style={{ fontFamily: "var(--font-sans)" }}>Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-2 md:py-4 grid grid-cols-2 sm:grid-cols-4 md:block">
        {links.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`w-full text-left px-4 md:px-6 py-3 text-[10px] md:text-[11px] tracking-[0.12em] md:tracking-[0.2em] uppercase transition-colors ${view === id ? "text-[#c9a46a] bg-[#141210]" : "text-[#7a6e5e] hover:text-[#f0e8d5]"}`}
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <span className="mr-3">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <div className="border-t border-[#282318] py-2 md:py-4 grid grid-cols-2 md:block">
        <Link to="/" className="block px-4 md:px-6 py-3 text-[10px] md:text-[11px] tracking-[0.12em] md:tracking-[0.2em] uppercase text-[#7a6e5e] hover:text-[#c9a46a]" style={{ fontFamily: "var(--font-sans)" }}>
          <span className="mr-3">{Icon.eye}</span>
          Public Site
        </Link>
        <button onClick={onLogout} className="w-full text-left px-4 md:px-6 py-3 text-[10px] md:text-[11px] tracking-[0.12em] md:tracking-[0.2em] uppercase text-[#7a6e5e] hover:text-[#c9a46a]" style={{ fontFamily: "var(--font-sans)" }}>
          <span className="mr-3">{Icon.logout}</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function DashboardHome({ projects, categories }: { projects: Project[]; categories: Category[] }) {
  const stats = [
    { label: "Total Projects", value: projects.length, sub: "Live database records" },
    { label: "Categories", value: categories.length, sub: "Available filters" },
    { label: "Status", value: "Online", sub: "API synced" },
    { label: "Updated", value: "Now", sub: "Ready to edit" },
  ];

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#f0e8d5]" style={{ fontFamily: "var(--font-display)" }}>Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, sub }) => (
          <div key={label} className="bg-[#141210] border border-[#282318] p-5">
            <p className="text-[28px] font-light text-[#c9a46a]" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
            <p className="text-[11px] tracking-[0.1em] text-[#f0e8d5]/70 mt-1" style={{ fontFamily: "var(--font-sans)" }}>{label}</p>
            <p className="text-[10px] text-[#7a6e5e] mt-1" style={{ fontFamily: "var(--font-sans)" }}>{sub}</p>
          </div>
        ))}
      </div>

      <div className="border border-[#282318] bg-[#141210] p-5 max-w-2xl">
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a46a] mb-4" style={{ fontFamily: "var(--font-sans)" }}>Recent Projects</p>
        <div className="space-y-3">
          {projects.slice(0, 4).map((project) => (
            <div key={project.id} className="flex items-center justify-between border-b border-[#282318] pb-3">
              <div>
                <p className="text-[13px] text-[#f0e8d5]" style={{ fontFamily: "var(--font-sans)" }}>{project.name}</p>
                <p className="text-[11px] text-[#7a6e5e]" style={{ fontFamily: "var(--font-sans)" }}>{project.location}</p>
              </div>
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#c9a46a]" style={{ fontFamily: "var(--font-sans)" }}>{project.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsManager({ projects, onDelete, onCreate }: { projects: Project[]; onDelete: (id: string) => void; onCreate: () => void }) {
  return (
    <div className="flex-1 overflow-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-light text-[#f0e8d5]" style={{ fontFamily: "var(--font-display)" }}>Projects</h1>
          <p className="text-[12px] text-[#7a6e5e] mt-1" style={{ fontFamily: "var(--font-sans)" }}>{projects.length} project(s) in the database</p>
        </div>
        <button onClick={onCreate} className="bg-[#c9a46a] text-[#0c0b09] text-[11px] tracking-[0.25em] uppercase px-5 py-2.5 hover:bg-[#b8904f]" style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}>
          {Icon.plus} Add Project
        </button>
      </div>

      <div className="border border-[#282318] overflow-x-auto">
        <div className="min-w-[620px]">
        <div className="grid grid-cols-[56px_1fr_1fr_100px_80px] gap-4 px-4 py-3 bg-[#141210] border-b border-[#282318]">
          {['', 'Project', 'Category', 'Year', ''].map((h, i) => (
            <span key={i} className="text-[9px] tracking-[0.35em] uppercase text-[#7a6e5e]" style={{ fontFamily: "var(--font-sans)" }}>{h}</span>
          ))}
        </div>

        {projects.map((project, index) => (
          <div key={project.id} className={`grid grid-cols-[56px_1fr_1fr_100px_80px] gap-4 items-center px-4 py-3 ${index < projects.length - 1 ? 'border-b border-[#282318]' : ''}`}>
            <div className="w-12 h-12 overflow-hidden bg-[#1c1a16]">
              <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[13px] text-[#f0e8d5]" style={{ fontFamily: "var(--font-sans)" }}>{project.name}</p>
              <p className="text-[11px] text-[#7a6e5e]" style={{ fontFamily: "var(--font-sans)" }}>{project.location}</p>
            </div>
            <p className="text-[12px] text-[#7a6e5e] capitalize" style={{ fontFamily: "var(--font-sans)" }}>{project.category}</p>
            <p className="text-[12px] text-[#7a6e5e]" style={{ fontFamily: "var(--font-sans)" }}>{project.year}</p>
            <button onClick={() => onDelete(project.id)} className="text-[#7a6e5e] hover:text-red-400 text-sm" aria-label={`Delete ${project.name}`}>
              {Icon.trash}
            </button>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

function readImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    return Promise.reject(new Error("Please select an image file."));
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return Promise.reject(new Error("Each image must be smaller than 4 MB."));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("The image could not be read. Please choose a valid image and try again."));
    reader.readAsDataURL(file);
  });
}

const MAX_SOURCE_IMAGE_SIZE = 25 * 1024 * 1024;
const MAX_UPLOAD_IMAGE_SIZE = 2.75 * 1024 * 1024;

function dataUrlFromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("The image could not be read. Please choose a valid image and try again."));
    reader.readAsDataURL(blob);
  });
}

async function optimizeImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please select an image file.");
  if (file.size > MAX_SOURCE_IMAGE_SIZE) throw new Error("Each source image must be smaller than 25 MB.");

  const source = await dataUrlFromBlob(file);
  const image = new Image();
  image.src = source;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("The image could not be processed. Please choose another file."));
  });

  const scale = Math.min(1, 2000 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);

  for (const quality of [0.86, 0.76, 0.66, 0.56]) {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (blob && blob.size <= MAX_UPLOAD_IMAGE_SIZE) return dataUrlFromBlob(blob);
  }
  throw new Error("The image is still too large after compression. Please use a smaller image.");
}

function NewProjectForm({ categories, onBack, onSave }: { categories: Category[]; onBack: () => void; onSave: (payload: Partial<Project>) => Promise<void> }) {
  const [form, setForm] = useState({
    name: "",
    category: categories.find((category) => category.id !== "all")?.id || "villas",
    location: "",
    year: new Date().getFullYear(),
    area: "",
    description: "",
  });
  const [thumbnail, setThumbnail] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [roomSections, setRoomSections] = useState<{ name: string; images: string[] }[]>([
    { name: "Living Room", images: [] },
  ]);
  const [imageError, setImageError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key: string, value: string | number) => setForm((current) => ({ ...current, [key]: value }));

  const selectImage = async (file: File | undefined, setter: (value: string) => void) => {
    if (!file) return;
    try {
      setImageError("");
      setter(await optimizeImage(file));
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "The image could not be read. Please try again.");
    }
  };

  const selectRoomImages = async (index: number, files: FileList | null) => {
    if (!files) return;
    try {
      setImageError("");
      const images = await Promise.all(Array.from(files).map(optimizeImage));
      setRoomSections((current) => current.map((section, sectionIndex) => sectionIndex === index ? { ...section, images } : section));
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "One or more images could not be read. Please try again.");
    }
  };

  const addRoomSection = () => setRoomSections((current) => [...current, { name: "", images: [] }]);

  const updateRoomName = (index: number, name: string) => {
    setRoomSections((current) => current.map((section, sectionIndex) => sectionIndex === index ? { ...section, name } : section));
  };

  const submit = async () => {
    setSaveError("");
    if (!form.name.trim() || form.category === "all" || !thumbnail || !heroImage) {
      setSaveError("Enter the project name, project type, card image, and main image before saving.");
      return;
    }
    if (!form.name.trim() || form.category === "all" || !thumbnail || !heroImage) {
      setSaveError("Enter the project name, project type, card image, and main image before saving.");
      return;
    }
    setSubmitting(true);
    try {
      await onSave({
        ...form,
        status: "published",
        thumbnail,
        heroImage,
        rooms: roomSections.filter((section) => section.name.trim() && section.images.length > 0),
        floorPlans: [],
      });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "The project could not be saved. Please check the details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8">
      <div className="flex items-start gap-3 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-[11px] tracking-[0.2em] uppercase text-[#7a6e5e] hover:text-[#c9a46a]" style={{ fontFamily: "var(--font-sans)" }}>← Back</button>
          <h1 className="text-xl md:text-2xl font-light text-[#f0e8d5]" style={{ fontFamily: "var(--font-display)" }}>Add New Project</h1>
        </div>
      </div>

      <div className="max-w-2xl space-y-5">
        <div>
          <label className="block text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] mb-2" style={{ fontFamily: "var(--font-sans)" }}>Project Name</label>
          <input value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full bg-[#141210] border border-[#282318] text-[#f0e8d5] text-[13px] px-4 py-3 focus:outline-none focus:border-[#c9a46a]" style={{ fontFamily: "var(--font-sans)" }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] mb-2" style={{ fontFamily: "var(--font-sans)" }}>Project Type</label>
            <select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full bg-[#141210] border border-[#282318] text-[#f0e8d5] text-[13px] px-4 py-3 focus:outline-none focus:border-[#c9a46a]" style={{ fontFamily: "var(--font-sans)" }}>
              {categories.filter((category) => category.id !== "all").map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] mb-2" style={{ fontFamily: "var(--font-sans)" }}>Year</label>
            <input type="number" value={form.year} onChange={(e) => update("year", Number(e.target.value))} className="w-full bg-[#141210] border border-[#282318] text-[#f0e8d5] text-[13px] px-4 py-3 focus:outline-none focus:border-[#c9a46a]" style={{ fontFamily: "var(--font-sans)" }} />
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] mb-2" style={{ fontFamily: "var(--font-sans)" }}>Location</label>
          <input value={form.location} onChange={(e) => update("location", e.target.value)} className="w-full bg-[#141210] border border-[#282318] text-[#f0e8d5] text-[13px] px-4 py-3 focus:outline-none focus:border-[#c9a46a]" style={{ fontFamily: "var(--font-sans)" }} />
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] mb-2" style={{ fontFamily: "var(--font-sans)" }}>Area</label>
          <input value={form.area} onChange={(e) => update("area", e.target.value)} className="w-full bg-[#141210] border border-[#282318] text-[#f0e8d5] text-[13px] px-4 py-3 focus:outline-none focus:border-[#c9a46a]" style={{ fontFamily: "var(--font-sans)" }} />
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] mb-2" style={{ fontFamily: "var(--font-sans)" }}>Description</label>
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={5} className="w-full bg-[#141210] border border-[#282318] text-[#f0e8d5] text-[13px] px-4 py-3 focus:outline-none focus:border-[#c9a46a] resize-none" style={{ fontFamily: "var(--font-sans)" }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUpload label="Card Image" value={thumbnail} onChange={(file) => void selectImage(file, setThumbnail)} />
          <ImageUpload label="Main Image" value={heroImage} onChange={(file) => void selectImage(file, setHeroImage)} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e]" style={{ fontFamily: "var(--font-sans)" }}>Spaces Inside This Project</label>
            <button type="button" onClick={addRoomSection} className="border border-[#c9a46a]/50 px-3 py-2 text-[10px] tracking-[0.2em] uppercase text-[#c9a46a] hover:bg-[#c9a46a] hover:text-[#0c0b09]" style={{ fontFamily: "var(--font-sans)" }}>+ Add Section</button>
          </div>
          {roomSections.map((section, index) => (
            <div key={index} className="border border-[#282318] bg-[#141210] p-4">
              <input
                value={section.name}
                onChange={(e) => updateRoomName(index, e.target.value)}
                placeholder="Example: Reception, Kitchen, Master Bedroom, or Pool"
                className="mb-3 w-full bg-[#0c0b09] border border-[#282318] text-[#f0e8d5] text-[13px] px-4 py-3 focus:outline-none focus:border-[#c9a46a]"
                style={{ fontFamily: "var(--font-sans)" }}
              />
              <input type="file" accept="image/*" multiple onChange={(e) => void selectRoomImages(index, e.target.files)} className="block w-full text-[12px] text-[#7a6e5e] file:mr-4 file:border-0 file:bg-[#c9a46a] file:px-4 file:py-3 file:text-[11px] file:tracking-[0.15em] file:uppercase file:text-[#0c0b09]" />
              {section.images.length > 0 && <p className="mt-2 text-[11px] text-[#c9a46a]" style={{ fontFamily: "var(--font-sans)" }}>{section.images.length} image(s) selected</p>}
            </div>
          ))}
        </div>

        {(imageError || saveError) && <p className="text-[11px] text-red-400/80" style={{ fontFamily: "var(--font-sans)" }}>{imageError || saveError}</p>}

        <button onClick={submit} disabled={submitting} className="bg-[#c9a46a] text-[#0c0b09] text-[11px] tracking-[0.25em] uppercase px-6 py-3 hover:bg-[#b8904f] disabled:opacity-60" style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}>
          {submitting ? "Saving..." : "Save Project"}
        </button>
      </div>
    </div>
  );
}

function ImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (file: File | undefined) => void }) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] mb-2" style={{ fontFamily: "var(--font-sans)" }}>{label}</label>
      <input type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0])} className="block w-full text-[12px] text-[#7a6e5e] file:mr-4 file:border-0 file:bg-[#c9a46a] file:px-4 file:py-3 file:text-[11px] file:tracking-[0.15em] file:uppercase file:text-[#0c0b09]" />
      {value && <img src={value} alt={`${label} preview`} className="mt-3 h-28 w-full object-cover border border-[#282318]" />}
    </div>
  );
}

function CategoriesManager({ categories, onAdded, onDeleted }: { categories: Category[]; onAdded: (category: Category) => void; onDeleted: (id: string) => void }) {
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const addCategoryClick = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    setError("");
    try {
      const category = await addCategory({ id: newName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: newName.trim() });
      onAdded(category);
      setNewName("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not add the category.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategoryClick = async (category: Category) => {
    if (!window.confirm(`Delete the category "${category.name}"?`)) return;
    setDeleting(category.id);
    setError("");
    try {
      await deleteCategory(category.id);
      onDeleted(category.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not delete the category.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8">
      <h1 className="text-2xl font-light text-[#f0e8d5] mb-2" style={{ fontFamily: "var(--font-display)" }}>Project Types</h1>
      <p className="max-w-lg mb-6 text-[12px] text-[#7a6e5e]" style={{ fontFamily: "var(--font-sans)" }}>Project types organize the portfolio. Rooms and spaces are added inside each project.</p>

      <div className="max-w-lg space-y-3 border border-[#282318] bg-[#141210] p-4">
        {categories.filter((category) => category.id !== "all").map((category) => (
          <div key={category.id} className="flex items-center justify-between border-b border-[#282318] pb-3 last:border-b-0 last:pb-0">
            <div>
              <p className="text-[13px] text-[#f0e8d5]" style={{ fontFamily: "var(--font-sans)" }}>{category.name}</p>
              <p className="text-[11px] text-[#7a6e5e]" style={{ fontFamily: "var(--font-sans)" }}>{category.count ?? 0} projects</p>
            </div>
            <button
              type="button"
              onClick={() => void deleteCategoryClick(category)}
              disabled={deleting === category.id}
              className="text-[11px] tracking-[0.15em] uppercase text-[#7a6e5e] hover:text-red-400 disabled:opacity-50"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {deleting === category.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>

      {error && <p className="max-w-lg mt-4 text-[11px] text-red-400/80" style={{ fontFamily: "var(--font-sans)" }}>{error}</p>}

      <div className="max-w-lg mt-6 flex flex-col sm:flex-row gap-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void addCategoryClick()}
          placeholder="New category name"
          className="flex-1 bg-[#141210] border border-[#282318] text-[#f0e8d5] text-[13px] px-4 py-3 focus:outline-none focus:border-[#c9a46a]"
          style={{ fontFamily: "var(--font-sans)" }}
        />
        <button onClick={() => void addCategoryClick()} disabled={loading} className="bg-[#c9a46a] text-[#0c0b09] text-[11px] tracking-[0.2em] uppercase px-5 py-3 hover:bg-[#b8904f] disabled:opacity-60" style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}>
          {loading ? "Adding..." : "+ Add"}
        </button>
      </div>
    </div>
  );
}

function SiteSettingsManager() {
  const [heroImage, setHeroImage] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const selectHeroImage = async (file: File | undefined) => {
    if (!file) return;
    try {
      setMessage("");
      setHeroImage(await optimizeImage(file));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not read the image.");
    }
  };

  const save = async () => {
    if (!heroImage) {
      setMessage("Choose a villa image first.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await updateSiteSettings({ heroImage });
      setMessage("Hero image saved. Refresh the public site to see it.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save the hero image.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#f0e8d5]" style={{ fontFamily: "var(--font-display)" }}>Site Settings</h1>
        <p className="text-[12px] text-[#7a6e5e] mt-1" style={{ fontFamily: "var(--font-sans)" }}>Update the image shown on the public homepage.</p>
      </div>

      <div className="max-w-2xl border border-[#282318] bg-[#141210] p-5">
        <label className="block text-[10px] tracking-[0.3em] uppercase text-[#7a6e5e] mb-3" style={{ fontFamily: "var(--font-sans)" }}>Homepage Hero Image</label>
        <input type="file" accept="image/*" onChange={(e) => void selectHeroImage(e.target.files?.[0])} className="block w-full text-[12px] text-[#7a6e5e] file:mr-4 file:border-0 file:bg-[#c9a46a] file:px-4 file:py-3 file:text-[11px] file:tracking-[0.15em] file:uppercase file:text-[#0c0b09]" />
        {heroImage && <img src={heroImage} alt="Homepage hero preview" className="mt-5 aspect-[2/1] w-full object-cover border border-[#282318]" />}
        {message && <p className="mt-4 text-[11px] text-[#c9a46a]" style={{ fontFamily: "var(--font-sans)" }}>{message}</p>}
        <button onClick={() => void save()} disabled={saving} className="mt-5 bg-[#c9a46a] text-[#0c0b09] text-[11px] tracking-[0.25em] uppercase px-6 py-3 hover:bg-[#b8904f] disabled:opacity-60" style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}>
          {saving ? "Saving..." : "Save Hero Image"}
        </button>
      </div>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [view, setView] = useState<AdminView>("dashboard");

  useEffect(() => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem("rds-admin-session");
  }, []);

  const loadData = async () => {
    const [nextProjects, nextCategories] = await Promise.all([getProjects(), getCategories()]);
    setProjects(nextProjects);
    setCategories(nextCategories);
  };

  useEffect(() => {
    if (!session) return;
    void loadData();
  }, [session]);

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    setSession(null);
    setView("dashboard");
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects((current) => current.filter((project) => project.id !== id));
    } catch {
      // keep the UI responsive even if the API is unavailable
    }
  };

  const handleCreateProject = async (payload: Partial<Project>) => {
    const created = await createProject(payload);
    setProjects((current) => [created, ...current]);
    setView("projects");
  };

  const handleCategoryAdded = (category: Category) => {
    setCategories((current) => [...current.filter((item) => item.id !== "all"), category]);
  };

  if (!session) {
    return <AdminLogin onLogin={setSession} />;
  }

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:flex-row bg-[#0c0b09] overflow-visible md:overflow-hidden">
      <Sidebar view={view} setView={setView} onLogout={signOut} />
      <main className="min-w-0 flex-1 overflow-visible md:overflow-hidden flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 md:px-8 py-4 md:py-0 md:h-[60px] border-b border-[#282318] bg-[#0e0d0b] flex-shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-[#7a6e5e]" style={{ fontFamily: "var(--font-sans)" }}>
            <span>Admin</span>
            <span className="mx-1 text-[#282318]">/</span>
            <span className="text-[#f0e8d5]/50 capitalize">{view}</span>
          </div>
          <div className="max-w-full truncate text-[11px] text-[#f0e8d5]/60" style={{ fontFamily: "var(--font-sans)" }}>{session.user.email}</div>
        </div>

        <div className="flex-1 min-h-0 overflow-visible md:overflow-hidden flex">
          {view === "dashboard" && <DashboardHome projects={projects} categories={categories} />}
          {view === "projects" && (projects.length > 0 || true) && (
            <ProjectsManager projects={projects} onDelete={handleDeleteProject} onCreate={() => setView("new-project")} />
          )}
          {view === "new-project" && <NewProjectForm categories={categories} onBack={() => setView("projects")} onSave={handleCreateProject} />}
          {view === "categories" && <CategoriesManager categories={categories} onAdded={handleCategoryAdded} onDeleted={(id) => setCategories((current) => current.filter((category) => category.id !== id))} />}
          {view === "site-settings" && <SiteSettingsManager />}
        </div>
      </main>
    </div>
  );
}
