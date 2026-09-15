import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { connectDB } from "./db.js";
import { Project } from "./models/Project.js";
import { Category } from "./models/Category.js";
import { AdminUser } from "./models/AdminUser.js";
import { SiteSettings } from "./models/SiteSettings.js";
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

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const serializeProject = (project) => {
  const data = project.toObject ? project.toObject() : project;
  return { ...data, id: String(data._id), _id: undefined };
};

const isValidObjectId = (value) => typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
const defaultHeroImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&h=1400&fit=crop&auto=format";

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "RDS API is running", imageStorage: hasCloudinaryConfig() ? "cloudinary" : "database-fallback" });
});

app.get("/api/projects", async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects.map(serializeProject));
});

app.get("/api/projects/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid project id" });
  }

  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  return res.json(serializeProject(project));
});

app.get("/api/categories", async (req, res) => {
  const categories = await Category.find().sort({ createdAt: 1 });
  res.json(categories);
});

app.get("/api/site-settings", async (req, res) => {
  const settings = await SiteSettings.findOne({ key: "public-site" }).lean();
  return res.json({ heroImage: settings?.heroImage || defaultHeroImage });
});

app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await AdminUser.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" },
  );

  return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, companyName: user.companyName } });
});

app.get("/api/admin/me", requireAuth, async (req, res) => {
  const user = await AdminUser.findById(req.user.id).select("-passwordHash");
  return res.json({ user });
});

app.post("/api/admin/projects", requireAuth, async (req, res) => {
  try {
    const payload = await storeProjectImages(req.body);
    const project = await Project.create({
      ...payload,
      status: payload.status || "draft",
    });
    return res.status(201).json(serializeProject(project));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create project";
    return res.status(400).json({ message });
  }
});

app.put("/api/admin/projects/:id", requireAuth, async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid project id" });
  }
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  return res.json(serializeProject(project));
});

app.delete("/api/admin/projects/:id", requireAuth, async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid project id" });
  }
  const project = await Project.findByIdAndDelete(req.params.id);
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

  const category = await Category.create({ id, name, count });
  return res.status(201).json(category);
});

app.put("/api/admin/site-settings", requireAuth, async (req, res) => {
  const { heroImage } = req.body || {};
  if (!heroImage || typeof heroImage !== "string" || !heroImage.startsWith("data:image/")) {
    return res.status(400).json({ message: "A valid hero image is required" });
  }

  const storedHeroImage = await storeImage(heroImage, "rds-studio/site");
  const settings = await SiteSettings.findOneAndUpdate(
    { key: "public-site" },
    { key: "public-site", heroImage: storedHeroImage },
    { new: true, upsert: true, runValidators: true },
  ).lean();
  return res.json({ heroImage: settings.heroImage });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const message = error instanceof Error ? error.message : "Request failed";
  return res.status(400).json({ message });
});

const seedDefaultAdmin = async () => {
  const adminEmail = "admin@rds.com";
  const existing = await AdminUser.findOne({ email: adminEmail });

  if (!existing) {
    const passwordHash = await bcrypt.hash("rds2024", 10);
    await AdminUser.create({
      name: "RDS Admin",
      email: adminEmail,
      passwordHash,
      role: "super-admin",
      companyName: "Red Door Studio",
      active: true,
    });
    console.log("Default admin account created: admin@rds.com / rds2024");
  }
};

const startServer = async () => {
  const connected = await connectDB();

  if (!connected) {
    console.error("API was not started because MongoDB is unavailable.");
    process.exitCode = 1;
    return;
  }

  await seedDefaultAdmin();
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
};

startServer();
