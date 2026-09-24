import { CATEGORIES as fallbackCategories, PROJECTS as fallbackProjects, DEFAULT_SITE_CONTENT, type Category, type Project } from "../data";

export type { Category, Project };
export type SiteContent = typeof DEFAULT_SITE_CONTENT;

const API_BASE = "/api";
const projectCache = new Map<string, Project>();
const projectRequests = new Map<string, Promise<Project>>();
let siteContentRequest: Promise<SiteContent> | undefined;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    if (response.status === 413) {
      throw new Error("The image is too large to upload. Please choose a smaller image and try again.");
    }
    try {
      const body = JSON.parse(text) as { message?: string };
      throw new Error(body.message || "The request could not be completed. Please try again.");
    } catch (error) {
      if (error instanceof Error && !(error instanceof SyntaxError)) throw error;
      throw new Error("The request could not be completed. Please try again.");
    }
  }

  return (await response.json()) as T;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await request<Project[]>("/projects");
    projects.forEach((project) => projectCache.set(project.id, project));
    return projects;
  } catch {
    fallbackProjects.forEach((project) => projectCache.set(project.id, project));
    return fallbackProjects;
  }
}

export async function getProject(id: string): Promise<Project> {
  const cached = projectCache.get(id);
  if (cached) return cached;
  const pending = projectRequests.get(id);
  if (pending) return pending;

  const pendingRequest = (async () => {
  try {
      const project = await request<Project>(`/projects/${id}`);
      projectCache.set(project.id, project);
      return project;
  } catch {
    const fallback = fallbackProjects.find((project) => project.id === id);
      if (fallback) {
        projectCache.set(fallback.id, fallback);
        return fallback;
      }
    throw new Error("Project not found.");
    } finally {
      projectRequests.delete(id);
    }
  })();
  projectRequests.set(id, pendingRequest);
  return pendingRequest;
}

export function cacheProject(project: Project) {
  projectCache.set(project.id, project);
}

export function prefetchProject(id: string) {
  void getProject(id).catch(() => undefined);
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await request<Category[]>("/categories");
    return categories.length ? categories : fallbackCategories;
  } catch {
    return fallbackCategories;
  }
}

export async function getSiteSettings() {
  return request<{ heroImage: string }>("/site-settings", { cache: "no-store" });
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!siteContentRequest) {
    siteContentRequest = request<Partial<SiteContent>>("/site-content", { cache: "no-store" })
      .then((content) => ({ ...DEFAULT_SITE_CONTENT, ...content }))
      .catch(() => DEFAULT_SITE_CONTENT);
  }
  return siteContentRequest;
}

export async function updateSiteContent(payload: SiteContent): Promise<SiteContent> {
  const token = localStorage.getItem("rds-admin-token");
  const saved = await request<SiteContent>("/admin/site-content", {
    method: "PUT",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(payload),
  });
  siteContentRequest = Promise.resolve(saved);
  return saved;
}

export async function updateSiteSettings(payload: { heroImage: string }) {
  const token = localStorage.getItem("rds-admin-token");
  const saved = await request<{ heroImage: string }>("/admin/site-settings", {
    method: "PUT",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(payload),
  });
  window.dispatchEvent(new CustomEvent("rds:site-settings-updated", { detail: saved }));
  return saved;
}

export async function loginAdmin(email: string, password: string) {
  return request<{ token: string; user: { id: string; name: string; email: string; role: string; companyName: string } }>(
    "/admin/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  );
}

export async function getAdminSession() {
  const token = localStorage.getItem("rds-admin-token");
  return request<{ user: { id: string; name: string; email: string; role: string; companyName: string } }>("/admin/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function updateAdminPassword(currentPassword: string, password: string) {
  const token = localStorage.getItem("rds-admin-token");
  return request<{ ok: boolean; message: string }>("/admin/password", {
    method: "PUT",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify({ currentPassword, password }),
  });
}

async function prepareProjectPayload(payload: Partial<Project>) {
  const upload = async (image: string, folder: "projects" | "rooms" = "projects") => {
    if (!image.startsWith("data:image/")) return image;
    const token = localStorage.getItem("rds-admin-token");
    const response = await request<{ url: string }>("/admin/uploads", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ image, folder }),
    });
    return response.url;
  };
  let thumbnail = payload.thumbnail;
  let heroImage = payload.heroImage;
  const rooms = (payload.rooms || []).map((room) => ({ ...room, images: [...room.images] }));
  const uploadTasks: (() => Promise<void>)[] = [];

  if (thumbnail) uploadTasks.push(async () => { thumbnail = await upload(thumbnail!, "projects"); });
  if (heroImage) uploadTasks.push(async () => { heroImage = await upload(heroImage!, "projects"); });
  rooms.forEach((room) => room.images.forEach((image, index) => {
    uploadTasks.push(async () => { room.images[index] = await upload(image, "rooms"); });
  }));

  let nextTask = 0;
  const uploadWorker = async () => {
    while (nextTask < uploadTasks.length) {
      const task = uploadTasks[nextTask++];
      await task();
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, uploadTasks.length) }, uploadWorker));

  const preparedPayload = {
    ...payload,
    thumbnail,
    heroImage,
    rooms,
  };
  return preparedPayload;
}

export async function createProject(payload: Partial<Project>) {
  const preparedPayload = await prepareProjectPayload(payload);
  const token = localStorage.getItem("rds-admin-token");
  return request<Project>("/admin/projects", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(preparedPayload),
  });
}

export async function updateProject(id: string, payload: Partial<Project>) {
  const preparedPayload = await prepareProjectPayload(payload);
  const token = localStorage.getItem("rds-admin-token");
  return request<Project>(`/admin/projects/${id}`, {
    method: "PUT",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(preparedPayload),
  });
}

export async function deleteProject(id: string) {
  const token = localStorage.getItem("rds-admin-token");
  return request<{ ok: boolean; message: string }>(`/admin/projects/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function addCategory(payload: { id: string; name: string; count?: number }) {
  const token = localStorage.getItem("rds-admin-token");
  return request<Category>("/admin/categories", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(id: string) {
  const token = localStorage.getItem("rds-admin-token");
  return request<{ ok: boolean; message: string }>(`/admin/categories/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
