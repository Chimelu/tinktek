import { Router } from "express";
import * as color from "./controller";
import multer from "multer";


const ColorRouter = Router();





ColorRouter.post("/create",color.createColor);






export default ColorRouter;
