import { Sequelize, DataTypes, Model, UUIDV4 } from "sequelize";
import { ICart } from "../../entity/cart.entity";

class Cart extends Model implements ICart {
  public id!: string;
  public userId!: string;
  public items!: Array<{
      productId: string;
      quantity: number;
      price: number;
      color:string
      size:string
    }>;
  public  deliveryOption:"delivery" | "pickup";
  public  deliveryFee:number
  public  deliveryDate:Date
  public deliveryAddress:string
  public pickupAddress:string
  public totalFee:number   

}

export default (sequelize: Sequelize): typeof Cart => {
  Cart.init(
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
      items: {
        type: DataTypes.JSONB,   
        defaultValue: [],
      },
      deliveryOption:{
        type: DataTypes.ENUM("delivery", "pickup"),
        defaultValue: "delivery",
      },
      deliveryAddress:{
        type:DataTypes.STRING
      },
      pickUpAddress:{
        type:DataTypes.STRING,
        defaultValue: "Joseph expensive store lagos",
      },
      deliveryFee:{
        type:DataTypes.INTEGER
      },
      deliveryDate:{
        type:DataTypes.DATE
      },
      totalFee:{
        type:DataTypes.INTEGER
      },

    },
    {
      sequelize,
      modelName: "Cart",
      tableName: "carts",
      timestamps: true,
    }
  );

  return Cart;
};
