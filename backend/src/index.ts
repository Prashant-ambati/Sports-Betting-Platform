import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';

// Import routes
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import betRoutes from './routes/bets';
import userRoutes from './routes/users';
import adminRoutes from './routes/admin';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { authenticateToken } from './middleware/auth';

// Import database connection
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';

// Import WebSocket handlers
import { setupWebSocket } from './websocket/socket';

// Load environment variables
dotenv.config();

// Log environment info
console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
console.log('🔧 Port:', process.env.PORT || 3001);
console.log('🔧 CORS Origin:', process.env.CORS_ORIGIN || 'http://localhost:3000');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Serve static frontend
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoints
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: process.memoryUsage(),
    pid: process.pid
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: process.memoryUsage(),
    pid: process.pid
  });
});

// Readiness check endpoint
app.get('/api/ready', (_req, res) => {
  res.json({ 
    status: 'ready',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bets', authenticateToken, betRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);

// Fallback to index.html for SPA
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// WebSocket setup
setupWebSocket(io);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database and Redis connection
async function startServer() {
  let dbConnected = false;
  let redisConnected = false;

  try {
    // Connect to database
    try {
      await connectDatabase();
      console.log('✅ Database connected successfully');
      dbConnected = true;
    } catch (error) {
      console.error('⚠️ Database connection failed:', error);
      console.log('🔄 Server will start without database connection');
    }

    // Connect to Redis
    try {
      await connectRedis();
      console.log('✅ Redis connected successfully');
      redisConnected = true;
    } catch (error) {
      console.error('⚠️ Redis connection failed:', error);
      console.log('🔄 Server will start without Redis connection');
    }

    // Start server even if database or Redis fail
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`📊 Database: ${dbConnected ? '✅ Connected' : '❌ Disconnected'}`);
      console.log(`📊 Redis: ${redisConnected ? '✅ Connected' : '❌ Disconnected'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

startServer(); 