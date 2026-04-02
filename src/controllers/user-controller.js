import asyncHandler from "./../utils/async-handler.js";
import User from "./../models/user-model.js";
import ApiResponse from "./../utils/api-response.js";
import ApiError from "./../utils/api-error.js";
import fs from "node:fs";
import jwt from "jsonwebtoken";
import { authCookieOptions } from "./../constants.js";
import {
  uploadOnCloudinary,
  removeFromCloudinary
} from "./../utils/cloudinary.js";
import {
  validateFullName,
  validateUserName,
  validateEmail,
  validatePassword,
} from "./../utils/validators.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    // 1. Find the user with same id
    const user = await User.findById(userId);

    // 2. Generate new tokens
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // 3. Add token to user
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;

    // 4. Save the user object in DB
    await user.save({ validateBeforeSave: false });

    // 5. Return the generated tokens
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generate access & refresh token"
    );
  }
};

const registerUser = asyncHandler(async (request, response) => {
  let errorFlag = false;
  let errorDescription = {};

  // 1. Receive data from client (frontend / API request) 2. Validate input fields
  const { fullName, userName, password, email } = request.body;

  let avatarImageLocalPath;
  if (
    request.files &&
    Array.isArray(request.files.avatarImage) &&
    request.files.avatarImage.length > 0
  ) {
    avatarImageLocalPath = request.files?.avatarImage[0]?.path;
  } else {
    errorDescription.avatarError = "Avatar Image not found";
  }

  let coverImageLocalPath;
  if (
    request.files &&
    Array.isArray(request.files.coverImage) &&
    request.files.coverImage.length > 0
  ) {
    coverImageLocalPath = request.files?.coverImage[0]?.path;
  }

  if (!validateFullName(fullName)) {
    errorDescription.fullNameError =
      "Full name must be 6–32 letters (letters, spaces, dots, and hyphens allowed)";
  }

  if (!validateUserName(userName)) {
    errorDescription.userNameError =
      "Username must be 4–16 chars (letter and underscores allowed[but no double __])";
  }

  if (!validateEmail(email)) {
    errorDescription.emailError = "Invalid email format (4–32 characters)";
  }

  if (!validatePassword(password)) {
    errorDescription.passwordError =
      "Password must be 8–32 chars with letter, number, and symbol";
  }

  // 3. If validation fails return error
  if (Object.entries(errorDescription).length !== 0) {
    throw new ApiError(400, "Validation failed!", errorDescription);
  }
  // 4. Check whether user exists already
  const existingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existingUser) {
    if (avatarImageLocalPath) fs.unlinkSync(avatarImageLocalPath);
    if (coverImageLocalPath) fs.unlinkSync(coverImageLocalPath);
    throw new ApiError(409, "User already exist!");
  }

  // 5. Handle Upload file to server then Cloudinary
  const avatarOnCloudinary = await uploadOnCloudinary(avatarImageLocalPath);

  if (!avatarOnCloudinary)
    throw new ApiError(400, "Avatar Image could not be uploaded on cloud");

  let coverImageOnCloudinary;
  if (coverImageLocalPath) {
    coverImageOnCloudinary = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImageOnCloudinary)
      throw new ApiError(400, "Cover Image could not be uploaded on cloud");
  }

  // 6. Create user object with validated data
  const user = {
    fullName: fullName,
    userName: userName,
    email: email,
    password: password,
    avatarImage: avatarOnCloudinary.url,
    coverImage: coverImageOnCloudinary?.url || "",
  };

  const createUser = await User.create(user);

  // 5. Perform database operation to save check
  const getCreatedUser = await User.findById(createUser._id).select(
    "-password -refreshToken"
  );

  if (!getCreatedUser) {
    throw new ApiError(500, "Something went while creating the users!");
  }

  // 6. Send success response
  return response
    .status(201)
    .json(new ApiResponse(201, getCreatedUser, "User created! "));
});

const loginUser = asyncHandler(async (request, response) => {
  // 1. Take input from the request (email / username and password)
  const { userName, email, password } = request.body;

  // 2. Validate the input to ensure all required fields are provided and properly formatted
  if (!userName && !email) {
    throw new ApiError(404, "Provide email or userName ");
  }

  // 3. Check if the user exists in the system using the provided identifier
  const getUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  // 3. Check if the user exists in the system using the provided identifier
  if (!getUser) {
    // 4. If the user does not exist, return an error indicating that the user was not found
    throw new ApiError(404, "User with given email or userName not found ");
  }
  // 5. If the user exists, compare the provided password with the stored password
  const isPasswordValid = await getUser.isPasswordCorrect(password);

  // 6. If the password does not match, return an error indicating invalid credentials
  if (!isPasswordValid) {
    // 7. If the password matches, generate an access token
    throw new ApiError(404, "Invalid user credentials!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    getUser._id
  );

  // Validate that both tokens were generated
  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Failed to generate tokens");
  }

  const loggedInUser = await User.findById(getUser._id).select(
    "-password -refreshToken"
  );

  // 8. Return the access token in the response cookies to the client
  return response
    .status(200)
    .cookie("accessToken", accessToken, authCookieOptions)
    .cookie("refreshToken", refreshToken, authCookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const refreshAccessToken = asyncHandler(async (request, response) => {
  // 1. Take the incoming refresh token from cookies / body (in case of application)
  const incomingRefreshToken =
    request.cookies.refreshToken || request.body.refreshToken;

  // If incoming request is not found then throw error
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request!");
  }

  try {
    // 3. Decode the refresh token which contains id
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // 4. With given Id find the user
    const getUser = await User.findById(decodedToken?._id);

    // if user not found then throw error
    if (!getUser) {
      throw new ApiError("Invalid refresh token");
    }

    // 5. If refresh token from request and database not match throw error
    if (incomingRefreshToken !== getUser?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    // If refresh token  matched then set create new  accessToken and refreshToken
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      getUser._id
    );

    // Override the cookie token or send tokens in the body for application
    return response
      .status(200)
      .cookie("accessToken", accessToken, authCookieOptions)
      .cookie("refreshToken", refreshToken, authCookieOptions)
      .json(
        new ApiResponse(
          200,
          { 
            accessToken,
            refreshToken,
          },
          "New Access Token & Refresh Token Assigned"
        )
      );
  } catch (error) {
    throw new ApiError(404, error?.message || "Invalid refresh token");
  }
});

const logoutUser = asyncHandler(async (request, response) => {
  // After middleware interception

  // 1. Find the  logged in user with given id, if found then clear "refreshToken" fields
  await User.findByIdAndUpdate(
    request.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  // 2. In response clear cookies
  return response
    .status(200)
    .clearCookie("accessToken", authCookieOptions)
    .clearCookie("refreshToken", authCookieOptions)
    .json(new ApiResponse(200, {}, "User logged out!"));
});

const getUserDetails = asyncHandler((request, response) => {
  return response
    .status(200)
    .json(new ApiResponse(200, request.user, "User Found!"));
});

const updatePassword = asyncHandler(async (request, response) => {
  const { oldPassword, newPassword, newPasswordConfirmation } = request.body;

  if (!oldPassword && !newPassword && !newPasswordConfirmation) {
    throw new ApiError(
      400,
      "currentPassword and NewPassword could not be empty!"
    );
  }

  if (newPassword !== newPasswordConfirmation) {
    throw new ApiError(
      400,
      "NewPassword and NewPasswordConfirmation does not match!"
    );
  }

  const getUser = await User.findById(request.user?._id);

  const isPasswordCorrect = await getUser.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Wrong old password!");
  }

  getUser.password = newPassword;

  await getUser.save({ validateBeforeSave: false });

  return response
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed!"));
});

const updateUserFullName = asyncHandler(async (request, response) => {
  const { fullName } = request.body;

  if (!validateFullName(fullName)) {
    throw new ApiError(
      400,
      "Full name must be 6–32 letters (letters, spaces, dots, and hyphens allowed"
    );
  }

  const getUpdatedUser = await User.findByIdAndUpdate(
    request.user?._id,
    { $set: { fullName: fullName } },
    { new: true }
  ).select("_id fullName");

  return response
    .status(200)
    .json(new ApiResponse(200, getUpdatedUser, "User Full Name Updated"));
});

const updateUserName = asyncHandler(async (request, response) => {
  const { userName } = request.body;

  if (!validateUserName(userName)) {
    throw new ApiError(
      400,
      "Username must be 4–16 chars (letter and underscores allowed[but no double __])"
    );
  }

  const getUpdatedUser = await User.findByIdAndUpdate(
    request.user?._id,
    { $set: { userName: userName } },
    { new: true } // return the data after the db update
  ).select("_id userName");

  return response
    .status(200)
    .json(new ApiResponse(200, getUpdatedUser, "User username Updated"));
});

const updateEmail = asyncHandler(async (request, response) => {
  const { email } = request.body;

  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid email format (4–32 characters)");
  }

  const getUpdatedUser = await User.findByIdAndUpdate(
    request.user?._id,
    { $set: { email: email } },
    { new: true } // return the data after the db update
  ).select("_id email");

  return response
    .status(200)
    .json(new ApiResponse(200, getUpdatedUser, "User email Updated"));
});

const updateUserAvatarImage = asyncHandler(async (request, response) => {

  const avatarImageLocalPath = request.file?.path;

  if (!avatarImageLocalPath) {
    throw new ApiError(400, "Avatar Image file missing!");
  }

  const avatarOnCloudinary = await uploadOnCloudinary(avatarImageLocalPath);

  if (!avatarOnCloudinary.url) {
    throw new ApiError(400, "Error while uploading avatar image");
  }

  const getUpdatedUser = await User.findByIdAndUpdate(
    request.user?._id,
    { $set: { avatarImage: avatarOnCloudinary.url } },
    { new: true }
  ).select("-password");

  if (request.user?.avatarImage) {
    await removeFromCloudinary(request.user?.avatarImage);
  }

  response.status(200).json(new ApiResponse(200, getUpdatedUser, "User Avatar Image Updated!"))
});


const updateUserCoverImage = asyncHandler(async (request, response) => {

  const coverImageLocalPath = request.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Local Image file missing!");
  }

  const coverImageOnCloudinary = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImageOnCloudinary.url) {
    throw new ApiError(400, "Error while uploading local image");
  }

  const getUpdatedUser = await User.findByIdAndUpdate(
    request.user?._id,
    { $set: { coverImage: coverImageOnCloudinary.url } },
    { new: true }
  ).select("-password");

  if (request.user?.coverImage) {
    await removeFromCloudinary(request.user?.coverImage);
  }

  response.status(200).json(new ApiResponse(200, getUpdatedUser, "User Cover Image Updated!"))
});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getUserDetails,
  updatePassword,
  updateUserFullName,
  updateUserName,
  updateEmail,
  updateUserAvatarImage,
  updateUserCoverImage,
};
