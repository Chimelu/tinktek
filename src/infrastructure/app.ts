import cors from "cors";
import express from "express";
import formData from "express-form-data";
import session from "express-session";
import useragent from "express-useragent";
import { createServer } from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import AppRouter from "../app/app.routes";
import config from "./config/env.config";
import { DatabaseFactory } from "./database/database.factory";
import { NotFoundError } from "./errorHandler/error";
import { errorHandler } from "./errorHandler/errorWrapper";
import logger from "./logger/logger";
import path from "path";

const app: any = express();   

interface SecurityRequirement {
  [key: string]: string[];
}




app.use(express.json({ limit: "50mb" }));
app.use(useragent.express());

const server: any = createServer(app);
const io: any = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST","PATCH"],
  },
});
const { dbType, env, secret } = config;

/**  ================================== Database connection ==================================  */

DatabaseFactory.initDatabase(dbType);


/** ===================================== Middleware ===================================== */

app.use(express.json({ limit: "50mb" }));
app.use(useragent.express());
app.use(cors());

// Body Parser middleware
app.use(express.json());
// app.use(formData.parse());
// app.use(formParser);
// app.use(express.urlencoded({ extended: false }));
// app.set("trust proxy", 1);

// app.use(cors());
app.use(
  session({
    secret: secret,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.urlencoded({ extended: false }));
if (["development", "production"].includes(env || "development")) {
  app.use(morgan("dev", { stream: logger.stream }));
}



/** ============================= Make public folders visible =================== */
// app.use(express.static(path.join(__dirname,'public')));

/** ======================================= API ROUTES =======================================*/
// app.use(limiter);
app.use("/api/v1", AppRouter);

/** ================================== Invalid route response ================================ */

app.all("*", (request: any, response: any) => {
  throw new NotFoundError("Invalid route.");
});



/** ================================= General Errror Handling middleware ======================= */

app.use(errorHandler);

export default app;
