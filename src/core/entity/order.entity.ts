export interface IOrder {
    id: string;
    userId: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      name: string;
    }>;
  
    deliveryToken: string; 
    total: number;
    status: "pending" | "processing" | "completed" | "cancelled";
    pickupAddress?: string | null;
    pickupStatus?: "pending" | "readyForPickUp" | "pickUpScheduled" | "completed";
    deliveryAddress?: string | null;
    deliveryFee?: number | null;
    deliveryDate?: Date | null;
    deliveryStatus?: "pending" | "processing" | "onTransit" | "completed";
    _v?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }