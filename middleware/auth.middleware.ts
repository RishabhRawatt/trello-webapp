import { Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AsyncHandler from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError";
import User from "../models/user.model";

interface NewRequest extends Request {
  user?: any;
}

interface JwtPayload {
  _id: string;
}

export const verifyJWT = AsyncHandler(
  async (req: NewRequest, _, next: NextFunction) => {
    try {
      const authorizationHeader = req.header("Authorization");
      // const accessToken =
      // req.cookies?.accessToken ||
      // req.header("Authorization")?.replace("Bearer ", "");
      const accessToken = authorizationHeader
        ? authorizationHeader.replace("Bearer ", "").trim()
        : null;


      if (!accessToken) {
        throw new ApiError(401, "Unauthorized request");
      }

      // Verify and decode the token
      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as JwtPayload;

      // Fetch user from database
      const user = await User.findById(decodedToken._id).select("-password");

      if (!user) {
        throw new ApiError(401, "Invalid access token");
      }

      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(
        401,
        (error as Error)?.message || "Invalid access token"
      );
    }
  }
);
