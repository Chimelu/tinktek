import { IDataAccessRepo, PaginationResult } from "../../core/repositories/dataAccess.repository";
import { PRODUCT_RESPONSE } from "../../infrastructure/constants/responses/productResponse.contant";
import {
  NotFoundError,
  UnauthorizedError,
} from "../../infrastructure/errorHandler/error";
import { createProductDto, updateProductDto, } from "./product.dto";
import { Product } from "../../core/models";
import { Op } from 'sequelize';
import cloudinary from "../../infrastructure/uploads/cloudinaryUpload";
import { IProduct } from "../../core/entity/product.entity";


class ProductService {
  private product: IDataAccessRepo;
  private category: IDataAccessRepo;
  private colorRepo: IDataAccessRepo;
  private sizeRepo: IDataAccessRepo;



  constructor(product: IDataAccessRepo, category: IDataAccessRepo, colorRepo: IDataAccessRepo, sizeRepo: IDataAccessRepo, ) {
    this.product = product;
    this.category = category;
    this.colorRepo = colorRepo;
    this.sizeRepo = sizeRepo;
   
   
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

        // Push secure URL to the array
        uploadedImages.push(uploadResult.secure_url);
      } catch (error) {
        console.error(`Error uploading image ${image.originalname}:`, error);
      }
    }
    productDto.images = uploadedImages;
  }

  // Create the product in the database using the repository
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
  

  public async editProduct(
    productId: string,
    productData: any,
    images: Express.Multer.File[] = []
  ): Promise<IProduct | null> {
    // Fetch the product to ensure it exists
    const existingProduct = await this.product.findById(productId);
    if (!existingProduct) {
      throw new NotFoundError("Product not found.");
    }
  
    // Validate and format product data using the DTO
    // This DTO should return only allowed fields (e.g. name, description, etc.)
    const updatedProductDto = updateProductDto(productData);
  
    // Merge array fields rather than replacing them
    // Merge color arrays
    if (updatedProductDto.color) {
      updatedProductDto.color = Array.from(
        new Set([...(existingProduct.color || []), ...updatedProductDto.color])
      );
    }
  
    // Merge size arrays
    if (updatedProductDto.size) {
      updatedProductDto.size = Array.from(
        new Set([...(existingProduct.size || []), ...updatedProductDto.size])
      );
    }
  
    // Merge categoryId arrays
    if (updatedProductDto.categoryId) {
      updatedProductDto.categoryId = Array.from(
        new Set([...(existingProduct.categoryId || []), ...updatedProductDto.categoryId])
      );
    }
  
    // Handle image uploads: if new images are provided, upload them to Cloudinary and merge with existing images.
    if (images && images.length > 0) {
      const uploadedImages: string[] = [];
      for (const image of images) {
        try {
          // Convert image buffer to base64 (for direct upload)
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
      // Merge new images with existing images
      updatedProductDto.images = Array.from(
        new Set([...(existingProduct.images || []), ...uploadedImages])
      );
    }
  
    // Update the product in the database
    await this.product.updateOne({ id: productId }, updatedProductDto);
  
    // Fetch and return the updated product
    const updatedProduct = await this.product.findById(productId);
    return updatedProduct;
  }
  

  

  
  public async getProductsAdmin(
    page: number = 1,
    limit: number = 20,
    filters: any = {}
  ): Promise<
    PaginationResult<IProduct> & {
      subCategories?: { id: string; name: string }[];
      colors?: { id: string; name: string }[];
      sizes?: { id: string; name: string }[];
    }
  > {
    try {
      // ✅ Fetch Single Product if ID is Provided
      if (filters.id) {
        const product = await this.product.findOne({ id: filters.id });
  
        if (!product) {
          throw new Error("Product not found");
        }
  
        // ✅ Fetch Category Names
        const categoryNames = await Promise.all(
          (product.categoryId || []).map(async (catId: string) => {
            const category = await this.category.findOne({ id: catId });
            return category ? category.name : "Unknown";
          })
        );
  
        // ✅ Fetch Color Names
        let colorNames: string[] = [];
        if (product.color && product.color.length > 0) {
          const colors = await this.colorRepo.find({ id: { [Op.in]: product.color } });
          colorNames = colors.map((color: any) => color.name);
        }
  
        // ✅ Fetch Size Names
        let sizeNames: string[] = [];
        if (product.size && product.size.length > 0) {
          const sizes = await this.sizeRepo.find({ id: { [Op.in]: product.size } });
          sizeNames = sizes.map((size: any) => size.name);
        }
  
        return {
          docs: [
            {
              ...product.dataValues,
              categoryNames,
              colorNames, // Array of color names
              sizeNames, // Array of size names
            },
          ],
          totalDocs: 1,
          limit: 1,
          page: 1,
          totalPages: 1,
          hasNextPage: false,
          nextPage: null,
          hasPrevPage: false,
          prevPage: null,
          pagingCounter: 1,
        };
      }
  
      // 🔄 Existing Pagination Logic
      const skip = (page - 1) * limit;
      const query: any = { isDeleted: false };
  
      if (filters.categoryId) {
        const categoryFilter = Array.isArray(filters.categoryId)
          ? filters.categoryId
          : [filters.categoryId];
        query.categoryId = { [Op.contains]: categoryFilter };
      }
  
      if (filters.colorId) {
        const colorFilter = Array.isArray(filters.colorId)
          ? filters.colorId
          : [filters.colorId];
        query.color = { [Op.contains]: colorFilter };
      }
  
      if (filters.sizeId) {
        const sizeFilter = Array.isArray(filters.sizeId)
          ? filters.sizeId
          : [filters.sizeId];
        query.size = { [Op.contains]: sizeFilter };
      }
  
      const totalCount = await this.product.count(query);
      const products = await this.product.find(query, {
        skip,
        limit,
        sort: { createdAt: -1 },
      });
  
      if (!products || products.length === 0) {
        return {
          docs: [],
          totalDocs: 0,
          limit,
          page,
          totalPages: 0,
          hasNextPage: false,
          nextPage: null,
          hasPrevPage: false,
          prevPage: null,
          pagingCounter: 0,
        };
      }
  
      const categoryIds = products.reduce((acc: string[], product: any) => {
        if (Array.isArray(product.categoryId)) {
          return acc.concat(product.categoryId);
        }
        return acc;
      }, []);
  
      const uniqueCategoryIds = [...new Set(categoryIds)];
      const categories = await this.category.find({ id: { [Op.in]: uniqueCategoryIds } });
  
      const categoryDetailsMap = categories.reduce((map: Record<string, any>, category: any) => {
        map[category.id] = { name: category.name };
        return map;
      }, {});
  
      const productsWithDetails = await Promise.all(
        products.map(async (product: any) => {
          const categoryNames = (product.categoryId || []).map((catId: string) => {
            return categoryDetailsMap[catId]?.name || "Unknown";
          });
  
          // Fetch color names
          let colorNames: string[] = [];
          if (product.color && product.color.length > 0) {
            const colors = await this.colorRepo.find({ id: { [Op.in]: product.color } });
            colorNames = colors.map((color: any) => color.name);
          }
  
          // Fetch size names
          let sizeNames: string[] = [];
          if (product.size && product.size.length > 0) {
            const sizes = await this.sizeRepo.find({ id: { [Op.in]: product.size } });
            sizeNames = sizes.map((size: any) => size.name);
          }
  
          return {
            ...product.dataValues,
            categoryNames,
            colorNames,
            sizeNames,
          };
        })
      );
  
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
  
      return {
        docs: productsWithDetails,
        totalDocs: totalCount,
        limit,
        page,
        totalPages,
        hasNextPage,
        nextPage: hasNextPage ? page + 1 : null,
        hasPrevPage: hasPreviousPage,
        prevPage: hasPreviousPage ? page - 1 : null,
        pagingCounter: skip + 1,
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
  //        // Extract product IDs, shop IDs, and category IDs from the fetched products
  //        const productIds = products.map((product: { id: string }) => product.id);
  //        const categoryIds = products.map((product: { categoryId: string }) => product.categoryId);
  
   
  

  
  
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
  //       const categoryDetails = categoryDetailsMap[product.categoryId] || { name: "Unknown" };
  
  //       return {
  //         ...product.dataValues,
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

export default ProductService;
