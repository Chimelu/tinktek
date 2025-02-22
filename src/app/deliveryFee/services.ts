import { IDataAccessRepo, PaginationResult } from "../../core/repositories/dataAccess.repository";
import { PRODUCT_RESPONSE } from "../../infrastructure/constants/responses/productResponse.contant";
import {
  NotFoundError,
  UnauthorizedError,
} from "../../infrastructure/errorHandler/error";
import { Product } from "../../core/models";
import { Op } from 'sequelize';



export class DeliveryFeeService {
    constructor(private deliveryFeeRepo: IDataAccessRepo) {
        this.deliveryFeeRepo = deliveryFeeRepo;
      }

      public async getAllDeliveryFee() {
        return await this.deliveryFeeRepo.find({}); // Fetch all colors from DB
      }


      public async editdeliveryFee(deliveryId: string, updatedData: any) {
        const existingAddress = await this.deliveryFeeRepo.findById( deliveryId);
    
    
          const updateResult = await this.deliveryFeeRepo.updateOne(
              { id: deliveryId },  // Find all addresses of the user
              updatedData,                   // Set active to false
                         // Ensure validation is applied
          );
      
          console.log("Updated addresses:", updateResult); // Log the result
      
        
        return updateResult;
    }

    public async deleteAllDeliveryFees() {
        const result = await this.deliveryFeeRepo.deleteMany({});
        console.log(`Deleted ${result.deletedCount} delivery fees.`);
        return result;
      }


}