import { Router } from "express";


import * as cart from "./cart.controller";


const CartRouter = Router();

CartRouter.post(
  "/add-to-cart",

  cart.addToCart
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






export default CartRouter;
