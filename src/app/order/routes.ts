import { Router } from "express";

import * as order from "./controller";

import multer from "multer";
import { authenticateUser } from "../../infrastructure/middleware/authMiddleware";



const OrderRouter = Router();

const upload = multer();



OrderRouter.post("/place-order", authenticateUser,  order.placeOrder);
OrderRouter.get("/get-orders", order.getAllOrders);
OrderRouter.put("/deliveryStatus/:orderId",  order.updateDeliveryStatus);
OrderRouter.put("/pickupStatus/:orderId", order.updatePickupStatus);





import axios from "axios";
import dotenv from "dotenv";


dotenv.config();


const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

/**
 * Initiates payment with Paystack
 * @route POST /api/paystack/initiate
 */

OrderRouter.post("/initiate", async (req, res) => {
  try {
    const { email, amount, callbackUrl } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ message: "Email and amount are required." });
    }

    // Convert amount to kobo (Naira * 100)
    const amountInKobo = amount * 100;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amountInKobo,
        currency: "NGN",
        callback_url: callbackUrl || "https://yourfrontend.com/payment-success",
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status) {
      return res.json({
        message: "Payment initialized successfully",
        status: "success",
        data: response.data.data, // contains the authorization URL
      });
    } else {
      return res.status(500).json({ message: "Failed to initialize payment" });
    }
  } catch (error:any) {
    console.error("Paystack Init Error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Error initializing payment", error: error.message });
  }
});




export default OrderRouter;
