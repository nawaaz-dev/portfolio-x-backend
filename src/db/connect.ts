// src/db/mongoose.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const db = {
  connected: false,
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING!, {
      dbName: process.env.MONGODB_DATABASE_NAME,
    });
    console.log("MongoDB connected");
    db.connected = true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
