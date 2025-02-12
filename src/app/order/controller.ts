import { Request, Response } from "express";
import { RepositoryFactory } from "../../infrastructure/repository-implementation/repository.factory";
import config from "../../infrastructure/config/env.config";
import { OrderModel ,  Product,Cart } from "../../core/models";
import { DBSource } from "../../infrastructure/database/sqldb.database";
import ResponseMessage from "../../infrastructure/responseHandler/response.handler";
import WayagramOrderService from "./services";
import { UpdateDeliveryStatusDTO, UpdatePickupStatusDTO } from "./dto";

const { dbType } = config;

// Set up the repository for orders
const WayagramOrderRepoService: any = RepositoryFactory.setRepository(
  dbType,
  OrderModel,
  DBSource
);
 




const WayagramProductRepoService: any = RepositoryFactory.setRepository(
  dbType,
  Product,
  DBSource
);

const wayagramCartRepoService: any = RepositoryFactory.setRepository(
  dbType,
  Cart,
  DBSource
);
// Initialize the order service
const wayagramOrderService = new WayagramOrderService(WayagramOrderRepoService, WayagramProductRepoService, wayagramCartRepoService);


export const placeOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // Assuming the token is in the format 'Bearer <token>'
    const { cartId, userId, pickupAddress, shopId } = req.body; // Add pickupAddress to the body
    if (!token) {
      return ResponseMessage.error(res, null, "Authorization token is required.", 401);
    }

 

    // Pass the token to the order service for payment processing
    const newOrder = await wayagramOrderService.placeOrder(cartId, userId, pickupAddress, shopId , token ); // Pass object here

    return ResponseMessage.success(
      res,
      newOrder,
      "Order placed successfully.",
      201
    );
  } catch (error: any) {
    console.error(error);
    return ResponseMessage.error(
      res,
      error,
      error.message || "Failed to place order.",
      400
    );
  }
};



  export const getAllOrders = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
  
      const filters = {
        userId: req.query.userId as string,
        shopId: req.query.shopId as string,
        status: req.query.status as string,
      };
  
      const result = await wayagramOrderService.getAllOrders(page, limit, filters);
  
      return ResponseMessage.success(
        res,
        result,
        "Orders fetched successfully.",
        200
      );
    } catch (error: any) {
      console.error(error);
      return ResponseMessage.error(
        res,
        error,
        error.message || "Failed to fetch orders.",
        400
      );
    }
  };
  
  
  



export const updateDeliveryStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const {orderId} = req.params; // Order ID from URL parameter
      const updateData: UpdateDeliveryStatusDTO = req.body;
  
      // Validate input
      if (!updateData.deliveryStatus) {
        return ResponseMessage.error(
          res,
          null,
          "Delivery status is required.",
          400
        );
      }
  
      // Update delivery status using the service
      const updatedOrder = await wayagramOrderService.updateDeliveryStatus(
        orderId,
        updateData
      );
  
      return ResponseMessage.success(
        res,
        updatedOrder,
        "Delivery status updated successfully.",
        200
      );
    } catch (error: any) {
      console.error(error);
      return ResponseMessage.error(
        res,
        error,
        error.message || "Failed to update delivery status.",
        400
      );
    }
  };
export const updatePickupStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const {orderId} = req.params; // Order ID from URL parameter
      const updateData: UpdatePickupStatusDTO = req.body;
  
      // Validate input
      if (!updateData.pickupStatus) {
        return ResponseMessage.error(
          res,
          null,
          "pickup status is required.",
          400
        );
      }
  
      // Update delivery status using the service
      const updatedOrder = await wayagramOrderService.updatePickupStatus(
        orderId,
        updateData
      );
  
      return ResponseMessage.success(
        res,
        updatedOrder,
        "Pickup status updated successfully.",
        200
      );
    } catch (error: any) {
      console.error(error);
      return ResponseMessage.error(
        res,
        error,
        error.message || "Failed to update pickup status.",
        400
      );
    }
  };



  export const completeOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { deliveryToken } = req.body;
      const token = req.headers.authorization?.split(" ")[1]; 
  
      if (!deliveryToken) {
        return ResponseMessage.error(res, null, "Delivery token is required.", 400);
      }
  
      const updatedOrder = await wayagramOrderService.completeOrder(deliveryToken,token);
  
      if (!updatedOrder) {
        return ResponseMessage.error(res, null, "Order not found or invalid delivery token.", 404);
      }
  
      return ResponseMessage.success(
        res,
        updatedOrder,
        "Order status updated successfully.",
        200
      );
    } catch (error: any) {
      console.error(error);
      return ResponseMessage.error(
        res,
        error,
        error.message || "Failed to complete order.",
        500
      );
    }
  };

  

export const getOrderById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { orderId } = req.params;
    const order = await wayagramOrderService.getOrderById(orderId);

    if (!order) {
      return ResponseMessage.error(res, null, "Order not found.", 404);
    }

    return ResponseMessage.success(
      res,
      order,
      "Order retrieved successfully.",
      200
    );
  } catch (error: any) {
    console.error(error);
    return ResponseMessage.error(
      res,
      error,
      error.message || "Failed to fetch order.",
      500
    );
  }
};
