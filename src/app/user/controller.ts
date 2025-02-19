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


  export const forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return ResponseMessage.error(res, null, "Email is required.");
      }
  
      const response = await userService.forgotPassword(email);
      return ResponseMessage.success(res, response);
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      return ResponseMessage.error(res, null, error.message || "An error occurred while processing your request.");
    }
  };
  
  export const resetPassword = async (req: Request, res: Response) => {
    try {
      const { email, otp, newPassword } = req.body;
  
      if (!email || !otp || !newPassword) {
        return ResponseMessage.error(res, null, "Email, OTP, and new password are required.");
      }
  
      const response = await userService.resetPassword(email, otp, newPassword);
      return ResponseMessage.success(res, response);
    } catch (error: any) {
      console.error("Reset Password Error:", error);
      return ResponseMessage.error(res, null, error.message || "An error occurred while resetting password.");
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


  export const getUsers = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, search, orderBy, orderDirection, fromDate, toDate , userId} = req.query;
   
  
      const options = {
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit),
        search: search ? String(search) : undefined,
        orderBy: orderBy ? String(orderBy) : "createdAt",
        orderDirection: orderDirection === "ASC" ? "ASC" : "DESC",
        fromDate: fromDate ? String(fromDate) : undefined,
        toDate: toDate ? String(toDate) : undefined,
      };
  
      // Fetch either a single user or paginated users list
      const result = await userService.getUsers(options as any, userId as any);
  
      return ResponseMessage.success(res, result, userId ? "User retrieved successfully" : "Users retrieved successfully");
    } catch (error: any) {
      console.error(error);
      return ResponseMessage.error(res, null, error.message || "An unexpected error occurred.");
    }
  };
  