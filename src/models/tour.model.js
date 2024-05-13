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
  highlights: [{ type: String }],
  services: [{ type: String }],
  location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  faqs: [{ type: mongoose.Schema.Types.ObjectId, ref: "TourFaq" }],
  activities: [
    {
      activityId: { type: mongoose.Schema.Types.ObjectId, ref: "TourActivity" },
      order: { type: Number },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Tour = mongoose.model("Tour", tourSchema);
