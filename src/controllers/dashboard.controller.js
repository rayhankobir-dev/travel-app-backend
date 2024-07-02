import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Tour } from "../models/tour.model.js";
import { User } from "../models/user.model.js";
import { Booking } from "../models/booking.model.js";
import { Location } from "../models/location.model.js";
import { Transaction } from "../models/transaction.model.js";

export const getContent = asyncHandler(async (req, res) => {
  try {
    const totalAdmin = await User.countDocuments({ role: "admin" });
    const totalCustomer = await User.countDocuments({ role: "user" });
    const totalLocation = await Location.countDocuments();
    const totalTrips = await Tour.countDocuments();
    const totalPublishedTrips = await Tour.countDocuments();
    const totalPendingBooking = await Booking.countDocuments({
      status: "PENDING",
    });
    const totalSuccessBooking = await Booking.countDocuments({
      status: "SUCCESS",
    });
    const totalCancelledBooking = await Booking.countDocuments({
      status: "CANCELLED",
    });

    const bookingSummary = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalBookingAmount: { $sum: "$totalCost" },
          cancelledBookingsAmount: {
            $sum: {
              $cond: [{ $eq: ["$status", "CANCELLED"] }, "$totalCost", 0],
            },
          },
        },
      },
    ]);

    const transactionSummary = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalRefundedAmount: {
            $sum: {
              $cond: [{ $eq: ["$transactionType", "refund"] }, "$amount", 0],
            },
          },
          totalPaymentAmount: {
            $sum: {
              $cond: [{ $eq: ["$transactionType", "payment"] }, "$amount", 0],
            },
          },
          totalStoreAmount: {
            $sum: {
              $cond: [
                { $eq: ["$transactionType", "payment"] },
                "$storeAmount",
                0,
              ],
            },
          },
        },
      },
    ]);

    const latestBookings = await Booking.find()
      .sort({ orderPlacedAt: -1 })
      .limit(10)
      .populate("tour")
      .populate("user");
    const popularTours = await Tour.find()
      .sort({ bookings: -1 })
      .limit(5)
      .populate("location");

    const analytics = {
      totalAdmin,
      totalCustomer,
      totalLocation,
      totalTrips,
      totalPublishedTrips,
      totalPendingBooking,
      totalSuccessBooking,
      totalCancelledBooking,
      bookingSummary:
        bookingSummary.length > 0
          ? bookingSummary[0]
          : { totalBookingAmount: 0, cancelledBookingsAmount: 0 },
      transactionSummary:
        transactionSummary.length > 0
          ? transactionSummary[0]
          : {
              totalPaymentAmount: 0,
              totalRefundedAmount: 0,
              totalStoreAmount: 0,
            },
    };

    const dashboardData = {
      analytics,
      latestBookings,
      popularTours,
      geochartData: await getTourisAtrractionPlaceMap(),
      tripsLocationWisePieData: await getTourCountByLocation(),
    };

    res.status(200).json(new ApiResponse(200, "Success", dashboardData));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export const getTourCountByLocation = async () => {
  const result = await Tour.aggregate([
    {
      $group: {
        _id: "$location",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "locations",
        localField: "_id",
        foreignField: "_id",
        as: "location",
      },
    },
    {
      $unwind: {
        path: "$location",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        id: { $ifNull: ["$location.location", "Unknown"] },
        label: { $ifNull: ["$location.location", "Unknown"] },
        value: { $ifNull: ["$count", 0] },
        color: { $literal: "hsl(139, 70%, 50%)" },
      },
    },
  ]);
  return result;
};

export const getTourisAtrractionPlaceMap = async () => {
  const result = await Booking.aggregate([
    {
      $group: {
        _id: "$tour",
        totalBookings: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "tours",
        localField: "_id",
        foreignField: "_id",
        as: "tourData",
      },
    },
    {
      $unwind: "$tourData",
    },
    {
      $lookup: {
        from: "locations",
        localField: "tourData.location",
        foreignField: "_id",
        as: "locationData",
      },
    },
    {
      $unwind: "$locationData",
    },
    {
      $group: {
        _id: "$locationData.country",
        bookingCount: { $sum: "$totalBookings" },
      },
    },
    {
      $project: {
        _id: 0,
        country: "$_id",
        bookingCount: 1,
      },
    },
    {
      $sort: { bookingCount: -1 },
    },
  ]);

  let geoData = [["Country", "Bookings"]];
  geoData = [
    ...geoData,
    ...result.map((item) => [item.country, item.bookingCount]),
  ];
  return geoData;
};
