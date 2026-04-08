import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// express middlewares

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());

// app health check
app.get("/thread-stream-api/v1/health-check", (req, res) => {
  res.json({ message: "hello world" });
});

// routes import and declaration
import userRouter from "./routes/user-routes.js";
app.use(
  "/thread-stream-api/v1/user",
  userRouter
);

import videoRouter from "./routes/video-routes.js"
app.use(
  "/thread-stream-api/v1/video",
  videoRouter
);

export default app;
