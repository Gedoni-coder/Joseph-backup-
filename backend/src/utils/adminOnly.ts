import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.ts";
import { config } from "dotenv";

config();

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId as string;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user) {
      return res.status(401).json("Invalid Id");
    }
    if (user.role !== "ADMIN") {
      return res.status(404).json("UNAUTHORIZED");
    }
    if (user && user.role === "ADMIN") {
      next();
    }
  } catch (err) {
    return res.status(400).json({ message: "Invalid Id" });
  }
};
