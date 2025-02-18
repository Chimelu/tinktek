import ProductModel from "./product/products.model";
import CategoryModel from "./category/Category.model";
import WayaGramCartModel from "./cart/cart.model";
import WayaGramFavoriteModel from "./favorites/favorites.model";
import User from "./user/user"
import color from "./product/color";
import size from "./product/size";
import ShippingAddress from "./shipping.address.ts/ShippingAddress";
import deliveryFee from "./DeliveryFee/deliveryFee";

import { DBSource } from "../../infrastructure/database/sqldb.database";
import Order from './order/Order.model'


export const Cart = WayaGramCartModel(DBSource);
export const Category = CategoryModel(DBSource);
export const Product = ProductModel(DBSource);
export const Favorite = WayaGramFavoriteModel(DBSource); 
export const OrderModel = Order(DBSource)
export const UserModel = User(DBSource)
export const ColorModel = color(DBSource)
export const SizeModel = size(DBSource)
export const AddressModel = ShippingAddress(DBSource)
export const RegionModel = deliveryFee(DBSource)




