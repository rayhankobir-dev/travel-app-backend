import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  location: { type: String, required: true },
  lon: { type: Number },
  lat: { type: Number },
  country: { type: String, required: true },
  countryCode: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Location = mongoose.model("Location", locationSchema);
