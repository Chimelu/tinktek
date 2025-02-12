import { Router } from "express";
import { inputValidator } from "../../infrastructure/middleware";
import * as order from "./controller";
import authenticateToken from "../../infrastructure/middleware/authenticateToken.middleware";
import multer from "multer";
import { verifyToken } from "../../infrastructure/middleware/verifyToken";


const OrderRouter = Router();

const upload = multer();



OrderRouter.post("/place-order", verifyToken, order.placeOrder);
OrderRouter.post("/complete-order", verifyToken, order.completeOrder);
OrderRouter.get("/get-orders", order.getAllOrders);
OrderRouter.put("/deliveryStatus/:orderId", verifyToken, order.updateDeliveryStatus);
OrderRouter.put("/pickupStatus/:orderId",verifyToken, order.updatePickupStatus);

export default OrderRouter;
