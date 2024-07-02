import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Transaction } from "../models/transaction.model.js";

export const getAllTransaction = asyncHandler(async (req, res) => {
  const { type } = req.query;
  try {
    const filter = {};
    if (type) {
      filter.transactionType = type;
    }
    const transactions = await Transaction.find(filter);
    return res.status(200).json({ transactions });
  } catch (error) {
    throw error;
  }
});
