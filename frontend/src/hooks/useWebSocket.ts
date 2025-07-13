import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';
import { API_CONFIG } from '@/config/api';

interface UseWebSocketOptions {
  onOddsUpdate?: (data: any) => void;
  onEventStatusUpdate?: (data: any) => void;
  onBalanceUpdate?: (data: any) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const { user, isAuthenticated } = useAuthStore();

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io(API_CONFIG.WS_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
      
      // Join user room if authenticated
      if (isAuthenticated && user?.id) {
        socket.emit('join-user', user.id);
      }
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('odds_update', (data) => {
      console.log('Odds update received:', data);
      options.onOddsUpdate?.(data);
    });

    socket.on('event_status_update', (data) => {
      console.log('Event status update received:', data);
      options.onEventStatusUpdate?.(data);
    });

    socket.on('balance_update', (data) => {
      console.log('Balance update received:', data);
      options.onBalanceUpdate?.(data);
    });

    socketRef.current = socket;
  }, [isAuthenticated, user?.id, options]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const joinEvent = useCallback((eventId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join-event', eventId);
    }
  }, []);

  const leaveEvent = useCallback((eventId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave-event', eventId);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useEffect(() => {
    if (socketRef.current?.connected && isAuthenticated && user?.id) {
      socketRef.current.emit('join-user', user.id);
    }
  }, [isAuthenticated, user?.id]);

  return {
    socket: socketRef.current,
    connect,
    disconnect,
    joinEvent,
    leaveEvent,
    isConnected: socketRef.current?.connected || false,
  };
}; 