import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Tour } from "../models/tour.model.js";

export const createTrip = asyncHandler(async (req, res) => {
  try {
    const tour = Tour.create({ ...req.body });
  } catch (error) {
    throw error;
  }
});
