import { Router } from "express";


import * as cart from "./cart.controller";
import { authenticateUser } from "../../infrastructure/middleware/authMiddleware";


const CartRouter = Router();

CartRouter.post(
  "/add-to-cart",
  // authenticateUser,

  cart.addToCart
);

CartRouter.patch(
  "/update-quantity",
  authenticateUser,
  cart.incrementProductQuantity
);
CartRouter.patch(
  "/decrease-quantity",
  authenticateUser,
  cart.decrementProductQuantity
);
CartRouter.put(
  "/delivery-option/:cartId",
  // authenticateUser,
  cart.updateDeliveryOption
);
CartRouter.get(
  "/:userId",
  // authenticateUser,
  cart.getUserCart
);






export default CartRouter;
