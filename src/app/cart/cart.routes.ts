import { Router } from "express";


import * as cart from "./cart.controller";


const CartRouter = Router();

CartRouter.post(
  "/add-to-cart",

  cart.addToCart
);
CartRouter.patch(
  "/request-deliveryFee",

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
