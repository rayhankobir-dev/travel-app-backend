import mongoose from "mongoose";

const schema = new mongoose.Schema({
  tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["PENDING", "SUCCESS", "CANCELLED"] },
  totalPerson: { type: Number, required: true },
  tax: { type: Number, required: true, default: 0 },
  appliedTaxAmount: { type: Number, required: true },
  perPersonCost: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  bookedAt: { type: Date, default: Date.now },
  isModified: { type: Boolean, default: false },
  modifiedAt: { type: Date },
  tx: { type: String },
  txHistory: [{ type: mongoose.Types.ObjectId, ref: "Transaction" }],
});

export const Booking = mongoose.model("Booking", schema);
