import { Pool } from 'pg';
export declare const pool: Pool;
export declare function connectDatabase(): Promise<void>;
export declare function closeDatabase(): Promise<void>;
export declare function query(text: string, params?: any[]): Promise<any>;
export declare function queryOne(text: string, params?: any[]): Promise<any>;
export declare function queryMany(text: string, params?: any[]): Promise<any[]>;
//# sourceMappingURL=database.d.ts.map