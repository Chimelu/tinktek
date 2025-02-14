import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../../infrastructure/config/env.config";
import { UserModel } from "../../core/models";
import { RepositoryFactory } from "../../infrastructure/repository-implementation/repository.factory";
import { DBSource } from "../../infrastructure/database/sqldb.database";

const { dbType, secret } = config;

const UserRepoService: any = RepositoryFactory.setRepository(
  dbType,
  UserModel,
  DBSource
);

// Extend Request to include the `user` property
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// 🔐 Middleware to Authenticate User
export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    // Verify JWT token
    const decoded: any = jwt.verify(token, secret);
    const user = await UserRepoService.findOne({ id: decoded.id });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }

    req.user = { id: user.id, role: user.role }; // ✅ Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized access." });
  }
};

// 🔐 Middleware to Enforce Role-Based Access Control (RBAC)
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: Access denied." });
    }
    next();
  };
};
