import { Router } from "express";
import * as user from "./controller";
import multer from "multer";


const UserRouter = Router();

const upload = multer();



UserRouter.post("/create", user.registerUser);
UserRouter.post("/login", user.loginUser);
// UserRouter.get("/all", category.getCategories);

export default UserRouter;
