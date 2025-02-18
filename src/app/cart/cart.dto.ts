export class AddToCartDTO {
    userId: string;
    productId: string;
    color?: string;
    size?: string;
    quantity: number;
    price: number;
    deliveryFee?:number
    deliveryDate?:Date
    deliveryAddress?:string
    totalFee:number
  } 





  