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

    req.user = await validateToken(accessToken);

    next();
  } catch (error) {
    throw error;
  }
});

const validateToken = async (token) => {
  const payload = jwt.decode(token, tokenConfig.secret);
  if (!payload) throw new ApiError(401, "Invalid Access token");

  const user = await User.findById(payload?._id)
    .select("-password")
  if (!user) throw new ApiError(401, "Invalid Access Token");
  return user;
};

export default auth;
