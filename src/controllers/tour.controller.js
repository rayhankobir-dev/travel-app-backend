import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Tour } from "../models/tour.model.js";

export const getTrips = asyncHandler(async (req, res) => {
  try {
    const trips = await Tour.find().populate("highlights");

    return res.status(200).json(new ApiResponse(200, "Success", { trips }));
  } catch(error) {
    throw error;
  }
})

export const createTrip = asyncHandler(async (req, res) => {
  const {...data} = req.body;
  try {
    const trip = await Tour.create({ ...data });
    const populatedTrip = await trip.populate("highlights");

    return res.status(201).json(new ApiResponse(201, "Trip has been successfully created", {
      trip: populatedTrip
    })); 
  } catch (error) {
    throw error;
  }
});

export const updateTrip = asyncHandler(async (req, res) => {
  const { tripId, ...data} = req.body;
  try {
    const trip = await Tour.findById(tripId);
    if(!trip) throw new ApiError(404, "Trip doesn't exist");

    const updatedTrip = await Tour.findByIdAndUpdate(tripId, data, { new: true });

    return res.status(200).json(new ApiResponse(200, "Trip has been successfully updated", {
      trip: updateTrip
    }));
  } catch(error) {
    throw error;
  }
})

export const deleteTrip = asyncHandler(async (req, res) => {
  const { tripId } = req.body;
  try {
    const trip = await Tour.findById(tripId);
    if(!trip) throw new ApiError(404, "Trip doesn't exist");

    await Tour.findByIdAndDelete(tripId);

    return res.status(200).json(new ApiResponse(200, "Trip has been successfully deleted", {
      trip
    }));
  } catch(error) {
    throw error;
  }
})