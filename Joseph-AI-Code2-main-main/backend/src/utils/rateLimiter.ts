import type { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis.ts";

type RateLimiterOptions = {
  windowMs: number; // time window in milliseconds
  maxRequests: number; // max requests per window
  keyPrefix?: string; // optional prefix for redis keys
};

export const rateLimiter =
  ({ windowMs, maxRequests, keyPrefix = "rate" }: RateLimiterOptions) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const identifier = req.userId ?? req.ip; // prefer userId, fallback to IP

      const key = `${keyPrefix}:${identifier}`;
      const ttlSeconds = Math.ceil(windowMs / 1000);

      const current = await redis.incr(key);

      // First request → set expiration
      if (current === 1) {
        await redis.expire(key, ttlSeconds);
      }

      if (current > maxRequests) {
        const ttl = await redis.ttl(key);

        return res.status(429).json({
          message: "Too many requests",
          retryAfter: ttl > 0 ? ttl : ttlSeconds,
        });
      }

      next();
    } catch (err) {
      // Fail open (don't block traffic if Redis is down)
      console.error("Rate limiter error:", err);
      next();
    }
  };
