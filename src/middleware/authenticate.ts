import express, { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { decode } from "punycode";

// Interface for your JWT payload (replace with your actual payload structure)
interface JwtPayload {
  userId: number;
  email: string;
  // Add other relevant user data
}
interface AuthenticatedRequest extends Request {
  user: any;
}

const secret = "secret1";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get the authorization header
  const authHeader = req.headers.authorization;

  // Check if authorization header is present and formatted correctly
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  // Verify the JWT token
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    if (decoded) {
      res.locals.user = decoded;
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const adminAuthorize = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as any; // Assuming user object is attached to req in authentication middleware
    if (!user || user.role !== "admin" || user.role !== "Admin") {
      return res
        .status(403)
        .json({ status: 403, message: "Unauthorized Admin" });
    }
    next();
  };
};
