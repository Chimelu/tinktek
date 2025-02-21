import { Cart } from "../../core/models";
import { Op } from 'sequelize';
import { IDataAccessRepo } from "../../core/repositories/dataAccess.repository";
import {AddToCartDTO } from "./cart.dto"; // Ensure you have this DTO defined
import { BadRequestError, NotFoundError } from "../../infrastructure/errorHandler/error";
import deliveryFee from "../../core/models/DeliveryFee/deliveryFee";

export class CartService {

  private cartRepo: IDataAccessRepo;
  private productRepo: IDataAccessRepo;
  private deliveryFeeRepo: IDataAccessRepo;
  private addressRepo: IDataAccessRepo;


  constructor( cartRepo: IDataAccessRepo ,productRepo: IDataAccessRepo, deliveryFeeRepo: IDataAccessRepo, addressRepo: IDataAccessRepo  ) {
    this.cartRepo = cartRepo;
    this.productRepo = productRepo;
    this.deliveryFeeRepo = deliveryFeeRepo;
    this.addressRepo = addressRepo;

  }

  // Create a new cart or update an existing cart
  async addToCart(dto: AddToCartDTO) {
    const { userId, productId, quantity, price, size, color } = dto;
  
    // Fetch the user's cart
    const existingCart = await this.cartRepo.findOne({ userId });
  
    if (!existingCart) {
      // Create a new cart if none exists
      const newCart = {
        userId,
        items: [{ productId, quantity, price: quantity * price, size, color }], // ✅ Ensure size & color are stored
        totalFee: quantity * price,
      };
      return this.cartRepo.create(newCart);
    } else {
      let productExists = false;
  
      // ✅ Update only if the same product with the same size & color exists
      const updatedItems = existingCart.items.map((item: any) => {
        if (item.productId === productId && item.size === size && item.color === color) {
          productExists = true;
          item.quantity += quantity;
          item.price = item.quantity * price;
        }
        return item;
      });
  
      // ✅ If product with that size & color does not exist, add a new entry
      if (!productExists) {
        updatedItems.push({ productId, quantity, price: quantity * price, size, color });
      }
  
      // Recalculate total fee
      const totalFee = updatedItems.reduce((sum: number, item: any) => sum + item.price, 0);
  
      return this.cartRepo.updateOne({ userId }, { items: updatedItems, totalFee });
    }
  }
  
  
  
  

  // Increment product quantity

  async incrementProduct(userId: string, productId: string) {
    // Find the cart for the user
    const cart = await this.cartRepo.findOne({ userId });
    if (!cart) throw new Error("Cart not found");
  
    // Update the cart items
    const updatedItems = cart.items.map((item: any) => {
      if (item.productId === productId) {
        // Increment quantity and recalculate price
        item.quantity += 1;
        item.price = item.quantity * (item.price / (item.quantity - 1)); // Maintain unit price
      }
      return item;
    });
  
    // Recalculate totalFee for the cart
    const totalFee = updatedItems.reduce((sum: number, item: any) => sum + item.price, 0);
  
    // Update the cart with the modified items
    return this.cartRepo.updateOne({ userId }, { items: updatedItems, totalFee });
  }
  
  



  // Decrement product quantity

  async decrementProduct(userId: string, productId: string) {
    // Find the cart for the user
    const cart = await this.cartRepo.findOne({ userId });
    if (!cart) throw new NotFoundError("Cart not found");
  
    // Update the cart items
    const updatedItems = cart.items
      .map((item: any) => {
        if (item.productId === productId) {
          item.quantity -= 1;
  
          if (item.quantity > 0) {
            // Maintain unit price while updating total price
            item.price = item.quantity * (item.price / (item.quantity + 1));
            return item;
          }
          // If quantity becomes 0, exclude the item
          return null;
        }
        return item;
      })
      .filter(Boolean); // Remove null items (products with quantity 0)
  
    // Recalculate totalFee for the cart
    const totalFee = updatedItems.reduce((sum: number, item: any) => sum + item.price, 0);
  
    // Update the cart with the modified items
    return this.cartRepo.updateOne({ userId }, { items: updatedItems, totalFee });
  }
  


  public async updateDeliveryOption(cartId: string, deliveryOption: "delivery" | "pickup") {
    // Find the cart by ID
    const cart = await this.cartRepo.findOne({ id: cartId });
    if (!cart) throw new NotFoundError("Cart not found");
  
    // Validate the deliveryOption value
    if (!["delivery", "pickup"].includes(deliveryOption)) {
      throw new BadRequestError("Invalid delivery option. Must be 'delivery' or 'pickup'.");
    }
  
    // Update the cart's delivery option
    await this.cartRepo.updateOne(
      { id: cart.id },
      { deliveryOption }
    );
  
    return { message: "Delivery option updated successfully", deliveryOption };
  }
  



// Fetch user cart
async getUserCart(userId: string) {
  const cart = await this.cartRepo.findOne({ userId });

  if (!cart) {
    return {
      userId,
      items: [] as any,
    };
  }

  // 1️⃣ Fetch the user's active shipping address
  const shippingAddress = await this.addressRepo.findOne(
     { userId, active: true, isDeleted: false },
  );


  await this.cartRepo.updateOne({ id: cart.id }, {  deliveryAddress: shippingAddress.address} );

  let deliveryFee = cart.deliveryFee || null; // Default to cart's delivery fee

  // 2️⃣ If delivery option is "delivery", match region to delivery fee
  if (cart.deliveryOption === "delivery" && shippingAddress?.region) {
    const deliveryFeeEntry = await this.deliveryFeeRepo.findOne(
      { region: shippingAddress.region },
    );
    // console.log(deliveryFeeEntry)

    if (deliveryFeeEntry) {
      deliveryFee = deliveryFeeEntry.deliveryFee;
      console.log("Retrieved Delivery Fee:", deliveryFeeEntry?.deliveryFee);

      // console.log(deliveryFeeEntry)
      // 3️⃣ Update the cart's delivery fee
      await this.cartRepo.updateOne({ id: cart.id },  deliveryFee );
    }
  }

  // 4️⃣ Populate product details
  const populatedItems = await Promise.all(
    cart.items.map(async (item: any) => {
      try {
        const productDetails = await this.productRepo.findOne(
           { id: item.productId },
        );

        if (!productDetails) {
          return null;
        }

        return {
          ...item,
          productName: productDetails.name,
          productImage:
            productDetails.images.length > 0 ? productDetails.images[0] : null,
        };
      } catch (error) {
        return null;
      }
    })
  );

  return {
    id: cart.id,
    userId: cart.userId,
    items: populatedItems.filter(Boolean),
    deliveryFee: cart.deliveryFee ?? 0, // Ensure deliveryFee is never null
    deliveryOption: cart.deliveryOption,
    pickupAddress: cart.pickUpAddress,
    total: cart.totalFee + (cart.deliveryFee ?? 0), // Default deliveryFee to 0 if null
    shippingRegion: cart?.deliveryAddress || null, // Include region in response
  };
  
}



  




}
