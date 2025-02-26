import { Request, Response } from "express";
import { RepositoryFactory } from "../../infrastructure/repository-implementation/repository.factory";
import config from "../../infrastructure/config/env.config";
import { Product, Category } from "../../core/models";
import { DBSource } from "../../infrastructure/database/sqldb.database";
import ResponseMessage from "../../infrastructure/responseHandler/response.handler";
import WayagramCategoryService from "./services";

const { dbType } = config;


const WayagramCategoryRepoService: any = RepositoryFactory.setRepository(
  dbType,
  Category,
  DBSource
);

const wayagramCategoryService = new WayagramCategoryService(
  WayagramCategoryRepoService
);


export const createCategory = async (req: Request, res: Response) => {
  try {
    // Include file in the payload
    const categoryData = {
      ...req.body,
      imageFile: req.file,
    };

    // Call the service to create a category
    const newCategory = await wayagramCategoryService.createCategory(categoryData);

    return ResponseMessage.success(res, newCategory);
  }catch (error: any) {
    console.error(error);
    return ResponseMessage.error(res,null, error.message || "An unexpected error occurred.");
  }
  
};


export const editCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      imageFile: req.file, // Attach the file if provided
    };

    const updatedCategory = await wayagramCategoryService.editCategory(id, updateData);
    return ResponseMessage.success(res, updatedCategory);
  } catch (error: any) {
    return ResponseMessage.error(res,null, error.message);
  }
};


export const getCategories = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  try {
    const data = await wayagramCategoryService.getCategories(page, limit);
    return ResponseMessage.success(res, data);
  } catch (error: any) {
    console.error("An error just occurred:", error);
    return ResponseMessage.error(res,null, error.message);
  }
};

export const getParentCategories = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const filters = {
    categoryName: req.query.categoryName as string,
  };


  try {
    // Fetch only root categories (categories with no parent)
    const data = await wayagramCategoryService.getParentCategories(page, limit, filters);
    return ResponseMessage.success(res, data);
  } catch (error: any) {
    console.error("Error fetching root categories:", error);
    return ResponseMessage.error(res, null, error.message);
  }
};

export const getSubCategories = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  // Assume the root category id is passed as a URL parameter (e.g., /categories/:rootCategoryId/sub)
  const { rootCategoryId } = req.params;

  try {
    // Fetch subcategories for the given root category
    const data = await wayagramCategoryService.getSubCategoriesByRoot(rootCategoryId, page, limit);
    return ResponseMessage.success(res, data);
  } catch (error: any) {
    console.error("Error fetching subcategories:", error);
    return ResponseMessage.error(res, null, error.message);
  }
};


export const deleteCategory = async (req: Request, res: Response) => {
  
  try {
    console.log("Request Params:", req.params);
    const { id } = req.params;
    const isValidUUID = require('uuid').validate(id); // You can install the 'uuid' package

    if (!isValidUUID) {
      return ResponseMessage.error(res, "Invalid UUID format");
    }

    // Call the service to delete the category
    const deletedCategory = await wayagramCategoryService.deleteCategory(id);

    return ResponseMessage.success(res, {
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error: any) {
    return ResponseMessage.error(res, error.message);
  }
};


