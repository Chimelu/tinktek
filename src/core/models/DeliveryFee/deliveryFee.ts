import { Sequelize, DataTypes, Model, UUIDV4 } from "sequelize";

// Define the Region model
class Region extends Model {
  public id!: string;
  public country!: string;
  public region!: string;
  public deliveryFee!: number;
}

export default (sequelize: Sequelize): typeof Region => {
  Region.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deliveryFee: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Region",
      tableName: "regions",
      timestamps: true,
    }
  );

  return Region;
};
