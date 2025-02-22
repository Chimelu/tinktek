import { IDataAccessRepo } from "../../core/repositories/dataAccess.repository";
import { PRODUCT_RESPONSE } from "../../infrastructure/constants/responses/productResponse.contant";
import {
  NotFoundError,
  BadRequestError,
} from "../../infrastructure/errorHandler/error";
import { IProduct } from "../../core/entity/product.entity";
import { Op } from 'sequelize';

interface IProductFavorite {
  id: string;
  userId: string;
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IProductCart {
  id: string;
  userId: string;
  items: ItemArray[];
  productId: string;
  deliveryFee:number;
  deliveryDate:Date;
  deliveryAddress:string;
  totalFee:number;
}

interface IColorCart {
  id: string | { [Op.in]: string[] };
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ISizeCart {
  id: string | { [Op.in]: string[] };
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ItemArray {
  productId: string;
  quantity: number;
  price: number;
  color:string
  size:string
}



class WayagramProductFavoriteService {
  constructor(
    private productRepo: IDataAccessRepo<IProduct>,
    private productFavoriteRepo: IDataAccessRepo<IProductFavorite>,
    private cartRepo: IDataAccessRepo<IProductCart>,
    private colorRepo: IDataAccessRepo<IColorCart>,
    private sizeRepo: IDataAccessRepo<ISizeCart>,

  ) {}

  async addToFavorite(
    userId: string,
    productId: string
  ): Promise<IProductFavorite> {
    const product = await this.productRepo.findOne({ id: productId });
    if (!product) {
      throw new NotFoundError(PRODUCT_RESPONSE.PRODUCT_404);
    }

    const existingFavorite = await this.productFavoriteRepo.findOne({
      userId,
      productId,
    });

    if (existingFavorite) {
      throw new BadRequestError("Product is already in favorites");
    }

    return await this.productFavoriteRepo.create({
      userId,
      productId,
    });
  }

  async removeFromFavorite(userId: string, productId: string): Promise<void> {
    const favorite = await this.productFavoriteRepo.findOne({
      userId,
      productId,
    });

    if (!favorite) {
      throw new NotFoundError("Favorite not found");
    }

    await this.productFavoriteRepo.deleteOne({ id: favorite.id });
  }
  
  

  async getUserFavorites(userId: string): Promise<{
    favorites: Array<IProduct & { favoriteId: string; isCarted: boolean }>;
    total: number;
}> {
    const favorites = await this.productFavoriteRepo.find({ userId });

    if (favorites.length === 0) {
        return {
            favorites: [],
            total: 0,
        };
    }

    const productsPromises = favorites.map((favorite) =>
        this.productRepo.findOne({ id: favorite.productId })
    );

    const products = await Promise.all(productsPromises);



          // Gather color IDs from the matching products
          const allColorIds = new Set<string>();
          products.forEach((product: any) => {
            if (Array.isArray(product.color)) {
              product.color.forEach((c: string) => allColorIds.add(c));
            }
          });
      
          const allSizeIds = new Set<string>();
          products.forEach((product: any) => {
            if (Array.isArray(product.size)) {
              product.size.forEach((c: string) => allSizeIds.add(c));
            }
          });
      
          let colors: { id: string; name: string }[] | undefined = undefined;
          if (allColorIds.size > 0 && this.colorRepo) {
            const colorIds = Array.from(allColorIds);
            // Fetch colors from the color repository
            const colorsData = await this.colorRepo.find({ id: { [Op.in]: colorIds } });
            // Map each color to an object with id and name
            colors = colorsData.map((color: any) => ({
              id: color.id,
              name: color.name,
            }));
          }
          let sizes: { id: string; name: string }[] | undefined = undefined;
          if (allSizeIds.size > 0 && this.sizeRepo) {
            const sizeIds = Array.from(allSizeIds);
            // Fetch colors from the color repository
            const sizesData = await this.sizeRepo.find({ id: { [Op.in]: sizeIds } });
            // Map each color to an object with id and name
            sizes = sizesData.map((size: any) => ({
              id: size.id,
              name: size.name,
            }));
          }
      

    // Fetch user's cart
    const userCart = await this.cartRepo.findOne({ userId });

    // Extract product IDs from the user's cart items
    const cartProductIds = new Set(userCart?.items.map((item: any) => item.productId) || []);

    const favoritesWithProducts = products
        .filter((product): product is IProduct => product !== null)
        .map((product) => {
            const favorite = favorites.find((f) => f.productId === product.id);

            return {
                id: favorite.id,
                productId: product.id,
                categoryId: product.categoryId,
                name: product.name,
                description: product.description,
                price: product.price,
                stockQuantity: product.stockQuantity,
                images: product.images,
                color: product.color,
                size: product.size,
                availability: product.availability,
                discountPercentage: product.discountPercentage,
                _v: product._v,
                isDeleted: product.isDeleted,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                favoriteId: favorite?.id || "",
                isCarted: cartProductIds.has(product.id),
                ...(colors && { colorNames: colors.map((el,i)=> el.name,) }),
                ...(sizes && { sizeNames: sizes.map((el,i)=> el.name,)  }),
            };
        });

    return {
        favorites: favoritesWithProducts,
        total: favorites.length,
    };
}

  

  async isFavorited(userId: string, productId: string): Promise<boolean> {
    const favorite = await this.productFavoriteRepo.findOne({
      userId,
      productId,
    });
    return !!favorite;
  }

  async getProductFavoriteCount(productId: string): Promise<number> {
    const favorites = await this.productFavoriteRepo.find({ productId });
    return favorites.length;
  }
}

export default WayagramProductFavoriteService;
