// lib/mongoose.js
import mongoose from "mongoose";

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    return; // If already connected, do nothing
  }
  const MONGODB_URI = process.env.MONGODB_URI || "";
  console.log("Mongo URI", MONGODB_URI);

  // MongoDB connection string
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    });
};

export default connectToDatabase;
