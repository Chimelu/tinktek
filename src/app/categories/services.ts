import EventEmitter from "node:events";
import { Op } from "sequelize";
import { IDataAccessRepo, PaginationResult } from "../../core/repositories/dataAccess.repository";
import { createCategoryDto } from "./categories.dto";
import { NotFoundError } from "../../infrastructure/errorHandler/error";
import { CATEGORY_RESPONSE } from "../../infrastructure/constants/responses/categoryResponse.constant";
import { Category } from "../../core/models";
import cloudinary from "../../infrastructure/uploads/cloudinaryUpload";
import { ICategory } from "../../core/entity/category.entity";


class WayagramCategoryService {
  constructor(private categoryRepo: IDataAccessRepo) {
    this.categoryRepo = categoryRepo;
  }



 public async createCategory(categoryData: any) {
    // Validate the incoming data using the DTO
    const data = createCategoryDto(categoryData);
  
    // Handle Cloudinary image upload if an image file is provided
    if (categoryData.imageFile) {
      try {
        const { buffer, mimetype } = categoryData.imageFile;
        const base64Image = `data:${mimetype};base64,${buffer.toString("base64")}`;
  
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(base64Image, {
          folder: "category-images",
          resource_type: "image",
        });
  
        // Update the image URL in the data to be saved in the database
        data.image = uploadResult.secure_url;
      } catch (error) {
        console.error("Error uploading category image to Cloudinary:", error);
        throw new Error("Image upload failed");
      }
    }
  
    // Create the category in the database
    const newCategory = await this.categoryRepo.create(data);
    if (!newCategory) throw new NotFoundError(CATEGORY_RESPONSE.CATEGORY_404);
  
    return newCategory;
  }
  

  public async getCategories(page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;
  
      // Get total count for pagination metadata
      const totalCount = await this.categoryRepo.count({});
  
      // Fetch paginated categories
      const categories = await this.categoryRepo.find({}, {
        skip,
        limit,
        sort: { createdAt: -1 }, // Sorting categories by creation date
      });
  
      if (!categories || categories.length === 0) {
        throw new NotFoundError("No categories found.");
      }
  
      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
  
      // Return categories with pagination metadata
      return {
        data: categories,
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
      console.error("Error in getCategories service:", error);
      throw error;
    }
  }

  public async getParentCategories(page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;
  
      // Build a query to fetch categories with no parent and not deleted
      const query: any = {
        parentCategoryId: null,
        isDeleted: false,
      };
  
      // Get total count for pagination metadata
      const totalCount = await this.categoryRepo.count(query);
  
      // Fetch paginated root categories matching the query
      const categories = await this.categoryRepo.find(query, {
        skip,
        limit,
        sort: { createdAt: -1 },
      });
  
      if (!categories || categories.length === 0) {
        throw new NotFoundError("No root categories found.");
      }
  
      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
  
      // Return categories with pagination metadata
      return {
        data: categories,
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
      console.error("Error in getRootCategories service:", error);
      throw error;
    }
  }

  public async getSubCategoriesByRoot(
    rootCategoryId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginationResult<ICategory> | { data: ICategory[] }> {
    try {
      const skip = (page - 1) * limit;
  
      // Build a query object to filter subcategories for the given root category
      const query: Record<string, any> = {
        parentCategoryId: rootCategoryId,
        isDeleted: false,
      };
  
      // Get total count of subcategories matching the query
      const totalCount = await this.categoryRepo.count(query);
  
      // Fetch paginated subcategories matching the query
      const subCategories = await this.categoryRepo.find(query, {
        skip,
        limit,
        sort: { createdAt: -1 },
      });
  
      if (!subCategories || subCategories.length === 0) {
        throw new NotFoundError("No subcategories found for this root category.");
      }
  
      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
  
      return {
        docs: subCategories,
        totalDocs: totalCount,
        limit: limit,
        page: page,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
        nextPage: hasNextPage ? page + 1 : null,
        hasPrevPage: hasPrevPage,
        prevPage: hasPrevPage ? page - 1 : null,
        pagingCounter: skip + 1,
      };
    } catch (error) {
      console.error("Error in getSubCategoriesByRoot service:", error);
      throw error;
    }
  }
  
  

  public async editCategory(categoryId: string, updateData: any) {
    // Step 1: Check if the category exists
    const existingCategory = await this.categoryRepo.findOne({ id: categoryId });
    if (!existingCategory) throw new NotFoundError(CATEGORY_RESPONSE.CATEGORY_404);
  
    // Step 2: If a new image file is provided, upload it to Cloudinary
    if (updateData.imageFile) {
      try {
        const { buffer, mimetype } = updateData.imageFile;
        const base64Image = `data:${mimetype};base64,${buffer.toString("base64")}`;
  
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(base64Image, {
          folder: "category-images",
          resource_type: "image",
        });
  
        // Update the image URL in the update data
        updateData.image = uploadResult.secure_url;
      } catch (error) {
        console.error("Error uploading category image to Cloudinary:", error);
        throw new Error("Image upload failed");
      }
    }
  
    // Step 3: Update the category in the database
    const updatedCategory = await this.categoryRepo.updateOne(
      { id: categoryId },
      updateData,
      { returnOriginal: false }
    );
  
    if (!updatedCategory) throw new NotFoundError("Failed to update category.");
  
    return updatedCategory;
  }
  

    public async deleteCategory(categoryId: string) {
    // Find the category
    const category = await Category.findOne({
      where: { id: categoryId, isDeleted: false },
    });

    if (!category) {
      throw new Error("Category not found or already deleted");
    }

    // Soft delete the category
    await category.update({ isDeleted: true });

    return category;
  }
}

export default WayagramCategoryService;
       