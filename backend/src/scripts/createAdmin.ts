import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    const email = "admin@tapnom.com";
    const password = "admin12345";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      name: "System Admin",
      email,
      passwordHash,
      role: "ADMIN"
    });

    console.log("Admin created successfully");
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();