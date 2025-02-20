import { Request, Response } from "express";
import { RepositoryFactory } from "../../../infrastructure/repository-implementation/repository.factory";
import config from "../../../infrastructure/config/env.config";
import { SizeModel } from "../../../core/models";
import { DBSource } from "../../../infrastructure/database/sqldb.database";
import ResponseMessage from "../../../infrastructure/responseHandler/response.handler";
import {SizeService }from "./services";

const { dbType } = config;


const SizeRepoService: any = RepositoryFactory.setRepository(
  dbType,
  SizeModel,
  DBSource
);

const sizeService = new SizeService(
    SizeRepoService
);


export const createSize = async (req: Request, res: Response) => {
  try {
    // Include file in the payload
 

    // Call the service to create a category
    const newSize = await sizeService.createSize(req.body);

    return ResponseMessage.success(res, newSize);
  }catch (error: any) {
    console.error(error);
    return ResponseMessage.error(res,null, error.message || "An unexpected error occurred.");
  }
  
};


export const getAllSizes = async (req: Request, res: Response) => {
  try {
    // Call the service to fetch all sizes
    const sizes = await sizeService.getAllSizes();

    // Return success response
    return ResponseMessage.success(res, sizes);
  } catch (error: any) {
    console.error("Error fetching sizes:", error);
    return ResponseMessage.error(res, null, error.message || "An unexpected error occurred.");
  }
};
