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


export const getAllDekiveryFee = async (req: Request, res: Response) => {
  try {
  
 

    // Call the service to create a category
    const newSize = await deliveryService.getAllDeliveryFee();

    return ResponseMessage.success(res, newSize);
  }catch (error: any) {
    console.error(error);
    return ResponseMessage.error(res,null, error.message || "An unexpected error occurred.");
  }
  
};
export const editdeliveryFee = async (req: Request, res: Response) => {
  try {
  
    // Call the service to edit delivery fee
    const newSize = await deliveryService.editdeliveryFee(req.params.id, req.body);

    return ResponseMessage.success(res, newSize);
  }catch (error: any) {
    console.error(error);
    return ResponseMessage.error(res,null, error.message || "An unexpected error occurred.");
  }
  
};

export const deleteAllDeliveryFees = async (req: Request, res: Response) => {
    try {
      const result = await deliveryService.deleteAllDeliveryFees();
      
      return ResponseMessage.success(res, result, "All delivery fees deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting delivery fees:", error);
      return ResponseMessage.error(res, null, error.message || "An error occurred while deleting delivery fees.");
    }
  };