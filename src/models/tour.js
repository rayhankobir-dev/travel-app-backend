import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
  tourId: { type: String, required: true, unique: true },
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
  transportation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TransportMedium",
  },
  faqs: [{ type: mongoose.Schema.Types.ObjectId, ref: "TourFaq" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Tour = mongoose.model("Tour", tourSchema);
