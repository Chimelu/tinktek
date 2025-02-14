import { Sequelize, DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { IOrder } from "../../entity/order.entity";

export interface OrderCreationAttributes
  extends Optional<IOrder, "id" | "_v" > {}



class Order extends Model<IOrder, OrderCreationAttributes> implements IOrder {
  public id!: string;
  public userId!: string;
  public items!: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }>;
  public shopId!: string;
  public vendorId!: string;
  public total!: number;
  public status!: "pending" | "processing" | "completed" | "cancelled";
  public pickupAddress!: string | null;
  public pickupStatus!: "pending" | "readyForPickUp" | "pickUpScheduled" | "completed";
  public deliveryAddress!: string | null;
  public deliveryFee!: number | null;
  public deliveryToken!: string | null;
  public deliveryDate!: Date | null;
  public deliveryStatus!: "pending" | "processing" | "onTransit" | "completed";
  public _v!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Add associations here
  }
}

export default (sequelize: Sequelize): typeof Order => {
  Order.init(
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
      items: {
        type: DataTypes.JSONB,
        allowNull: false,  
      },
      shopId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "processing", "completed", "cancelled"),
        defaultValue: "pending",
      },
      pickupAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pickupStatus: {
        type: DataTypes.ENUM("pending", "readyForPickUp", "pickUpScheduled", "completed"),
        defaultValue: "pending",
      },
      deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deliveryFee: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      deliveryToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deliveryStatus: {
        type: DataTypes.ENUM("pending", "processing", "onTransit", "completed"),
        defaultValue: "pending",
      },
      _v: {
        type: DataTypes.STRING,
        defaultValue: "1.0",
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      timestamps: true,
    }
  );

  return Order;
};
