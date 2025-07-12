import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: RedisClientType;

export async function connectRedis(): Promise<void> {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 10000,
      },
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected');
    });

    await redisClient.connect();
  } catch (error) {
    console.error('Redis connection failed:', error);
    throw error;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.disconnect();
  }
}

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
}

// Cache helper functions
export async function setCache(key: string, value: any, ttl?: number): Promise<void> {
  const client = getRedisClient();
  const serializedValue = JSON.stringify(value);
  
  if (ttl) {
    await client.setEx(key, ttl, serializedValue);
  } else {
    await client.set(key, serializedValue);
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  const value = await client.get(key);
  
  if (value) {
    return JSON.parse(value) as T;
  }
  
  return null;
}

export async function deleteCache(key: string): Promise<void> {
  const client = getRedisClient();
  await client.del(key);
}

export async function clearCache(): Promise<void> {
  const client = getRedisClient();
  await client.flushAll();
} 