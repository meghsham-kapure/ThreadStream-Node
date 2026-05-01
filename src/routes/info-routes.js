import { Router } from 'express';
import { } from "./../controllers/info-controller.js"
import ApiResponse from '../utils/api-response.js';

const infoRouter = Router();

infoRouter.route("/health-check")
  .get((request, response) => {
    response
      .status(200)
      .json(new ApiResponse(200, request.body, {
        "status": "available",
        "version": "0.0.0.1",
        "message": "Server is up and running",
        "database": "mongodb",
        "cloud_storage": "cloudinary"
      }));
  });

export default infoRouter
