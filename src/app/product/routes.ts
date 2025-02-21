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


// GET /products/admin/:keyword (latest, best-sellers, recommended)
ProductRouter.get("/organised/:keyword", product.getOrganisedProducts);


ProductRouter.get("/", product.getProductsAdmin);
ProductRouter.get("/:productId", product.getProduct);
// ProductRouter.get("/get", product.getProductsUser);


ProductRouter.patch(
  "/edit/:productId",
  upload.array("images", 5),
  product.editProduct
);


// best sellers: check orderDb and get most orderd products 10
// new: check db and get 10 latest created products



ProductRouter.delete("/:productId", product.deleteProduct);

export default ProductRouter;
