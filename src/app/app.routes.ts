import { Router, Request, Response } from "express";
import ResponseMessage from "../infrastructure/responseHandler/response.handler";


import ProductRouter from "./product/products.routes";
import CategoryRouter from "./categories/categories.routes";
import FavoritesRouter from "./favourites/favorites.routes";
import CategoryAdminRouter from "./AdminRoutes/category";
import CartRouter from "./cart/cart.routes";


import OrderRouter from "./order/routes";  
import UserRouter from "./user/routes";

const AppRouter: any = Router();   

AppRouter.get("/", (request: any, response: any) => {
  return ResponseMessage.success(
    response,
    {
      service: "account-creation-and-profile-management-service",
      version: "2.0.0",
    },
    "Welcome to WayaGram Account Creation and Profile Management API"
  );
});

AppRouter.use("/products", ProductRouter);
AppRouter.use("/category", CategoryRouter);
AppRouter.use("/user-auth", UserRouter);
// AppRouter.use("/favorites", FavoritesRouter);

// AppRouter.use("/cart", CartRouter);
// AppRouter.use("/orders", OrderRouter);




export default AppRouter;
