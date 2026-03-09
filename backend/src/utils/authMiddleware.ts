import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

/* type JwtPayload = {
  id: string;
  role: "STUDENT" | "ADMIN" | "BUSINESS";
  verificationLevel: "L1" | "L2" | "L3" | "L4";
}; */

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.jwt ?? {};

  if (!token || typeof token !== "string") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as {id: string};

    // Attach immutable auth payload to request
    Object.defineProperty(req, "userId", {
      value: decoded.id,
      writable: false,
      enumerable: true,
      configurable: false,
    });

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
