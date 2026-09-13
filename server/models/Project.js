import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: [{ type: String }],
    materials: [{ type: String }],
  },
  { _id: false },
);

const floorPlanSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    image: { type: String, required: true },
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    year: { type: Number, required: true },
    status: { type: String, enum: ["published", "draft"], default: "draft" },
    thumbnail: { type: String, required: true },
    heroImage: { type: String, required: true },
    area: { type: String, default: "—" },
    description: { type: String, default: "" },
    floorPlans: [floorPlanSchema],
    rooms: [roomSchema],
  },
  { timestamps: true },
);

export const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
