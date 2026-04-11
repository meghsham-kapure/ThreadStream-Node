import mongoose, { isValidObjectId } from "mongoose"
import Post from "../models/post-model.js"
import User from "../models/user-model.js"
import ApiError from "../utils/api-error.js"
import ApiResponse from "../utils/api-response.js"
import asyncHandler from "./../utils/async-handler.js"

//TODO: create post
const createPost = asyncHandler(async (req, res) => {
})

// TODO: get user posts
const getUserPosts = asyncHandler(async (req, res) => {
})

//TODO: update post
const updatePost = asyncHandler(async (req, res) => {
})

//TODO: delete post
const deletePost = asyncHandler(async (req, res) => {
})

export {
  createPost,
  getUserPosts,
  updatePost,
  deletePost
}
