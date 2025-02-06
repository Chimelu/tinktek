import express from "express";
import { createShipment } from "../controllers/shipmentController";
import { protect, authorizeRoles } from "../middlewares/authMiddleware";

const shipmentRouter = express.Router();

// Protected route for creating shipment, accessible only by Admins
shipmentRouter.post("/create", protect, authorizeRoles("Admin"), createShipment);

export default shipmentRouter
