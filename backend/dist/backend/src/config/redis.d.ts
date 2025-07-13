import { RedisClientType } from 'redis';
export declare function connectRedis(): Promise<void>;
export declare function disconnectRedis(): Promise<void>;
export declare function getRedisClient(): RedisClientType;
export declare function setCache(key: string, value: any, ttl?: number): Promise<void>;
export declare function getCache<T>(key: string): Promise<T | null>;
export declare function deleteCache(key: string): Promise<void>;
export declare function clearCache(): Promise<void>;
//# sourceMappingURL=redis.d.ts.map