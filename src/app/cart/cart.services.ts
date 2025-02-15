import { Cart } from "../../core/models";
import { Op } from 'sequelize';
import { IDataAccessRepo } from "../../core/repositories/dataAccess.repository";
import {AddToCartDTO } from "./cart.dto"; // Ensure you have this DTO defined
import { NotFoundError } from "../../infrastructure/errorHandler/error";

export class CartService {

  private cartRepo: IDataAccessRepo;
  private productRepo: IDataAccessRepo;


  constructor( cartRepo: IDataAccessRepo ,productRepo: IDataAccessRepo,  ) {
    this.cartRepo = cartRepo;
    this.productRepo = productRepo;

  }

  // Create a new cart or update an existing cart
  async addToCart(dto: AddToCartDTO) {
    const { userId, productId, quantity, price } = dto;
  
    // Check if the user already has a cart
    const existingCart = await this.cartRepo.findOne({ userId });
  
    if (!existingCart) {
      // Create a new cart if none exists
      const newCart = {
        userId,
        items: [{ productId, quantity, price: quantity * price }], // FIXED: Changed products to items
        totalFee: quantity * price, // FIXED: Using totalFee as defined in DTO and Model
      };
      return this.cartRepo.create(newCart);
    } else {
      let productExists = false;
  
      // Update the existing cart's items array
      const updatedItems = existingCart.items.map((item: any) => {
        if (item.productId === productId) {
          productExists = true;
          item.quantity += quantity;
          item.price = item.quantity * price;
        }
        return item;
      });
  
      if (!productExists) {
        updatedItems.push({ productId, quantity, price: quantity * price });
      }
  
      const totalFee = updatedItems.reduce(
        (sum: number, item: any) => sum + item.price,
        0
      );
  
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
  


  // Fetch user cart
  async getUserCart(userId: string) {
    const cart = await this.cartRepo.findOne({ userId });
    if (!cart) {
      return {
      
        userId,
        items: [] as any,
      
      };
    }
  
    // Populate shop and product details
    const populatedItems = await Promise.all(
      cart.items.map(async (shop: any) => {
      
  
        // Populate products in the shop
        const populatedProducts = await Promise.all(
          shop.products.map(async (product: any) => {
            // Get product details
            const productDetails = await this.productRepo.findOne({
              id: product.productId,
            });
            if (!productDetails)
              throw new Error(`Product not found: ${product.productId}`);
  
            return {
              ...product,
              productName: productDetails.name,
              pickUpAddress: productDetails.pickupAddress || null,
              deliveryOptions: productDetails.options ,
              deliveryCharge: productDetails.deliveryCharge,
              productImage:
                productDetails.images.length > 0 ? productDetails.images[0] : null,
            };
          })
        );
  
        // Include the total fee for the shop
        return {
          shopId: shop.shopId,
          deliveryAddress: shop.deliveryAddress || null,
          deliveryFee: shop.deliveryFee || null,
          deliveryDate: shop.deliveryDate || null,
          totalFee: shop.totalFee, // Include the shop's totalFee
          products: populatedProducts,
        };
      })
    );
  
 
  
    return {
      id:cart.id,
      userId: cart.userId,
      items: populatedItems,
     
    };
  }
  




}
