import mongoose from "mongoose";

export const tourSchema = new mongoose.Schema({
  title: { type: String },
  overview: { type: String },
  cost: { type: Number },
  tax: { type: Number },
  groupSize: { type: Number },
  startedAt: { type: Date },
  endedAt: { type: Date },
  duration: { type: Number },
  minAge: { type: Number },
  maxAge: { type: Number },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  highlights: [{ type: mongoose.Schema.Types.ObjectId, ref: "TourHighlight" }],
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "TourService" }],
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "TourActivity" }],
  faqs: [{ type: mongoose.Schema.Types.ObjectId, ref: "TourFaq" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Tour = mongoose.model("Tour", tourSchema);
