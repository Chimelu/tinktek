import { Router } from "express";
import * as deliveryFee from "./controller";
import multer from "multer";


const DeliveryFeeRouter = Router();





// DeliveryFeeRouter.post("/create",deliveryFee.createDelive);
DeliveryFeeRouter.get("/get",deliveryFee.getAllDekiveryFee);
DeliveryFeeRouter.delete("/all",deliveryFee.deleteAllDeliveryFees);
DeliveryFeeRouter.patch("/edit/:id",deliveryFee.editdeliveryFee);






export default DeliveryFeeRouter;
