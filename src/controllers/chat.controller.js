import asyncHandler from "../helpers/asyncHandler.js";
import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import { Chat } from "../models/chat.model.js";
import mongoose from "mongoose";

export const getDistinctUsers = asyncHandler(async (req, res) => {
  try {
    const distinctSenders = await Chat.aggregate([
      { $match: { isAdmin: false } },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$sender",
          lastMessagedAt: { $first: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "senderDetails",
        },
      },
      { $unwind: "$senderDetails" },
      {
        $project: {
          _id: "$senderDetails._id",
          email: "$senderDetails.email",
          fullName: "$senderDetails.fullName",
          role: "$senderDetails.role",
          lastMessagedAt: 1,
        },
      },
    ]);

    res
      .status(200)
      .json(new ApiResponse(200, "Success", { users: distinctSenders }));
  } catch (error) {
    throw error;
  }
});

export const getUsersConversiations = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const objectId = new mongoose.Types.ObjectId(id);
    const conversations = await Chat.aggregate([
      {
        $match: {
          $or: [{ sender: objectId }, { reciever: objectId }],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiver",
          foreignField: "_id",
          as: "receiverDetails",
        },
      },
      { $unwind: "$senderDetails" },
      {
        $unwind: {
          path: "$receiverDetails",
          preserveNullAndEmptyArrays: true, // Handle cases where receiver is null
        },
      },
      {
        $project: {
          _id: 1,
          sender: {
            _id: "$senderDetails._id",
            email: "$senderDetails.email",
            fullName: "$senderDetails.fullName",
            role: "$senderDetails.role",
          },
          receiver: {
            _id: "$receiverDetails._id",
            email: "$receiverDetails.email",
            fullName: "$receiverDetails.fullName",
            role: "$receiverDetails.role",
          },
          message: 1,
          createdAt: 1,
          isAdmin: 1,
        },
      },
    ]);

    res.status(200).json(new ApiResponse(200, "Success", conversations));
  } catch (error) {
    throw error;
  }
});
