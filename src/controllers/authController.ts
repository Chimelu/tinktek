import { Request, Response } from "express";
import { registerUserService, loginUserService } from "../services/authService";



// registr a new user , with a role 
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const userData = await registerUserService(name, email, password, role);
    res.status(201).json(userData);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


// login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userData = await loginUserService(email, password);
    res.json(userData);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};





