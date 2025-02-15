import { Request, Response } from "express";
import { RepositoryFactory } from "../../infrastructure/repository-implementation/repository.factory";
import config from "../../infrastructure/config/env.config";
import { AddressModel, ColorModel } from "../../core/models";
import { DBSource } from "../../infrastructure/database/sqldb.database";
import ResponseMessage from "../../infrastructure/responseHandler/response.handler";
import {AddressService}from "./services";

const { dbType } = config;


const AddressRepoService: any = RepositoryFactory.setRepository(
  dbType,
  AddressModel,
  DBSource
);

const addressService = new AddressService(
    AddressRepoService
);


export const createAddress = async (req: Request, res: Response) => {
  try {
    // Include file in the payload
 

    // Call the service to create a color
    const newAddress = await addressService.createAddress(req.body);

    return ResponseMessage.success(res, newAddress);
  }catch (error: any) {
    console.error(error);
    return ResponseMessage.error(res,null, error.message || "An unexpected error occurred.");
  }
  
};


export const editAddress = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    const updatedAddress = await addressService.editAddress(addressId, req.body);
    return ResponseMessage.success(res, updatedAddress);
  } catch (error: any) {
    console.error(error);
    return ResponseMessage.error(res, null, error.message || "An unexpected error occurred.");
  }
};

/**
 * Get all addresses for a user
 */
export const getAllAddressesByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const addresses = await addressService.getAllAddressesByUserId(userId);
    return ResponseMessage.success(res, addresses);
  } catch (error: any) {
    console.error(error);
    return ResponseMessage.error(res, null, error.message || "An unexpected error occurred.");
  }
};


export const deleteAddress = async (req: Request, res: Response) => {
  
  try {
   
    const {addressId } = req.params;


    // Call the service to delete the Address
    const deletedAddress = await addressService.deleteAddress(addressId);

    return ResponseMessage.success(res, {
      message: "Address deleted successfully",
      data: deletedAddress,
    });
  } catch (error: any) {
    return ResponseMessage.error(res, error.message);
  }
};  
