import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  locationId: { type: String, required: true, unique: true },
  location: { type: String },
  lon: { type: Number },
  lat: { type: Number },
  country: { type: String },
  countryCode: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Location = mongoose.model("Location", locationSchema);
