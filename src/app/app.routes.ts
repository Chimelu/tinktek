import { Router, Request, Response } from "express";
import ResponseMessage from "../infrastructure/responseHandler/response.handler";


import ProductRouter from "./product/routes";
import CategoryRouter from "./categories/routes";
import CartRouter from "./cart/cart.routes";


import OrderRouter from "./order/routes";  
import UserRouter from "./user/routes";
import ColorRouter from "./product/Color/routes";
import SizeRouter from "./product/Size/routes";
import AddressRouter from "./shippingAddress/routes";
import FavoritesRouter from "./favourites/favorites.routes";
import DeliveryFeeRouter from "./deliveryFee/routes";
import NotificationRouter from "./notifications/notifications.routes";

const AppRouter: any = Router();   

AppRouter.get("/", (request: any, response: any) => {
  return ResponseMessage.success(
    response,
    {
      service: "Joseph expensive  API",
      version: "2.0.0",
    },
    "Welcome to Joseph expensive  API"
  );
});

AppRouter.use("/products", ProductRouter);
AppRouter.use("/category", CategoryRouter);
AppRouter.use("/user-auth", UserRouter);
AppRouter.use("/colors", ColorRouter);
AppRouter.use("/sizes", SizeRouter);
AppRouter.use("/address", AddressRouter);

AppRouter.use("/favorites", FavoritesRouter);
AppRouter.use("/cart", CartRouter);
AppRouter.use("/orders", OrderRouter);
AppRouter.use("/deliveryFee", DeliveryFeeRouter);
AppRouter.use("/notifications", NotificationRouter);




export default AppRouter;
