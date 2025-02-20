import { Request, Response } from "express";
import { RepositoryFactory } from "../../../infrastructure/repository-implementation/repository.factory";
import config from "../../../infrastructure/config/env.config";
import { ColorModel } from "../../../core/models";
import { DBSource } from "../../../infrastructure/database/sqldb.database";
import ResponseMessage from "../../../infrastructure/responseHandler/response.handler";
import {ColorService }from "./services";

const { dbType } = config;


const ColorRepoService: any = RepositoryFactory.setRepository(
  dbType,
  ColorModel,
  DBSource
);

const colorService = new ColorService(
    ColorRepoService
);


export const createColor = async (req: Request, res: Response) => {
  try {
    // Include file in the payload
 

    // Call the service to create a color
    const newColor = await colorService.createColor(req.body);

    return ResponseMessage.success(res, newColor);
  }catch (error: any) {
    console.error(error);
    return ResponseMessage.error(res,null, error.message || "An unexpected error occurred.");
  }
  
};


export const getAllColors = async (req: Request, res: Response) => {
  try {
    // Call the service to fetch all sizes
    const colors = await colorService.getAllColors();

    // Return success response
    return ResponseMessage.success(res, colors);
  } catch (error: any) {
    console.error("Error fetching sizes:", error);
    return ResponseMessage.error(res, null, error.message || "An unexpected error occurred.");
  }
};



