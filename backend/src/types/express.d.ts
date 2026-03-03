import "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      phone?: string;
    }
  }
}
export {};
