import "dotenv/config";
import connectDatabase from "./db/db-connect.js";

await connectDatabase();

console.log("Hello World !!!");
