// User related types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  balance: number;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  balance: number;
  totalBets: number;
  totalWinnings: number;
  winRate: number;
}

// Event related types
export interface Event {
  id: string;
  title: string;
  description: string;
  sport: Sport;
  startTime: Date;
  endTime: Date;
  status: EventStatus;
  odds: Odds;
  result?: EventResult;
  createdAt: Date;
  updatedAt: Date;
}

export type Sport = 'football' | 'basketball' | 'tennis' | 'baseball' | 'hockey' | 'soccer' | 'cricket';

export type EventStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

export interface Odds {
  home: number;
  away: number;
  draw?: number;
  lastUpdated: Date;
}

export interface EventResult {
  homeScore: number;
  awayScore: number;
  winner: 'home' | 'away' | 'draw';
  completedAt: Date;
}

// Bet related types
export interface Bet {
  id: string;
  userId: string;
  eventId: string;
  amount: number;
  odds: number;
  prediction: BetPrediction;
  status: BetStatus;
  potentialWinnings: number;
  actualWinnings?: number;
  placedAt: Date;
  settledAt?: Date;
}

export type BetPrediction = 'home' | 'away' | 'draw';

export type BetStatus = 'pending' | 'won' | 'lost' | 'cancelled';

// Transaction related types
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: Date;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'bet' | 'win' | 'refund';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// WebSocket event types
export interface WebSocketEvent {
  type: string;
  payload: any;
  timestamp: Date;
}

export interface OddsUpdateEvent {
  eventId: string;
  odds: Odds;
}

export interface EventStatusUpdateEvent {
  eventId: string;
  status: EventStatus;
  result?: EventResult;
}

export interface BalanceUpdateEvent {
  userId: string;
  newBalance: number;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}

// Filter and search types
export interface EventFilters {
  sport?: Sport;
  status?: EventStatus;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface BetFilters {
  status?: BetStatus;
  startDate?: Date;
  endDate?: Date;
  eventId?: string;
}

// Admin types
export interface CreateEventRequest {
  title: string;
  description: string;
  sport: Sport;
  startTime: Date;
  endTime: Date;
  initialOdds: Odds;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  odds?: Odds;
  status?: EventStatus;
  result?: EventResult;
}

// Statistics types
export interface UserStats {
  totalBets: number;
  totalWinnings: number;
  totalLosses: number;
  winRate: number;
  averageBetAmount: number;
  largestWin: number;
  largestLoss: number;
}

export interface PlatformStats {
  totalUsers: number;
  totalEvents: number;
  totalBets: number;
  totalVolume: number;
  activeEvents: number;
} 