import { IDataAccessRepo } from "../../core/repositories/dataAccess.repository";
import { PRODUCT_RESPONSE } from "../../infrastructure/constants/responses/productResponse.contant";
import {
  NotFoundError,
  UnauthorizedError,
} from "../../infrastructure/errorHandler/error";
import {  UpdateProductData } from "../../core/entity/product.entity";
import { createProductDto, updateProductDto, } from "./product.dto";
import { Product } from "../../core/models";
import { Op } from 'sequelize';
import cloudinary from "../../infrastructure/uploads/cloudinaryUpload";


class WayagramProductService {
  private product: IDataAccessRepo;
  private category: IDataAccessRepo;



  constructor(product: IDataAccessRepo, category: IDataAccessRepo,  ) {
    this.product = product;
    this.category = category;
   
   
}

public async createProduct(productData: any, images: Express.Multer.File[]) {
    // Validate and format product data using the DTO
    const productDto = createProductDto(productData);
  
    // Upload images to Cloudinary
    if (images && images.length > 0) {
      const uploadedImages: string[] = [];
      for (const image of images) {
        try {
          // Convert image buffer to base64 (required for direct upload)
          const base64Image = `data:${image.mimetype};base64,${image.buffer.toString("base64")}`;
  
          // Upload to Cloudinary
          const uploadResult = await cloudinary.uploader.upload(base64Image, {
            folder: "product-images", // Organize images in a folder
            resource_type: "image",
          });
  
          uploadedImages.push(uploadResult.secure_url);
        } catch (error) {
          console.error(`Error uploading image ${image.originalname}:`, error);
        }
      }
      productDto.images = uploadedImages;
    }
  
    // Create the product
    const product = await this.product.create(productDto);
    return product;
}
  

  public async deleteProduct(productId: string) {
    try {
      // Find the product by its ID
      const product = await this.product.findOne({ id: productId,  isDeleted: false });
  
      if (!product) {
        throw new NotFoundError(PRODUCT_RESPONSE.PRODUCT_404); // Product not found
      }
  
      // Update the product's isDeleted property
      const updatedProduct = await this.product.updateOne(
        { id: productId },
        { isDeleted: true }
      );
  
      
  
      return {
        message: PRODUCT_RESPONSE.PRODUCT_DELETED,
        data: updatedProduct,
      };
    } catch (error) {
      console.error("Error in deleteProduct service:", error);
      throw error;
    }
  }
  

  public async editProduct(productId: string, productData: any, images: Express.Multer.File[] = []) {
    // Fetch the product to ensure it exists
    const existingProduct = await this.product.findById(productId);
    if (!existingProduct) {
      throw new NotFoundError("Product not found.");
    }
  
    // Validate and format product data using a DTO
    const updatedProductDto = updateProductDto(productData);



  
   
    
    // Update the product in the database
    await this.product.updateOne({ id: productId }, updatedProductDto);
  
    // Fetch the updated product
    const updatedProduct = await this.product.findById(productId);
  
    return updatedProduct;
  }



  
  

  public async getProductsAdmin(page: number = 1, limit: number = 20, filters: any = {}) {
    try {
      const skip = (page - 1) * limit;
  
      // Base query object to filter products
      const query: any = {
        isDeleted: false,
        // approve: true,
      };
  
      if (filters.categoryId) {
        query.categoryId = filters.categoryId;
      }
  
      // Get the total count of products matching the query
      const totalCount = await this.product.count(query);
  
      // Fetch paginated products matching the query
      const products = await this.product.find(query, {
        skip,
        limit,
        sort: { createdAt: -1 },
      });
  
      // Check if products exist
      if (!products || products.length === 0) {
        return {
          data: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: limit,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      }
  
      // Extract product IDs, shop IDs, and category IDs from the fetched products
      const productIds = products.map((product: { id: string }) => product.id);
      const categoryIds = products.map((product: { categoryId: string }) => product.categoryId);
    
  
  
    
  
      // Fetch category details directly from the category database for each categoryId
      const categories = await this.category.find({ id: categoryIds });
      // console.log(categories)
  
      // Create a map of categoryId to category details for quick lookup
      const categoryDetailsMap = categories.reduce((map: Record<string, any>, category: any) => {
        map[category.id] = {
          name: category.name,
        };
        return map;
      }, {});

    
  
      // Merge discounted prices, shop details, and category details into product objects
      const productsWithDetails = products.map((product: any, index: number) => {
   
        const categoryDetails = categoryDetailsMap[product.categoryId] || { name: "Unknown" };
  
  
        return {
          ...product.dataValues,
          categoryName: categoryDetails.name,
      
        };
      });
  
      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
  
      // Return products with pagination metadata
      return {
        data: productsWithDetails,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage,
          hasPreviousPage,
        },
      };
    } catch (error) {
      console.error("Error in getProducts service:", error);
      throw error;
    }
  }



  // public async getProductsUser(page: number = 1, limit: number = 20, filters: any = {}) {
  //   try {
  //     const skip = (page - 1) * limit;
  
  //     // Base query object to filter products
  //     const query: any = {
  //       isDeleted: false,
  //       approve: true,
        
  //     };
  
  //     // Add filters if they are provided
  //     if (filters.shopId) {
  //       query.shopId = filters.shopId;
  //     }
  //     if (filters.discountId) {
  //       query.discountTypeId = filters.discountId;  
  //     }
  //     if (filters.categoryId) {
  //       query.categoryId = filters.categoryId;
  //     }
  
  //     // Get the total count of products matching the query
  //     const totalCount = await this.product.count(query);
  
  //     // Fetch paginated products matching the query
  //     const products = await Product.findAll({
  //       where: query, // Your query object
  //       limit, // Maximum number of records to fetch
  //       offset: skip, // Skip the specified number of records
  //       order: [['createdAt', 'DESC']], // Sort by `createdAt` in descending order
  //     });
      
  //     // Check if products exist
  //     if (!products || products.length === 0) {
  //       return {
  //         data: [],
  //         pagination: {
  //           currentPage: page,
  //           totalPages: 0,
  //           totalItems: 0,
  //           itemsPerPage: limit,
  //           hasNextPage: false,
  //           hasPreviousPage: false,
  //         },
  //       };
  //     }
  
  //     // Extract product IDs, shop IDs, and category IDs from the fetched products
  //     const productIds = products.map((product: { id: string }) => product.id);
  //     const shopIds = products.map((product: { shopId: string }) => product.shopId);
  //     const categoryIds = products.map((product: { categoryId: string }) => product.categoryId);
  
  //     // Calculate discounted prices using the helper function
  //     const discountedPrices = await calculateDiscountedPrice(productIds);
  
  //     // Fetch shop details for each shopId
  //     const shops = await this.shop.find({ id: shopIds });
  
  //     // Create a map of shopId to shop details for quick lookup
  //     const shopDetailsMap = shops.reduce((map: Record<string, any>, shop: any) => {
  //       map[shop.id] = {
  //         name: shop.name,
  //         phone: shop.phone,
  //       };
  //       return map;
  //     }, {});
  
  //     // Fetch category details directly from the category database for each categoryId
  //     const categories = await this.category.find({ id: categoryIds });
  
  //     // Create a map of categoryId to category details for quick lookup
  //     const categoryDetailsMap = categories.reduce((map: Record<string, any>, category: any) => {
  //       map[category.id] = {
  //         name: category.name,
  //       };
  //       return map;
  //     }, {});
  
  //     // Merge discounted prices, shop details, and category details into product objects
  //     const productsWithDetails = products.map((product: any, index: number) => {
  //       const shopDetails = shopDetailsMap[product.shopId] || { name: "Unknown", phone: "N/A" };
  //       const categoryDetails = categoryDetailsMap[product.categoryId] || { name: "Unknown" };
  
  //       return {
  //         ...product.dataValues,
  //         discountedPrice: discountedPrices[index],
  //         shopName: shopDetails.name,
  //         shopPhone: shopDetails.phone,
  //         categoryName: categoryDetails.name,
  //       };
  //     });
  
  //     // Calculate pagination metadata
  //     const totalPages = Math.ceil(totalCount / limit);
  //     const hasNextPage = page < totalPages;
  //     const hasPreviousPage = page > 1;
  
  //     // Return products with pagination metadata
  //     return {
  //       data: productsWithDetails,
  //       pagination: {
  //         currentPage: page,
  //         totalPages,
  //         totalItems: totalCount,
  //         itemsPerPage: limit,
  //         hasNextPage,
  //         hasPreviousPage,
  //       },
  //     };
  //   } catch (error) {
  //     console.error("Error in getProducts service:", error);
  //     throw error;
  //   }
  // }
  
  
  
  
  

 




  
}

export default WayagramProductService;
