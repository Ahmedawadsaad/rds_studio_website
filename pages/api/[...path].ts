import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin, supabaseAuth } from "../../lib/supabaseAdmin";

const defaultHeroImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&h=1400&fit=crop&auto=format";
const defaultSiteContent = {
  aboutParagraphs: [
    "Red Door Studio was founded in Cairo with a single conviction: that every Egyptian family deserves a home designed with the same rigour and sensitivity as the great houses of the Mediterranean. We do not separate architecture from interior design — they are one discipline.",
    "Our process begins with listening. We map the way you move through your days — morning light at breakfast, evening gathering in the kitchen, the quality of silence in a bedroom — and translate those rhythms into floor plans, volumes, and materials.",
    "The palette we return to — black Marquina marble, custom walnut millwork, brushed brass, olive cabinetry — is not a signature style imposed on clients. It is a vocabulary we reach for because these materials age honestly, photograph beautifully, and endure.",
  ],
  projectsCompleted: "60+",
  yearsExperience: "8",
  email: "reddoorstudio25@gmail.com",
  phone: "+20 11 18324473",
};

function siteContentOut(row: any) {
  return {
    aboutParagraphs: Array.isArray(row?.about_paragraphs) && row.about_paragraphs.length === 3 ? row.about_paragraphs : defaultSiteContent.aboutParagraphs,
    projectsCompleted: row?.projects_completed || defaultSiteContent.projectsCompleted,
    yearsExperience: row?.years_experience || defaultSiteContent.yearsExperience,
    email: row?.email || defaultSiteContent.email,
    phone: row?.phone || defaultSiteContent.phone,
  };
}

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

async function uploadProjectImages(payload: any) {
  const result = { ...payload };
  result.thumbnail = await uploadImage(result.thumbnail, "projects");
  result.heroImage = await uploadImage(result.heroImage, "projects");
  if (Array.isArray(result.rooms)) {
    result.rooms = await Promise.all(result.rooms.map(async (room: any) => ({ ...room, images: await Promise.all((room.images || []).map((image: string) => uploadImage(image, "rooms"))) })));
  }
  return result;
}

function projectImageUrls(project: any): string[] {
  if (!project) return [];
  return [
    project.thumbnail,
    project.hero_image ?? project.heroImage,
    ...(project.rooms || []).flatMap((room: any) => room.images || []),
    ...(project.floor_plans ?? project.floorPlans ?? []).map((plan: any) => plan.image),
  ].filter((value): value is string => typeof value === "string");
}

function storagePathFromUrl(url: string): string | null {
  const marker = "/storage/v1/object/public/project-images/";
  const index = url.indexOf(marker);
  return index === -1 ? null : decodeURIComponent(url.slice(index + marker.length));
}

async function removeProjectImages(project: any, keepUrls: string[] = []) {
  const keep = new Set(keepUrls);
  const paths = [...new Set(projectImageUrls(project)
    .filter((url) => !keep.has(url))
    .map(storagePathFromUrl)
    .filter((path): path is string => Boolean(path)))];
  if (!paths.length) return;
  const { error } = await supabaseAdmin.storage.from("project-images").remove(paths);
  if (error) throw error;
}

function publicError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("payload") || message.includes("too large") || message.includes("size")) {
    return "This image is too large. Please choose a smaller image and try again.";
  }
  if (message.includes("duplicate") || message.includes("unique")) {
    return "An item with this name already exists. Choose a different name and try again.";
  }
  if (message.includes("column") || message.includes("schema cache") || message.includes("does not exist")) {
    return "This feature needs a database update before it can be used. Please contact the site owner.";
  }
  if (message.includes("password") || message.includes("weak_password")) {
    return "Choose a stronger password. Use at least 8 characters and avoid common passwords.";
  }
  if (message.includes("storage") || message.includes("bucket") || message.includes("image")) {
    return "We couldn't save this image. Try a different image or try again later.";
  }
  return "We couldn't complete that request. Check your internet connection and try again. If the problem continues, contact the site owner.";
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
      const [{ data: categories, error: categoriesError }, { data: projects, error: projectsError }] = await Promise.all([
        supabaseAdmin.from("categories").select("*").order("created_at", { ascending: true }),
        supabaseAdmin.from("projects").select("category"),
      ]);
      if (categoriesError || projectsError) throw categoriesError || projectsError;
      const counts = new Map<string, number>();
      for (const project of projects || []) counts.set(project.category, (counts.get(project.category) || 0) + 1);
      return res.json((categories || []).map((category) => ({ ...category, count: counts.get(category.id) || 0 })));
    }
    if (req.method === "GET" && path[0] === "site-settings") {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      const { data, error } = await supabaseAdmin.from("site_settings").select("hero_image").eq("key", "public-site").maybeSingle();
      if (error) throw error;
      return res.json({ heroImage: data?.hero_image || defaultHeroImage });
    }
    if (req.method === "GET" && path[0] === "site-content") {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      const { data, error } = await supabaseAdmin.from("site_settings").select("about_paragraphs, projects_completed, years_experience, email, phone").eq("key", "public-site").maybeSingle();
      if (error) throw error;
      return res.json(siteContentOut(data));
    }
    if (req.method === "POST" && path.join("/") === "admin/login") {
      const { email, password } = req.body || {};
      const { data, error } = await supabaseAuth.auth.signInWithPassword({ email: email?.toLowerCase(), password });
      if (error || !data.user || !data.session) return res.status(401).json({ message: "Your email or password is incorrect. Please check both and try again." });
      const { data: profile } = await supabaseAdmin.from("admin_profiles").select("*").eq("id", data.user.id).maybeSingle();
      if (!profile?.active) return res.status(403).json({ message: "This account does not have admin access. Please contact the site owner." });
      return res.json({ token: data.session.access_token, user: { id: data.user.id, name: profile.name, email: data.user.email, role: profile.role, companyName: profile.company_name } });
    }
    if (path[0] !== "admin") return res.status(404).json({ message: "We couldn't find that page. Check the address and try again." });
    const adminPath = path.join("/");
    const isKnownAdminRoute =
      (req.method === "GET" && adminPath === "admin/me") ||
      (req.method === "POST" && (adminPath === "admin/uploads" || adminPath === "admin/projects" || adminPath === "admin/categories")) ||
      (req.method === "PUT" && (adminPath === "admin/site-settings" || adminPath === "admin/password" || (path.length === 3 && path[1] === "projects" && Boolean(path[2])))) ||
      (req.method === "PUT" && adminPath === "admin/site-content") ||
      (req.method === "DELETE" && (path.length === 3 && (path[1] === "projects" || path[1] === "categories") && Boolean(path[2])));
    if (!isKnownAdminRoute) return res.status(404).json({ message: "We couldn't find that admin page. Please return to the admin dashboard." });
    const admin = await requireAdmin(req);
    if (!admin) return res.status(401).json({ message: "Your sign-in has expired. Please sign in again." });
    if (req.method === "GET" && path.join("/") === "admin/me") {
      return res.json({ user: { id: admin.auth.id, name: admin.profile.name, email: admin.auth.email, role: admin.profile.role, companyName: admin.profile.company_name } });
    }
    if (req.method === "PUT" && adminPath === "admin/password") {
      const password = req.body?.password;
      const currentPassword = req.body?.currentPassword;
      if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({ message: "Your new password must be at least 8 characters." });
      }
      if (typeof currentPassword !== "string") return res.status(400).json({ message: "Enter your current password." });
      const { error: verifyError } = await supabaseAuth.auth.signInWithPassword({ email: admin.auth.email!, password: currentPassword });
      if (verifyError) return res.status(400).json({ message: "Your current password is incorrect." });
      const { error } = await supabaseAdmin.auth.admin.updateUserById(admin.auth.id, { password });
      if (error) throw error;
      return res.json({ ok: true, message: "Password updated successfully." });
    }
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
    if (req.method === "PUT" && path[0] === "admin" && path[1] === "projects" && path[2]) {
      const { data: existing, error: existingError } = await supabaseAdmin.from("projects").select("*").eq("id", path[2]).maybeSingle();
      if (existingError) throw existingError;
      if (!existing) return res.status(404).json({ message: "Project not found" });
      const value = await uploadProjectImages(req.body);
      const row = { ...value, hero_image: value.heroImage, floor_plans: value.floorPlans || [] };
      delete row.id; delete row.heroImage; delete row.floorPlans; delete row.createdAt; delete row.updatedAt; delete row.created_at; delete row.updated_at;
      const { data, error } = await supabaseAdmin.from("projects").update(row).eq("id", path[2]).select().maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ message: "Project not found" });
      await removeProjectImages(existing, projectImageUrls(data));
      return res.json(projectOut(data));
    }
    if (req.method === "DELETE" && path[0] === "admin" && path[1] === "projects") {
      const { data, error } = await supabaseAdmin.from("projects").delete().eq("id", path[2]).select().maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ message: "Project not found" });
      await removeProjectImages(data);
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
      res.setHeader("Cache-Control", "no-store");
      const heroImage = await uploadImage(req.body?.heroImage, "site");
      const { data, error } = await supabaseAdmin.from("site_settings").upsert({ key: "public-site", hero_image: heroImage }).select().single();
      if (error) throw error;
      return res.json({ heroImage: data.hero_image });
    }
    if (req.method === "PUT" && path.join("/") === "admin/site-content") {
      const body = req.body || {};
      const paragraphs = Array.isArray(body.aboutParagraphs) ? body.aboutParagraphs.slice(0, 3).map((value: unknown) => String(value).trim().slice(0, 3000)) : defaultSiteContent.aboutParagraphs;
      const content = {
        about_paragraphs: paragraphs,
        projects_completed: String(body.projectsCompleted || "").trim().slice(0, 40),
        years_experience: String(body.yearsExperience || "").trim().slice(0, 40),
        email: String(body.email || "").trim().slice(0, 254),
        phone: String(body.phone || "").trim().slice(0, 60),
      };
      if (!content.email || !content.phone || !content.projects_completed || !content.years_experience || paragraphs.length !== 3 || paragraphs.some((text: string) => !text)) {
        return res.status(400).json({ message: "Fill in all three About paragraphs, both statistics, your phone number, and your email before saving." });
      }
      const { data: currentSettings, error: currentError } = await supabaseAdmin.from("site_settings").select("hero_image").eq("key", "public-site").maybeSingle();
      if (currentError) throw currentError;
      const { data, error } = await supabaseAdmin.from("site_settings").upsert({ key: "public-site", hero_image: currentSettings?.hero_image || defaultHeroImage, ...content }).select("about_paragraphs, projects_completed, years_experience, email, phone").single();
      if (error) throw error;
      return res.json(siteContentOut(data));
    }
    return res.status(404).json({ message: "We couldn't find that page. Check the address and try again." });
  } catch (error) {
    return res.status(500).json({ message: publicError(error) });
  }
}

export const config = { api: { bodyParser: { sizeLimit: "5mb" } } };
