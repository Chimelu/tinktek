import { Sequelize, DataTypes, Model, UUIDV4 } from "sequelize";
import { ICart } from "../../entity/cart.entity";

class Cart extends Model implements ICart {
  public id!: string;
  public userId!: string;
  public items!: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
  public  deliveryFee:number
  public  deliveryDate:Date
  public deliveryAddress:string
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
      deliveryFee:{
        type:DataTypes.INTEGER
      },
      deliveryDate:{
        type:DataTypes.DATE
      }

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
