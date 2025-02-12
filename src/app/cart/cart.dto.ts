export class AddToCartDTO {
    userId: string;
    shopId: string;
    productId: string;
    quantity: number;
    price: number;
    deliveryFee?:number
    deliveryDate?:Date
    deliveryAddress?:string
    totalFee:number
  }
  