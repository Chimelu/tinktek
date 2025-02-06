import jwt from "jsonwebtoken";
import { config } from "../config/env.config"; 

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, config.jwtSecret as string, {
    expiresIn: "30d",
  });
};

export default generateToken;
