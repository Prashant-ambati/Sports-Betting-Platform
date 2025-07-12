# Sports Betting Platform - Deployment Guide

This guide covers deploying the Sports Betting Platform to various environments.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker (optional)

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd sports-betting-platform

# Run the setup script
./setup.sh

# Start development servers
npm run dev
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Clone and setup:**
```bash
git clone <repository-url>
cd sports-betting-platform
```

2. **Create environment files:**
```bash
cp backend/env.example backend/.env
# Edit backend/.env with your production values
```

3. **Build and run:**
```bash
docker-compose up --build
```

4. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/health

### Production Docker Setup

1. **Create production environment file:**
```bash
# backend/.env.production
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://yourdomain.com
DATABASE_URL=postgresql://user:password@host:5432/dbname
REDIS_URL=redis://host:6379
JWT_SECRET=your-super-secret-production-jwt-key
```

2. **Build production images:**
```bash
docker-compose -f docker-compose.prod.yml build
```

3. **Run production stack:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## ☁️ Cloud Deployment

### AWS Deployment

#### Using AWS ECS with Fargate

1. **Create ECR repositories:**
```bash
aws ecr create-repository --repository-name sports-betting-backend
aws ecr create-repository --repository-name sports-betting-frontend
```

2. **Build and push images:**
```bash
# Backend
docker build -t sports-betting-backend ./backend
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag sports-betting-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/sports-betting-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/sports-betting-backend:latest

# Frontend
docker build -t sports-betting-frontend ./frontend
docker tag sports-betting-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/sports-betting-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/sports-betting-frontend:latest
```

3. **Create ECS cluster and services:**
```bash
# Create cluster
aws ecs create-cluster --cluster-name sports-betting-cluster

# Create task definitions and services
# (Use AWS Console or CloudFormation for this step)
```

#### Using AWS Elastic Beanstalk

1. **Create EB application:**
```bash
eb init sports-betting-platform --platform node.js --region us-east-1
```

2. **Configure environment:**
```bash
eb create sports-betting-prod --envvars NODE_ENV=production
```

3. **Deploy:**
```bash
eb deploy
```

### Google Cloud Platform

#### Using Google Cloud Run

1. **Enable APIs:**
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

2. **Build and deploy:**
```bash
# Backend
gcloud builds submit --tag gcr.io/PROJECT_ID/sports-betting-backend ./backend
gcloud run deploy sports-betting-backend --image gcr.io/PROJECT_ID/sports-betting-backend --platform managed

# Frontend
gcloud builds submit --tag gcr.io/PROJECT_ID/sports-betting-frontend ./frontend
gcloud run deploy sports-betting-frontend --image gcr.io/PROJECT_ID/sports-betting-frontend --platform managed
```

### Azure Deployment

#### Using Azure Container Instances

1. **Build and push to Azure Container Registry:**
```bash
az acr build --registry myregistry --image sports-betting-backend ./backend
az acr build --registry myregistry --image sports-betting-frontend ./frontend
```

2. **Deploy containers:**
```bash
az container create --resource-group myResourceGroup --name sports-betting-backend --image myregistry.azurecr.io/sports-betting-backend:latest --ports 3001
az container create --resource-group myResourceGroup --name sports-betting-frontend --image myregistry.azurecr.io/sports-betting-frontend:latest --ports 80
```

## 🗄️ Database Setup

### PostgreSQL Setup

#### Local PostgreSQL
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb sports_betting_db

# Create user
sudo -u postgres createuser --interactive

# Run migrations
npm run db:migrate
```

#### AWS RDS
1. **Create RDS instance:**
```bash
aws rds create-db-instance \
  --db-instance-identifier sports-betting-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password <password> \
  --allocated-storage 20
```

2. **Update environment variables:**
```bash
DATABASE_URL=postgresql://admin:<password>@<endpoint>:5432/sports_betting_db
```

#### Google Cloud SQL
1. **Create Cloud SQL instance:**
```bash
gcloud sql instances create sports-betting-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1
```

2. **Create database:**
```bash
gcloud sql databases create sports_betting_db --instance=sports-betting-db
```

### Redis Setup

#### Local Redis
```bash
# Install Redis
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server
```

#### AWS ElastiCache
1. **Create ElastiCache cluster:**
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id sports-betting-redis \
  --engine redis \
  --cache-node-type cache.t3.micro \
  --num-cache-nodes 1
```

2. **Update environment variables:**
```bash
REDIS_URL=redis://<endpoint>:6379
```

## 🔒 Security Configuration

### SSL/TLS Setup

#### Using Let's Encrypt
```bash
# Install Certbot
sudo apt-get install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure nginx
sudo cp nginx-ssl.conf /etc/nginx/sites-available/sports-betting
sudo ln -s /etc/nginx/sites-available/sports-betting /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Using Cloudflare
1. **Add domain to Cloudflare**
2. **Update nameservers**
3. **Enable SSL/TLS encryption mode: Full**

### Environment Variables

#### Production Environment
```bash
# Backend (.env)
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://yourdomain.com
DATABASE_URL=postgresql://user:password@host:5432/dbname
REDIS_URL=redis://host:6379
JWT_SECRET=your-super-secret-production-jwt-key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend (.env)
VITE_API_URL=https://api.yourdomain.com/api
VITE_WS_URL=wss://api.yourdomain.com
```

## 📊 Monitoring and Logging

### Application Monitoring

#### Using PM2
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Setup PM2 startup script
pm2 startup
pm2 save
```

#### Using Docker with monitoring
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### Logging

#### Using Winston
```javascript
// backend/src/config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to AWS
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /opt/sports-betting-platform
            git pull origin main
            docker-compose -f docker-compose.prod.yml up -d --build
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t sports-betting-backend ./backend
    - docker build -t sports-betting-frontend ./frontend

deploy:
  stage: deploy
  script:
    - docker-compose -f docker-compose.prod.yml up -d
```

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U postgres -d sports_betting_db

# Reset database
npm run db:reset
```

#### Redis Connection Issues
```bash
# Check Redis status
sudo systemctl status redis-server

# Test Redis connection
redis-cli ping

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log
```

#### Docker Issues
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart
```

#### Performance Issues
```bash
# Check system resources
htop
df -h
free -h

# Check application logs
docker-compose logs --tail=100 backend
```

## 📈 Scaling

### Horizontal Scaling

#### Load Balancer Setup
```nginx
# nginx.conf
upstream backend {
    server backend1:3001;
    server backend2:3001;
    server backend3:3001;
}

server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Database Scaling
```bash
# Read replicas
aws rds create-db-instance-read-replica \
  --db-instance-identifier sports-betting-db-read-1 \
  --source-db-instance-identifier sports-betting-db
```

### Vertical Scaling

#### Increase Resources
```bash
# Update ECS task definition
aws ecs register-task-definition \
  --family sports-betting-backend \
  --cpu 1024 \
  --memory 2048
```

## 🔧 Maintenance

### Backup Strategy
```bash
# Database backup
pg_dump sports_betting_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backup script
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump sports_betting_db > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

### Update Strategy
```bash
# Zero-downtime deployment
docker-compose -f docker-compose.prod.yml up -d --no-deps --build backend
docker-compose -f docker-compose.prod.yml up -d --no-deps --build frontend
```

## 📞 Support

For deployment issues:
1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Test database connectivity
4. Check network connectivity
5. Review security group settings

For more help, refer to the troubleshooting section or create an issue in the repository. 