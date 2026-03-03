import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.ts";

export const requirePhoneMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true },
    });

    if (!user || !user.phone) {
      return res.status(400).json({ message: "Phone number required to proceed" });
    }
    // Attach immutable phone payload to request
    Object.defineProperty(req, "phone", {
      value: user.phone,
      writable: false,
      enumerable: true,
      configurable: false,
    });

    next();
  } catch {
    return res.status(500).json({ message: "something went wrong" });
  }
};
