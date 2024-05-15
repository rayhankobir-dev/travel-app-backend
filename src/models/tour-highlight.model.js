import mongoose from "mongoose";

const tourHighlightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const TourHighlight = mongoose.model(
  "TourHighlight",
  tourHighlightSchema
);
