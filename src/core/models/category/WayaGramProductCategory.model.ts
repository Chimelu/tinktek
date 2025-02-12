import { Sequelize, DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { ICategory } from "../../entity/category.entity";

export interface CategoryCreationAttributes
  extends Optional<ICategory, "id" | "_v"> {}

class Category extends Model implements ICategory {
  public id!: string;
  public name!: string;
  public description?: string;
  public image?: string;
  public  isDeleted?: boolean;
  public parentCategoryId?: string | null;
  public _v!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

 
}  

export default (sequelize: Sequelize): typeof Category => {
  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      parentCategoryId: {
        type: DataTypes.UUID,
        allowNull: true,
       
      },
      isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
      _v: {
        type: DataTypes.STRING,
        defaultValue: "1.0",
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories",
      timestamps: true,
    }
  );

  return Category;
};
