import mongoose from "mongoose";

const tourServiceSchema = new mongoose.Schema({
  service: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const TourService = mongoose.model("TourService", tourServiceSchema);
