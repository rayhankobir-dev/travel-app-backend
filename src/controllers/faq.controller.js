import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { TourFaq } from "../models/tour-faq.model.js";

export const addQuestion = asyncHandler(async (req, res) => {
  try {
    const question = TourFaq.create({ ...req.body });

    return res.status(201).json(
      new ApiResponse(201, "Question has been successfully created", {
        question,
      })
    );
  } catch (error) {
    throw error;
  }
});

export const editQuestion = asyncHandler(async (req, res) => {
  const { questionId, ...data } = req.body;
  try {
    const question = Location.findById(questionId);
    if (!question) throw new ApiError(404, "Question doesn't exist");

    const updatedQuestion = await TourFaq.findByIdAndUpdate({ ...data });

    return res.status(200).json(
      new ApiResponse(200, "Question has been successfully updated", {
        question: updatedQuestion,
      })
    );
  } catch (error) {
    throw error;
  }
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.body;
  try {
    const question = await TourFaq.findById(questionId);
    if (!question) throw new ApiError(404, "Question doesn't exist");

    return res.status(200).json(
      new ApiResponse(201, "Question has been successfully deleted", {
        question,
      })
    );
  } catch (error) {
    throw error;
  }
});