import "dotenv/config";
import mongoose from "mongoose";
import { appName, dbName } from "./constants.js";
import express from "express";

if (process.platform === "win32") {
  const dns = await import("dns");
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

const appPort = process.env.APP_PORT ?? 5000;
const appUrl = process.env.MONGODB_URI;

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
    console.error("Full error:", JSON.stringify(error, null, 2));
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Reason:", error.reason);
  }
})();
