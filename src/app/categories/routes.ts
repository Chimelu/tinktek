import { Router } from "express";
import * as category from "./controllers";
import multer from "multer";


const CategoryRouter = Router();

const upload = multer();



CategoryRouter.post("/create", upload.single('image'),category.createCategory);
CategoryRouter.get("/all", category.getCategories); //for admin
CategoryRouter.get("/parent-categories", category.getParentCategories); 
CategoryRouter.get("/sub-categories/:rootCategoryId", category.getSubCategories); 
CategoryRouter.patch(
  "/edit/:id",
  upload.single('image'),
  category.editCategory
);

CategoryRouter.delete(
    "/delete/:id",
    category.deleteCategory
  );





export default CategoryRouter;
