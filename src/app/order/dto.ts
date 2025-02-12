// dtos/order.dto.ts
import { IOrder } from "../../core/entity/order.entity";

export const createOrderDto = (orderData: any): Partial<IOrder> => {
  // Required fields validation
  if (!orderData.userId) throw new Error("User ID is required.");
  if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
    throw new Error("Order must include at least one item.");
  }
  if (!orderData.shopId) throw new Error("Shop ID is required.");
  if (!orderData.deliveryAddress && !orderData.pickupAddress) {
    throw new Error("Either delivery address or pickup address is required.");
  }
  if (!orderData.total) throw new Error("Total amount is required.");

  // Return processed DTO with default values for optional fields
  return {
    userId: orderData.userId,
    items: orderData.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity || 1, // Default quantity to 1
      price: parseFloat(item.price) || 0, 
      name: item.name || "Unnamed Product", // Fallback for item name
    })),
    shopId: orderData.shopId,
    vendorId: orderData.vendorId,
    deliveryFee: orderData.deliveryFee || "0", // Default delivery fee to 0
    deliveryAddress: orderData.deliveryAddress || "",
    deliveryDate: orderData.deliveryDate ? new Date(orderData.deliveryDate) : null, // Parse delivery date if provided
    pickupAddress: orderData.pickupAddress || "",
    total: parseFloat(orderData.total),
  };
};


export interface UpdateDeliveryStatusDTO {
    deliveryStatus: "pending" | "processing" | "onTransit" | "completed";
  }
export interface UpdatePickupStatusDTO {
    pickupStatus: "pending" | "readyForPickUp" | "pickUpScheduled" | "completed";
  }
  
