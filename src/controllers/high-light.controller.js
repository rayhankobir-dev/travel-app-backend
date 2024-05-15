import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { TourHighlight } from "../models/tour-highlight.model.js";

export const getHighlights = asyncHandler(async (req, res) => {
  try {
    const highlights = await TourHighlight.find();
    return res.status(200).json(new ApiResponse(200, "Success", {highlights}))
  } catch(error) {
    throw error;
  }
})

export const addHighlight = asyncHandler(async (req, res) => {
  try {
    const highlight = await TourHighlight.create({...req.body});

    return res.status(201).json(
      new ApiResponse(201, "Highlight has been successfully created", {
        highlight,
      })
    );
  } catch (error) {
    throw error;
  }
});

export const editHighlight = asyncHandler(async (req, res) => {
  const { highlightId, ...data } = req.body;
  try {
    const highlight = await TourHighlight.findById(highlightId);
    if (!highlight) throw new ApiError(404, "Highlight doesn't exist");

    const updatedHighlight = await TourHighlight.findByIdAndUpdate(highlightId, data, { new: true });

    return res.status(200).json(
      new ApiResponse(200, "Highlight has been successfully updated", {
        highlight: updatedHighlight,
      })
    );
  } catch (error) {
    throw error;
  }
});

export const deleteHighlight = asyncHandler(async (req, res) => {
  const { highlightId } = req.body;
  try {
    const highlight = await TourHighlight.findById(highlightId);
    if (!highlight) throw new ApiError(404, "Highlight doesn't exist");

    await TourHighlight.findByIdAndDelete(highlightId)

    return res.status(200).json(
      new ApiResponse(201, "Highlight has been successfully deleted", {
        highlight,
      })
    );
  } catch (error) {
    throw error;
  }
});
