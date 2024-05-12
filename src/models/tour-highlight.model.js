import mongoose from "mongoose";

const tourHighlightSchema = new mongoose.Schema({
  highLight: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const TourHighlight = mongoose.model(
  "TourHighlight",
  tourHighlightSchema
);
