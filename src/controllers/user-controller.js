import asyncHandler from "./../utils/async-handler.js";
import ApiError from "./../utils/api-error.js";
import User from "./../models/user-model.js";
import uploadOnCloudinary from "./../utils/cloudinary.js";
import ApiResponse from "./../utils/api-response.js";
import fs from "node:fs";

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
    errorFlag = true;
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

  if (!/^(?=.{4,32}$)[A-Za-z]+( [A-Za-z]+)*$/.test(fullName?.trim() || "")) {
    errorFlag = true;
    errorDescription.fullNameError =
      "Full name must be 4–32 letters (spaces allowed)";
  }

  if (!/^(?!_)(?!.*_$)[a-zA-Z0-9_]{4,16}$/.test(userName)) {
    errorFlag = true;
    errorDescription.userNameError =
      "Username must be 4–16 chars, no _ at start/end";
  }

  if (!/^(?=.{4,32}$)[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorFlag = true;
    errorDescription.emailError = "Invalid email format";
  }

  if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,32}$/.test(password)) {
    errorFlag = true;
    errorDescription.passwordError =
      "Password must be 8–32 chars with letter, number, and symbol";
  }

  // 3. If validation fails return error
  if (errorFlag)
    throw new ApiError(400, "Validation failed!", errorDescription);

  // 4. check whether user exists already
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

export default registerUser;
