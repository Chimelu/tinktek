import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";


interface AuthRequest extends Request {
  user?: IUser;
}

// Protect middleware to verify the JWT token
export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  // Check if the token is in the Authorization header
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; // Extract token

    try {
      // Verify the token and decode it
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
      req.user = await User.findById(decoded.id).select("-password"); // Attach user data to request
      next(); 
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" }); // If token is invalid or expired
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" }); // If no token is provided
  }
};

// Role-based authorization middleware
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Check if the user's role is allowed
    if (!req.user || !roles.includes(req.user.role)) {
     res.status(403).json({ message: "Forbidden: Insufficient role permissions" });
    }
    next(); // If role is authorized, pass control to the next middleware or route handler
  };
};
