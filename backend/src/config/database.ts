import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Use DATABASE_URL for Railway deployment, fallback to individual env vars for local development
const poolConfig: PoolConfig = process.env.DATABASE_URL 
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

export const pool = new Pool(poolConfig);

export async function connectDatabase(): Promise<void> {
  try {
    // Test the connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  await pool.end();
  console.log('✅ Database connection closed');
}

// Helper function to run queries
export async function query(text: string, params?: any[]): Promise<any> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

// Helper function to get a single row
export async function queryOne(text: string, params?: any[]): Promise<any> {
  const result = await query(text, params);
  return result.rows[0];
}

// Helper function to get multiple rows
export async function queryMany(text: string, params?: any[]): Promise<any[]> {
  const result = await query(text, params);
  return result.rows;
} 