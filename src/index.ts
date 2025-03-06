import http from "http";
import debug from "debug";
import app from "./infrastructure/app";
import config from "./infrastructure/config/env.config";
import { seedRegions } from "./core/models/DeliveryFee/populateDb";
import cron from "node-cron";
import axios from "axios";

seedRegions();

const { port, env } = config;
const DEBUG = debug("dev");
app.disable("x-powered-by");


if(process.env.NODE_ENV === "production"){ // runs only on production
console.log("Environment Check:", {
  NODE_ENV: process.env.NODE_ENV,
  isProd: process.env.NODE_ENV !== "production",
  envKeys: Object.keys(process.env).filter((key) => key.includes("TOKEN")),
});}


// app.use(security);

// process.on("uncaughtException", async (error) => {
//   console.log(`uncaught exception: ${error.message}`);
//   appLogger.error(error);
//   await new NodemailerEmailService().sendMail({
//     to: "developer@gmail.com",
//     subject: "Server Error",
//     html: `Hi Engineer, <p> uncaught exception: ${error.message} </p> <p> ${error}</p>`,
//   });
//   process.exit(1);
// });

// process.on("unhandledRejection", async (reason, promise) => {
//   appLogger.error(reason);
//   await new NodemailerEmailService().sendMail({
//     to: "developer@gmail.com",
//     subject: "Server Error",
//     html: `Hi Engineer, <p> unhandled rejection at ${await promise}  </p> <p> reason: ${reason}</p>`,
//   });

//   process.exit(1);
// });



const server = http.createServer(app);

server.listen(port, () => {
  DEBUG(`Server running on http://localhost:${port} in ${env} mode.`);
});

// 🔥 **CRON JOB TO KEEP SERVER AWAKE**
cron.schedule("*/5 * * * *", async () => {
  try {
    const serverUrl = `https://tinktek.onrender.com/api/v1`; // Change this to your actual server URL
    console.log(`Pinging server: ${serverUrl}`);
    await axios.get(serverUrl);
    console.log("Server is active ✅");
  } catch (error:any) {
    console.error("Error keeping server awake:", error.message);
  }
});
