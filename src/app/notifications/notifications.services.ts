import axios from "axios";
import { NotificationModel } from "../../core/models";
import { IDataAccessRepo } from "../../core/repositories/dataAccess.repository";
import { IUser } from "../../core/entity/user.entity";
import user from "../../core/models/user/user";
import { v4 as uuidValidate, V4Options } from "uuid";
import { NotFoundError } from "../../infrastructure/errorHandler/error";

const APP_ID = parseFloat(process.env.NOTIFY_APP_ID); // Has to be a number type
const APP_TOKEN = process.env.NOTIFY_APP_TOKEN;
const BASE_URL = process.env.NOTIFY_BASE_URL;
const BASE_URL_INDIVIDUAL = process.env.NOTIFY_BASE_URL_INDIVIDUAL;

export class NotificationService {
  constructor(
    private notificationRepo: IDataAccessRepo,
    private userRepo: IDataAccessRepo<IUser>,
    private orderRepo: IDataAccessRepo,
    private product: IDataAccessRepo,
  ) {
    this.userRepo = userRepo;
    this.orderRepo = orderRepo;
    this.product = product;
  }  


  // Get paginated notifications with filtering
  public async getAllNotifications(
    page: number = 1,
    limit: number = 20,
    filters: { userId?: string; notificationType?: string } = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      const query: any = {};
      const sort = { createdAt: -1 }

      if (filters.userId) {
        query.userId = filters.userId;
      }
      if (filters.notificationType) {
        query.notificationType = filters.notificationType;
      }

      // Count total matching notifications
      const totalCount = await this.notificationRepo.count(query);

      // Fetch paginated notifications
      const notifications = await this.notificationRepo.find(query, {
        skip,
        limit,
        sort,
      });

      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        data: notifications,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage,
          hasPreviousPage,
        },
      };
    } catch (error) {
      console.error("Error in getAllNotifications service:", error);
      throw error;
    }
  }



    // Send a single push notification & store it in DB
    // usage: sendNotification(body, userId, notificationType? )
    public async sendSingleNotification(
      body: string,
      userId: string,
      notificationType?: string,
    ) {
      const dateSent = new Date().toLocaleString();
  
      const user = await this.userRepo.findOne({ id: userId });
      if (!user) throw new NotFoundError("User not found");
      const text = `Hello ${user.firstName}`
      try {
        await axios.post(BASE_URL_INDIVIDUAL, {
          subID: userId,
          appId: APP_ID,
          appToken: APP_TOKEN,
          title: text,
          message: body,
          pushData: `{ title: ${text}, body: ${body} }` //optional
        });
  
        // Store notification in DB
        return await this.notificationRepo.create({
          userId,
          notificationType: notificationType || "users-notification",
          appId: APP_ID,
          appToken: APP_TOKEN,
          title: text,
          body,
          dateSent,
        });
      } catch (error) {
        console.error("Error sending notification:", error);
        throw new Error("Failed to send notification.");
      }
    }



    // Send push notification to all users
    // usage: sendNotification(body, title, notificationType)
    public async sendNotifications(
      body: string,
      title?: string,
      notificationType?: string,
    ) {
      const dateSent = new Date().toLocaleString();
      try {
          await axios.post(BASE_URL, {
            appId: APP_ID,
            appToken: APP_TOKEN,
            title,
            body,
            dateSent,
          });
    
          // Store notification in DB
          return await this.notificationRepo.create({
            userId: null,
            notificationType: notificationType || "general-notification",
            appId: APP_ID,
            appToken: APP_TOKEN,
            title,
            body,
            dateSent,
          });
        } catch (error) {
          console.error("Error sending notification:", error);
          throw new Error("Failed to send notification.");
        }
  }
    




  // Send delivery status change notification
  public async sendDeliveryStatusNotification(orderId: string, productName: string) {  const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw new Error("Order not found.");
    }
    if (order.status === "pending") {
      throw new Error("Notification for pending orders Not Allowed.");
    }
    const body = `your order for ${productName} has been ${order.status}.`;  
    return await this.sendSingleNotification( body, order.userId, order.status === "delivered" ? "delivery-order" : "cancelled-order");
  }



  // Send discount offer notification
  public async sendDiscountOfferNotification(productId: string, discountOffer: string) {
    const singleProduct = await this.product.findById(productId);
    if (!singleProduct) {
      throw new Error("Product not found.");
    }
    const title = "Exclusive Discount Offer!";
    const body = `Hurry up! ${discountOffer} available on ${singleProduct.name}.`;
    return await this.sendSingleNotification( body, title, "discount-offer");
  }
}
