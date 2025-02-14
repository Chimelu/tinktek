import { Sequelize, DataTypes, Model, Optional, UUIDV4 } from "sequelize";

// Define the interface for a Size entity
export interface ISize {
  id: string;
  name: string // Allowed size values
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for creating a Size
export interface SizeCreationAttributes extends Optional<ISize, "id" | "createdAt" | "updatedAt"> {}

class Size extends Model<ISize, SizeCreationAttributes> implements ISize {
  public id!: string;
  public name!:string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize): typeof Size => {
  Size.init(
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
      modelName: "Size",
      tableName: "sizes",
      timestamps: true,
    }
  );

  return Size;
};
