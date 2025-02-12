import { ICategory } from "../../core/entity/category.entity";

/**
 * Create Category DTO
 * @param categoryData - The incoming data to create a category
 * @returns A Partial<ICategory> object
 */
export const createCategoryDto = (categoryData: any): Partial<ICategory> => {
  if (!categoryData.name) throw new Error("Category name is required");

  return {
    name: categoryData.name,
    description: categoryData.description || "",
    parentCategoryId: categoryData.parentCategoryId || null,
    image: categoryData.image || null,
  };
};
