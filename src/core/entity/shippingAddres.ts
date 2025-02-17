export interface IShippingAddress {
    id: string;
    userId: string;
    name: string;
    country: string;
    city: string;
    state: string;
    region: string;
    address: string;
    active: boolean;
    isDeleted: boolean;
    zipCode: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
