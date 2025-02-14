import EventEmitter from "node:events";
import { Op } from "sequelize";
import { IDataAccessRepo, PaginationResult } from "../../../core/repositories/dataAccess.repository";
import { NotFoundError } from "../../../infrastructure/errorHandler/error";




export class ColorService {
  constructor(private colorRepo: IDataAccessRepo) {
    this.colorRepo = colorRepo;
  }



 public async createColor(colorData: any) {
    // Validate the incoming data using the DTO
    const data = colorData;
  
    // Handle Cloudinary image upload if an image file is provided
    
  
    // Create the category in the database
    const newColor = await this.colorRepo.createMany(data);
    if (!newColor) throw new NotFoundError('color not founf');
  
    return newColor;
  }
  
  
}