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

console.log(`Server running on http://localhost:${port} in ${env} mode.`);

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
