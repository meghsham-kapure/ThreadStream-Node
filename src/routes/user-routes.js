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
  .route("/register")
  .post(
    upload.fields([
      { name: "avatarImage", maxCount: 1 },
      { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
  );

userRouter
  .route("/login")
  .post(
    loginUser
  );
userRouter
  .route("/refresh-token")
  .post(
    refreshAccessToken
  );

// secured routes
userRouter.use(verifyJWT);

userRouter
  .route("/logout")
  .post(
    logoutUser
);

userRouter
  .route("/details")
  .get(
    getUserDetails
  );

userRouter
  .route("/details/password")
  .patch(
    updatePassword
  );

userRouter
  .route("/details/fullname")
  .patch(
    updateUserFullName
  );

userRouter
  .route("/details/username")
  .patch(
    updateUserName
  );

userRouter
  .route("/details/email")
  .patch(
    updateEmail
  );

userRouter
  .route("/details/avatar-img")
  .patch(
    upload.single('avatarImage'),
    updateUserAvatarImage
  );

userRouter
  .route("/details/cover-img")
  .patch(
    upload.single('coverImage'),
    updateUserCoverImage
  );

userRouter
  .route("/profile/:userName")
  .get(
    getUserProfile
  );

userRouter
  .route("/history")
  .get(
    getWatchHistory
);


export default userRouter;
