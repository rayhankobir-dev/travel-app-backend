import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Tour } from "../models/tour.model.js";
import { User } from "../models/user.model.js";
import { Booking } from "../models/booking.model.js";

export const getContent = asyncHandler(async (req, res) => {
  try {
    const latestOrders = await Booking.find()
      .sort({ orderPlacedAt: -1 })
      .limit(10)
      .populate("tour")
      .populate("user");
    const totalUsers = await User.countDocuments();
    const totalTours = await Tour.countDocuments();
    const totalOrders = await Booking.countDocuments();
    const popularTours = await Tour.find().sort({ bookings: -1 }).limit(5);
    const geochartData = await Tour.aggregate([
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "locationData",
        },
      },
      { $unwind: "$locationData" },
      {
        $group: {
          _id: "$locationData.country",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          country: "$_id",
          count: 1,
        },
      },
    ]);

    const orderStatusData = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]);

    const analytics = {
      totalUsers,
      totalTours,
      totalOrders,
    };

    const dashboardData = {
      latestOrders,
      analytics,
      popularTours,
      geochartData,
      orderStatusData,
    };

    res.status(200).json(new ApiResponse(200, "Success", dashboardData));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
