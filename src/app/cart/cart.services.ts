import { Cart } from "../../core/models";
import { Op } from 'sequelize';
import { IDataAccessRepo } from "../../core/repositories/dataAccess.repository";
import {AddToCartDTO } from "./cart.dto"; // Ensure you have this DTO defined

export class CartService {

  private cartRepo: IDataAccessRepo;
  private productRepo: IDataAccessRepo;
  private shopRepo: IDataAccessRepo;

  constructor( cartRepo: IDataAccessRepo ,productRepo: IDataAccessRepo, shopRepo: IDataAccessRepo   ) {
    this.cartRepo = cartRepo;
    this.productRepo = productRepo;
    this.shopRepo = shopRepo;
  }

  // Create a new cart or update an existing cart
  async addToCart(dto: AddToCartDTO) {
    const { userId, shopId, productId, quantity, price } = dto;
  
    // Check if the user already has a cart
    const existingCart = await this.cartRepo.findOne({ userId });
  
    if (!existingCart) {
      // Create a new cart if none exists
      const newCart = {
        userId,
        items: [
          {
            shopId,
            products: [{ productId, quantity, price: quantity * price }], // Single product price calculation
            totalFee: quantity * price, // Total fee for this shop
          },
        ],
      };
      return this.cartRepo.create(newCart);   
    } else {
      // Update the existing cart
      let shopExists = false;
      let productExists = false;
  
      const updatedItems = existingCart.items.map((shop: any) => {
        if (shop.shopId === shopId) {
          shopExists = true;
          shop.products = shop.products.map((product: any) => {
            if (product.productId === productId) {
              productExists = true;
              product.quantity += quantity;
              product.price = product.quantity * price; // Update price for the product
            }
            return product;
          });
  
          // Add the product if it doesn't already exist in this shop
          if (!productExists) {
            shop.products.push({ productId, quantity, price: quantity * price });
          }
  
          // Recalculate the totalFee for the shop
          shop.totalFee = shop.products.reduce(
            (sum: any, product: any) => sum + product.price,
            0
          );
        }
        return shop;
      });
  
      // Add a new shop if it doesn't already exist in the cart
      if (!shopExists) {
        updatedItems.push({
          shopId,
          products: [{ productId, quantity, price: quantity * price }],
          totalFee: quantity * price, // Total fee for this new shop
        });
      }
  
      // Update the cart with the modified items
      return this.cartRepo.updateOne({ userId }, { items: updatedItems });
    }
  }
  
  
  
  
async updateDeliveryAddress(userId: string, shopId: string, deliveryAddress: string) {
  // Fetch the user's cart
  const existingCart = await this.cartRepo.findOne({ userId });

  if (!existingCart) {
    throw new Error("Cart not found for this user.");
  }

  // Update delivery fee for the specific shop in the items array
  const updatedItems = existingCart.items.map((shop: any) => {
    if (shop.shopId === shopId) {
      shop.deliveryAddress= deliveryAddress; // Update the delivery fee for the specific shop
    }
    return shop;
  });

  // Save the updated cart to the database
  const updatedCart = await this.cartRepo.updateOne(
    { userId },
    { items: updatedItems }
  );

  return updatedCart;
}




async getDeliveryAddress(shopId: string): Promise<any[]> {
  // Query the database for all carts containing the specified shopId
  const carts = await Cart.findAll({
    where: {
      items: {
        [Op.contains]: [{ shopId }], // Check if any item in the cart contains the specified shopId
      },
    },
    attributes: ['id', 'userId', 'items'], // Include userId in the selected fields
    order: [['updatedAt', 'DESC']], // Optional: Sort by updatedAt, most recent first
  });

  // Log to see the fetched carts (for debugging)
  console.log(carts);

  // Filter items in each cart for matching shopId and non-null deliveryAddress
  const filteredCarts = carts.map((cart) => {
    // Filter the items of each cart to include only those with the correct shopId and a non-null deliveryAddress
    const items = cart.items.filter(
      (item: any) =>
        item.shopId === shopId && // Ensure the item has the correct shopId
        item.deliveryAddress // Ensure the item has a deliveryAddress
    
    );
    return {
      userId: cart.userId, // Include the userId in the response
      items, // Filtered items
    };
  });

  // Return only carts that have relevant items (i.e., items with non-null deliveryAddress)
  return filteredCarts.filter((cart) => cart.items.length > 0); // Only include carts with items that match the conditions
}



async updateDeliveryFeeAndDate(
  shopId: string,
  userId: string,
  deliveryFee: number,
  deliveryDate: Date
): Promise<any> {
  // Find the user's cart
  const cart = await this.cartRepo.findOne({ userId });

  if (!cart) {
    throw new Error("Cart not found.");
  }
  if (!shopId || !userId || !deliveryFee || !deliveryDate) {
    throw new Error(
      "Shop ID, User ID, Delivery Fee, and Delivery Date are required.",
    );
  }

  // Update the specific shop's delivery fee and date, and just add the deliveryFee to the existing totalFee
  cart.items = cart.items.map((item: any) => {
    if (item.shopId === shopId) {
      // Just add the new deliveryFee to the existing totalFee (no recalculation of product prices)
      const updatedTotalFee = item.totalFee + deliveryFee;

      return {
        ...item,
        deliveryFee,     // Update delivery fee
        deliveryDate,    // Update delivery date
        totalFee: updatedTotalFee,  // Add the deliveryFee to the existing totalFee
      };
    }
    return item;
  });

  // Recalculate the cart's total fee (sum of all shop's totalFee)
  const totalCartFee = cart.items.reduce(
    (sum: number, shop: any) => sum + shop.totalFee,
    0
  );

  // Save the updated cart with the recalculated total fee for the entire cart
  await this.cartRepo.updateOne({ userId }, { items: cart.items, total: totalCartFee });

  return cart;
}





  // Increment product quantity

  async incrementProduct(userId: string, shopId: string, productId: string) {
    // Find the cart for the user
    const cart = await this.cartRepo.findOne({ userId });
    if (!cart) throw new Error("Cart not found");
  
    // Update the cart items
    const updatedItems = cart.items.map((shop: any) => {
      if (shop.shopId === shopId) {
        shop.products = shop.products.map((product: any) => {
          if (product.productId === productId) {
            // Increment quantity and recalculate price
            product.quantity += 1;
            product.price = product.quantity * (product.price / (product.quantity - 1)); // Unit price * new quantity
          }
          return product;
        });
  
        // Recalculate totalFee for the shop
        shop.totalFee = shop.products.reduce(
          (sum: any, product: any) => sum + product.price,
          0
        );
      }
      return shop;
    });
  
    // Update the cart with the modified items
    return this.cartRepo.updateOne({ userId }, { items: updatedItems });
  }
  



  // Decrement product quantity

  async decrementProduct(userId: string, shopId: string, productId: string) {
    // Find the cart for the user
    const cart = await this.cartRepo.findOne({ userId });
    if (!cart) throw new Error("Cart not found");
  
    // Update the cart items
    const updatedItems = cart.items.map((shop: any) => {
      if (shop.shopId === shopId) {
        shop.products = shop.products
          .map((product: any) => {
            if (product.productId === productId) {
              product.quantity -= 1;
              if (product.quantity > 0) {
                product.price = product.quantity * (product.price / (product.quantity + 1)); // Update price based on new quantity
              }
            }
            return product;
          })
          .filter((product: any) => product.quantity > 0); // Remove product if quantity is 0
  
        // Recalculate totalFee for the shop
        shop.totalFee = shop.products.reduce(
          (sum: any, product: any) => sum + product.price,
          0
        );
      }
      return shop;
    });
  
    // Remove the shop if it no longer has products
    const filteredItems = updatedItems.filter((shop: any) => shop.products.length > 0);
  
    // Update the cart with the modified items
    return this.cartRepo.updateOne({ userId }, { items: filteredItems });
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
        // Get shop details
        const shopDetails = await this.shopRepo.findOne({ id: shop.shopId });
        if (!shopDetails) throw new Error(`Shop not found: ${shop.shopId}`);
  
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
          shopName: shopDetails.name,
          shopLogo: shopDetails.logo,
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
