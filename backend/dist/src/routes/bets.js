"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
const validateBet = [
    (0, express_validator_1.body)('eventId').isUUID().withMessage('Invalid event ID'),
    (0, express_validator_1.body)('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    (0, express_validator_1.body)('prediction').isIn(['home', 'away', 'draw']).withMessage('Invalid prediction')
];
router.post('/', validateBet, async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors.array()
            });
        }
        const { eventId, amount, prediction } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        const user = await (0, database_1.queryOne)('SELECT balance FROM users WHERE id = $1', [userId]);
        if (!user || user.balance < amount) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient balance'
            });
        }
        const event = await (0, database_1.queryOne)('SELECT * FROM events WHERE id = $1 AND status IN ($2, $3)', [eventId, 'upcoming', 'live']);
        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found or not available for betting'
            });
        }
        let odds;
        switch (prediction) {
            case 'home':
                odds = event.home_odds;
                break;
            case 'away':
                odds = event.away_odds;
                break;
            case 'draw':
                odds = event.draw_odds || 0;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    error: 'Invalid prediction'
                });
        }
        if (odds <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid odds for this prediction'
            });
        }
        const potentialWinnings = amount * odds;
        await (0, database_1.query)('BEGIN');
        try {
            const betResult = await (0, database_1.query)(`INSERT INTO bets (user_id, event_id, amount, odds, prediction, potential_winnings)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`, [userId, eventId, amount, odds, prediction, potentialWinnings]);
            await (0, database_1.query)('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, userId]);
            await (0, database_1.query)(`INSERT INTO transactions (user_id, type, amount, description, balance_before, balance_after)
         VALUES ($1, $2, $3, $4, $5, $6)`, [userId, 'bet', -amount, `Bet placed on ${event.title}`, user.balance, user.balance - amount]);
            await (0, database_1.query)('COMMIT');
            const bet = betResult.rows[0];
            const betData = {
                id: bet.id,
                userId: bet.user_id,
                eventId: bet.event_id,
                amount: bet.amount,
                odds: bet.odds,
                prediction: bet.prediction,
                status: bet.status,
                potentialWinnings: bet.potential_winnings,
                actualWinnings: bet.actual_winnings,
                placedAt: bet.placed_at,
                settledAt: bet.settled_at
            };
            return res.status(201).json({
                success: true,
                data: betData,
                message: 'Bet placed successfully'
            });
        }
        catch (error) {
            await (0, database_1.query)('ROLLBACK');
            throw error;
        }
    }
    catch (error) {
        console.error('Place bet error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to place bet'
        });
    }
});
router.get('/', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        const { status, page = '1', limit = '10' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = Math.min(parseInt(limit), 100);
        const offset = (pageNum - 1) * limitNum;
        let whereClause = 'WHERE b.user_id = $1';
        const params = [userId];
        let paramIndex = 2;
        if (status) {
            whereClause += ` AND b.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }
        const countResult = await (0, database_1.query)(`SELECT COUNT(*) as total FROM bets b ${whereClause}`, params);
        const total = parseInt(countResult.rows[0].total);
        const betsResult = await (0, database_1.query)(`SELECT b.*, e.title as event_title 
       FROM bets b 
       JOIN events e ON b.event_id = e.id 
       ${whereClause} 
       ORDER BY b.placed_at DESC 
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`, [...params, limitNum, offset]);
        const bets = betsResult.rows.map((row) => ({
            id: row.id,
            eventId: row.event_id,
            eventTitle: row.event_title,
            amount: row.amount,
            odds: row.odds,
            prediction: row.prediction,
            status: row.status,
            potentialWinnings: row.potential_winnings,
            actualWinnings: row.actual_winnings,
            placedAt: row.placed_at,
            settledAt: row.settled_at
        }));
        return res.json({
            success: true,
            data: bets,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (error) {
        console.error('Get bets error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch bets'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }
        const bet = await (0, database_1.queryOne)(`SELECT b.*, e.title as event_title 
       FROM bets b 
       JOIN events e ON b.event_id = e.id 
       WHERE b.id = $1 AND b.user_id = $2`, [id, userId]);
        if (!bet) {
            return res.status(404).json({
                success: false,
                error: 'Bet not found'
            });
        }
        const betData = {
            id: bet.id,
            eventId: bet.event_id,
            eventTitle: bet.event_title,
            amount: bet.amount,
            odds: bet.odds,
            prediction: bet.prediction,
            status: bet.status,
            potentialWinnings: bet.potential_winnings,
            actualWinnings: bet.actual_winnings,
            placedAt: bet.placed_at,
            settledAt: bet.settled_at
        };
        return res.json({
            success: true,
            data: betData
        });
    }
    catch (error) {
        console.error('Get bet error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch bet'
        });
    }
});
exports.default = router;
//# sourceMappingURL=bets.js.map