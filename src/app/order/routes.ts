import { Router } from "express";

import * as order from "./controller";

import multer from "multer";



const OrderRouter = Router();

const upload = multer();



OrderRouter.post("/place-order",  order.placeOrder);
OrderRouter.get("/get-orders", order.getAllOrders);
OrderRouter.put("/deliveryStatus/:orderId",  order.updateDeliveryStatus);
OrderRouter.put("/pickupStatus/:orderId", order.updatePickupStatus);

export default OrderRouter;
