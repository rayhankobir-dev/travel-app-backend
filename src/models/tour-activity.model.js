import mongoose from "mongoose";

const tourActivitySchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const TourActivity = mongoose.model("TourActivity", tourActivitySchema);
