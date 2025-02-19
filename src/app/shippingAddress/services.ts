import EventEmitter from "node:events";
import { Op } from "sequelize";
import { IDataAccessRepo, PaginationResult } from "../../core/repositories/dataAccess.repository";
import { NotFoundError } from "../../infrastructure/errorHandler/error";
import { createShippingAddressDto } from "./dto";




export class AddressService {
    constructor(private addressRepo: IDataAccessRepo) {
      this.addressRepo = addressRepo;
    }
  
  
    public async createAddress(addressData: any) {
      const data = createShippingAddressDto(addressData);
  
      // Deactivate all other addresses of the user before creating the new one
      await this.addressRepo.updateMany(
          { userId: data.userId }, // Find all addresses for the user
          { active: false },       // Set active to false for existing addresses
          { runValidators: true }  // Ensure validation is applied
      );
  
      // Create the new address in the database
      const newAddress = await this.addressRepo.create(data);
      if (!newAddress) throw new NotFoundError('Address not found');
  
      return newAddress;
  }
  
  



    public async editAddress(addressId: string, updatedData: any) {
      const existingAddress = await this.addressRepo.findById( addressId);
      
      if (!existingAddress) throw new NotFoundError('Address not found');
      console.log(existingAddress.userId)
  
      // If the updated address is set to active, deactivate all other addresses of the user
      if (updatedData.active === true) {
        const updateResult = await this.addressRepo.updateMany(
            { userId: existingAddress.userId },  // Find all addresses of the user
            { active: false },                   // Set active to false
            { runValidators: true }              // Ensure validation is applied
        );
    
        console.log("Updated addresses:", updateResult); // Log the result
    }
    
  
      const updatedAddress = await this.addressRepo.updateOne({id:addressId}, updatedData);
      
      return updatedAddress;
  }


  public async getAllAddressesByUserId(userId: string) {
    const addresses = await this.addressRepo.find(
       { userId },
    );

    return addresses.length ? addresses : [];
  }



    public async deleteAddress(addressId: string) {
      // Find the address
      const address = await this.addressRepo.findOne(
         { id: addressId,  isDeleted: false},
      );
      // ({ id, isDeleted: false })
  
      if (!address) {
        throw new Error("address not found or already deleted");
      }
  
      // Soft delete the address
      await address.update({ isDeleted: true });
  
      return address;
    }
  
      
  }