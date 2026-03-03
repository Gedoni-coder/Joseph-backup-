// utils/cache.ts
import { redis } from "../config/redis.ts";
export async function cached<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const data = await fetcher();
  await redis.setEx(key, ttl, JSON.stringify(data));
  return data;
}
/* export async function invalidate(pattern: string) {
  const keys = await redis.keys(pattern);
  if (keys.length) await redis.del(keys);
} */
export async function invalidate(pattern: string) {
  let cursor = "0";
  const keys: string[] = [];

  do {
    const result = await redis.scan(cursor, {
      MATCH: pattern,
      COUNT: 100,
    });

    cursor = result.cursor;
    keys.push(...result.keys);
  } while (cursor !== "0");

  if (keys.length) {
    await redis.del(keys);
  }
}
