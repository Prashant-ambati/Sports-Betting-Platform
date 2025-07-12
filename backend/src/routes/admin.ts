import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { query, queryOne } from '../config/database';
import { requireAdmin } from '../middleware/auth';
import { CreateEventRequest, UpdateEventRequest, PlatformStats } from '../../../shared/types';

const router = Router();

// Apply admin middleware to all routes
router.use(requireAdmin);

// Validation middleware
const validateCreateEvent = [
  body('title').isLength({ min: 1, max: 255 }),
  body('description').optional(),
  body('sport').isIn(['football', 'basketball', 'tennis', 'baseball', 'hockey', 'soccer', 'cricket']),
  body('startTime').isISO8601(),
  body('endTime').isISO8601(),
  body('initialOdds.home').isFloat({ min: 1 }),
  body('initialOdds.away').isFloat({ min: 1 }),
  body('initialOdds.draw').optional().isFloat({ min: 1 })
];

const validateUpdateEvent = [
  body('title').optional().isLength({ min: 1, max: 255 }),
  body('description').optional(),
  body('startTime').optional().isISO8601(),
  body('endTime').optional().isISO8601(),
  body('status').optional().isIn(['upcoming', 'live', 'completed', 'cancelled'])
];

// Create new event
router.post('/events', validateCreateEvent, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      title,
      description,
      sport,
      startTime,
      endTime,
      initialOdds
    }: CreateEventRequest = req.body;

    const result = await query(
      `INSERT INTO events (title, description, sport, start_time, end_time, home_odds, away_odds, draw_odds)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        title,
        description,
        sport,
        startTime,
        endTime,
        initialOdds.home,
        initialOdds.away,
        initialOdds.draw || null
      ]
    );

    const event = result.rows[0];
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
        lastUpdated: event.created_at
      },
      createdAt: event.created_at,
      updatedAt: event.updated_at
    };

          return res.status(201).json({
        success: true,
        data: eventData,
        message: 'Event created successfully'
      });
    } catch (error) {
      console.error('Create event error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create event'
      });
    }
});

// Update event
router.put('/events/:id', validateUpdateEvent, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const updateData: UpdateEventRequest = req.body;

    // Check if event exists
    const existingEvent = await queryOne(
      'SELECT * FROM events WHERE id = $1',
      [id]
    );

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updateData.title) {
      updates.push(`title = $${paramIndex}`);
      values.push(updateData.title);
      paramIndex++;
    }

    if (updateData.description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      values.push(updateData.description);
      paramIndex++;
    }

    if (updateData.startTime) {
      updates.push(`start_time = $${paramIndex}`);
      values.push(updateData.startTime);
      paramIndex++;
    }

    if (updateData.endTime) {
      updates.push(`end_time = $${paramIndex}`);
      values.push(updateData.endTime);
      paramIndex++;
    }

    if (updateData.status) {
      updates.push(`status = $${paramIndex}`);
      values.push(updateData.status);
      paramIndex++;
    }

    if (updateData.odds) {
      if (updateData.odds.home) {
        updates.push(`home_odds = $${paramIndex}`);
        values.push(updateData.odds.home);
        paramIndex++;
      }
      if (updateData.odds.away) {
        updates.push(`away_odds = $${paramIndex}`);
        values.push(updateData.odds.away);
        paramIndex++;
      }
      if (updateData.odds.draw !== undefined) {
        updates.push(`draw_odds = $${paramIndex}`);
        values.push(updateData.odds.draw);
        paramIndex++;
      }
    }

    if (updateData.result) {
      updates.push(`home_score = $${paramIndex}, away_score = $${paramIndex + 1}, winner = $${paramIndex + 2}`);
      values.push(updateData.result.homeScore, updateData.result.awayScore, updateData.result.winner);
      paramIndex += 3;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    values.push(id);
    const updateQuery = `UPDATE events SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`;

    const result = await query(updateQuery, values);
    const updatedEvent = result.rows[0];

    const eventData = {
      id: updatedEvent.id,
      title: updatedEvent.title,
      description: updatedEvent.description,
      sport: updatedEvent.sport,
      startTime: updatedEvent.start_time,
      endTime: updatedEvent.end_time,
      status: updatedEvent.status,
      odds: {
        home: updatedEvent.home_odds,
        away: updatedEvent.away_odds,
        draw: updatedEvent.draw_odds,
        lastUpdated: updatedEvent.updated_at
      },
      result: updatedEvent.winner ? {
        homeScore: updatedEvent.home_score,
        awayScore: updatedEvent.away_score,
        winner: updatedEvent.winner,
        completedAt: updatedEvent.updated_at
      } : undefined,
      createdAt: updatedEvent.created_at,
      updatedAt: updatedEvent.updated_at
    };

          return res.json({
        success: true,
        data: eventData,
        message: 'Event updated successfully'
      });
    } catch (error) {
      console.error('Update event error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update event'
      });
    }
});

// Get platform statistics
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    // Get basic stats
    const statsResult = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE active = true) as total_users,
        (SELECT COUNT(*) FROM events) as total_events,
        (SELECT COUNT(*) FROM bets) as total_bets,
        (SELECT COALESCE(SUM(amount), 0) FROM bets) as total_volume,
        (SELECT COUNT(*) FROM events WHERE status = 'live') as active_events
    `);

    const stats = statsResult.rows[0];

    // Get recent activity
    const recentActivityResult = await query(`
      SELECT 
        'bet_placed' as type,
        b.user_id,
        b.amount,
        b.placed_at as timestamp
      FROM bets b
      ORDER BY b.placed_at DESC
      LIMIT 10
    `);

    const platformStats: PlatformStats = {
      totalUsers: parseInt(stats.total_users),
      totalEvents: parseInt(stats.total_events),
      totalBets: parseInt(stats.total_bets),
      totalVolume: parseFloat(stats.total_volume),
      activeEvents: parseInt(stats.active_events),
      recentActivity: recentActivityResult.rows.map((row: any) => ({
        type: row.type,
        userId: row.user_id,
        amount: row.amount,
        timestamp: row.timestamp
      }))
    };

    return res.json({
      success: true,
      data: platformStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch platform statistics'
    });
  }
});

export default router; 