import { Router } from "express";
import * as category from "../categories/categories.controllers";
import multer from "multer";



const CategoryAdminRouter = Router();

const upload = multer();




CategoryAdminRouter.patch(
  "/edit/:id",
  upload.single('image'),

  
  //   inputValidator(validator.updateCategory),
  category.editCategory
);


CategoryAdminRouter.delete(
  "/delete/:id",
  category.deleteCategory
);

export default CategoryAdminRouter;
