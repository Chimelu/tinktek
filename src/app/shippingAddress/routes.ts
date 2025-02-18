import { Router } from "express";
import * as address from "./controller";



const AddressRouter = Router();






AddressRouter.post("/create", address.createAddress);
AddressRouter.patch("/edit/:addressId", address.editAddress);
AddressRouter.delete("/delete/:addressId", address.deleteAddress);
AddressRouter.get("/get-all/:userId", address.getAllAddressesByUserId); 



export default AddressRouter;  
