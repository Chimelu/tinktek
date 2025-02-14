import { Router } from "express";
import multer from "multer";
import * as product from "./product.controller";


const ProductRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Accept multiple images
ProductRouter.post(
  "/create",
  upload.array("images", 5), // "images" must match the key in Postman
  product.createProduct
);


ProductRouter.get("/", product.getProductsAdmin);
// ProductRouter.get("/get", product.getProductsUser);


ProductRouter.patch(
  "/edit/:productId",
  upload.array("images", 5),
  product.editProduct
);


// when i pass  category id i want an object of all sub categories id and name and an array of all colors that category product has
// best sellers: check orderDb and get most orderd products 10
// new: check db and get 10 latest created products
// get all products filter by categoryId, color ,size


ProductRouter.delete("/:productId", product.deleteProduct);

export default ProductRouter;
