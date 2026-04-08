import { Router } from 'express';
import upload from '../middlewares/multer-upload-middleware.js';
import {
  uploadVideo,
  updateVideoTextDetails,
  togglePublishStatus,
  getVideoById,
  updateVideoThumbnail,
  deleteVideo,
  getAllVideos,
} from "./../controllers/video-controller.js"
import verifyJWT from '../middlewares/auth-middleware.js';

const videoRouter = Router();

videoRouter
  .route("/upload")
  .post(
    verifyJWT,
    upload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 }
    ]),
    uploadVideo
  );

videoRouter
  .route("/update/text-details/:videoId")
  .put(
    verifyJWT,
    updateVideoTextDetails
  );

videoRouter
  .route("/update/thumbnail/:videoId")
  .patch(
    verifyJWT,
    upload.single("thumbnail"),
    updateVideoThumbnail
  );

videoRouter
  .route("/update/toggle-publishing/:videoId")
  .patch(
    verifyJWT,
    togglePublishStatus
  );

videoRouter
  .route("/getVideoById/:videoId")
  .get(
    verifyJWT,
    getVideoById
  )

videoRouter
  .route("/deleteVideo/:videoId")
  .delete(
    verifyJWT,
    deleteVideo
)

videoRouter
.route("/search/:query")

export default videoRouter;
