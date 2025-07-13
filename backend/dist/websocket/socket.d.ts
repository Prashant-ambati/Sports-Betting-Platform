import { Server } from 'socket.io';
export declare const setupWebSocket: (io: Server) => void;
export declare const emitOddsUpdate: (eventId: string, odds: any) => void;
export declare const emitEventStatusUpdate: (eventId: string, status: string, result?: any) => void;
export declare const emitBalanceUpdate: (userId: string, newBalance: number) => void;
//# sourceMappingURL=socket.d.ts.map