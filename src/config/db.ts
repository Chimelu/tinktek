import mongoose from "mongoose";
import { config } from "./env.config"; 

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI as string);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;

