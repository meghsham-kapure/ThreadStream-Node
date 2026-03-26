import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

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
    }); // research this
    console.log(`File Updated Successfully on  ${response.url}`);
    return response; // just give response.url
  } catch (error) {
    fs.unlinkSync(localFilePath); // delete temp file from server after cloudinary upload failed
    return null; //return error here
  }
};

export { uploadOnCloudinary };
