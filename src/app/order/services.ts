import { Op, Sequelize } from "sequelize";
import { createOrderDto, UpdateDeliveryStatusDTO, UpdatePickupStatusDTO } from "./dto";
import { IDataAccessRepo } from "../../core/repositories/dataAccess.repository";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Product } from "../../core/models";
import { any } from "joi";

class WayagramOrderService {
  private orderRepo: IDataAccessRepo;
  private product: IDataAccessRepo;

  private cart: IDataAccessRepo;



  constructor(  orderRepo: IDataAccessRepo , product: IDataAccessRepo,  cart: IDataAccessRepo ) {
    this.orderRepo = orderRepo;

    this.product = product;
    this.cart = cart;
   
   
  }

  /**
   * Places a new order and processes payment.
   * @param orderData - Raw order data.
   * @param token - Authorization token for API calls.
   * @returns Created order.
   */
  async placeOrder(cartId: string, userId: string, pickupAddress: string, shopId: string,  token: string, ): Promise<any> {
    // Fetch the cart using cartId and userId
    const cart = await this.cart.findOne({ id: cartId, userId });
    if (!cart) throw new Error("Cart not found.");
  
    // Find the specific shop items in the cart
    const shopItems = cart.items.find((item: any) => item.shopId === shopId);
    if (!shopItems) throw new Error("Shop not found in cart.");
    console.log(shopItems)
  
    // Get the total fee for the shop directly from the cart
    const totalFee = shopItems.totalFee;
  
  

    const deliveryToken = Math.floor(1000000000 + Math.random() * 9000000000).toString();

  
    // Prepare the order data, including the pickupAddress
    const orderData = {
      userId,
   
      items: shopItems.products.map((product: any) => ({
        productId: product.productId,
        quantity: product.quantity,
        price: product.price,
      })),
      deliveryFee: shopItems.deliveryFee,
      deliveryAddress: shopItems.deliveryAddress,
      pickupAddress,
      deliveryToken,  // Include the pickupAddress here
      deliveryDate: shopItems.deliveryDate,
      total:totalFee,
    };
  
    // Create the order using the data
    const newOrder = await this.orderRepo.create(orderData);   
  
    // Handle payment if applicable
    
    return newOrder;
  }
  
  


   async updateDeliveryStatus(
    orderId: string,
    updateData: UpdateDeliveryStatusDTO
  ): Promise<null> {
    const order = await this.orderRepo.findById(orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    // Update delivery status
    order.deliveryStatus = updateData.deliveryStatus;

    // Save the changes
    await order.save();

    return order;
  }
   async updatePickupStatus(
    orderId: string,
    updateData: UpdatePickupStatusDTO
  ): Promise<null> {
    const order = await this.orderRepo.findById(orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    // Update delivery status
    order.pickupStatus = updateData.pickupStatus;

    // Save the changes
    await order.save();

    return order;
  }


  async completeOrder(deliveryToken: string, bearerToken: string): Promise<any> {
    // Find the order with the matching deliveryToken
    const order = await this.orderRepo.findOne({ deliveryToken });
  
    if (!order) {
      throw new Error("Invalid delivery token or order not found.");
    }
  
    // Update the statuses based on the presence of a delivery fee
    if (order.deliveryFee && order.deliveryFee > 0) {
      order.deliveryStatus = "completed"; // Update deliveryStatus to completed
    } else {
      order.pickupStatus = "completed"; // Update pickupStatus to completed
    }
  
    // Update the overall status of the order to completed
    order.status = "completed";
  
    // Save the changes to the database
    await order.save();
  
    // Prepare the settlement payload
    const settlementPayload = {
      referenceId: order.orderId, // Use the order ID as the referenceId
      recipientId: order.vendorId, // Use the vendor ID as the recipientId
      purpose: "ECOMMERCE", // Settlement purpose
    };
  
    // Call the settlement microservice with Bearer token
    const settlementResponse = await fetch(
      "https://services.staging.wayagram.ng/wayagram-wallet/api/v2/client/payment/handle-settlement",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`, // Add Bearer token
        },
        body: JSON.stringify(settlementPayload),
      }
    );
  
    const settlementResult = await settlementResponse.json();
  
    // Check if the settlement was successful
    if (!settlementResult.status || settlementResult.statusCode !== 200) {
      throw new Error(
        `Settlement failed: ${settlementResult.message || "Unknown error"}`
      );
    }
  
    // Return the updated order and settlement response
    return {
      order,
      settlementMessage: settlementResult.message,
    };
  }
  

  public async getAllOrders(
    page: number = 1,
    limit: number = 20,
    filters: { userId?: string; shopId?: string; status?: string } = {}
  ) {
    try {
      const skip = (page - 1) * limit;
  
      // Build the query object based on the provided filters
      const query: any = {};
  
      if (filters.userId) {
        query.userId = filters.userId;
      }
      if (filters.shopId) {
        query.shopId = filters.shopId;
      }
      if (filters.status) {
        query.status = filters.status;
      }
  
      // Get the total count of orders matching the query
      const totalCount = await this.orderRepo.count(query);
  
      // Fetch paginated orders matching the query
      const orders = await this.orderRepo.find(query, {
        skip,
        limit,
        sort: { createdAt: -1 },
      });
  
      if (!orders || orders.length === 0) {
        return {
          data: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: limit,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      }
  
      // Extract product and shop details logic remains unchanged
      const productIds = orders
        .flatMap((order: any) => order.items.map((item: any) => item.productId))
        .filter((id: string | undefined) => !!id);
  
  
      const products = await Product.findAll({
        where: {
          id: {
            [Op.in]: productIds,
          },
        },
      });
  
      const productDetailsMap = products.reduce((map: Record<string, any>, product: any) => {
        const firstImage = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null;
        map[product.id] = { image: firstImage };
        return map;
      }, {});
      
  
  
  
      const ordersWithDetails = orders.map((order: any) => {
        const itemsWithDetails = order.items.map((item: any) => {
          const productDetails = productDetailsMap[item.productId] || { image: null };
          return {
            ...item,
            productImage: productDetails.image,
          };
        });
  

  
        return {
          ...order.dataValues,
          items: itemsWithDetails,
       
          deliveryType: order.deliveryFee > 0 ? "Delivery" : "Pickup",
        };
      });
  
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
  
      return {
        data: ordersWithDetails,
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
      console.error("Error in getAllOrders service:", error);
      throw error;
    }
  }
  
  
  



  /**
   * Gets an order by ID.
   * @param orderId - Order ID.
   * @returns Found order.
   */
  async getOrderById(orderId: string): Promise<any | null> {
    return await this.orderRepo.findById(orderId);
  }
}

export default WayagramOrderService;  
