"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
const validateProfileUpdate = [
    (0, express_validator_1.body)('firstName').optional().isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('lastName').optional().isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('email').optional().isEmail()
];
router.get('/profile', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        const user = await (0, database_1.queryOne)(`SELECT 
        u.id, u.email, u.username, u.first_name, u.last_name, u.balance,
        COUNT(b.id) as total_bets,
        COALESCE(SUM(CASE WHEN b.status = 'won' THEN b.actual_winnings ELSE 0 END), 0) as total_winnings,
        CASE 
          WHEN COUNT(b.id) > 0 THEN 
            ROUND(COUNT(CASE WHEN b.status = 'won' THEN 1 END)::DECIMAL / COUNT(b.id) * 100, 2)
          ELSE 0 
        END as win_rate
       FROM users u
       LEFT JOIN bets b ON u.id = b.user_id
       WHERE u.id = $1
       GROUP BY u.id`, [userId]);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        const profile = {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            balance: user.balance,
            totalBets: parseInt(user.total_bets),
            totalWinnings: parseFloat(user.total_winnings),
            winRate: parseFloat(user.win_rate)
        };
        return res.json({
            success: true,
            data: profile
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch profile'
        });
    }
});
router.put('/profile', validateProfileUpdate, async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        const { firstName, lastName, email } = req.body;
        if (email) {
            const existingUser = await (0, database_1.queryOne)('SELECT id FROM users WHERE email = $1 AND id != $2', [email, userId]);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    error: 'Email already taken by another user'
                });
            }
        }
        const updates = [];
        const values = [];
        let paramIndex = 1;
        if (firstName) {
            updates.push(`first_name = $${paramIndex}`);
            values.push(firstName);
            paramIndex++;
        }
        if (lastName) {
            updates.push(`last_name = $${paramIndex}`);
            values.push(lastName);
            paramIndex++;
        }
        if (email) {
            updates.push(`email = $${paramIndex}`);
            values.push(email);
            paramIndex++;
        }
        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No fields to update'
            });
        }
        values.push(userId);
        const updateQuery = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`;
        const result = await (0, database_1.query)(updateQuery, values);
        const updatedUser = result.rows[0];
        const userData = {
            id: updatedUser.id,
            email: updatedUser.email,
            username: updatedUser.username,
            firstName: updatedUser.first_name,
            lastName: updatedUser.last_name,
            balance: updatedUser.balance,
            role: updatedUser.role,
            createdAt: updatedUser.created_at,
            updatedAt: updatedUser.updated_at
        };
        return res.json({
            success: true,
            data: userData,
            message: 'Profile updated successfully'
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to update profile'
        });
    }
});
router.get('/balance', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        const user = await (0, database_1.queryOne)('SELECT balance FROM users WHERE id = $1', [userId]);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        return res.json({
            success: true,
            data: {
                balance: user.balance,
                currency: 'USD'
            }
        });
    }
    catch (error) {
        console.error('Get balance error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch balance'
        });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map