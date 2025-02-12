import { IDataAccessRepo } from "../../core/repositories/dataAccess.repository";
import { PRODUCT_RESPONSE } from "../../infrastructure/constants/responses/productResponse.contant";
import {
  NotFoundError,
  BadRequestError,
} from "../../infrastructure/errorHandler/error";
import { IProduct } from "../../core/entity/product.entity";

interface IProductFavorite {
  id: string;
  userId: string;
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class WayagramProductFavoriteService {
  constructor(
    private productRepo: IDataAccessRepo<IProduct>,
    private productFavoriteRepo: IDataAccessRepo<IProductFavorite>
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
    favorites: Array<IProduct & { favoriteId: string }>;
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

    const favoritesWithProducts = products
      .filter((product): product is IProduct => product !== null)
      .map((product) => {
        const favorite = favorites.find((f) => f.productId === product.id);
        return {
          ...product,
          favoriteId: favorite?.id || "",
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
