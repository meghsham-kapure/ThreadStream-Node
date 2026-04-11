import mongoose from 'mongoose';
import asyncHandler from "./../utils/async-handler.js"
import ApiError from "./../utils/api-error.js"
import ApiResponse from "./../utils/api-response.js"
import Playlist from '../models/playlist-model.js';
import Video from '../models/video-model.js';

const createPlaylist = asyncHandler(async (request, response) => {
  let { name, description, isPublic } = request.body;

  if (!name && name.length > 0) {
    throw new ApiError(400, "Playlist title can't be null or empty!");
  }

  if (!description || description.length == 0) {
    description = undefined;
  }

  if (!isPublic) {
    isPublic = false;
  }

  const userId = new mongoose.Types.ObjectId(request.user._id);

  const duplicateTitlePlaylist = await Playlist.find({ owner: userId, name: name });

  if (duplicateTitlePlaylist.length > 0) {
    throw new ApiError(400, "Playlist title can't be duplicated!");
  }

  const savedPlaylist = await Playlist.create(
    {
      name: name,
      description: description,
      owner: userId,
      isPublic: isPublic
    }
  );

  return response
    .status(201)
    .json(new ApiResponse(200, savedPlaylist, "Playlist Created Successfully!"))
});

const getUserPlaylists = asyncHandler(async (request, response) => {
  const { userId } = request.params;

  if (!userId) {
    throw new ApiError(400, "Playlist owner user input not found!");
  }

  const playlistsByUser = await Playlist.find({ owner: userId, isPublic: true });

  return response
    .status(200)
    .json(new ApiResponse(200, playlistsByUser, "Playlist owned by user fetched successfully!"));
});

const getMyPlaylists = asyncHandler(async (request, response) => {
  const userId = request.user._id;

  if (!userId) {
    throw new ApiError(400, "Playlist owner user input not found!");
  }

  const playlistsByUser = await Playlist.find({ owner: userId });

  return response
    .status(200)
    .json(new ApiResponse(200, playlistsByUser, "Playlist owned by user fetched successfully!"));
});

const getPlaylistById = asyncHandler(async (request, response) => {
  const { playlistId } = request.params;

  if (!playlistId) {
    throw new ApiError(400, "Playlist owner user input not found!");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(400, "Playlist not found!");
  }

  return response
    .status(200)
    .json(new ApiResponse(200, playlist, " Playlist fetched Successfully!"))
});

const deletePlaylist = asyncHandler(async (request, response) => {
  const { playlistId } = request.params;

  if (!playlistId) {
    throw new ApiError(400, "Playlist owner user input not found!");
  }

  const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

  if (!deletedPlaylist) {
    throw new ApiError(400, "Playlist not found!");
  }

  return response
    .status(200)
    .json(new ApiResponse(200, deletedPlaylist, "Deleted Playlist Successfully!"))

});

const updatePlaylist = asyncHandler(async (request, response) => {
  const { playlistId } = request.params;
  const userId = new mongoose.Types.ObjectId(request.user._id);

  if (!playlistId) {
    throw new ApiError(400, "Input Playlist owner user  not found!");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!userId.equals(playlist.owner)) {
    throw new ApiError(401, "You are not playlist owner!")
  }

  const { name, description } = request.body;

  if (name) {
    const playlistWithUserAndName = await Playlist.find({ name: name });
    if (playlistWithUserAndName.length != 0) {
      throw new ApiError(400, " Playlist name already exist and can't be duplicated!");
    }
    playlist.name = name;
  }

  if (description) {
    playlist.description = description;
  }

  const savedPlaylist = await playlist.save();

  return response
    .status(200)
    .json(new ApiResponse(200, savedPlaylist, "Updated Playlist Successfully!"))

});

const toggleVisibility = asyncHandler(async (request, response) => {
  const { playlistId } = request.params;
  const userId = new mongoose.Types.ObjectId(request.user._id);

  if (!playlistId) {
    throw new ApiError(400, "Input Playlist owner user  not found!");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!userId.equals(playlist.owner)) {
    throw new ApiError(401, "You are not playlist owner!")
  }

  playlist.isPublic = !playlist.isPublic;

  const savedPlaylist = await playlist.save();

  return response
    .status(200)
    .json(new ApiResponse(200, savedPlaylist, "Updated Playlist Successfully!"))

});

const addVideoToPlaylist = asyncHandler(async (request, response) => {
  const { playlistId, videoId } = request.params;
  const userId = new mongoose.Types.ObjectId(request.user._id);

  if (!playlistId) {
    throw new ApiError(400, "Input Playlist owner user  not found!");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!userId.equals(playlist.owner)) {
    throw new ApiError(401, "You are not playlist owner!")
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(401, "Video not found!")
  }

  if (playlist.videos.includes(video._id)) {
    throw new ApiError(401, "Video already present in playlist!")
  }

  playlist.videos.push(video)

  const savedPlaylist = await playlist.save();

  return response
    .status(200)
    .json(new ApiResponse(200, savedPlaylist, "Video added to Playlist Successfully!"));
});


const removeVideoFromPlaylist = asyncHandler(async (request, response) => {
  const { playlistId, videoId } = request.params;

  const userId = new mongoose.Types.ObjectId(request.user._id);

  if (!playlistId) {
    throw new ApiError(400, "Input Playlist owner user  not found!");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!userId.equals(playlist.owner)) {
    throw new ApiError(401, "You are not playlist owner!")
  }

  const videoIndex =
    await playlist.videos.indexOf(
      new mongoose.Types.ObjectId(videoId)
    );

  playlist.videos.splice(videoIndex, 1);

  if (videoIndex === -1) {
    throw new ApiError(401, "Video not found!")
  }

  const savedPlaylist = await playlist.save();

  return response
    .status(200)
    .json(new ApiResponse(200, savedPlaylist, "Video added to Playlist Successfully!"));

});

export {
  createPlaylist,
  getUserPlaylists,
  getMyPlaylists,
  getPlaylistById,
  deletePlaylist,
  updatePlaylist,
  toggleVisibility,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
}
