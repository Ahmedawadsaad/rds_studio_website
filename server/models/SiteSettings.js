import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true },
    heroImage: { type: String, required: true },
  },
  { timestamps: true },
);

export const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", siteSettingsSchema);
