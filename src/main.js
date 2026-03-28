import "dotenv/config";
import connectDatabase from "./db/db-connect.js";
import app from "./app.js";

const appPort = process.env.APP_PORT ?? 8080;
const appName = process.env.APP_NAME ?? "Thread Stream";

console.info(`Staring ${appName} at ${new Date().toLocaleString()} `);

connectDatabase()
  .then(() => {
    app.on("error", (error) => {
      console.error("Server Initialization failed with Error ${error}");
      throw new Error(error.message);
    });

    app.listen(appPort, () =>
      console.info(`${appName} started listening on port ${appPort}`)
    );
  })
  .catch((error) =>
    console.error(`Database Connection Failed with Error ${error}`)
  );
