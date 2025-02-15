import { IShippingAddress } from "../../core/entity/shippingAddres";

/**
 * Create Shipping Address DTO
 * @param addressData - The incoming data to create a shipping address
 * @returns A Partial<IShippingAddress> object
 */
export const createShippingAddressDto = (addressData: any): Partial<IShippingAddress> => {
  if (!addressData.name) throw new Error("Recipient name is required");
  if (!addressData.country) throw new Error("Country is required");
  if (!addressData.city) throw new Error("City is required");
  if (!addressData.state) throw new Error("State is required");
  if (!addressData.address) throw new Error("Address is required");
  if (!addressData.zipCode) throw new Error("Zip code is required");

  return {
    name: addressData.name,
    country: addressData.country,
    city: addressData.city,
    state: addressData.state,
    address: addressData.address,
    zipCode: addressData.zipCode,
    userId: addressData.userId 
  };
};
