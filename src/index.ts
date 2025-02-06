import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import { config } from "../src/config/env.config"; 
import shipmentRouter from "./routes/shipmentRoutes";

dotenv.config();

// connect db 
connectDB();

const app = express();
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/shipment", shipmentRouter);

// start the server 
const PORT = config.port || 5000;  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

