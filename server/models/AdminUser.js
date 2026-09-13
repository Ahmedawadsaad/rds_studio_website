import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["super-admin", "studio-manager", "company-admin"], default: "company-admin" },
    companyName: { type: String, default: "Red Door Studio" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const AdminUser = mongoose.models.AdminUser || mongoose.model("AdminUser", adminUserSchema);
