import { Router } from "express";
import * as Size from "./controller";
import multer from "multer";


const SizeRouter = Router();





SizeRouter.post("/create",Size.createSize);
SizeRouter.get("/get",Size.getAllSizes);  






export default SizeRouter;
