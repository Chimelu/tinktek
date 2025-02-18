
export interface IProduct {
  id: string;
  categoryId: string[];
  name: string;
  description: string;
  size?: string[];
  color?: string[];
  availability?: boolean
  price: number;
  stockQuantity?: number;
  images: string[];
  approve?: boolean;
  deliveryCharge?: boolean;
  discountPercentage:number
  isDeleted?: boolean;
  _v?: string;
  createdAt?: Date;
  updatedAt?: Date;
}




export interface IProductFavorite {
  id: string;
  userId: string;
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
