import { IUser } from "../../core/entity/user.entity";

export const createUserDto = (data: any): Partial<IUser> => {
  // Required fields validation
  if (!data.email) throw new Error("email is required.");
 
  return {

    firstName: data.firstName,
    lastName: data.lastName, 
    email: data.email,
    phoneNumber: data.phoneNumber,
    country:data.country,
    password: data.password,
    role:data.role
  };
};
export const updateUserDto = (data: any): Partial<IUser> => {
  // Required fields validation

 
  return {

    firstName: data.firstName,
    lastName: data.lastName, 
    phoneNumber: data.phoneNumber,
    country:data.country,

  };
};



  
