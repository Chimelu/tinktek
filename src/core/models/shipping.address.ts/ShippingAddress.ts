import { Sequelize, DataTypes, Model, UUIDV4, Optional } from "sequelize";
import { IShippingAddress } from "../../entity/shippingAddres";

export interface ShippingAddressAttributes extends Optional<IShippingAddress, "id"> {}

// Define a mapping of states to geopolitical zones
const geopoliticalZones: Record<string, string> = {
  "Benue": "North Central",
  "Kogi": "North Central",
  "Kwara": "North Central",
  "Nasarawa": "North Central",
  "Niger": "North Central",
  "Plateau": "North Central",
  "Federal Capital Territory": "North Central",  

  "Adamawa": "North East",
  "Bauchi": "North East",
  "Borno": "North East",
  "Gombe": "North East",
  "Taraba": "North East",
  "Yobe": "North East",

  "Jigawa": "North West",
  "Kaduna": "North West",
  "Kano": "North West",
  "Katsina": "North West",
  "Kebbi": "North West",
  "Sokoto": "North West",
  "Zamfara": "North West",

  "Abia": "South East",
  "Anambra": "South East",
  "Ebonyi": "South East",
  "Enugu": "South East",
  "Imo": "South East",  

  "Akwa Ibom": "South South",
  "Bayelsa": "South South",
  "Cross River": "South South",
  "Delta": "South South",
  "Edo": "South South",
  "Rivers": "South South",

  "Ekiti": "South West",
  "Lagos": "South West",
  "Ogun": "South West",
  "Ondo": "South West",
  "Osun": "South West",
  "Oyo": "South West",
};

class ShippingAddress extends Model<IShippingAddress, ShippingAddressAttributes> implements IShippingAddress {
  public id!: string;
  public name!: string;
  public country!: string;
  public city!: string;
  public state!: string;
  public region!: string;
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
      region: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      hooks: {
        beforeCreate: (address) => {
          if (address.country.toLowerCase() === "nigeria" && address.state) {
            address.region = geopoliticalZones[address.state] || null;
          } else if (address.country.toLowerCase() === "south_africa" && address.state) {
            address.region = address.state; // Save province directly as region
          }
        },
        beforeUpdate: (address) => {
          if (address.country.toLowerCase() === "nigeria" && address.state) {
            address.region = geopoliticalZones[address.state] || null;
          } else if (address.country.toLowerCase() === "south_africa" && address.state) {
            address.region = address.state;
          }
        },
      },
    }
  );

  return ShippingAddress;
};