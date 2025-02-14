import { Sequelize, DataTypes, Model, Optional, UUIDV4 } from "sequelize";

// Define the interface for a Color entity (you can adjust this as needed)
export interface IColor {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for creating a Color
export interface ColorCreationAttributes extends Optional<IColor, "id" | "createdAt" | "updatedAt"> {}

class Color extends Model<IColor, ColorCreationAttributes> implements IColor {
  public id!: string;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize): typeof Color => {
  Color.init(
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
    },
    {
      sequelize,
      modelName: "Color",
      tableName: "colors",
      timestamps: true,
    }
  );

  return Color;
};
