"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.connectDatabase = connectDatabase;
exports.closeDatabase = closeDatabase;
exports.query = query;
exports.queryOne = queryOne;
exports.queryMany = queryMany;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'sports_betting_db',
        password: process.env.DB_PASSWORD || 'postgres123',
        port: parseInt(process.env.DB_PORT || '5432'),
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
exports.pool = new pg_1.Pool(poolConfig);
async function connectDatabase() {
    try {
        const client = await exports.pool.connect();
        console.log('✅ Database connection successful');
        client.release();
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
}
async function closeDatabase() {
    await exports.pool.end();
    console.log('✅ Database connection closed');
}
async function query(text, params) {
    const start = Date.now();
    try {
        const res = await exports.pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    }
    catch (error) {
        console.error('Query error:', error);
        throw error;
    }
}
async function queryOne(text, params) {
    const result = await query(text, params);
    return result.rows[0];
}
async function queryMany(text, params) {
    const result = await query(text, params);
    return result.rows;
}
//# sourceMappingURL=database.js.map