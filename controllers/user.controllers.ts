import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import AsyncHandler from "../utils/AsyncHandler";
import User from "../models/user.model";

interface RegisterRequest extends Request {
  body: {
    fullName: string;
    email: string;
    password: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

const signupUser = AsyncHandler(async (req: RegisterRequest, res: Response) => {
  const { fullName, email, password } = req.body;

  if ([fullName, email, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "User registration failed, please try again");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully!!!"));
});

const signinUser = AsyncHandler(async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  if ([email, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found. Try to register first");
  }
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  //access token
  const accessToken = await user.generateAccessToken();

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, { accessToken }, "User logged in successfully"));
});

const signoutUser = AsyncHandler(async (req: Request, res: Response) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  res.clearCookie("accessToken", options);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = AsyncHandler(async (req: any, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

export { signupUser, signinUser, signoutUser, getCurrentUser };
