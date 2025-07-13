"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigration = runMigration;
const database_1 = require("../config/database");
async function createTables() {
    try {
        console.log('🔄 Starting database migration...');
        await database_1.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        balance DECIMAL(10,2) DEFAULT 0.00,
        role VARCHAR(20) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await database_1.pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        sport VARCHAR(100) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        status VARCHAR(20) DEFAULT 'upcoming',
        odds_home DECIMAL(5,2),
        odds_away DECIMAL(5,2),
        odds_draw DECIMAL(5,2),
        home_team VARCHAR(100) NOT NULL,
        away_team VARCHAR(100) NOT NULL,
        home_score INTEGER DEFAULT 0,
        away_score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await database_1.pool.query(`
      CREATE TABLE IF NOT EXISTS bets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        bet_type VARCHAR(20) NOT NULL,
        bet_amount DECIMAL(10,2) NOT NULL,
        potential_winnings DECIMAL(10,2) NOT NULL,
        odds DECIMAL(5,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await database_1.pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        reference_id INTEGER,
        reference_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Database migration completed successfully!');
    }
    catch (error) {
        console.error('❌ Database migration failed:', error);
        throw error;
    }
}
async function seedData() {
    try {
        console.log('🔄 Seeding initial data...');
        const adminPassword = 'admin123';
        const adminPasswordHash = await Promise.resolve().then(() => __importStar(require('bcryptjs'))).then(bcrypt => bcrypt.hash(adminPassword, 10));
        await database_1.pool.query(`
      INSERT INTO users (email, username, password_hash, first_name, last_name, role, balance)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO NOTHING
    `, ['admin@sportsbetting.com', 'admin', adminPasswordHash, 'Admin', 'User', 'admin', 10000.00]);
        await database_1.pool.query(`
      INSERT INTO events (title, description, sport, start_time, home_team, away_team, odds_home, odds_away, odds_draw)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9),
        ($10, $11, $12, $13, $14, $15, $16, $17, $18),
        ($19, $20, $21, $22, $23, $24, $25, $26, $27)
      ON CONFLICT DO NOTHING
    `, [
            'Manchester United vs Liverpool', 'Premier League clash', 'Football',
            new Date(Date.now() + 24 * 60 * 60 * 1000), 'Manchester United', 'Liverpool', 2.50, 2.80, 3.20,
            'Lakers vs Warriors', 'NBA Western Conference', 'Basketball',
            new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 'Lakers', 'Warriors', 1.80, 2.10, null,
            'Djokovic vs Nadal', 'Wimbledon Final', 'Tennis',
            new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 'Djokovic', 'Nadal', 1.90, 1.90, null
        ]);
        console.log('✅ Initial data seeded successfully!');
    }
    catch (error) {
        console.error('❌ Data seeding failed:', error);
        throw error;
    }
}
async function runMigration() {
    try {
        await (0, database_1.connectDatabase)();
        await createTables();
        await seedData();
        console.log('🎉 Database setup completed!');
    }
    catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    }
    finally {
        await database_1.pool.end();
    }
}
if (require.main === module) {
    runMigration();
}
//# sourceMappingURL=migrate.js.map