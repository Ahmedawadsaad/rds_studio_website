import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function storeImage(image, folder = "rds-studio") {
  if (typeof image !== "string" || !image.startsWith("data:image/")) return image;

  if (!isConfigured) {
    return image;
  }

  const result = await cloudinary.uploader.upload(image, {
    folder,
    resource_type: "image",
  });

  return result.secure_url;
}

export async function storeProjectImages(payload) {
  const project = { ...payload };
  project.thumbnail = await storeImage(project.thumbnail, "rds-studio/projects");
  project.heroImage = await storeImage(project.heroImage, "rds-studio/projects");

  if (Array.isArray(project.floorPlans)) {
    project.floorPlans = await Promise.all(
      project.floorPlans.map(async (floorPlan) => ({
        ...floorPlan,
        image: await storeImage(floorPlan.image, "rds-studio/floor-plans"),
      })),
    );
  }

  if (Array.isArray(project.rooms)) {
    project.rooms = await Promise.all(
      project.rooms.map(async (room) => ({
        ...room,
        images: Array.isArray(room.images)
          ? await Promise.all(room.images.map((image) => storeImage(image, "rds-studio/rooms")))
          : room.images,
      })),
    );
  }

  return project;
}

export function hasCloudinaryConfig() {
  return isConfigured;
}
