import jwt from "jsonwebtoken";
import { tokenConfig } from "../config.js";
import ApiError from "../helpers/ApiError.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../helpers/asyncHandler.js";

// check user authentication and set cureent user into the request
const auth = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      res.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) throw new ApiError(401, "Authentication required");
    
    const payload = jwt.decode(accessToken, tokenConfig.secret);
    if (!payload) throw new ApiError(401, "Invalid Access token");

    const user = await User.findById(payload?._id).select("-password").populate("role");
    if (!user) throw new ApiError(401, "Invalid Access Token");

    req.user = user;

    next();
  } catch (error) {
    throw error;
  }
});

export default auth;
