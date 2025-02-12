import ProductModel from "./product/products.model";
import CategoryModel from "./category/WayaGramProductCategory.model";
import WayaGramCartModel from "./cart/cart.model";
import WayaGramFavoriteModel from "./favorites/favorites.model";
import User from "./user/user"

import { DBSource } from "../../infrastructure/database/sqldb.database";
import Order from './order/WayagramOrder.model'


export const Cart = WayaGramCartModel(DBSource);
export const Category = CategoryModel(DBSource);
export const Product = ProductModel(DBSource);
export const Favorite = WayaGramFavoriteModel(DBSource); 
export const OrderModel = Order(DBSource)
export const UserModel = User(DBSource)




