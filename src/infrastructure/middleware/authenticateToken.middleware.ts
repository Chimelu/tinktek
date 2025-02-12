import { Request, Response, NextFunction } from "express";
import { CustomJwtPayload, verifyAccessToken } from "../utils/tokenUtils";
import ResponseMessage from "../responseHandler/response.handler";

export interface AuthenticatedRequest extends Request {
  user?: CustomJwtPayload;
}

const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log("Auth Header:", authHeader);

  const token = authHeader?.split(" ")[1];
  console.log("Extracted Token:", token?.substring(0, 20) + "...");

  if (!token) return ResponseMessage.error(res, "Access token missing");

  try {
    console.log("Environment:", process.env.NODE_ENV);

    let payload = verifyAccessToken(token);
    // Debug payload
    console.log("Token Verification Result:", payload ? "Success" : "Failed");
    if (payload) {
      console.log("Decoded Payload:", {
        userId: payload.id,
        email: payload.email,
        isAdmin: payload.isAdmin,
        exp: payload.exp,
      });
      payload = {
        userId: payload.id,
        email: payload.email,
        isAdmin: payload.isAdmin,
        exp: payload.exp,
        accountType: payload.accountType,
      }
    }

    if (!payload) return ResponseMessage.error(res, "Invalid or expired token");

    req.user = payload;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    return ResponseMessage.error(res, "Token verification failed");
  }
};

export default authenticateToken;
