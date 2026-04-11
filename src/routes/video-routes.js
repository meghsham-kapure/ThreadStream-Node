import { Router } from 'express';
import upload from '../middlewares/multer-upload-middleware.js';
import {
  uploadVideo,
  updateVideoTextDetails,
  togglePublishStatus,
  getVideoById,
  updateVideoThumbnail,
  deleteVideo,
  searchVideos,
} from "./../controllers/video-controller.js"
import verifyJWT from '../middlewares/auth-middleware.js';

const videoRouter = Router();

videoRouter.use(verifyJWT);

videoRouter
  .route("/upload")
  .post(
    upload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 }
    ]),
    uploadVideo
  );

videoRouter
  .route("/update/text-details/:videoId")
  .put(
    updateVideoTextDetails
  );

videoRouter
  .route("/update/thumbnail/:videoId")
  .patch(
    upload.single("thumbnail"),
    updateVideoThumbnail
  );

videoRouter
  .route("/update/toggle-publishing/:videoId")
  .patch(
    togglePublishStatus
  );

videoRouter
  .route("/getVideoById/:videoId")
  .get(
    getVideoById
  )

videoRouter
  .route("/deleteVideo/:videoId")
  .delete(
    deleteVideo
)

videoRouter
  .route("/search")
  .get(
    searchVideos
  )

export default videoRouter;
