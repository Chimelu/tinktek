import { Sequelize, DataTypes, Model, UUIDV4 } from "sequelize";

class Notification extends Model {
  public id!: string;
  public userId!: string | null;
  public notificationType!: "delivered-order" | "cancelled-order" | "general-notification" | "admins-notification" | "users-notification" | "vendors-notification" | "discount-offer";
  public appId!: number;
  public appToken!: string;
  public title!: string;
  public body!: string;
  public dateSent!: Date;
}

export default (sequelize: Sequelize): typeof Notification => {
  Notification.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true, // Null means it's sent to all users
      },
      notificationType: {
        type: DataTypes.ENUM(
          "delivered-order",
          "cancelled-order",
          "general-notification",
          "admins-notification",
          "users-notification",
          "vendors-notification",
          "discount-offer"
        ),
        allowNull: false,
      },
      appId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      appToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateSent: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Notification",
      tableName: "notifications",
      timestamps: true,
    }
  );

  return Notification;
};
