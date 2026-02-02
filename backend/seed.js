import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/user.model.js";
import Student from "./models/student.model.js";
import Thread from "./models/thread.model.js";
import JobPosting from "./models/jobPosting.model.js";
import JobApplication from "./models/JobApplication.model.js";
import Comment from "./models/comment.model.js";

dotenv.config();

const seedData = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected for seeding");

    // Guard against accidental production data loss
    if (process.env.NODE_ENV === "production" && process.env.SEED_CONFIRM !== "YES") {
      throw new Error("Refusing to seed in production without SEED_CONFIRM=YES");
    }

    // Clear existing data
    console.log("Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Thread.deleteMany({}),
      JobPosting.deleteMany({}),
      JobApplication.deleteMany({}),
      Comment.deleteMany({}),
    ]);
    
    console.log("Data cleared.");

    // TODO: Add seeding logic here

    console.log("Seeding completed.");
    process.exit(0);
  } catch (error) {
    console.error("Error with seeding:", error);
    process.exit(1);
  }
};

seedData();
