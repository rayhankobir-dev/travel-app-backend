import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Tour } from "../models/tour.model.js";
import { Location } from "../models/location.model.js";

export const getTrips = asyncHandler(async (req, res) => {
  const { location, from, to, maxPrice, sort } = req.query;

  console.log(req.query);

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
    const trips = await Tour.find(filter)
      .sort(sortOption)
      .populate("location")
      .select("-activities -services -faqs -highlights");
    res.json({ data: { trips } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export const getTripsBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  try {
    const trip = await Tour.findOne({ slug: slug }).populate("location");
    if (!trip) throw new ApiError(404, "Trip doesn't exist");

    return res.status(200).json(new ApiResponse(200, "Success", { trip }));
  } catch (error) {
    throw error;
  }
});

export const getPopularTours = asyncHandler(async (req, res) => {
  try {
    const trips = await Tour.find().sort({ bookings: -1 }).limit(10);

    return res.status(200).json(new ApiResponse(200, "Success", { trips }));
  } catch (error) {
    throw error;
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
      url: `http://localhost:3000/uploads/trips/${file.filename}`,
    }));
    res.status(200).json({ urls, message: "Files uploaded successfully" });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ error: "Failed to upload files" });
  }
});

export const updateTrip = asyncHandler(async (req, res) => {
  const { tripId, ...data } = req.body;
  try {
    const trip = await Tour.findById(tripId);
    if (!trip) throw new ApiError(404, "Trip doesn't exist");

    const updatedTrip = await Tour.findByIdAndUpdate(tripId, data, {
      new: true,
    });

    return res.status(200).json(
      new ApiResponse(200, "Trip has been successfully updated", {
        trip: updateTrip,
      })
    );
  } catch (error) {
    throw error;
  }
});

export const deleteTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log(id);
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
