import { tokenConfig } from "../config.js";
import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signupUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) throw new ApiError(409, "Email already exist");

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json(
      new ApiResponse(201, "Successfully account created", {
        user: createdUser,
      })
    );
  } catch (error) {
    throw error;
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(409, "User dosen't exist");

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) throw new ApiError(403, "Invalid credentials");

    const fetchedUser = await User.findById(user._id).select("-password");

    const token = jwt.sign(
      { _id: user._id, email: user.email, fullName: user.fullName },
      tokenConfig.secret,
      {
        expiresIn: tokenConfig.expiry,
      }
    );

    return res.status(200).json(
      new ApiResponse(200, "Successfully logged in", {
        user: fetchedUser,
        token,
      })
    );
  } catch (error) {
    throw error;
  }
});

export const getProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json(new ApiResponse(200, "Success", { user }));
  } catch (error) {
    throw error;
  }
});

export const getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  try {
    const filter = {};
    if (role) {
      filter.role = role;
    }
    const users = await User.find(filter);
    return res.status(200).json({ users });
  } catch (error) {
    throw error;
  }
});
