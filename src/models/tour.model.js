import mongoose from "mongoose";

export const schema = new mongoose.Schema(
  {
    title: { type: String },
    slug: { type: String },
    overview: { type: String },
    cost: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    groupSize: { type: Number, required: true, default: 0 },
    startedAt: { type: Date },
    endedAt: { type: Date },
    duration: { type: Number, required: true, default: 0 },
    minAge: { type: Number, required: true, default: 0 },
    maxAge: { type: Number, required: true, default: 80 },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    highlights: [{ type: String }],
    services: [{ type: String }],
    activities: [{ title: { type: String }, description: { type: String } }],
    faqs: [{ question: { type: String }, answer: { type: String } }],
    images: [{ url: { type: String } }],
  },
  { timestamps: true }
);

export const Tour = mongoose.model("Tour", schema);
