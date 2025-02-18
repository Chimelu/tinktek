import { COUNTRY } from "../../infrastructure/constants/others";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  otp: string;
  image: string;
  isVerified: boolean;
  isActive: boolean;
  phoneNumber: string;
  country: COUNTRY;
  password: string;
  role: "Admin" | "User";
}
