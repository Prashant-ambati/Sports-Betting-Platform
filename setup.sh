#!/bin/bash

# Sports Betting Platform Setup Script
# This script sets up the entire development environment

set -e

echo "🚀 Setting up Sports Betting Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js version: $(node -v)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    print_success "npm version: $(npm -v)"
    
    # Check Docker (optional)
    if command -v docker &> /dev/null; then
        print_success "Docker is available"
    else
        print_warning "Docker is not installed. You can still run the application locally."
    fi
    
    # Check PostgreSQL
    if command -v psql &> /dev/null; then
        print_success "PostgreSQL is available"
    else
        print_warning "PostgreSQL is not installed. You'll need to install it or use Docker."
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    print_success "All dependencies installed successfully"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if PostgreSQL is running
    if command -v pg_isready &> /dev/null; then
        if pg_isready -q; then
            print_success "PostgreSQL is running"
        else
            print_warning "PostgreSQL is not running. Please start it manually."
            return
        fi
    fi
    
    # Create database if it doesn't exist
    if command -v createdb &> /dev/null; then
        if createdb sports_betting_db 2>/dev/null; then
            print_success "Database 'sports_betting_db' created"
        else
            print_warning "Database 'sports_betting_db' already exists or could not be created"
        fi
    fi
    
    # Run migrations
    print_status "Running database migrations..."
    cd backend
    npm run db:migrate
    cd ..
    
    print_success "Database setup completed"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f backend/.env ]; then
        cp backend/env.example backend/.env
        print_success "Created backend/.env from template"
    else
        print_warning "backend/.env already exists"
    fi
    
    # Frontend environment
    if [ ! -f frontend/.env ]; then
        cat > frontend/.env << EOF
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
EOF
        print_success "Created frontend/.env"
    else
        print_warning "frontend/.env already exists"
    fi
}

# Build the application
build_application() {
    print_status "Building application..."
    
    # Build backend
    print_status "Building backend..."
    cd backend
    npm run build
    cd ..
    
    # Build frontend
    print_status "Building frontend..."
    cd frontend
    npm run build
    cd ..
    
    print_success "Application built successfully"
}

# Start development servers
start_development() {
    print_status "Starting development servers..."
    
    # Start both frontend and backend
    npm run dev &
    
    print_success "Development servers started"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend API: http://localhost:3001"
    print_status "Health check: http://localhost:3001/health"
}

# Docker setup
setup_docker() {
    if ! command -v docker &> /dev/null; then
        print_warning "Docker not available, skipping Docker setup"
        return
    fi
    
    print_status "Setting up Docker environment..."
    
    # Build Docker images
    docker-compose build
    
    print_success "Docker images built successfully"
    print_status "To start with Docker: docker-compose up"
}

# Main setup function
main() {
    echo "🏈 Sports Betting Platform Setup"
    echo "================================"
    
    check_requirements
    install_dependencies
    setup_environment
    setup_database
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start development servers: npm run dev"
    echo "2. Or use Docker: docker-compose up"
    echo "3. Open http://localhost:3000 in your browser"
    echo ""
    echo "Default admin credentials:"
    echo "Email: admin@sportsbetting.com"
    echo "Password: admin123"
    echo ""
    echo "For more information, see README.md"
}

# Run main function
main "$@" 