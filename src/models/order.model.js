import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String },
  totalPerson: { type: Number },
  tax: {type: Number},
  appliedTax: { type: Number },
  perPersonCost: { type: Number },
  totalCost: { type: Number },
  transactionId: { type: String, unique: true },
  isEdited: { type: Boolean },
  paymentTX: {type: String},
  storeAmount: {type: Number},
  paymentMethod: { type: String },
  paymentAmount: { type: Number },
  orderPlacedAt: { type: Date },
  paymentedAt: { type: Date },
});

// const orderHistorySchema = new mongoose.Schema({
//   ...orderSchema,
//   order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
// });

export const Order = mongoose.model("Order", orderSchema);
// export const OrderHistory = mongoose.model("OrderHistory", orderHistorySchema);
