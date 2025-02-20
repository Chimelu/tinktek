import { IProduct } from "../../core/entity/product.entity";


export const createProductDto = (productData: any): Partial<IProduct> => {
  if (!productData.name) throw new Error("Product name is required.");
  if (!productData.price) throw new Error("Product price is required.");
  
  if (
    !productData.categoryId ||
    !Array.isArray(productData.categoryId) ||
    productData.categoryId.length === 0
  ) {
    throw new Error("Category ID is required and cannot be empty.");
  }
  

  return {
    name: productData.name,
    categoryId: productData.categoryId,
    description: productData.description || "",
    color: Array.isArray(productData.color) ? productData.color : [],
    size: Array.isArray(productData.size) ? productData.size : [],
    price: parseFloat(productData.price),
    stockQuantity: productData.stockQuantity || 0,
    images: productData.images,
    availability: productData.availability,
    discountPercentage: productData.discountPercentage || 0,
  };
};


export const updateProductDto = (data: any) => {

  return {
    name: data.name,
    categoryId: data.categoryId,
    description: data.description ,
    color: data.color ,
    size: data.size ,
    price: data.price,
    stockQuantity: data.stockQuantity ,
    images: data.images ,
    availability:data.availability,
    discountPercentage: data.discountPercentage ,    
  };
};


