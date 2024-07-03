import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Tour } from "../models/tour.model.js";
import { Location } from "../models/location.model.js";

export const getTrips = asyncHandler(async (req, res) => {
  const { location, from, to, maxPrice, sort } = req.query;

  let filter = {};

  if (location) {
    const loc = await Location.findOne({ location }).exec();
    if (loc) {
      filter.location = loc._id;
    }
  }

  if (from && to) {
    filter.startedAt = { $gte: new Date(from), $lte: new Date(to) };
  }

  if (maxPrice) {
    filter.cost = { $lte: Number(maxPrice) };
  }

  let sortOption = {};
  switch (sort) {
    case "az":
      sortOption = { title: 1 };
      break;
    case "za":
      sortOption = { title: -1 };
      break;
    case "hl":
      sortOption = { cost: -1 };
      break;
    case "lh":
      sortOption = { cost: 1 };
      break;
    default:
      sortOption = {};
  }

  try {
    const trips = await Tour.aggregate([
      { $match: filter || {} },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "tour",
          as: "bookings",
        },
      },
      {
        $addFields: {
          bookingCount: { $size: "$bookings" },
        },
      },
      {
        $project: {
          activities: 0,
          services: 0,
          faqs: 0,
          highlights: 0,
          bookings: 0, // Exclude the bookings array if you only want the count
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "location",
        },
      },
      { $unwind: "$location" },
    ]);

    res.status(200).json(new ApiResponse(200, "Success", { trips }));
  } catch (error) {
    throw error;
  }
});

export const getTripsBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  try {
    const trip = await Tour.aggregate([
      { $match: { slug } },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "tour",
          as: "bookings",
        },
      },
      {
        $addFields: {
          bookingCount: { $size: "$bookings" },
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "location",
        },
      },
      {
        $unwind: "$location",
      },
    ]);

    if (!trip || trip.length === 0)
      throw new ApiError(404, "Trip doesn't exist");

    return res
      .status(200)
      .json(new ApiResponse(200, "Success", { trip: trip[0] }));
  } catch (error) {
    throw error;
  }
});

export const getPopularTours = asyncHandler(async (req, res) => {
  try {
    const trips = await Tour.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "tour",
          as: "bookings",
        },
      },
      {
        $addFields: {
          bookingCount: { $size: "$bookings" },
        },
      },
      {
        $project: {
          activities: 0,
          services: 0,
          faqs: 0,
          highlights: 0,
          bookings: 0,
        },
      },
      {
        $sort: { bookingCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    return res.status(200).json(new ApiResponse(200, "Success", { trips }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const createTrip = asyncHandler(async (req, res) => {
  try {
    const trip = await Tour.create({ ...req.body });
    return res.status(201).json(
      new ApiResponse(201, "Trip has been successfully created", {
        trip,
      })
    );
  } catch (error) {
    throw error;
  }
});

export const uploadImages = asyncHandler(async (req, res) => {
  try {
    const urls = req.files.map((file) => ({
      url: `https://api.ghureashi.xyz/uploads/trips/${file.filename}`,
    }));
    res.status(200).json({ urls, message: "Files uploaded successfully" });
  } catch (error) {
    throw error;
  }
});

export const updateTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const trip = await Tour.findById(id);
    if (!trip) throw new ApiError(404, "Trip doesn't exist");

    const updatedTrip = await Tour.findByIdAndUpdate(trip._id, req.body, {
      new: true,
    });

    return res.status(200).json(
      new ApiResponse(200, "Trip has been successfully updated", {
        trip: updatedTrip,
      })
    );
  } catch (error) {
    throw error;
  }
});

export const deleteTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const trip = await Tour.findById(id);
    if (!trip) throw new ApiError(404, "Trip doesn't exist");

    await Tour.findByIdAndDelete(id);
    return res.status(200).json(
      new ApiResponse(200, "Trip has been successfully deleted", {
        trip,
      })
    );
  } catch (error) {
    throw error;
  }
});

export const getTripById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const trip = await Tour.findById(id).populate("location");

    if (!trip) throw new ApiError(400, "Trip doesn't exist");
    return res.status(200).json(new ApiResponse(200, "Success", { trip }));
  } catch (error) {
    throw error;
  }
});
