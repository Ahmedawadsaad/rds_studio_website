import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase, getSupabaseUser } from "./supabase.js";
import { hasCloudinaryConfig, storeImage, storeProjectImages } from "./media.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "20mb" }));

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const user = await getSupabaseUser(token);
  if (!user) return res.status(401).json({ message: "Invalid token" });

  const { data: profile } = await supabase.from("admin_profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile?.active) return res.status(403).json({ message: "Admin access required" });
  req.user = { ...user, profile };
  return next();
};

const serializeProject = (project) => ({
  ...project,
  id: project.id,
  heroImage: project.hero_image,
  floorPlans: project.floor_plans || [],
  createdAt: project.created_at,
  updatedAt: project.updated_at,
});
const defaultHeroImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&h=1400&fit=crop&auto=format";

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "RDS API is running", imageStorage: hasCloudinaryConfig() ? "cloudinary" : "database-fallback" });
});

app.get("/api/projects", async (req, res) => {
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ message: error.message });
  res.json((data || []).map(serializeProject));
});

app.get("/api/projects/:id", async (req, res) => {
  const { data: project, error } = await supabase.from("projects").select("*").eq("id", req.params.id).maybeSingle();
  if (error) return res.status(400).json({ message: error.message });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  return res.json(serializeProject(project));
});

app.get("/api/categories", async (req, res) => {
  const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: true });
  if (error) return res.status(500).json({ message: error.message });
  res.json(data || []);
});

app.get("/api/site-settings", async (req, res) => {
  const { data: settings } = await supabase.from("site_settings").select("hero_image").eq("key", "public-site").maybeSingle();
  return res.json({ heroImage: settings?.hero_image || defaultHeroImage });
});

app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email: email.toLowerCase(), password });
  if (error || !data.user || !data.session) return res.status(401).json({ message: "Invalid credentials" });
  const { data: profile } = await supabase.from("admin_profiles").select("*").eq("id", data.user.id).maybeSingle();
  if (!profile?.active) return res.status(403).json({ message: "Admin access required" });
  return res.json({ token: data.session.access_token, user: { id: data.user.id, name: profile.name, email: data.user.email, role: profile.role, companyName: profile.company_name } });
});

app.get("/api/admin/me", requireAuth, async (req, res) => {
  return res.json({ user: { id: req.user.id, name: req.user.profile.name, email: req.user.email, role: req.user.profile.role, companyName: req.user.profile.company_name } });
});

app.post("/api/admin/projects", requireAuth, async (req, res) => {
  try {
    const payload = await storeProjectImages(req.body);
    const projectPayload = { ...payload, hero_image: payload.heroImage, floor_plans: payload.floorPlans || [], status: payload.status || "draft" };
    delete projectPayload.heroImage;
    delete projectPayload.floorPlans;
    const { data: project, error } = await supabase.from("projects").insert(projectPayload).select().single();
    if (error) return res.status(400).json({ message: error.message });
    return res.status(201).json(serializeProject(project));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create project";
    return res.status(400).json({ message });
  }
});

app.put("/api/admin/projects/:id", requireAuth, async (req, res) => {
  const updates = { ...req.body, hero_image: req.body.heroImage, floor_plans: req.body.floorPlans };
  delete updates.heroImage;
  delete updates.floorPlans;
  const { data: project, error } = await supabase.from("projects").update(updates).eq("id", req.params.id).select().maybeSingle();
  if (error) return res.status(400).json({ message: error.message });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  return res.json(serializeProject(project));
});

app.delete("/api/admin/projects/:id", requireAuth, async (req, res) => {
  const { data: project, error } = await supabase.from("projects").delete().eq("id", req.params.id).select().maybeSingle();
  if (error) return res.status(400).json({ message: error.message });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  return res.json({ ok: true, message: "Project deleted" });
});

app.post("/api/admin/categories", requireAuth, async (req, res) => {
  const { id, name, count = 0 } = req.body || {};
  if (!id || !name) {
    return res.status(400).json({ message: "Category id and name are required" });
  }

  const { data: category, error } = await supabase.from("categories").insert({ id, name, count }).select().single();
  if (error) return res.status(400).json({ message: error.message });
  return res.status(201).json(category);
});

app.put("/api/admin/site-settings", requireAuth, async (req, res) => {
  const { heroImage } = req.body || {};
  if (!heroImage || typeof heroImage !== "string" || !heroImage.startsWith("data:image/")) {
    return res.status(400).json({ message: "A valid hero image is required" });
  }

  const storedHeroImage = await storeImage(heroImage, "rds-studio/site");
  const { data: settings, error } = await supabase.from("site_settings").upsert({ key: "public-site", hero_image: storedHeroImage }).select().single();
  if (error) return res.status(400).json({ message: error.message });
  return res.json({ heroImage: settings.hero_image });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const message = error instanceof Error ? error.message : "Request failed";
  return res.status(400).json({ message });
});

const startServer = async () => {
  const { error } = await supabase.from("categories").select("id").limit(1);
  if (error) {
    console.error("Supabase connection failed:", error.message);
    process.exitCode = 1;
    return;
  }
  app.listen(PORT, () => {
    console.log(`Supabase API listening on http://localhost:${PORT}`);
  });
};

startServer();
