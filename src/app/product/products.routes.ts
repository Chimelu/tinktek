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
ProductRouter.put("/wayagramDeal-status/:productId", product.updateWayagramDealStatus);



ProductRouter.patch(
  "/edit/:productId",
  upload.array("images", 5),
  product.editProduct
);


ProductRouter.delete("/:productId", product.deleteProduct);

export default ProductRouter;
