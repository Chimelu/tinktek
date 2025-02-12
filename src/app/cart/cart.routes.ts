import { Router } from "express";

import { inputValidator } from "../../infrastructure/middleware";
import * as cart from "./cart.controller";
import authenticateToken from "../../infrastructure/middleware/authenticateToken.middleware";
import { verifyToken } from "../../infrastructure/middleware/verifyToken";

const CartRouter = Router();

CartRouter.post(
  "/add-to-cart",

  cart.addToCart
);
CartRouter.patch(
  "/request-deliveryFee",
  verifyToken,
  cart.updateDeliveryAddress
);
CartRouter.get(
  "/delivery-address/:shopId",
  cart.getDeliveryAddress
);
CartRouter.patch(
  "/update-quantity",
  cart.incrementProductQuantity
);
CartRouter.patch(
  "/decrease-quantity",
  cart.decrementProductQuantity
);
CartRouter.get(
  "/:userId",
  cart.getUserCart
);
CartRouter.patch(
  "/shop/:shopId/user/:userId/update-fee-and-date",
  cart.updateDeliveryFeeAndDate
);





export default CartRouter;
