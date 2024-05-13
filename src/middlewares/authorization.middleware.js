import ApiError from "../helpers/ApiError.js";
import { Role } from "../models/role.model.js";
import asyncHandler from "../helpers/asyncHandler.js";

// check authorization and give access to perform the taks
const authorization = (allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    const user = req.user;
    const role = user.role.slug;
    if (!user || !role) throw new ApiError("Un-authorized request");

    if (!allowedRoles.some((allowedRole) => allowedRole == role))
      throw new ApiError(403, "Permision denied");
    
    next();
  });

export default authorization;
