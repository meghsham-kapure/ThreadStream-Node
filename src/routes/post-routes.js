import { Router } from 'express';
import {
  createPost,
  getUserPosts,
  updatePost,
  deletePost
} from "./../controllers/post-controller.js"
import verifyJWT from "./../middlewares/auth-middleware.js"
import upload from "./../middlewares/multer-upload-middleware.js";

const postRouter = Router();

postRouter.use(verifyJWT);

postRouter
  .route("/")
  .post(
    upload.single("postImage"),
    createPost
  );

postRouter
  .route("/user/:userId")
  .get(getUserPosts);

postRouter
  .route("/:postId")
  .patch(upload.single("postImage"), updatePost)
  .delete(deletePost);


export default postRouter
