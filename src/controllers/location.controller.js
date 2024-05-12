import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Location } from "../models/location.model.js";

export const addLocation = asyncHandler(async (req, res) => {
  try {
    const location = Location.create({ ...req.body });

    return res.status(201).json(
      new ApiResponse(201, "Location has been successfully added", {
        location,
      })
    );
  } catch (error) {
    throw error;
  }
});

export const editLocation = asyncHandler(async (req, res) => {
  const { locationId, ...data } = req.body;
  try {
    const location = Location.findById(locationId);
    if (!location) throw new ApiError(404, "Location doesn't exist");

    const updatedLocation = await Location.findByIdAndUpdate({ ...data });

    return res.status(200).json(
      new ApiResponse(200, "Location has been successfully updated", {
        location: updatedLocation,
      })
    );
  } catch (error) {
    throw error;
  }
});

export const deleteLocation = asyncHandler(async (req, res) => {
  const { locationId } = req.body;
  try {
    const location = await Location.findById(locationId);
    if (!location) throw new ApiError(404, "Location doesn't exist");

    return res.status(200).json(
      new ApiResponse(201, "Location has been successfully deleted", {
        location,
      })
    );
  } catch (error) {
    throw error;
  }
});