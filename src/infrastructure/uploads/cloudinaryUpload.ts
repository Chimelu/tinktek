import { v2 as cloudinary } from "cloudinary";  
import config from "../config/env.config";  

// Cloudinary configuration
cloudinary.config({
  cloud_name: config.cloudName,  
  api_key: config.apiKey,  
  api_secret: config.apiSecret,  
  secure: true,  
});  

export default cloudinary;  
