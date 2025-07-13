"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.requireAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Access token required'
            });
            return;
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET not configured');
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await (0, database_1.queryOne)('SELECT * FROM users WHERE id = $1 AND active = true', [decoded.userId]);
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Invalid token or user not found'
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
        else {
            console.error('Auth middleware error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
};
exports.authenticateToken = authenticateToken;
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
        return;
    }
    if (req.user.role !== 'admin') {
        res.status(403).json({
            success: false,
            error: 'Admin access required'
        });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET not configured');
    }
    return jsonwebtoken_1.default.sign({ userId }, secret, { expiresIn: '24h' });
};
exports.generateToken = generateToken;
//# sourceMappingURL=auth.js.map