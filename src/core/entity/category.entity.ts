export interface ICategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isDeleted?: boolean;
  parentCategoryId?: string | null;
  _v?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

