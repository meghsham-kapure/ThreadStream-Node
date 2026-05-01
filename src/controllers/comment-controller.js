import mongoose from "mongoose"
import Comment from "./../models/comment-model.js"
import ApiError from "./../utils/api-error.js"
import ApiResponse from "./../utils/api-response.js"
import asyncHandler from "./../utils/async-handler.js"

//TODO: get all comments for a video
const getVideoComments = asyncHandler(async (request, response) => {
  const { videoId } = request.params
  const { page = 1, limit = 10 } = request.query

});

// TODO: add a comment to a video
const addComment = asyncHandler(async (request, response) => {
  const requestUrl = request.originalUrl;
  const content = request.body.content;
  const commentOnTarget = request.params.commentOnTarget;
  const userId = request.user._id;

  const comment = {};

  if (requestUrl.includes("/comment/video/")) {
    comment.commentedOn = 'Video';
  } else if (requestUrl.includes("/comment/post/")) {
    comment.commentedOn = 'Video';
  } else {
    throw new ApiError(400, "commentedOn filed missing!")
  }


  if (!content) {
    throw new ApiError(400, "Comment should have contents!");
  }

  if (!commentOnTarget) {
    throw new ApiError(400, "Comment should have commentOnTarget!");
  }

  if (!userId) {
    throw new ApiError(400, "Comment should have owner!");
  }

  comment.content = content;
  comment.commentedOnTarget = new mongoose.Types.ObjectId(commentOnTarget);
  comment.owner = userId;


  console.log(comment);

  const savedComment = await Comment.create(comment);

  const data = {
    commentId: savedComment._id,
    [`${savedComment.commentedOn}Id`]: savedComment.commentedOnTarget,
    owner: savedComment.owner,
    createdAt: savedComment.createdAt

  }

  return response
    .status(201)
    .json(
      new ApiResponse(200, data, "successfully commented on video!")
    );


});

// TODO: update a comment
const updateComment = asyncHandler(async (request, response) => {
});

// TODO: delete a comment
const deleteComment = asyncHandler(async (request, response) => {
});

let getPostComments = asyncHandler(async (request, response) => {
});;

export {
  getVideoComments,
  getPostComments,
  addComment,
  updateComment,
  deleteComment,
}
