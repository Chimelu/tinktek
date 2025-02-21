import { IDataAccessRepo, PaginationResult } from "../../core/repositories/dataAccess.repository";
import { PRODUCT_RESPONSE } from "../../infrastructure/constants/responses/productResponse.contant";
import {
  NotFoundError,
  UnauthorizedError,
} from "../../infrastructure/errorHandler/error";
import { Product } from "../../core/models";
import { Op } from 'sequelize';
import cloudinary from "../../infrastructure/uploads/cloudinaryUpload";
import { IProduct } from "../../core/entity/product.entity";


export class DeliveryFeeService {
    constructor(private deliveryFeeRepo: IDataAccessRepo) {
        this.deliveryFeeRepo = deliveryFeeRepo;
      }


}