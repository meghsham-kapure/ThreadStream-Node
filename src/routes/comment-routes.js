import { Router } from 'express';
import {
  addComment,
  deleteComment,
  getVideoComments,
  getPostComments,
  updateComment,
} from "./../controllers/comment-controller.js"
import verifyJWT from "./../middlewares/auth-middleware.js"

const commentRouter = Router();

commentRouter.use(verifyJWT);

commentRouter
  .route("/video/:commentOnTarget")
  .get(getVideoComments)
  .post(addComment);

commentRouter
  .route("/video/:commentOnTarget")
  .patch(updateComment)
  .delete(deleteComment);

commentRouter
  .route("/post/:postId")
  .get(getPostComments) // Renamed for clarity
  .post(addComment);

commentRouter
  .route("/post/:commentId")
  .patch(updateComment)
  .delete(deleteComment);

export default commentRouter
