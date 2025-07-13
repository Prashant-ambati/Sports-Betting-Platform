"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const { sport, status, page = '1', limit = '10', search } = req.query;
        const pageNum = parseInt(page);
        const limitNum = Math.min(parseInt(limit), 100);
        const offset = (pageNum - 1) * limitNum;
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramIndex = 1;
        if (sport) {
            whereClause += ` AND sport = $${paramIndex}`;
            params.push(sport);
            paramIndex++;
        }
        if (status) {
            whereClause += ` AND status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }
        if (search) {
            whereClause += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }
        const countResult = await (0, database_1.query)(`SELECT COUNT(*) as total FROM events ${whereClause}`, params);
        const total = parseInt(countResult.rows[0].total);
        const eventsResult = await (0, database_1.query)(`SELECT * FROM events ${whereClause} 
       ORDER BY start_time DESC 
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`, [...params, limitNum, offset]);
        const events = eventsResult.rows.map((row) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            sport: row.sport,
            startTime: row.start_time,
            endTime: row.end_time,
            status: row.status,
            odds: {
                home: row.home_odds,
                away: row.away_odds,
                draw: row.draw_odds,
                lastUpdated: row.updated_at
            },
            result: row.winner ? {
                homeScore: row.home_score,
                awayScore: row.away_score,
                winner: row.winner,
                completedAt: row.updated_at
            } : undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
        res.json({
            success: true,
            data: events,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch events'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const event = await (0, database_1.queryOne)('SELECT * FROM events WHERE id = $1', [id]);
        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }
        const eventData = {
            id: event.id,
            title: event.title,
            description: event.description,
            sport: event.sport,
            startTime: event.start_time,
            endTime: event.end_time,
            status: event.status,
            odds: {
                home: event.home_odds,
                away: event.away_odds,
                draw: event.draw_odds,
                lastUpdated: event.updated_at
            },
            ...(event.winner && {
                result: {
                    homeScore: event.home_score,
                    awayScore: event.away_score,
                    winner: event.winner,
                    completedAt: event.updated_at
                }
            }),
            createdAt: event.created_at,
            updatedAt: event.updated_at
        };
        return res.json({
            success: true,
            data: eventData
        });
    }
    catch (error) {
        console.error('Get event error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch event'
        });
    }
});
exports.default = router;
//# sourceMappingURL=events.js.map