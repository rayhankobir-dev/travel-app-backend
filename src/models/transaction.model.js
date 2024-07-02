import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true },
    bankTransactionId: { type: String, required: true, default: null },
    transactionType: {
      type: String,
      enum: ["payment", "refund"],
      default: "payment",
    },
    currency: { type: String, default: "BDT" },
    amount: { type: Number, required: true, default: 0 },
    storeAmount: { type: Number, required: true, default: 0 },
    paymentMethod: { type: String },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      required: true,
    },
    refundReason: { type: String },
    refundRefId: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
