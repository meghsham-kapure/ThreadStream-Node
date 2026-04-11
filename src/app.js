import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

const app = express();

// express middlewares

app.use(helmet()); // security headers
app.use(morgan("dev")); // log requests
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true })); // allow frontend access
app.use(express.json({ limit: "16kb" })); // parse JSON body
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // parse form data
app.use(express.static("public")); // serve static files
app.use(cookieParser()); // parse cookies

// routes import and declaration

import infoRouter from "./routes/info-routes.js";
app.use(
  "/thread-stream-api/v1/info",
  infoRouter
);

import userRouter from "./routes/user-routes.js";
app.use(
  "/thread-stream-api/v1/user",
  userRouter
);

import videoRouter from "./routes/video-routes.js";
app.use(
  "/thread-stream-api/v1/video",
  videoRouter
);

import playlistRouter from "./routes/playlist-routes.js";
app.use("/thread-stream-api/v1/playlist",
  playlistRouter
);

import postRouter from './routes/post-routes.js';
app.use(
  "./thread-stream-api/v1/",
  postRouter
)
export default app;
