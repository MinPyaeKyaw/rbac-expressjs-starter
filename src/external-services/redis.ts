import Redis from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT, 10)
  : 6379;

const redisClient = new Redis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null,
});

redisClient.on('connect', () => {
  console.log(`✅ Redis connected to ${redisHost}:${redisPort}`);
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Cache invalidation
export const invalidateCache = async (cachePrefix: string) => {
  const keys = await redisClient.keys(`${cachePrefix}:*`);
  if (keys.length > 0) {
    await redisClient.del(...keys);
  }
};

export default redisClient;
