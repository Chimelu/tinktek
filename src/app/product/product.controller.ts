import { Request, Response } from "express";
import ProductService from "./services";
import { RepositoryFactory } from "../../infrastructure/repository-implementation/repository.factory";
import config from "../../infrastructure/config/env.config";
import {  Product,Category, ColorModel,  SizeModel} from "../../core/models";
import { DBSource } from "../../infrastructure/database/sqldb.database";
import ResponseMessage from "../../infrastructure/responseHandler/response.handler";



const { dbType } = config;
 
 const SizeRepoService: any = RepositoryFactory.setRepository(
   dbType,
   SizeModel,
   DBSource
 );

const ColorRepoService: any = RepositoryFactory.setRepository(
  dbType,
  ColorModel,
  DBSource
);
const CategoryRepoService: any = RepositoryFactory.setRepository(
  dbType,
  Category,
  DBSource
);


const ProductRepoService: any = RepositoryFactory.setRepository(
  dbType,
  Product,
  DBSource
);

const wayagramProductService = new ProductService(
  ProductRepoService,
  CategoryRepoService,
  ColorRepoService,
  SizeRepoService

);



export const createProduct = async (req: Request, res: Response) => {
  try {
    // Extract product data and images from the request
    const productData = req.body;
    const images = req.files as Express.Multer.File[];

    // Call the service to create the product
    const newProduct = await wayagramProductService.createProduct(productData, images);

    // Send a success response
    return ResponseMessage.success(res, newProduct);
  } catch (error: any) {
    // Send an error response
    return ResponseMessage.error(res, error.message);
  }
};


export const editProduct = async (req: Request, res: Response) => {
  try {
    // Extract product ID from request parameters
    const { productId } = req.params;

    // Extract updated product data and images from the request
    const productData = req.body;
    const images = req.files as Express.Multer.File[];

    // Call the service to update the product
    const updatedProduct = await wayagramProductService.editProduct(productId, productData, images);

    // Send a success response
    return ResponseMessage.success(res, updatedProduct);
  } catch (error: any) {
    // Send an error response
    return ResponseMessage.error(res, error.message);
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
  try {
    // Extract product ID and shop ID from request parameters
    const { productId } = req.params;

    // Validate required parameters
    if (!productId) {
      return ResponseMessage.error(res, "Product ID is required.");
    }

    // Call the service to delete the product
    const result = await wayagramProductService.deleteProduct(productId);

    // Send a success response
    return ResponseMessage.success(res, result);
  } catch (error: any) {
    console.error("Error in deleteProduct controller:", error);

    // Send an error response
    return ResponseMessage.error(res, error.message);
  }
};



export const getProductsAdmin = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  // Collect filter parameters from query
  const filters: any = {};
  if (req.query.id) {
    filters.id = req.query.id; // Fetch single product if ID is provided
  }
  if (req.query.categoryId) {
    filters.categoryId = req.query.categoryId;
  }
  if (req.query.colorId) {
    filters.colorId = req.query.colorId;
  }
  if (req.query.sizeId) {
    filters.sizeId = req.query.sizeId;
  }
  if (req.query.subCategoryId) {
    filters.subCategoryId = req.query.subCategoryId;
  }
  if (req.query.search) {
    filters.search = req.query.search;
  }

  try {
    const data = await wayagramProductService.getProductsAdmin(page, limit, filters);
    return ResponseMessage.success(res, data);
  } catch (error: any) {
    return ResponseMessage.error(res, error.message);
  }
};



// export const getProductsUser = async (req: Request, res: Response) => {
//   const page = parseInt(req.query.page as string) || 1;
//   const limit = parseInt(req.query.limit as string) || 20;

//   // Collect filter parameters from query
//   const filters: any = {};
//   if (req.query.shopId) {
//     filters.shopId = req.query.shopId;
//   }
//   if (req.query.discountId) {
//     filters.discountId = req.query.discountId;
//   }
//   if (req.query.categoryId) {
//     filters.categoryId = req.query.categoryId;
//   }

//   try {
//     const data = await wayagramProductService.getProductsUser(page, limit, filters);
//     return ResponseMessage.success(res, data);
//   } catch (error: any) {
//     return ResponseMessage.error(res, error.message);
//   }
// };

 




  


