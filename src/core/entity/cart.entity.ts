export interface CartItem {
  productId: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

export interface ICart {
  id: string;
  userId: string;
  items: CartItem[]; // Changed from ShopCart[] to CartItem[] to match Cart class
  deliveryFee: number;
  deliveryDate: Date;
  deliveryAddress: string;
  totalFee: number;
}
