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
// forgot password
// reset password
// admin update user profile and his profile
// verify otp
// resend otp
// user update mail 

export default UserRouter;
