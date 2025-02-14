import { Sequelize, DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { ICategory } from "../../../core/entity/category.entity";
import { IProduct } from "../../entity/product.entity";

// Interface for creating a product
export interface ProductCreationAttributes extends Optional<IProduct, "id" | "_v"> {}

class Product extends Model<IProduct, ProductCreationAttributes> implements IProduct {
  public id!: string;
  public categoryId!: string[];
  public discountTypeId!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public stockQuantity!: number;
  public _v!: string;
  public size!: string[];
  public color!: string[];
  public images!: string[];
  public  availability!: boolean;
  public isDeleted!: boolean;
  public discountPercentage!: number;

  // static associate(models: any) {
  //   Product.belongsTo(models.Category, {
  //     foreignKey: "categoryId",
  //     as: "category",
  //   });

  // }
}

export default (sequelize: Sequelize): typeof Product => {
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,  
        unique: true,
      },
      categoryId: {
        type: DataTypes.ARRAY(DataTypes.UUID), // Ensures it's an array of UUIDs
        allowNull: false,
       
      },
      
      name: {
        type: DataTypes.STRING,   
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stockQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      color: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
        defaultValue: [],
      },
      size: {
        type: DataTypes.ARRAY(DataTypes.UUID),  
        allowNull: true,
        defaultValue: [],
      },
      availability: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      discountPercentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      _v: {
        type: DataTypes.STRING,
        defaultValue: "1.0",
      },
      isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      timestamps: true,
    }
  );

  return Product;
};
