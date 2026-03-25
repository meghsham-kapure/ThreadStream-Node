import "dotenv/config";
import connectDatabase from "./db/db-connect.js";

const appPort = process.env.APP_PORT ?? 8080;
const appName = process.env.APP_NAME ?? "Thread Stream";

connectDatabase()
  .then(() => {
    app.on("error", (error) => {
      console.error("Server Initialization failed with Error ${error}");
      throw new Error(error.message);
    });

    app.listen(appName, () =>
      console.log(`${appName} started listening on port ${appPort}`)
    );
  })
  .catch((error) =>
    console.error(`Database Connection Failed with Error ${error}`)
  );

console.log("Hello World !!!");
