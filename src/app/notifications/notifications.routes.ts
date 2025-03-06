import { Router } from "express";
import * as notification from "./notifications.controller";
import { authenticateUser } from "../../infrastructure/middleware/authMiddleware";
// import { authenticateToken } from "../../infrastructure/middleware";




const NotificationRouter = Router();

NotificationRouter.get("/get", notification.getAllNotifications);
NotificationRouter.post("/send/single", notification.sendSingleNotification);
NotificationRouter.post("/send/all", notification.sendNotificationToAllUsers);
NotificationRouter.post("/send/delivery-status", notification.sendDeliveryStatusNotification);
NotificationRouter.post("/send/discount-offer", notification.sendDiscountOfferNotification);




export default NotificationRouter;