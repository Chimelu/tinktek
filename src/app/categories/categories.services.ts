import EventEmitter from "node:events";
import { Op } from "sequelize";
import { IDataAccessRepo } from "../../core/repositories/dataAccess.repository";
import { createCategoryDto } from "./categories.dto";
import { NotFoundError } from "../../infrastructure/errorHandler/error";
import { CATEGORY_RESPONSE } from "../../infrastructure/constants/responses/categoryResponse.constant";
import { Category } from "../../core/models";
import cloudinary from "../../infrastructure/uploads/cloudinaryUpload";


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
       