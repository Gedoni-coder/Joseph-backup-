import { createClient } from "redis";
import {config} from "dotenv";
import retry from "../utils/retry.ts";


config();
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL is not defined in environment variables");
}
export const redis = createClient({
  url: redisUrl, // e.g. redis://localhost:6379
});

redis.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export async function connectRedis() {
    try{
    await retry(async () => {
        if (!redis.isOpen) {
          await redis.connect();
          console.log("Redis connected");
        }
    })}catch(err){
        console.error("Redis connection error:", err);
        process.exit(1);
    }
}
