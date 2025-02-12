import { Router } from "express";
import * as user from "./controller";
import multer from "multer";


const UserRouter = Router();

const upload = multer();



UserRouter.post("/create", user.registerUser);
UserRouter.post("/login", user.loginUser);
UserRouter.patch("/update-profile", user.updateProfile);
UserRouter.patch("/change-password", user.changePassword);
// update profile Image
// forgot password
// reset password
export default UserRouter;
