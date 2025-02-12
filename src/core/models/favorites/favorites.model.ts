import { Sequelize, DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { IProductFavorite } from '../../../core/entity/product.entity'

// Optional attributes for creation
export interface ProductFavoriteCreationAttributes
  extends Optional<IProductFavorite, "id"> {}

class ProductFavorite extends Model implements IProductFavorite {
  // Required fields
  public id!: string;
  public userId!: string;
  public productId!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations method
  static associate(models: any) {
    // User association
   

    // Product association
    ProductFavorite.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  }
}

export default (sequelize: Sequelize): typeof ProductFavorite => {
  ProductFavorite.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        unique: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
       
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "ProductFavorite",
      tableName: "product_favorites",
      timestamps: true,
      indexes: [
        // Compound index for faster lookups and ensuring unique combinations
        {
          unique: true,
          fields: ["userId", "productId"],
          name: "product_favorites_user_product_unique",
        },
      ],
    }
  );

  return ProductFavorite;
};
