import path from "path";
import { config as dotenvConfig } from 'dotenv';

// Load environment variables from .env file
dotenvConfig();

export const config = {
  mongoURI: process.env.MONGO_URI ,
  jwtSecret: process.env.JWT_SECRET ,
  port: process.env.PORT 
};
