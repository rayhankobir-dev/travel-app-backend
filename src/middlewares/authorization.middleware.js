import ApiError from "../helpers/ApiError.js";
import asyncHandler from "../helpers/asyncHandler.js";

// check authorization and give access to perform the taks
const authorization = (allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    const user = req.user;
    const role = user.role;
    if (!user || !role) throw new ApiError("Access denied. Authentication required");

    if (!allowedRoles.some((allowedRole) => allowedRole == role))
      throw new ApiError(403, "Access denied. You do not have permission to access this resource.");
    
    next();
  });

export default authorization;
