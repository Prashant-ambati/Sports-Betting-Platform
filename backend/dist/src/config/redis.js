"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = connectRedis;
exports.disconnectRedis = disconnectRedis;
exports.getRedisClient = getRedisClient;
exports.setCache = setCache;
exports.getCache = getCache;
exports.deleteCache = deleteCache;
exports.clearCache = clearCache;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let redisClient;
async function connectRedis() {
    try {
        redisClient = (0, redis_1.createClient)({
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
    }
    catch (error) {
        console.error('Redis connection failed:', error);
        throw error;
    }
}
async function disconnectRedis() {
    if (redisClient) {
        await redisClient.disconnect();
    }
}
function getRedisClient() {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }
    return redisClient;
}
async function setCache(key, value, ttl) {
    const client = getRedisClient();
    const serializedValue = JSON.stringify(value);
    if (ttl) {
        await client.setEx(key, ttl, serializedValue);
    }
    else {
        await client.set(key, serializedValue);
    }
}
async function getCache(key) {
    const client = getRedisClient();
    const value = await client.get(key);
    if (!value) {
        return null;
    }
    try {
        return JSON.parse(value);
    }
    catch (error) {
        console.error('Error parsing cached value:', error);
        return null;
    }
}
async function deleteCache(key) {
    const client = getRedisClient();
    await client.del(key);
}
async function clearCache() {
    const client = getRedisClient();
    await client.flushAll();
}
//# sourceMappingURL=redis.js.map