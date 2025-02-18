import { Request, Response } from "express";
import { RepositoryFactory } from "../../infrastructure/repository-implementation/repository.factory";
import config from "../../infrastructure/config/env.config";
import { Product, Cart} from "../../core/models";
import { DBSource } from "../../infrastructure/database/sqldb.database";
import ResponseMessage from "../../infrastructure/responseHandler/response.handler";
import WayagramProductService from "../product/services";
import { CartService } from "./cart.services";
import { AddToCartDTO } from "./cart.dto";

const { dbType } = config;

const WayagramProductRepoService: any = RepositoryFactory.setRepository(
    dbType,
    Product,
    DBSource
  );

;

// Initialize repositories and services
const wayagramCartRepoService: any = RepositoryFactory.setRepository(
  dbType,
  Cart,
  DBSource
);
const wayagramCartService = new CartService(wayagramCartRepoService,WayagramProductRepoService);

const wayaGramProductRepoService: any = RepositoryFactory.setRepository(
  dbType,
  Product,
  DBSource  
);


export const addToCart = async (req: Request, res: Response): Promise<Response> => {
  try {
    const dto: AddToCartDTO = req.body;

    // Call the service method
    const updatedCart = await wayagramCartService.addToCart(dto);

    // Return the updated cart
    return ResponseMessage.success(res, updatedCart )
  } catch (error:any) {
    return ResponseMessage.error(res,null,"failed to add to cart")
  }
};
 



export const incrementProductQuantity = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.body;
    const updatedCart = await wayagramCartService.incrementProduct(userId, productId);
    return ResponseMessage.success(res,updatedCart, "Product quantity incremented") ;
  } catch (error:any) {
    return ResponseMessage.error(res, null , "Failed to increment product quantity");
  }
};


export const decrementProductQuantity = async (req: Request, res: Response) => {
  try {
    const { userId, shopId, productId } = req.body;
    const updatedCart = await wayagramCartService.decrementProduct(userId, productId);
    return ResponseMessage.success(res,updatedCart, "Product quantity decremented")
  } catch (error:any) {
    return ResponseMessage.error(res, null , "Failed to decrement product quantity");
  }
};


export const getUserCart = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return ResponseMessage.error( res ,"User ID is required");
    }

    // Call the service to get the user's cart
    const cart = await wayagramCartService.getUserCart(userId);

    return ResponseMessage.success(res, cart);
  } catch (error:any) {
    return ResponseMessage.error( res ,null ,error.message);
  }
};

