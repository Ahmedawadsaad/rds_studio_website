import { CATEGORIES as fallbackCategories, PROJECTS as fallbackProjects, type Category, type Project } from "../data";

export type { Category, Project };

const API_BASE = "/api";

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
    return await request<Project[]>("/projects");
  } catch {
    return fallbackProjects;
  }
}

export async function getProject(id: string): Promise<Project> {
  return request<Project>(`/projects/${id}`);
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
  return request<{ heroImage: string }>("/site-settings");
}

export async function updateSiteSettings(payload: { heroImage: string }) {
  const token = localStorage.getItem("rds-admin-token");
  return request<{ heroImage: string }>("/admin/site-settings", {
    method: "PUT",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(payload),
  });
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

export async function createProject(payload: Partial<Project>) {
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
  const rooms = [];
  for (const room of payload.rooms || []) {
    rooms.push({ ...room, images: await Promise.all(room.images.map((image) => upload(image, "rooms"))) });
  }
  const preparedPayload = {
    ...payload,
    thumbnail: payload.thumbnail ? await upload(payload.thumbnail) : payload.thumbnail,
    heroImage: payload.heroImage ? await upload(payload.heroImage) : payload.heroImage,
    rooms,
  };
  const token = localStorage.getItem("rds-admin-token");
  return request<Project>("/admin/projects", {
    method: "POST",
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
