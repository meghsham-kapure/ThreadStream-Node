import mongoose from "mongoose";
import { dbName } from "./../constants.js";

if (process.platform === "win32") {
  const dns = await import("dns");
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

async function connectDatabase() {
  try {e
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${dbName}`
    );
    console.log(
      `MONGODB connected with DB Host : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("Full error:", JSON.stringify(error, null, 2));
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Reason:", error.reason);
    process.exit(1);
  }
}

export default connectDatabase;
