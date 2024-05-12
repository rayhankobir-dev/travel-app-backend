import mongoose from "mongoose";

const transportMediumSchema = new mongoose.Schema({
  transportId: { type: String, required: true, unique: true },
  medium: { type: String },
  icon: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const TransportMedium = mongoose.model(
  "TransportMedium",
  transportMediumSchema
);
