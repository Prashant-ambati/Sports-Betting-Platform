"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitBalanceUpdate = exports.emitEventStatusUpdate = exports.emitOddsUpdate = exports.setupWebSocket = void 0;
let ioInstance;
const setupWebSocket = (io) => {
    ioInstance = io;
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        socket.on('join-user', (userId) => {
            socket.join(`user-${userId}`);
            console.log(`User ${userId} joined their room`);
        });
        socket.on('join-event', (eventId) => {
            socket.join(`event-${eventId}`);
            console.log(`Client joined event room: ${eventId}`);
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
exports.setupWebSocket = setupWebSocket;
const emitOddsUpdate = (eventId, odds) => {
    if (ioInstance) {
        ioInstance.to(`event-${eventId}`).emit('odds_update', {
            eventId,
            odds,
            timestamp: new Date()
        });
    }
};
exports.emitOddsUpdate = emitOddsUpdate;
const emitEventStatusUpdate = (eventId, status, result) => {
    if (ioInstance) {
        ioInstance.to(`event-${eventId}`).emit('event_status_update', {
            eventId,
            status,
            result,
            timestamp: new Date()
        });
    }
};
exports.emitEventStatusUpdate = emitEventStatusUpdate;
const emitBalanceUpdate = (userId, newBalance) => {
    if (ioInstance) {
        ioInstance.to(`user-${userId}`).emit('balance_update', {
            userId,
            newBalance,
            timestamp: new Date()
        });
    }
};
exports.emitBalanceUpdate = emitBalanceUpdate;
//# sourceMappingURL=socket.js.map