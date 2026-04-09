import mongoose from 'mongoose';
import asyncHandler from "./../utils/async-handler.js";
import ApiError from "./../utils/api-error.js";
import ApiResponse from "./../utils/api-response.js";
import Video from "./../models/video-model.js"
import { uploadOnCloudinary, removeFromCloudinary } from '../utils/cloudinary.js';

const uploadVideo = asyncHandler(async (request, response) => {

  const { title, description, isPublished } = request.body;
  const errorDescription = {};

  let thumbnailUploadLocation;
  let videoUploadLocation;

  if (request.files) {
    if (
      Array.isArray(request.files.thumbnail) &&
      String(request.files.thumbnail[0].mimetype).startsWith("image") &&
      request.files.thumbnail.length == 1
    ) {
      thumbnailUploadLocation = request.files.thumbnail[0].path
    }

    if (
      Array.isArray(request.files.video) &&
      String(request.files.video[0].mimetype).startsWith("video") &&
      request.files.video.length == 1
    ) {
      videoUploadLocation = request.files.video[0].path
    }
  }

  if (!thumbnailUploadLocation) {
    errorDescription.thumbnailError = "Thumbnail image cant be uploaded!";
  }

  if (!videoUploadLocation) {
    errorDescription.videoError = "Video cant be uploaded!";
  }

  if (!title) {
    errorDescription.titleError = "Title is mandatory!";
  }

  if (!description) {
    errorDescription.descriptionError = "Description is mandatory!";
  }

  if (Object.entries(errorDescription).length !== 0) {
    if (thumbnailUploadLocation) fs.unlink(thumbnailUploadLocation);
    if (videoUploadLocation) fs.unlink(videoUploadLocation);
    throw new ApiError(400, "Validation failed!");
  }

  if (!isPublished) {
    isPublished = true;
  }

  const thumbnailOnCloudinary = await uploadOnCloudinary(thumbnailUploadLocation);
  const videoOnCloudinary = await uploadOnCloudinary(videoUploadLocation);

  if (!thumbnailOnCloudinary || !videoOnCloudinary) {
    if (thumbnailUploadLocation) fs.unlinkSync(thumbnailUploadLocation)
    if (videoUploadLocation) fs.unlinkSync(videoUploadLocation)
    throw new ApiError(500, "error while uploading thumbnail and video on cloudinary!")

  }
  const newVideo = {
    title,
    description,
    thumbnail: thumbnailOnCloudinary.url,
    video: videoOnCloudinary.url,
    description,
    isPublished,
    owner: request.user?._id
  };

  const createdVideo = await Video.create(newVideo);

  if (!createdVideo) {
    throw new ApiError(500, "Something went while creating the video!");
  }

  return response
    .status(201)
    .json(new ApiResponse(201, createdVideo, "User created! "));
}
);

const updateVideoTextDetails = asyncHandler(async (request, response) => {

  const videoId = new mongoose.Types.ObjectId(request.params.videoId)
  const getVideo = await Video.findById(videoId)

  if (!getVideo) {
    throw new ApiError(400, "Video not found!");
  }

  const { title, description } = request.body;

  if (title) {
    getVideo.title = title;
  }

  if (description) {
    getVideo.description = description;
  }

  const updatedVideo = await getVideo.save({ validateBeforeSave: false });

  return response
    .status(202)
    .json(new ApiResponse(
      202,
      updatedVideo,
      "Video text details updated successfully!"))

});

const togglePublishStatus = asyncHandler(async (request, response) => {
  const videoId = new mongoose.Types.ObjectId(request.params.videoId)

  const getVideo = await Video.findById(videoId)

  if (!getVideo) {
    throw new ApiError(400, "Thumbnail not found!");
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { $set: { isPublished: !getVideo.isPublished } },
    { new: true }
  );

  const result = updatedVideo.isPublished ? "Published" : "Unpublished";

  return response
    .status(202)
    .json(new ApiResponse(
      202,
      updatedVideo,
      `Video is ${result}`
    ));
});

const getVideoById = asyncHandler(async (request, response) => {
  const videoId = new mongoose.Types.ObjectId(request.params.videoId);

  const getVideo = await Video.findById(videoId);

  if (!getVideo) {
    throw new ApiError(400, "Video not found!");
  }

  return response
    .status(200)
    .json(
      new ApiResponse(
        200,
        getVideo, "Video Fetched successfully!")
    );
});

const updateVideoThumbnail = asyncHandler(async (request, response) => {
  const videoId = new mongoose.Types.ObjectId(request.params.videoId);

  const getVideo = await Video.findById(videoId);

  if (!getVideo) {
    throw new ApiError(400, "Video not found!");
  }

  let thumbnailLocalPath;
  if (request.file &&
    !request.file.thumbnail &&
    request.file.mimetype.startsWith("image") &&
    request.file.path != ""
  ) {
    thumbnailLocalPath = request.file.path;
  }

  const thumbnailOnCloudinary = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnailOnCloudinary) {
    if (!thumbnailLocalPath) {
      fs.unlinkSync(thumbnailLocalPath);
    }
    throw new ApiError(502, "Thumbnail could'nt upload to cloudinary");
  }

  getVideo.thumbnail = thumbnailOnCloudinary.url;

  await getVideo.save({ validateBeforeSave: false });

  return response
    .status(200)
    .json(new ApiResponse(200, getVideo, "Thumbnail is updated successfully!"))
});

const deleteVideo = asyncHandler(async (request, response) => {
  const videoId = new mongoose.Types.ObjectId(request.params.videoId);

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  return response
    .status(200)
    .json(new ApiResponse(200, deletedVideo, "Video deleted successfully!"))

});

const searchVideos = asyncHandler(async (request, response) => {

  const { searchText, fromUser, sortingField, sortingOrder, onPage, videosOnPage } = request.query;
  const matchStageConditions = {
    isPublished: true,
  }

  if (searchText) {
    matchStageConditions.title = {
      $regex: searchText,
      $options: "i"
    }
  }

  if (fromUser) {
    if (mongoose.isValidObjectId(fromUser)) {
      matchStageConditions.owner = new mongoose.Types.ObjectId(fromUser);
    } else {
      throw new ApiError(400, "Invalid From UserId is given")
    }
  }

  const sortStageCondition = {};
  if (sortingField) {
    sortStageCondition[sortingField] = sortingOrder == "desc" ? -1 : 1
  } else {
    sortingField.createdAt = -1;
  }

  const aggregate = Video.aggregate([
    { $match: matchStageConditions },
    { $sort: sortStageCondition },
  ]);

  const paginate = {
    page: Number(onPage) || 1,
    limit: Number(videosOnPage) || 10
  };

  const searchResult = await Video.aggregatePaginate(aggregate, paginate);

  return response
    .status(200)
    .json(new ApiResponse(200, searchResult, "Videos fetch successfully!  "));
});

export {
  uploadVideo,
  updateVideoTextDetails,
  togglePublishStatus,
  getVideoById,
  updateVideoThumbnail,
  deleteVideo,
  searchVideos,
}




