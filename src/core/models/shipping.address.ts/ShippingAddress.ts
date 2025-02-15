import { Sequelize, DataTypes, Model, UUIDV4, Optional } from "sequelize";
import { IShippingAddress } from "../../entity/shippingAddres";



export interface ShippingAddressAttributes extends Optional<IShippingAddress, "id" > {}

class ShippingAddress extends Model<IShippingAddress, ShippingAddressAttributes>   implements IShippingAddress {
  public id!: string;
  public name!: string;
  public country!: string;
  public city!: string;
  public state!: string;
  public address!: string;
  public zipCode!: string;
  public active!: boolean;
  public isDeleted!: boolean;
  public userId!: string; // Assuming a user is associated with the address
}

export default (sequelize: Sequelize): typeof ShippingAddress => {
  ShippingAddress.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      active:{
        type: DataTypes.BOOLEAN,
        defaultValue:true,
        allowNull: true,

      },
      isDeleted:{
        type: DataTypes.BOOLEAN,
        defaultValue:false


      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ShippingAddress",
      tableName: "shipping_addresses",
      timestamps: true,
    }
  );

  return ShippingAddress;
};
