import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { TourService } from "../models/tour-service.model.js";

export const addService = asyncHandler(async (req, res) => {
  try {
    const service = await TourService.create({ ...req.body });

    return res.status(201).json(
      new ApiResponse(201, "Service has been successfully created", {
        service,
      })
    );
  } catch (error) {
    throw error;
  }
});

export const editService = asyncHandler(async (req, res) => {
  const { serviceId, ...data } = req.body;
  try {
    const service = TourService.findById(serviceId);
    if (!service) throw new ApiError(404, "Service doesn't exist");

    const updatedService = await TourService.findByIdAndUpdate({ ...data });

    return res.status(200).json(
      new ApiResponse(200, "Service has been successfully updated", {
        service: updatedService,
      })
    );
  } catch (error) {
    throw error;
  }
});

export const deleteService = asyncHandler(async (req, res) => {
  const { serviceId } = req.body;
  try {
    const service = await TourService.findById(serviceId);
    if (!service) throw new ApiError(404, "Service doesn't exist");

    return res.status(200).json(
      new ApiResponse(201, "Service has been successfully deleted", {
        service,
      })
    );
  } catch (error) {
    throw error;
  }
});
