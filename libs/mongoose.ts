import mongoose from "mongoose";

const cached = (globalThis as any).mongoose || { conn: null, promise: null };

export default async function connectDB() {
  mongoose.set("strictQuery", true);

  if (cached.conn) {
    console.log("Already connected to DB");
    return { success: true, message: "" };
  }

  if (!process.env.MONGODB_URL)
    return { success: false, message: "DB URL not found" };

  if (!cached.promise) {
    try {
      cached.promise = mongoose.connect(process.env.MONGODB_URL);
    } catch (error) {
      console.log(`Failed to connect to DB: ${error}`);
      return {
        success: false,
        message: "An error occurred when connect to DB",
      };
    }
  }

  cached.conn = await cached.promise;
  (globalThis as any).mongoose = cached.conn;

  return { success: true, message: "" };
}
