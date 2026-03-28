import mongoose from "mongoose";
import { dbName } from "./../constants.js";

if (process.platform === "win32") {
  const dns = await import("dns");
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

async function connectDatabase() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${dbName}`
    );
    console.info(
      `MONGODB connected with DB Host : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(`Database connection failed with error : ${error}`);
    process.exit(1);
  }
}

export default connectDatabase;
