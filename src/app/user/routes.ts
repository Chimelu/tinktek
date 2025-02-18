import { Router } from "express";
import * as user from "./controller";
import multer from "multer";
import { authenticateUser } from "../../infrastructure/middleware/authMiddleware";


const UserRouter = Router();

const upload = multer();



UserRouter.post("/create", user.registerUser);
UserRouter.post("/login", user.loginUser);
UserRouter.put("/upload-image", upload.single('image'), authenticateUser, user.updateProfileImage);
UserRouter.patch("/update-profile/:userId", user.updateProfile);
UserRouter.patch("/change-password/:userId", user.changePassword);  
UserRouter.post("/resend-otp", user.resendOtp) 
UserRouter.post("/verify-otp", user.verifyOtp); 
UserRouter.post("/get-user", user.getUsers); 



// forgot password
// reset password
// admin update user profile and his profile
// user update mail 

export default UserRouter;
