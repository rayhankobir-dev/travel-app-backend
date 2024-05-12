import mongoose from "mongoose";

const tourFaqSchema = new mongoose.Schema({
  question: { type: String },
  answer: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const TourFaq = mongoose.model("TourFaq", tourFaqSchema);
