import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn("MONGODB_URI is not set. Set it in .env before starting the API.");
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    console.log("MongoDB connected");
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("MongoDB connection failed:", message);

    if (/bad auth|authentication failed|auth failed/i.test(message)) {
      console.error(
        "Check the Atlas database username/password, URL-encode special characters in the password, and confirm the user has access to the target database.",
      );
    } else if (/querySrv|ENOTFOUND|ECONNREFUSED|timed out/i.test(message)) {
      console.error(
        "Check the Atlas cluster address, network access/IP allowlist, and internet connection.",
      );
    }

    return false;
  }
}