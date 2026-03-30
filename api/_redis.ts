import { createClient } from 'redis';

let redis: ReturnType<typeof createClient> | null = null;

export function getRedis() {
  if (!redis) {
    redis = createClient({ url: process.env.REDIS_URL });
    redis.connect().catch(console.error);
  }
  return redis;
}
