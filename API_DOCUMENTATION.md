# Sports Betting Platform API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://api.sportsbetting.com/api`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

## Error Responses
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ] // Validation errors
}
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "username",
      "firstName": "John",
      "lastName": "Doe",
      "balance": 1000.00,
      "role": "user",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt-token"
  },
  "message": "User registered successfully"
}
```

### Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt-token"
  },
  "message": "Login successful"
}
```

### Get Current User
**GET** `/auth/me`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "balance": 1000.00,
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Events Endpoints

### Get All Events
**GET** `/events`

**Query Parameters:**
- `sport` (optional): Filter by sport
- `status` (optional): Filter by status (upcoming, live, completed, cancelled)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in title and description

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Manchester United vs Liverpool",
      "description": "Premier League match",
      "sport": "football",
      "startTime": "2024-01-01T20:00:00Z",
      "endTime": "2024-01-01T22:00:00Z",
      "status": "upcoming",
      "odds": {
        "home": 2.50,
        "away": 1.80,
        "draw": 3.20,
        "lastUpdated": "2024-01-01T19:00:00Z"
      },
      "result": null,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Get Event by ID
**GET** `/events/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Manchester United vs Liverpool",
    "description": "Premier League match",
    "sport": "football",
    "startTime": "2024-01-01T20:00:00Z",
    "endTime": "2024-01-01T22:00:00Z",
    "status": "live",
    "odds": {
      "home": 2.50,
      "away": 1.80,
      "draw": 3.20,
      "lastUpdated": "2024-01-01T19:00:00Z"
    },
    "result": {
      "homeScore": 2,
      "awayScore": 1,
      "winner": "home",
      "completedAt": "2024-01-01T22:00:00Z"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Bets Endpoints

### Place Bet
**POST** `/bets`

**Request Body:**
```json
{
  "eventId": "uuid",
  "amount": 50.00,
  "prediction": "home"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "eventId": "uuid",
    "amount": 50.00,
    "odds": 2.50,
    "prediction": "home",
    "status": "pending",
    "potentialWinnings": 125.00,
    "actualWinnings": null,
    "placedAt": "2024-01-01T19:30:00Z",
    "settledAt": null,
    "createdAt": "2024-01-01T19:30:00Z",
    "updatedAt": "2024-01-01T19:30:00Z"
  },
  "message": "Bet placed successfully"
}
```

### Get User Bets
**GET** `/bets`

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "eventId": "uuid",
      "eventTitle": "Manchester United vs Liverpool",
      "amount": 50.00,
      "odds": 2.50,
      "prediction": "home",
      "status": "won",
      "potentialWinnings": 125.00,
      "actualWinnings": 125.00,
      "placedAt": "2024-01-01T19:30:00Z",
      "settledAt": "2024-01-01T22:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Get Bet by ID
**GET** `/bets/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "eventId": "uuid",
    "eventTitle": "Manchester United vs Liverpool",
    "amount": 50.00,
    "odds": 2.50,
    "prediction": "home",
    "status": "won",
    "potentialWinnings": 125.00,
    "actualWinnings": 125.00,
    "placedAt": "2024-01-01T19:30:00Z",
    "settledAt": "2024-01-01T22:00:00Z"
  }
}
```

---

## Users Endpoints

### Get User Profile
**GET** `/users/profile`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "balance": 1000.00,
    "totalBets": 25,
    "totalWinnings": 500.00,
    "winRate": 0.60
  }
}
```

### Update User Profile
**PUT** `/users/profile`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "newemail@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "newemail@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Smith",
    "balance": 1000.00,
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T20:00:00Z"
  },
  "message": "Profile updated successfully"
}
```

### Get User Balance
**GET** `/users/balance`

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 1000.00,
    "currency": "USD"
  }
}
```

---

## Admin Endpoints

### Create Event (Admin Only)
**POST** `/admin/events`

**Request Body:**
```json
{
  "title": "Manchester United vs Liverpool",
  "description": "Premier League match",
  "sport": "football",
  "startTime": "2024-01-01T20:00:00Z",
  "endTime": "2024-01-01T22:00:00Z",
  "initialOdds": {
    "home": 2.50,
    "away": 1.80,
    "draw": 3.20
  }
}
```

### Update Event (Admin Only)
**PUT** `/admin/events/:id`

**Request Body:**
```json
{
  "title": "Updated Title",
  "odds": {
    "home": 2.00,
    "away": 2.20,
    "draw": 3.50
  },
  "status": "live"
}
```

### Get Platform Statistics (Admin Only)
**GET** `/admin/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1000,
    "totalEvents": 150,
    "totalBets": 5000,
    "totalVolume": 250000.00,
    "activeEvents": 25,
    "recentActivity": [
      {
        "type": "bet_placed",
        "userId": "uuid",
        "amount": 50.00,
        "timestamp": "2024-01-01T19:30:00Z"
      }
    ]
  }
}
```

---

## WebSocket Events

### Connection
Connect to WebSocket at `ws://localhost:3001` (or your server URL)

### Events

#### Odds Update
```json
{
  "type": "odds_update",
  "payload": {
    "eventId": "uuid",
    "odds": {
      "home": 2.00,
      "away": 2.20,
      "draw": 3.50,
      "lastUpdated": "2024-01-01T19:30:00Z"
    }
  },
  "timestamp": "2024-01-01T19:30:00Z"
}
```

#### Event Status Update
```json
{
  "type": "event_status_update",
  "payload": {
    "eventId": "uuid",
    "status": "live",
    "result": {
      "homeScore": 1,
      "awayScore": 0,
      "winner": "home",
      "completedAt": "2024-01-01T22:00:00Z"
    }
  },
  "timestamp": "2024-01-01T22:00:00Z"
}
```

#### Balance Update
```json
{
  "type": "balance_update",
  "payload": {
    "userId": "uuid",
    "newBalance": 1125.00
  },
  "timestamp": "2024-01-01T22:00:00Z"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation errors |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 10 requests per 15 minutes
- **Bet placement**: 20 requests per 15 minutes

---

## Pagination

All list endpoints support pagination with these query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
``` 