import mongoose, { isValidObjectId } from "mongoose"
import Post from "../models/post-model.js"
import User from "../models/user-model.js"
import ApiError from "../utils/api-error.js"
import ApiResponse from "../utils/api-response.js"
import asyncHandler from "./../utils/async-handler.js"
import { removeFromCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js'
import fs from "node:fs"

const createPost = asyncHandler(async (request, response) => {

  const content = request.body.content;
  const localImage = request.file;
  const userId = request.user._id;

  if (!content) {
    throw new ApiError(400, "Content not found!");
  }

  let cloudinaryImageUpload;

  if (localImage) {

    if (!localImage.mimetype.startsWith("image")) {
      fs.unlinkSync(localImage.path);
      throw new ApiError(400, "Only image attachment are allowed!");
    }

    cloudinaryImageUpload = await uploadOnCloudinary(localImage.path);

    if (!cloudinaryImageUpload) {
      throw new ApiError(400, "Unsupported mentioned media!");
    }

  }

  const post = await Post.create({
    content: content,
    imageAttached: cloudinaryImageUpload?.url, // if cloudinaryImageUpload is null then undefined, and mongoose omits the undefined fields
    owner: userId,
  });

  if (!post) {
    removeFromCloudinary(cloudinaryImageUpload.url);
    throw new ApiError(500, "Unable to upload media on cloudinary!");
  }

  const data = {
    postId: post._id,
    userId: post.owner,
    content: post.content,
    createdAt: post.createdAt,
  }

  return response
    .status(201)
    .json(new ApiResponse(201, data, "Post created Successfully!"));

});

// TODO: get user posts
const getUserPosts = asyncHandler(async (request, response) => {

  const { page, limit } = request.body
  const userId = new mongoose.Types.ObjectId(request.params.userId);

  const aggregationFilter = Post.aggregate([
    { $match: { owner: { $eq: userId } } },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        _id: 1,
        owner: 1,
        content: 1,
        imageAttached: 1,
        createdAt: 1
      }
    }
  ]);

  const paginateFilter = {
    page: Number(page) || 1,
    limit: Number(limit) || 10
  };

  const posts = await Post.aggregatePaginate(aggregationFilter, paginateFilter);

  return response
    .status(200)
    .json(
      new ApiResponse(200, posts, `Posts fetched Successfully on page ${page}`)
    );

});

//TODO: update post
const updatePost = asyncHandler(async (request, response) => {
})

//TODO: delete post
const deletePost = asyncHandler(async (request, response) => {
})

export {
  createPost,
  getUserPosts,
  updatePost,
  deletePost
}
