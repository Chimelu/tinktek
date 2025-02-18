import EventEmitter from "node:events";
import { Op } from "sequelize";
import { IDataAccessRepo, PaginationResult } from "../../../core/repositories/dataAccess.repository";
import { NotFoundError } from "../../../infrastructure/errorHandler/error";




export class SizeService {
  constructor(private sizeRepo: IDataAccessRepo) {
    this.sizeRepo = sizeRepo;
  }



 public async createSize(sizeData: any) {
    // Validate the incoming data using the DTO
    const data = sizeData;
  
    // Handle Cloudinary image upload if an image file is provided
    
  
    // Create the size in the database
    const newSize = await this.sizeRepo.createMany(data);
    if (!newSize) throw new NotFoundError('size not found');
  
    return newSize;
  }
  
  
  
}