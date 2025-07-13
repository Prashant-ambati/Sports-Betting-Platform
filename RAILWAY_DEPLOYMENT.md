# Railway Deployment Guide

## 🚀 Overview

This guide will help you deploy your Sports Betting Platform on Railway with both backend and frontend services.

## 📋 Prerequisites

- Railway account connected to GitHub
- PostgreSQL and Redis services created on Railway
- Environment variables ready

## 🔧 Backend Deployment

### Step 1: Create Backend Service

1. Go to Railway Dashboard
2. Click "New Service" → "GitHub Repo"
3. Select your `Sports-Betting-Platform` repository
4. **IMPORTANT**: Set **Root Directory** to `backend`
5. Click "Deploy"

### Step 2: Add Environment Variables

Go to your backend service → "Variables" tab and add:

```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=318a9c7c27ca86e4788165df692f9cf68e016bcac1e72d60b931ac235f940dabae8974e19b9c420145c832c4b69267e851799f05506c3d9e73d3826faa12cab2
CORS_ORIGIN=*
```

### Step 3: Connect Database

1. Go to your backend service
2. Click "Variables" tab
3. Add `DATABASE_URL` (Railway will provide this from your PostgreSQL service)
4. Add `REDIS_URL` (Railway will provide this from your Redis service)

## 🌐 Frontend Deployment

### Step 1: Create Frontend Service

1. Go to Railway Dashboard
2. Click "New Service" → "GitHub Repo"
3. Select your `Sports-Betting-Platform` repository
4. **IMPORTANT**: Set **Root Directory** to `frontend`
5. Click "Deploy"

### Step 2: Add Environment Variables

Go to your frontend service → "Variables" tab and add:

```bash
VITE_API_URL=https://your-backend-url.railway.app
VITE_WS_URL=wss://your-backend-url.railway.app
```

**Replace** `your-backend-url.railway.app` with your actual backend URL.

## 🗄️ Database Setup

### PostgreSQL Service

1. Click "New Service" → "Database" → "PostgreSQL"
2. Name: `sports-betting-db`
3. Railway will automatically connect it to your backend

### Redis Service

1. Click "New Service" → "Database" → "Redis"
2. Name: `sports-betting-redis`
3. Railway will automatically connect it to your backend

## 🔗 Service URLs

After deployment, you'll get URLs like:

- **Backend**: `https://sports-betting-backend-production-1234.up.railway.app`
- **Frontend**: `https://sports-betting-frontend-production-5678.up.railway.app`
- **Database**: Automatically connected
- **Redis**: Automatically connected

## ⚙️ Configuration Files

### Backend Configuration

- `backend/railway.json` - Railway service configuration
- `backend/nixpacks.toml` - Build configuration
- `backend/build.sh` - Build script
- `backend/.railwayignore` - Files to exclude

### Frontend Configuration

- `frontend/railway.json` - Railway service configuration
- `frontend/nixpacks.toml` - Build configuration
- `frontend/vite.config.ts` - Vite configuration

## 🔍 Troubleshooting

### Build Issues

1. **TypeScript not found**: Ensure `typescript` is in dependencies
2. **Root directory issues**: Make sure Root Directory is set correctly
3. **Environment variables**: Check all required variables are set

### Connection Issues

1. **CORS errors**: Update `CORS_ORIGIN` with frontend URL
2. **Database connection**: Check `DATABASE_URL` is set correctly
3. **Redis connection**: Check `REDIS_URL` is set correctly

### Common Errors

- **Exit code 127**: Command not found - check Root Directory
- **Build fails**: Check TypeScript configuration
- **API calls fail**: Verify environment variables

## 📊 Monitoring

- Check Railway dashboard for deployment status
- Monitor logs for any errors
- Verify environment variables are set correctly
- Test API endpoints after deployment

## 🎯 Success Checklist

- [ ] Backend service deployed successfully
- [ ] Frontend service deployed successfully
- [ ] Database connected to backend
- [ ] Redis connected to backend
- [ ] Environment variables set correctly
- [ ] API endpoints responding
- [ ] Frontend can connect to backend
- [ ] WebSocket connection working

## 🔄 Updates

To update your deployment:

1. Push changes to GitHub
2. Railway will automatically redeploy
3. Check deployment logs for any issues
4. Test the application after deployment

## 📞 Support

If you encounter issues:

1. Check Railway deployment logs
2. Verify all environment variables
3. Ensure Root Directory is set correctly
4. Check service connections 