import jwt from "jsonwebtoken";
import User from "./../models/user-model.js";
import ApiError from "./../utils/api-error.js";
import asyncHandler from "./../utils/async-handler.js";

const verifyJWT = asyncHandler(
  asyncHandler(async (request, response, next) => {
    try {
      const accessToken =
        request.cookies?.accessToken ||
        request.header("Authorization")?.replace("Bearer ", "");

      if (!accessToken) {
        throw new ApiError(401, "Unauthorized Request!");
      }

      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );

      const getUser = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );

      if (!getUser) {
        // TODO : discuss about frontend
        throw new ApiError(401, "Invalid Access Token!");
      }

      request.user = getUser;

      next();
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid Access Token!");
    }
  })
);

export default verifyJWT;
