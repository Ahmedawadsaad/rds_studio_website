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
    throw new Error(text || "Request failed");
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

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await request<Category[]>("/categories");
    return categories.length ? categories : fallbackCategories;
  } catch {
    return fallbackCategories;
  }
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
  const token = localStorage.getItem("rds-admin-token");
  return request<Project>("/admin/projects", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(payload),
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
