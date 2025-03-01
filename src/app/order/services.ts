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
  private paystackSecretKey: string = process.env.PAYSTACK_SECRET_KEY || "";




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
  async placeOrder(
    cartId: string,
    userId: string,
 
 
    paymentReference: string
  ): Promise<any> {
    try {
      // Fetch the cart using cartId and userId
      const cart = await this.cart.findOne({ id: cartId, userId });
      if (!cart) throw new Error("Cart not found.");

      

      // **Step 1: Verify Payment with Paystack**
      const isPaymentSuccessful = await this.verifyPaystackPayment(paymentReference, cart.totalFee);
      if (!isPaymentSuccessful) {
        throw new Error("Payment verification failed. Order not placed.");
      }

      // **Step 2: Generate a Unique Delivery Token**
      const deliveryToken = Math.floor(1000000000 + Math.random() * 9000000000).toString();

      // **Step 3: Prepare the Order Data**
      const orderData = {
        userId,
        items: cart.items.map((product: any) => ({
          productId: product.productId,
          name: product.productName,
          color: product.color,
          size: product.size,
          quantity: product.quantity,
          price: product.price,
        })),
        deliveryFee: cart.deliveryFee,
        deliveryAddress:  cart.deliveryAddress,
        deliveryToken,
        deliveryDate: cart.deliveryDate,
        total: cart.totalFee,
      };

      // **Step 4: Create the Order**
      const newOrder = await this.orderRepo.create(orderData);

      return newOrder;
    } catch (error:any) {
      console.error("Error placing order:", error);
      throw new Error(error.message || "Failed to place order.");
    }
  }

  private async verifyPaystackPayment(paymentReference: string, expectedAmount: number): Promise<boolean> {
    try {
      const response = await axios.get(`https://api.paystack.co/transaction/verify/${paymentReference}`, {
        headers: {
          Authorization: `Bearer ${this.paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      });

      const paymentData = response.data;
      if (paymentData.status && paymentData.data.status === "success") {
        // Ensure the amount matches (Paystack amount is in kobo, so we multiply expectedAmount by 100)
        if (paymentData.data.amount === expectedAmount * 100) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Paystack verification error:", error);
      return false;
    }
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
            productName: productDetails.name,
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
