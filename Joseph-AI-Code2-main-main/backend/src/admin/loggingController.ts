import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  const requestId = randomUUID();

  // attach requestId for later use
  (req as any).requestId = requestId;

  res.on("finish", () => {
    const duration = Date.now() - start;

    const log = {
      level:
        res.statusCode >= 500
          ? "error"
          : res.statusCode >= 400
          ? "warn"
          : "info",

      requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: duration,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      userId: (req as any).userId ?? null,
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
    };

    console.log(JSON.stringify(log));
  });

  next();
};
