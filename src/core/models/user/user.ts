import { Sequelize, DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { IUser } from "../../entity/user.entity";
import { COUNTRY } from "../../../infrastructure/constants/others";

// Interface for creating a user
export interface UserCreationAttributes extends Optional<IUser, "id"> {}



class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phoneNumber!: string;
  public otp!: string;
  public country!: COUNTRY;
  public image!: string;
  public isActive!: boolean;
  public isVerified!: boolean;
  public password!: string;
  public role!: "Admin" | "User";
}

export default (sequelize: Sequelize): typeof User => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.ENUM,
        values:Object.values(COUNTRY),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: true
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("Admin", "User"),
        allowNull: false,
        defaultValue: "User",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};
