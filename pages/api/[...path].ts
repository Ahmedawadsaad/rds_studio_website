import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin, supabaseAuth } from "../../lib/supabaseAdmin";

const defaultHeroImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&h=1400&fit=crop&auto=format";

function projectOut(project: any) {
  return { ...project, heroImage: project.hero_image, floorPlans: project.floor_plans || [], createdAt: project.created_at, updatedAt: project.updated_at };
}

async function requireAdmin(req: NextApiRequest) {
  const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : "";
  if (!token) return null;
  const { data: auth } = await supabaseAdmin.auth.getUser(token);
  if (!auth.user) return null;
  const { data: profile } = await supabaseAdmin.from("admin_profiles").select("*").eq("id", auth.user.id).maybeSingle();
  return profile?.active ? { auth: auth.user, profile } : null;
}

async function uploadImage(value: unknown, folder: string) {
  if (typeof value !== "string" || !value.startsWith("data:image/")) return value;
  const match = value.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
  if (!match) throw new Error("The image data is invalid. Please choose a valid image and try again.");
  const buffer = Buffer.from(match[2], "base64");
  const extension = match[1].split("/")[1].replace("svg+xml", "svg");
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabaseAdmin.storage.from("project-images").upload(path, buffer, { contentType: match[1], upsert: false });
  if (error) throw error;
  return supabaseAdmin.storage.from("project-images").getPublicUrl(path).data.publicUrl;
}

function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("payload") || message.includes("too large") || message.includes("size")) {
    return "The image is too large. Please choose a smaller image and try again.";
  }
  if (message.includes("duplicate") || message.includes("unique")) {
    return "This item already exists. Please use a different name and try again.";
  }
  if (error instanceof Error && /[\u0600-\u06ff]/.test(error.message)) return error.message;
  return "Something went wrong. Please check your details and try again.";
}

async function uploadProjectImages(payload: any) {
  const result = { ...payload };
  result.thumbnail = await uploadImage(result.thumbnail, "projects");
  result.heroImage = await uploadImage(result.heroImage, "projects");
  if (Array.isArray(result.rooms)) {
    result.rooms = await Promise.all(result.rooms.map(async (room: any) => ({ ...room, images: await Promise.all((room.images || []).map((image: string) => uploadImage(image, "rooms"))) })));
  }
  return result;
}

function publicError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("payload") || message.includes("too large") || message.includes("size")) {
    return "The image is too large. Please choose a smaller image and try again.";
  }
  if (message.includes("duplicate") || message.includes("unique")) {
    return "This item already exists. Please use a different name and try again.";
  }
  return "Something went wrong. Please check your details and try again.";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = Array.isArray(req.query.path) ? req.query.path : [req.query.path || ""];
  try {
    if (req.method === "GET" && path[0] === "health") return res.json({ ok: true, message: "RDS API is running", imageStorage: "supabase-storage" });
    if (req.method === "GET" && path[0] === "projects" && !path[1]) {
      const { data, error } = await supabaseAdmin.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return res.json((data || []).map(projectOut));
    }
    if (req.method === "GET" && path[0] === "projects" && path[1]) {
      const { data, error } = await supabaseAdmin.from("projects").select("*").eq("id", path[1]).maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ message: "Project not found" });
      return res.json(projectOut(data));
    }
    if (req.method === "GET" && path[0] === "categories") {
      const { data, error } = await supabaseAdmin.from("categories").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return res.json(data || []);
    }
    if (req.method === "GET" && path[0] === "site-settings") {
      const { data } = await supabaseAdmin.from("site_settings").select("hero_image").eq("key", "public-site").maybeSingle();
      return res.json({ heroImage: data?.hero_image || defaultHeroImage });
    }
    if (req.method === "POST" && path.join("/") === "admin/login") {
      const { email, password } = req.body || {};
      const { data, error } = await supabaseAuth.auth.signInWithPassword({ email: email?.toLowerCase(), password });
      if (error || !data.user || !data.session) return res.status(401).json({ message: "Invalid credentials" });
      const { data: profile } = await supabaseAdmin.from("admin_profiles").select("*").eq("id", data.user.id).maybeSingle();
      if (!profile?.active) return res.status(403).json({ message: "Admin access required" });
      return res.json({ token: data.session.access_token, user: { id: data.user.id, name: profile.name, email: data.user.email, role: profile.role, companyName: profile.company_name } });
    }
    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ message: "Unauthorized" });
    if (req.method === "POST" && path.join("/") === "admin/uploads") {
      const folder = req.body?.folder === "site" ? "site" : req.body?.folder === "rooms" ? "rooms" : "projects";
      const url = await uploadImage(req.body?.image, folder);
      if (typeof url !== "string") return res.status(400).json({ message: "Please select a valid image file." });
      return res.status(201).json({ url });
    }
    if (req.method === "POST" && path.join("/") === "admin/projects") {
      const value = await uploadProjectImages(req.body);
      const row = { ...value, hero_image: value.heroImage, floor_plans: value.floorPlans || [] };
      delete row.heroImage; delete row.floorPlans;
      const { data, error } = await supabaseAdmin.from("projects").insert(row).select().single();
      if (error) throw error;
      return res.status(201).json(projectOut(data));
    }
    if (req.method === "DELETE" && path[0] === "admin" && path[1] === "projects") {
      const { data, error } = await supabaseAdmin.from("projects").delete().eq("id", path[2]).select().maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ message: "Project not found" });
      return res.json({ ok: true, message: "Project deleted" });
    }
    if (req.method === "POST" && path.join("/") === "admin/categories") {
      const { data, error } = await supabaseAdmin.from("categories").insert(req.body).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === "DELETE" && path[0] === "admin" && path[1] === "categories" && path[2]) {
      const categoryId = path[2];
      const { count, error: countError } = await supabaseAdmin
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("category", categoryId);
      if (countError) throw countError;
      if ((count || 0) > 0) {
        return res.status(409).json({ message: "This category cannot be deleted because it is assigned to one or more projects." });
      }

      const { data, error } = await supabaseAdmin.from("categories").delete().eq("id", categoryId).select().maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ message: "Category not found" });
      return res.json({ ok: true, message: "Category deleted" });
    }
    if (req.method === "PUT" && path.join("/") === "admin/site-settings") {
      const heroImage = await uploadImage(req.body?.heroImage, "site");
      const { data, error } = await supabaseAdmin.from("site_settings").upsert({ key: "public-site", hero_image: heroImage }).select().single();
      if (error) throw error;
      return res.json({ heroImage: data.hero_image });
    }
    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    return res.status(400).json({ message: publicError(error) });
  }
}

export const config = { api: { bodyParser: { sizeLimit: "5mb" } } };
