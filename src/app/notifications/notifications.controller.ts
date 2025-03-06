import { Request, Response } from "express";
import { RepositoryFactory } from "../../infrastructure/repository-implementation/repository.factory";
import config from "../../infrastructure/config/env.config";
import { DBSource } from "../../infrastructure/database/sqldb.database";
import ResponseMessage from "../../infrastructure/responseHandler/response.handler";
import { NotificationModel, UserModel, OrderModel, Product } from "../../core/models";
import { NotificationService } from "./notifications.services";
import UserService from "../user/service";

const { dbType } = config;


const UserRepoService: any = RepositoryFactory.setRepository(
  dbType,
  UserModel,
  DBSource
);

const userService = new UserService(
    UserRepoService
);

const NotificationRepoService: any = RepositoryFactory.setRepository(
  dbType,
  NotificationModel,
  DBSource
);

// Set up the repository for orders
const WayagramOrderRepoService: any = RepositoryFactory.setRepository(
  dbType,
  OrderModel,
  DBSource
);


export const ProductRepoService: any = RepositoryFactory.setRepository(
  dbType,
  Product,
  DBSource
);

const notificationService = new NotificationService(
  NotificationRepoService,
  UserRepoService,
  WayagramOrderRepoService,
  ProductRepoService
);

export const getAllNotifications = async (req: Request, res: Response) => {
    try {
      const { userId, notificationType, page, limit } = req.query;
  
      const notifications = await notificationService.getAllNotifications(
        Number(page) || 1,
        Number(limit) || 20,
        {
          userId: userId as string,
          notificationType: notificationType as string,
        }
      );
  
      return ResponseMessage.success(res, notifications, "Notifications fetched successfully.");
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      return ResponseMessage.error(res, null, error.message || "An unexpected error occurred.");
    }
}


export const sendSingleNotification = async (req: Request, res: Response) => {
  try {
    const { body, userId, notificationType, } = req.body;
    const newNotification = await notificationService.sendSingleNotification( body, userId, notificationType || "users-notification", );
    return ResponseMessage.success(res, newNotification, "Notification sent successfully.");
  } catch (error: any) {
    console.error(error);
    return ResponseMessage.error(res, null, error.message || "An unexpected error occurred.");
  }
};


export const sendNotificationToAllUsers = async (req: Request, res: Response) => {
  try {
    const { body, title, notificationType, } = req.body;
    const newNotification = await notificationService.sendNotifications( body, title, notificationType || "general-notification", );
    return ResponseMessage.success(res, newNotification, "Notification sent successfully.");
  } catch (error: any) {
    console.error(error);
    return ResponseMessage.error(res, null, error.message || "An unexpected error occurred.");
  }
};


export const sendDeliveryStatusNotification = async (req: Request, res: Response) => {
  try {
    const { orderId, productName } = req.body;
    const result = await notificationService.sendDeliveryStatusNotification(orderId, productName);
    return ResponseMessage.success(res, result, "Delivery status notification sent.");
  } catch (error: any) {
    return ResponseMessage.error(res, null, error.message);
  }
};

export const sendDiscountOfferNotification = async (req: Request, res: Response) => {
  try {
    const { productId, discountOffer } = req.body;
    const result = await notificationService.sendDiscountOfferNotification(productId, discountOffer);
    return ResponseMessage.success(res, result, "Discount offer notification sent.");
  } catch (error: any) {
    return ResponseMessage.error(res, null, error.message);
  }
};
