import "dotenv/config";
import mongoose from "mongoose";
import { appName, dbName } from "./constants.js";
import express from "express";

const appPort = process.env.APP_PORT ?? 5000;
const appUrl = process.env.MONGODB_URI;
console.log(appUrl);

const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`);
    app.on("error", (error) => {
      console.error(`ERROR ${error}`);
      throw new Error("Server Initialization Failed!");
    });

    app.listen(appPort, () => {
      console.log(`${appName} is started running on ${appPort}`);
    });
  } catch (error) {
    console.error(`ERROR ${error}`);
  }
})();
