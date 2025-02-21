import { Request, Response } from "express";
import { RepositoryFactory } from "../../infrastructure/repository-implementation/repository.factory";
import config from "../../infrastructure/config/env.config";
import { DBSource } from "../../infrastructure/database/sqldb.database";
import ResponseMessage from "../../infrastructure/responseHandler/response.handler";
import {DeliveryFeeService }from "./services";
import { RegionModel } from "../../core/models";

const { dbType } = config;


const DeliveryRepoService: any = RepositoryFactory.setRepository(
  dbType,
  RegionModel,
  DBSource
);

const deliveryService = new DeliveryFeeService(
    DeliveryRepoService
);


// export const createSize = async (req: Request, res: Response) => {
//   try {
//     // Include file in the payload
 

//     // Call the service to create a category
//     const newSize = await sizeService.createSize(req.body);

//     return ResponseMessage.success(res, newSize);
//   }catch (error: any) {
//     console.error(error);
//     return ResponseMessage.error(res,null, error.message || "An unexpected error occurred.");
//   }
  
// };
