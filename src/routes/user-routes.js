
import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "./../controllers/user-controller.js";
import upload from "./../middlewares/multer-upload-middleware.js";
import verifyJWT from "./../middlewares/auth-middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
  // this middleware runs with every register request  before registerUser controller is called
  upload.fields([
    { name: "avatarImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);
export default userRouter;

// secured routes
userRouter.route("/logout").post(verifyJWT, logoutUser);

userRouter.route("/refresh-token").post(refreshAccessToken);
