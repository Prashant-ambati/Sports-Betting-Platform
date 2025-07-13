"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const events_1 = __importDefault(require("./routes/events"));
const bets_1 = __importDefault(require("./routes/bets"));
const users_1 = __importDefault(require("./routes/users"));
const admin_1 = __importDefault(require("./routes/admin"));
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const auth_2 = require("./middleware/auth");
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const socket_1 = require("./websocket/socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 3001;
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
}));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(limiter);
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/events', events_1.default);
app.use('/api/bets', auth_2.authenticateToken, bets_1.default);
app.use('/api/users', auth_2.authenticateToken, users_1.default);
app.use('/api/admin', auth_2.authenticateToken, admin_1.default);
app.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public', 'index.html'));
});
(0, socket_1.setupWebSocket)(io);
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
async function startServer() {
    try {
        await (0, database_1.connectDatabase)();
        console.log('✅ Database connected successfully');
        await (0, redis_1.connectRedis)();
        console.log('✅ Redis connected successfully');
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
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
//# sourceMappingURL=index.js.map