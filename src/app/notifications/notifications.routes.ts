import { Router } from "express";
import * as notification from "./notifications.controller";
import { authenticateUser } from "../../infrastructure/middleware/authMiddleware";
// import { authenticateToken } from "../../infrastructure/middleware";




const NotificationRouter = Router();

NotificationRouter.get("/get", authenticateUser, notification.getAllNotifications);
NotificationRouter.post("/send/single", authenticateUser, notification.sendSingleNotification);
NotificationRouter.post("/send/all", authenticateUser, notification.sendNotificationToAllUsers);
NotificationRouter.post("/send/delivery-status", authenticateUser, notification.sendDeliveryStatusNotification);
NotificationRouter.post("/send/discount-offer", authenticateUser, notification.sendDiscountOfferNotification);




export default NotificationRouter;