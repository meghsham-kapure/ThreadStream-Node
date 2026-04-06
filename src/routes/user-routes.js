import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getUserDetails,
  updatePassword,
  updateUserFullName,
  updateUserName,
  updateEmail,
  updateUserAvatarImage,
  updateUserCoverImage,
  getUserProfile,
  getWatchHistory,
} from "./../controllers/user-controller.js";
import upload from "./../middlewares/multer-upload-middleware.js";
import verifyJWT from "./../middlewares/auth-middleware.js";

const userRouter = Router();

userRouter
  .route("/register").post(
  upload.fields([
    { name: "avatarImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

userRouter
  .route("/login").post(
    loginUser
  );
userRouter
  .route("/refresh-token").post(
    refreshAccessToken
  );

// secured routes
userRouter
  .route("/logout").post(
    verifyJWT,
    logoutUser
  );
userRouter
  .route("/details").get(
    verifyJWT,
    getUserDetails
  );

userRouter
  .route("/details/password").patch(
    verifyJWT,
    updatePassword
  );

userRouter
  .route("/details/fullname").patch(
    verifyJWT,
    updateUserFullName
  );

userRouter
  .route("/details/username").patch(
    verifyJWT,
    updateUserName
  );

userRouter
  .route("/details/email").patch(
    verifyJWT,
    updateEmail
  );

userRouter
  .route("/details/avatar-img").patch(
  verifyJWT,
    upload.single('avatarImage'),
  updateUserAvatarImage
);

userRouter
  .route("/details/cover-img").patch(
  verifyJWT,
  upload.single('coverImage'),
  updateUserCoverImage
);

userRouter
  .route("/profile/:channelName").get(
    verifyJWT,
    getUserProfile
  );

userRouter
  .route("/history").get(
    verifyJWT,
    getWatchHistory
  );


export default userRouter;
