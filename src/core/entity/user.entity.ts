import { COUNTRY } from "../../infrastructure/constants/others";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: COUNTRY;
  password: string;
  role: "Admin" | "User";
}
