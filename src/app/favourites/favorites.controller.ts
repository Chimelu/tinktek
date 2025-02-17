import { Request, Response } from "express";
import WayagramProductFavoriteService from "./favorites.services";
import { RepositoryFactory } from "../../infrastructure/repository-implementation/repository.factory";
import config from "../../infrastructure/config/env.config";
import {  Product, Favorite, Cart } from "../../core/models";
import { DBSource } from "../../infrastructure/database/sqldb.database";
import ResponseMessage from "../../infrastructure/responseHandler/response.handler";
import {
  BadRequestError,
  UnauthorizedError,
} from "../../infrastructure/errorHandler/error";
import { AuthenticatedRequest } from "../../infrastructure/middleware/authMiddleware";
// import { AuthRequest } from "../../types";


const { dbType } = config;

const WayagramProductRepoService: any = RepositoryFactory.setRepository(
  dbType,
  Product,
  DBSource
);

const wayagramProductFavoriteService: any = RepositoryFactory.setRepository(
  dbType,
  Favorite,
  DBSource
);



const wayagramFavouriteService = new WayagramProductFavoriteService(
  WayagramProductRepoService,
  wayagramProductFavoriteService
);


const addToFavorites = async (req: Request, res: Response) => {
  try {
    const {userId}= req.params;

    const { productId } = req.body;
    const newFavourite =   await wayagramFavouriteService.addToFavorite(
      userId,
      productId
    );
    return ResponseMessage.success(res, newFavourite,"Product added to favorites");
    
  } catch (error:any) {
    return ResponseMessage.error(res,null, error.message || "An unexpected error occurred.");
    
  }  

};



const removeFromFavorites = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const authenticatedUser = req.user;
    const { productId } = req.body;
    if (!authenticatedUser) {
      throw new UnauthorizedError("User not authenticated");
    }
    const remove = await wayagramFavouriteService.removeFromFavorite(
      authenticatedUser.id,
      productId
    );

    
    return ResponseMessage.success(res, "Product removed from favorites");

  } catch (error:any) {
    return ResponseMessage.error(res,null, error.message || "An unexpected error occurred.");
    
  }  
 
};

const getUserFavorites = async (req: AuthenticatedRequest, res: Response) => {
  const authenticatedUser = req.user;

  if (!authenticatedUser) {
    throw new UnauthorizedError("User not authenticated");
  } else {
    const data = await wayagramFavouriteService.getUserFavorites(
      authenticatedUser.id
    );
    return ResponseMessage.success(res, data);
  }
};

export { addToFavorites, removeFromFavorites, getUserFavorites };
