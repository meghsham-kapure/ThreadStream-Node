import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import ApiError from "./api-error.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null; //return error here
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return new ApiError(
      500,
      "Cloudinary upload failed", [error]
    );
  }
};


const removeFromCloudinary = async (cloudinaryFilePath) => {
  try {

    const publicId = (url => url.split("/").pop().split(".")[0])(cloudinaryFilePath);
    const isDeleted = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true
    });

    return isDeleted.result;
  }
  catch (error) {
    return new ApiError(
      500,
      `Could not delete file from Cloudinary ${cloudinaryFilePath} : ${error}`
    )
  }
};



export { uploadOnCloudinary, removeFromCloudinary };
