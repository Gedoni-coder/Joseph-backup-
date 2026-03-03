# Joseph-AI-Code2-main
>>>>>>> 20f7f643cfc660598e88785d6bcc343c437bf194
=======
# Joseph-AI-Code2-main

This project has been configured to use environment variables for API endpoints instead of hardcoding localhost URLs. This makes it production-ready and deployable.

## Changes Made

### 1. Environment Variable Configuration
- ✅ Created `.env.example` with all required environment variables
- ✅ Updated `useEconomicData.ts` to use environment variables
- ✅ Updated `useEconomicData_backup.ts` to use environment variables
- ✅ Created `.env` file for local development

### 2. Backend Production Setup
- ✅ Created `Dockerfile` for Django backend
- ✅ Created `Dockerfile.frontend` for React frontend
- ✅ Created `docker-compose.yml` for easy deployment
- ✅ Updated Django settings to support environment variables
- ✅ Enhanced CORS settings for production

## Environment Variables

### Frontend Variables (Vite)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_ECONOMIC_API_ENDPOINT=/api/economic
VITE_DEV_MODE=true
```

### Backend Variables (Django)
```env
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
GEMINI_API_KEY=your-gemini-api-key-here
```

## Deployment Options

### Option 1: Docker Compose (Recommended)
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your production values
# Update VITE_API_BASE_URL to your production backend URL
# Update DJANGO_SECRET_KEY to a secure random key
# Set DEBUG=False for production

# Start all services
docker-compose up -d

# Or build and start
docker-compose up --build
```

### Option 2: Manual Deployment

#### Backend Deployment
1. Copy `.env.example` to `.env` in your backend directory
2. Update the environment variables for production
3. Install dependencies: `pip install -r requirements.txt`
4. Run migrations: `python manage.py migrate`
5. Collect static files: `python manage.py collectstatic`
6. Start server: `python manage.py runserver 0.0.0.0:8000`

#### Frontend Deployment
1. Copy `.env.example` to `.env` in your frontend directory
2. Update `VITE_API_BASE_URL` to your production backend URL
3. Build: `npm run build`
4. Serve the `dist` folder with your web server

## Production Configuration

### For Production Deployment:
1. **Change DEBUG to False** in your environment variables
2. **Update ALLOWED_HOSTS** to include your production domain
3. **Set a secure DJANGO_SECRET_KEY**
4. **Update CORS settings** in Django settings for your domain
5. **Configure your production database** (PostgreSQL recommended)

### Example Production .env
```env
# Frontend
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ECONOMIC_API_ENDPOINT=/api/economic
VITE_DEV_MODE=false

# Backend
DJANGO_SECRET_KEY=your-secure-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,api.yourdomain.com
GEMINI_API_KEY=your-production-gemini-key
```

## API Endpoints

The economic data API endpoints are available at:
- `GET /api/economic/metrics/` - Economic metrics
- `GET /api/economic/news/` - Economic news
- `GET /api/economic/forecasts/` - Economic forecasts
- `GET /api/economic/events/` - Economic events

## Testing the Configuration

1. **Local Development:**
   ```bash
   # Start backend
   cd backend && python manage.py runserver

   # In another terminal, start frontend
   npm run dev
   ```

2. **With Docker:**
   ```bash
   docker-compose up --build
   ```

3. **Verify API calls:**
   - Frontend should now use environment variables instead of hardcoded localhost
   - Backend should accept requests from the configured origins
   - All economic data endpoints should work with the new configuration

## Troubleshooting

### Common Issues:
1. **API calls failing**: Check that `VITE_API_BASE_URL` is set correctly
2. **CORS errors**: Ensure your frontend URL is in `CORS_ALLOWED_ORIGINS`
3. **Environment variables not loading**: Make sure `.env` file exists and is in the correct directory

### Debug Mode:
- Set `VITE_DEV_MODE=true` for development logging
- Set `DEBUG=True` in backend for detailed error messages
- Check browser console and backend logs for issues

## Security Notes

- Never commit `.env` files to version control
- Use strong, random secret keys in production
- Configure proper CORS settings for production domains
- Use HTTPS in production environments
- Consider using environment-specific settings files for different deployment stages
=======
# Joseph-AI-Code2-main
>>>>>>> 20f7f643cfc660598e88785d6bcc343c437bf194
