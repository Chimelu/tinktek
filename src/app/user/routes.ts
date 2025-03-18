import { Router } from "express";
import * as user from "./controller";
import multer from "multer";
import { authenticateUser } from "../../infrastructure/middleware/authMiddleware";


const UserRouter = Router();

const upload = multer();



UserRouter.post("/create", user.registerUser);
UserRouter.post("/login", user.loginUser);
UserRouter.put("/upload-image", upload.single('image'), authenticateUser, user.updateProfileImage);
UserRouter.patch("/update-profile/:userId", authenticateUser, user.updateProfile);
UserRouter.patch("/change-password/:userId", authenticateUser, user.changePassword);  
UserRouter.post("/resend-otp", user.resendOtp) 
UserRouter.post("/verify-otp", user.verifyOtp); 
UserRouter.get("/get-user", authenticateUser, user.getUsers); 
UserRouter.post("/forgot-password", user.forgotPassword); 
UserRouter.post("/reset-password", user.resetPassword); 




// admin update user profile and his profile
// user update mail 

export default UserRouter;
