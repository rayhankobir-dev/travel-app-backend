import mongoose from "mongoose";

const tourServiceSchema = new mongoose.Schema({
  serviceId: { type: String, required: true, unique: true },
  service: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const TourService = mongoose.model("TourService", tourServiceSchema);
