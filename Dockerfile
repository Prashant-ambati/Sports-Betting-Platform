FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install
RUN cd backend && npm install --include=dev
RUN cd frontend && npm install

# Copy source code
COPY . .

# Build frontend and backend
RUN npm run build

# Create startup script
RUN echo '#!/bin/sh\ncd backend && npm run migrate && npm start' > /app/start.sh && chmod +x /app/start.sh

# Expose port
EXPOSE 3001

# Start the application with migration
CMD ["/app/start.sh"] 