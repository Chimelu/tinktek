import { IProduct } from "../../core/entity/product.entity";

export const createProductDto = (productData: any): Partial<IProduct> => {
  if (!productData.name) throw new Error("Product name is required.");
  if (!productData.price) throw new Error("Product price is required.");
  // if (!productData.categoryId) throw new Error("Category ID is required.");
//   if (!productData.images ) throw new Error("Upload atleast one image.");

  return {
    name: productData.name,
    categoryId: productData.categoryId,
    description: productData.description || "",
    color: productData.color || [],
    size: productData.size || [],
    price: parseFloat(productData.price),
    stockQuantity: productData.stockQuantity || 0,
    images: productData.images || [],
    availability:productData.availability,
    discountPercentage: productData.discountPercentage || 0,   
  };
};



export const updateProductDto = (data: any) => {
  if (data.discountTypeId && data.discountPercentage > 0) {
    throw new Error("You can only provide either a discountTypeId or discountPercentage, not both.");
  }
  return {
    name: data.name,
    categoryId: data.categoryId,
    discountTypeId: data.discountTypeId,
    description: data.description || "",
    color: data.color || "",
    materialType: data.materialType || "",
    price: parseFloat(data.price),
    stockQuantity: data.stockQuantity || 0,
    images: data.images || [],
    height: data.height || 0,
    width: data.width || 0,
    depth: data.depth || 0,
    options: data.options,
    wayagramDeal: data.wayagramDeal,
    wayagramDealApprove: data.wayagramDealApprove,
    deliveryCharge:data.deliveryCharge,
    condition: data.condition || "New",
    pickupAddress: data.pickupAddress || "",
    discountPercentage: data.discountPercentage || 0,   
  };
};

export const wayagramDealStatusDto = (data: any) => {
  return {
    wayagramDealApprove: data.wayagramDealApprove === false ? null : data.wayagramDealApprove,
    wayagramDeal: data.wayagramDealApprove === false ? null : data.wayagramDeal,
    wayagramDealRejectedReason: data.wayagramDealRejectedReason || "",
  };
};

