import express, { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { multerClient } from "../utils/helper";

interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  // Verify the JWT token
  try {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
      res.locals.user = decoded as JwtPayload;
      next();
    });
    // if (decoded) {
    //   res.locals.user = decoded;
    // }
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const adminAuthorize = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user as any;
  if (user.role !== "admin") {
    return res.status(403).json({ status: 403, message: "Unauthorized Admin" });
  }
  next();
};

export async function multerSingle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const multer = multerClient();
    const uploadSingle = multer.single("file");
    uploadSingle(req, res, (err) => {
      if (err) {
        return res.status(400).send({ error: "Multer error: " + err.message });
      } else {
        next();
      }
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: 400, message: "Kindly Upload a document file!" });
  }
}
