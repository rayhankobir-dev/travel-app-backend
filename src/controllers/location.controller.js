import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Location } from "../models/location.model.js";
import { Tour } from "../models/tour.model.js";

export const getLocations = asyncHandler(async (req, res) => {
  try {
    const locations = await Location.find();
    return res.status(200).json(new ApiResponse(200, "Success", { locations }));
  } catch (error) {
    throw error;
  }
});

export const popularDestanition = asyncHandler(async (req, res) => {
  try {
    const popularLocations = await Tour.aggregate([
      {
        $group: {
          _id: "$location",
          tourCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "_id",
          foreignField: "_id",
          as: "locationDetails",
        },
      },
      {
        $unwind: "$locationDetails", // Unwind to access fields within locationDetails
      },
      {
        $project: {
          _id: 0,
          location: {
            _id: "$locationDetails._id",
            location: "$locationDetails.location",
            lon: "$locationDetails.lon",
            lat: "$locationDetails.lat",
            country: "$locationDetails.country",
            countryCode: "$locationDetails.countryCode",
            createdAt: "$locationDetails.createdAt",
            updatedAt: "$locationDetails.updatedAt",
          },
          tourCount: 1,
        },
      },
    ]);

    console.log(popularLocations);
  } catch (error) {
    throw error;
  }
});

export const addLocation = asyncHandler(async (req, res) => {
  try {
    const location = await Location.create({ ...req.body });

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
    const location = await Location.findById(locationId);
    if (!location) throw new ApiError(404, "Location doesn't exist");

    const updatedLocation = await Location.findByIdAndUpdate(locationId, data, {
      new: true,
    });

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

    await Location.findByIdAndDelete(location._id);

    return res.status(200).json(
      new ApiResponse(201, "Location has been successfully deleted", {
        location,
      })
    );
  } catch (error) {
    throw error;
  }
});
