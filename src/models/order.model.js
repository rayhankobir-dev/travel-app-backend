import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderPlacedAt: { type: Date },
  status: { type: String },
  isModified: { type: Boolean },
  perPersonCost: { type: Number },
  totalPerson: { type: Number },
  taxApplied: { type: Number },
  totalCost: { type: Number },
  transactionId: { type: String },
  paymentMethod: { type: String },
  paymentAmount: { type: Number },
  paymentedAt: { type: Date },
});

const orderHistorySchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
});

export const Order = mongoose.model("Order", orderSchema);
export const OrderHistory = mongoose.model("OrderHistory", orderHistorySchema);
