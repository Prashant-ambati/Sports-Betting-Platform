import { Server } from 'socket.io';


let ioInstance: Server;

export const setupWebSocket = (io: Server): void => {
  ioInstance = io;
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join user to their personal room
    socket.on('join-user', (userId: string) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join event room for real-time updates
    socket.on('join-event', (eventId: string) => {
      socket.join(`event-${eventId}`);
      console.log(`Client joined event room: ${eventId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

// Emit odds update to event room
export const emitOddsUpdate = (eventId: string, odds: any) => {
  if (ioInstance) {
    ioInstance.to(`event-${eventId}`).emit('odds_update', {
      eventId,
      odds,
      timestamp: new Date()
    });
  }
};

// Emit event status update
export const emitEventStatusUpdate = (eventId: string, status: string, result?: any) => {
  if (ioInstance) {
    ioInstance.to(`event-${eventId}`).emit('event_status_update', {
      eventId,
      status,
      result,
      timestamp: new Date()
    });
  }
};

// Emit balance update to user
export const emitBalanceUpdate = (userId: string, newBalance: number) => {
  if (ioInstance) {
    ioInstance.to(`user-${userId}`).emit('balance_update', {
      userId,
      newBalance,
      timestamp: new Date()
    });
  }
}; 