import asyncHandler from "./../utils/async-handler.js"
import ApiError from "./../utils/api-error.js"
import ApiResponse from "./../utils/api-response.js"
import mongoose from 'mongoose';
import Playlist from '../models/playlist-model.js';

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

  const userId = new mongoose.Types.ObjectId(request._id);

  const duplicateTitlePlaylist = await Playlist.find({ owner: userId, name: name });

  if (duplicateTitlePlaylist.length > 0) {
    throw new ApiError(400, "Playlist title can't be duplicated!");
  }

  console.log("name => " + name);
  console.log("description => " + description);
  console.log("owner => " + userId);
  console.log("isPublic => " + isPublic);

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
  //TODO: get user playlists
})

const getPlaylistById = asyncHandler(async (request, response) => {
  const { playlistId } = request.params;
  //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (request, response) => {
  const { playlistId, videoId } = request.params;
})

const removeVideoFromPlaylist = asyncHandler(async (request, response) => {
  const { playlistId, videoId } = request.params;
  // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (request, response) => {
  const { playlistId } = request.params;
  // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (request, response) => {
  const { playlistId } = request.params;
  const { name, description } = request.body;
  //TODO: update playlist
})

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist
}
