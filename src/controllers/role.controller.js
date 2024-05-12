import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Role } from "../models/role.model.js";

export const createRole = asyncHandler(async (req, res) => {
  const { slug } = req.body;
  try {
    const role = await Role.findOne({ slug });
    if (role) new ApiError(409, "Role already exist");

    const createdRole = await Role.create({ slug });
    return res
      .status(201)
      .json(
        new ApiResponse(201, "Successfully role created", { role: createdRole })
      );
  } catch (error) {
    console.log(error);
  }
});

export const deleteRole = asyncHandler(async (req, res) => {
  const { roleId } = req.body;
  try {
    const role = await Role.findById(roleId);
    if (!role) new ApiError(409, "Role doesn't exist");

    const createdRole = await Role.findByIdAndDelete(roleId);
    return res.status(200).json(
      new ApiResponse(201, "Role has been successfully deleted", {
        role: createdRole,
      })
    );
  } catch (error) {
    console.log(error);
  }
});
