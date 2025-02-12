import { Request, Response } from "express";
import WayagramProductFavoriteService from "./favorites.services";
import WayagramProductService from "../product/products.services";
import { RepositoryFactory } from "../../infrastructure/repository-implementation/repository.factory";
import config from "../../infrastructure/config/env.config";
import {  Product, Favorite, Cart } from "../../core/models";
import { DBSource } from "../../infrastructure/database/sqldb.database";
import ResponseMessage from "../../infrastructure/responseHandler/response.handler";
import {
  BadRequestError,
  UnauthorizedError,
} from "../../infrastructure/errorHandler/error";
import { AuthRequest } from "../../types";



const { dbType } = config;


const wayagramCartRepoService: any = RepositoryFactory.setRepository(
  dbType,
  Cart,
  DBSource
);

const wayagramProductRepoService: any = RepositoryFactory.setRepository(
  dbType,
  Product,
  DBSource
);

const wayagramProductFavoriteService: any = RepositoryFactory.setRepository(
  dbType,
  Favorite,
  DBSource
);

const addToFavorites = async (req: AuthRequest, res: Response) => {
  const authenticatedUser = req.user;

  if (!authenticatedUser) {
    throw new UnauthorizedError("User not authenticated");
  }

  const { productId } = req.body;

  if (!productId) {
    throw new BadRequestError("Product ID is required");
  }

  try {
    const isFavorited = await wayagramProductFavoriteService.isFavorited(
      authenticatedUser.id,
      productId
    );
    if (isFavorited) {
      await wayagramProductFavoriteService.removeFromFavorite(
        authenticatedUser.id,
        productId
      );
      return ResponseMessage.success(res, "Product removed from favorites");
    } else {
      await wayagramProductFavoriteService.addToFavorite(
        authenticatedUser.id,
        productId
      );
      return ResponseMessage.success(res, "Product added to favorites");
    }
  } catch (error: any) {
    return ResponseMessage.error(res, error.message);
  }
};

const removeFromFavorites = async (req: AuthRequest, res: Response) => {
  const authenticatedUser = req.user;

  if (!authenticatedUser) {
    throw new UnauthorizedError("User not authenticated");
  }

  const { productId } = req.body;

  if (!productId) {
    throw new BadRequestError("Product ID is required");
  }

  try {
    await wayagramProductFavoriteService.removeFromFavorite(
      authenticatedUser.id,
      productId
    );
    return ResponseMessage.success(res, "Product removed from favorites");
  } catch (error: any) {
    return ResponseMessage.error(res, error.message);
  }
};

const getUserFavorites = async (req: AuthRequest, res: Response) => {
  const authenticatedUser = req.user;

  if (!authenticatedUser) {
    throw new UnauthorizedError("User not authenticated");
  } else {
    const data = await wayagramProductFavoriteService.getUserFavorites(
      authenticatedUser.id
    );
    return ResponseMessage.success(res, data);
  }
};

export { addToFavorites, removeFromFavorites, getUserFavorites };
