import { Router } from 'express';
import {
  createPlaylist,
  getUserPlaylists,
  getMyPlaylists,
  getPlaylistById,
  deletePlaylist,
  updatePlaylist,
  toggleVisibility,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlist-controller.js"
import verifyJWT from "../middlewares/auth-middleware.js"

const playlistRouter = Router();

playlistRouter.use(verifyJWT);

playlistRouter.route("/")
  .post(createPlaylist);

playlistRouter.route("/user")
  .get(getMyPlaylists);

playlistRouter.route("/user/:userId")
  .get(getUserPlaylists);

playlistRouter.route("/add/:playlistId/:videoId")
  .patch(addVideoToPlaylist);

playlistRouter.route("/remove/:playlistId/:videoId")
  .delete(removeVideoFromPlaylist);

playlistRouter.route("/:playlistId")
  .get(getPlaylistById)
  .put(updatePlaylist)
  .patch(toggleVisibility)
  .delete(deletePlaylist)

export default playlistRouter
