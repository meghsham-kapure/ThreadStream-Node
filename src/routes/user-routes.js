import { Router } from "express";
import registerUser from "./../controllers/user-controller.js";
import upload from "./../middlewares/multer-upload-middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
  // this middleware runs with every register request  before registerUser controller is called
  upload.fields([
    { name: "avatarImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

export default userRouter;
