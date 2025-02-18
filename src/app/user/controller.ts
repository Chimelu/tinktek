import { Request, Response } from "express";
import { RepositoryFactory } from "../../infrastructure/repository-implementation/repository.factory";
import config from "../../infrastructure/config/env.config";
import { Product, Category, UserModel } from "../../core/models";
import { DBSource } from "../../infrastructure/database/sqldb.database";
import ResponseMessage from "../../infrastructure/responseHandler/response.handler";
import UserService from "./service";
import { AuthenticatedRequest } from "../../infrastructure/middleware/authMiddleware";

const { dbType } = config;


const UserRepoService: any = RepositoryFactory.setRepository(
  dbType,
  UserModel,
  DBSource
);

const userService = new UserService(
    UserRepoService
);


export const registerUser = async (req: Request, res: Response) => {
    try {
   
  
      // Call the service to create a user
      const newUser = await userService.registerUser(req.body);
  
      return ResponseMessage.success(res, newUser);
    }catch (error: any) {
      console.error(error);
      return ResponseMessage.error(res,null, error.message || "An unexpected error occurred.");
    }
    
  };


  export const loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return ResponseMessage.error(res, null, "Email and password are required", 400);
      }
  
      // Call service method to authenticate user
      const userData = await userService.loginUser(email, password);
  
      return ResponseMessage.success(res, userData, "Login successful");
    } catch (error: any) {
      console.error(error);
      return ResponseMessage.error(res, null, error.message || "An unexpected error occurred.");
    }
  };


  export const resendOtp = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return ResponseMessage.error(res, null, "Email is required.");
      }
  
      const response = await userService.resendOtp(email);
      return ResponseMessage.success(res, response);
    } catch (error: any) {
      console.error("Resend OTP Error:", error);
      return ResponseMessage.error(res, null, error.message || "An error occurred while resending OTP.");
    }
  };
  
  /**
   * Controller to verify OTP
   */
  export const verifyOtp = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
  
      if (!email || !otp) {
        return ResponseMessage.error(res, null, "Email and OTP are required.");
      }
  
      const response = await userService.verifyOtp(email, otp);
      return ResponseMessage.success(res, response);
    } catch (error: any) {
      console.error("Verify OTP Error:", error);
      return ResponseMessage.error(res, null, error.message || "An error occurred while verifying OTP.");
    }
  };


  export const changePassword = async (req: Request, res: Response) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const{ userId} = req.params; // Extract from authenticated user token
  
      const result = await userService.changePassword(userId, oldPassword, newPassword);
  
      return ResponseMessage.success(res, result);
    } catch (error: any) {
      console.error(error);
      return ResponseMessage.error(res, null, error.message || "An unexpected error occurred.");
    }
  };


  export const updateProfileImage = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user.id;
      const uploadedImageUrl = await userService.updateProfileImage(userId, req.file);
  
      return ResponseMessage.success(res, uploadedImageUrl, "Profile image updated successfully")
    } catch (error:any) {
        return ResponseMessage.error(res, null, error.message || "An unexpected error occurred.");
    }
  };
  
  
  /**
   * Update Profile Controller
   */
  export const updateProfile = async (req: Request, res: Response) => {
    try {
      const {userId} = req.params // Extract from authenticated user token
      const updateData = req.body;
  
      const updatedUser = await userService.updateProfile(userId, updateData);
  
      return ResponseMessage.success(res, updatedUser);
    } catch (error: any) {
      console.error(error);
      return ResponseMessage.error(res, null, error.message || "An unexpected error occurred.");
    }
  };