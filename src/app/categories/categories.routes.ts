import { Router } from "express";
import * as category from "./categories.controllers";
import multer from "multer";


const CategoryRouter = Router();

const upload = multer();



CategoryRouter.post("/create",   upload.single('image'),category.createCategory);
CategoryRouter.get("/all", category.getCategories);

export default CategoryRouter;
