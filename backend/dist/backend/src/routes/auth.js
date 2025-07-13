"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
const validateRegistration = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('firstName').isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('lastName').isLength({ min: 1, max: 50 })
];
const validateLogin = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty()
];
router.post('/register', validateRegistration, async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { email, username, password, firstName, lastName } = req.body;
        const existingUser = await (0, database_1.queryOne)('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'User with this email or username already exists'
            });
        }
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        const result = await (0, database_1.query)(`INSERT INTO users (email, username, password_hash, first_name, last_name, balance, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, username, first_name, last_name, balance, role, created_at`, [email, username, hashedPassword, firstName, lastName, 1000, 'user']);
        const user = result.rows[0];
        const token = (0, auth_1.generateToken)(user.id);
        const response = {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.first_name,
                lastName: user.last_name,
                balance: user.balance,
                role: user.role,
                createdAt: user.created_at,
                updatedAt: user.created_at
            },
            token
        };
        return res.status(201).json({
            success: true,
            data: response,
            message: 'User registered successfully'
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to register user'
        });
    }
});
router.post('/login', validateLogin, async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { email, password } = req.body;
        const user = await (0, database_1.queryOne)('SELECT * FROM users WHERE email = $1 AND active = true', [email]);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }
        const token = (0, auth_1.generateToken)(user.id);
        const response = {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.first_name,
                lastName: user.last_name,
                balance: user.balance,
                role: user.role,
                createdAt: user.created_at,
                updatedAt: user.updated_at
            },
            token
        };
        return res.json({
            success: true,
            data: response,
            message: 'Login successful'
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to login'
        });
    }
});
router.post('/logout', (_req, res) => {
    res.json({
        success: true,
        message: 'Logout successful'
    });
});
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }
        const jwt = require('jsonwebtoken');
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw (0, errorHandler_1.createError)('JWT_SECRET not configured');
        }
        const decoded = jwt.verify(token, secret);
        const user = await (0, database_1.queryOne)('SELECT * FROM users WHERE id = $1 AND active = true', [decoded.userId]);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
        return res.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.first_name,
                lastName: user.last_name,
                balance: user.balance,
                role: user.role,
                createdAt: user.created_at,
                updatedAt: user.updated_at
            }
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get user profile'
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map