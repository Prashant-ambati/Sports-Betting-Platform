# Sports Betting Platform

A comprehensive, end-to-end digital platform for virtual sports betting with real-time odds, secure betting mechanisms, and user account management.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Real-time**: WebSocket (Socket.io)
- **Authentication**: JWT
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Documentation**: Swagger/OpenAPI

### System Components

1. **User Management System**
   - Registration/Login with JWT authentication
   - User profiles and betting history
   - Account balance management

2. **Event Management**
   - Dynamic sports events creation
   - Real-time odds calculation
   - Event status tracking (upcoming, live, completed)

3. **Betting Engine**
   - Secure bet placement
   - Odds calculation and updates
   - Bet validation and processing

4. **Real-time Updates**
   - Live odds updates
   - Event status changes
   - User balance updates

5. **Admin Dashboard**
   - Event management
   - User management
   - System monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker (optional)

### Development Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository>
   cd sports-betting-platform
   npm install
   ```

2. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb sports_betting_db
   
   # Run migrations
   npm run db:migrate
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start Development Servers**
   ```bash
   # Start backend
   npm run dev:backend
   
   # Start frontend (in new terminal)
   npm run dev:frontend
   ```

### Production Deployment

```bash
# Build and run with Docker
docker-compose up --build
```

## 📁 Project Structure

```
sports-betting-platform/
├── frontend/                 # React frontend application
├── backend/                  # Node.js/Express API server
├── shared/                   # Shared types and utilities
├── docker-compose.yml        # Docker orchestration
├── package.json              # Root package.json
└── README.md                # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin only)

### Bets
- `POST /api/bets` - Place a bet
- `GET /api/bets` - Get user bets
- `GET /api/bets/:id` - Get bet details

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/balance` - Get user balance

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- SQL injection prevention

## 📊 Database Schema

### Core Tables
- `users` - User accounts and profiles
- `events` - Sports events and matches
- `bets` - User bet records
- `odds` - Event odds history
- `transactions` - Balance transactions

## 🎯 Key Features

- ✅ Real-time odds updates
- ✅ Secure bet placement
- ✅ User account management
- ✅ Live event tracking
- ✅ Responsive design
- ✅ Admin dashboard
- ✅ Transaction history
- ✅ Balance management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 