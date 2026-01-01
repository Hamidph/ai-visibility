# Echo AI - Local Setup Guide for Mac

This guide will help you clone and run Echo AI on your local Mac computer.

## Prerequisites

You need to install these tools on your Mac:

### 1. Homebrew (Package Manager)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Python 3.11+ with uv
```bash
# Install uv (fast Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Verify installation
uv --version
python3 --version  # Should be 3.11 or higher
```

### 3. Node.js 18+ and npm
```bash
# Install Node.js using Homebrew
brew install node@22

# Verify installation
node --version   # Should be v18+ or higher
npm --version
```

### 4. PostgreSQL 15+
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb ai_visibility_dev

# Verify it's running
psql -d ai_visibility_dev -c "SELECT version();"
```

### 5. Redis
```bash
# Install Redis
brew install redis

# Start Redis service
brew services start redis

# Verify it's running
redis-cli ping  # Should return "PONG"
```

### 6. Git
```bash
# Install Git (if not already installed)
brew install git

# Verify installation
git --version
```

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Hamidph/ai-visibility.git
cd ai-visibility

# Checkout the production-ready branch
git checkout claude/analyze-codebase-A9hr5
```

## Step 2: Configure Environment Variables

### Backend Configuration

1. Copy the example environment file:
```bash
cp .env .env.local
```

2. Edit `.env` and add your API keys:
```bash
# Open in your preferred editor
nano .env
# or
code .env
# or
open -e .env
```

3. **IMPORTANT: Add at least ONE LLM provider API key:**

```bash
# OpenAI (recommended - get from https://platform.openai.com/api-keys)
OPENAI_API_KEY="sk-proj-your-actual-key-here"

# OR Anthropic (get from https://console.anthropic.com/settings/keys)
ANTHROPIC_API_KEY="sk-ant-your-actual-key-here"

# OR Perplexity (get from https://www.perplexity.ai/settings/api)
PERPLEXITY_API_KEY="pplx-your-actual-key-here"
```

**How to get API keys:**

- **OpenAI**:
  1. Go to https://platform.openai.com/api-keys
  2. Click "Create new secret key"
  3. Copy the key (starts with `sk-proj-...`)

- **Anthropic**:
  1. Go to https://console.anthropic.com/settings/keys
  2. Click "Create Key"
  3. Copy the key (starts with `sk-ant-...`)

- **Perplexity**:
  1. Go to https://www.perplexity.ai/settings/api
  2. Generate API key
  3. Copy the key (starts with `pplx-...`)

4. **Generate a secure SECRET_KEY:**
```bash
# Generate a random secret key
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Copy the output and add it to .env:
SECRET_KEY="paste-your-generated-key-here"
```

5. **Update database connection (if needed):**
```bash
# Default PostgreSQL connection (should work if you followed setup)
DATABASE_URL="postgresql+asyncpg://localhost/ai_visibility_dev"

# If you set a password during PostgreSQL setup:
# DATABASE_URL="postgresql+asyncpg://username:password@localhost/ai_visibility_dev"
```

### Frontend Configuration

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Create `.env.local`:
```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME="Echo AI"
EOF
```

3. Return to root:
```bash
cd ..
```

## Step 3: Install Dependencies

### Backend Dependencies

```bash
# Install Python dependencies using uv
uv sync

# Verify installation
uv pip list
```

### Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Return to root
cd ..
```

## Step 4: Initialize Database

Run database migrations to create all necessary tables:

```bash
# Run Alembic migrations
uv run alembic upgrade head

# You should see output like:
# INFO  [alembic.runtime.migration] Running upgrade  -> 001, initial_schema
# INFO  [alembic.runtime.migration] Running upgrade 001 -> 002, add_refresh_tokens
# INFO  [alembic.runtime.migration] Running upgrade 002 -> 003, Add user_id to experiments table
```

## Step 5: Start the Application

### Option A: Run Both Services in Separate Terminals

**Terminal 1 - Backend:**
```bash
cd /path/to/ai-visibility
uv run uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000

# You should see:
# Starting Echo AI - AI Search Analytics Platform v0.1.0
# Environment: development
# Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Frontend:**
```bash
cd /path/to/ai-visibility/frontend
npm run dev

# You should see:
# ▲ Next.js 14.2.5
# - Local:        http://localhost:3000
# ✓ Ready in 6.1s
```

### Option B: Run in Background (single terminal)

```bash
# Start backend in background
uv run uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000 &

# Start frontend in background
cd frontend && npm run dev &

# Return to root
cd ..
```

## Step 6: Verify Everything Works

### 1. Check Backend Health
```bash
curl http://localhost:8000/health | python3 -m json.tool

# Expected output:
# {
#     "status": "healthy",
#     "version": "0.1.0",
#     "environment": "development",
#     "services": {
#         "redis": "healthy",
#         "database": "healthy"
#     }
# }
```

### 2. Check API Documentation
Open in browser: http://localhost:8000/api/v1/docs

You should see the Swagger UI with all API endpoints.

### 3. Check Frontend
Open in browser: http://localhost:3000

You should see the Echo AI landing page with:
- Modern dark theme
- "ECHO" logo in gradient cyan-to-violet
- "Echo AI" branding throughout

## Step 7: Test the Application

### 1. Create an Account
1. Navigate to http://localhost:3000/register
2. Enter email and password (min 8 characters)
3. Click "Create Account"

### 2. Login
1. Navigate to http://localhost:3000/login
2. Enter your credentials
3. You'll receive a JWT token (15-minute access + 7-day refresh)

### 3. Create an Experiment (requires API key)
1. After login, you'll see the dashboard
2. Click "New Experiment"
3. Fill in:
   - **Prompt**: "best project management software for startups"
   - **Target Brand**: "Linear"
   - **Competitor Brands**: Asana, Monday.com, Jira
   - **Iterations**: 10
4. Click "Run Experiment"

### 4. View Results
- Experiment will run asynchronously
- View real-time progress on dashboard
- See detailed analytics when complete

## Troubleshooting

### PostgreSQL Connection Issues

**Error: "could not connect to server"**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# If not running, start it:
brew services start postgresql@15

# Check if database exists
psql -l | grep ai_visibility_dev

# If not, create it:
createdb ai_visibility_dev
```

### Redis Connection Issues

**Error: "Connection refused" for Redis**
```bash
# Check if Redis is running
brew services list | grep redis

# If not running, start it:
brew services start redis

# Test connection
redis-cli ping  # Should return "PONG"
```

### Port Already in Use

**Error: "Address already in use" (port 8000 or 3000)**
```bash
# Find process using port 8000
lsof -ti:8000 | xargs kill -9

# Find process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Python Version Issues

**Error: Python version mismatch**
```bash
# Install Python 3.11 or higher
brew install python@3.11

# Verify version
python3 --version

# If needed, update uv
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Missing Dependencies

**Error: Module not found**
```bash
# Backend dependencies
uv sync --reinstall

# Frontend dependencies
cd frontend && npm install --force && cd ..
```

### Database Migration Issues

**Error: Migration fails**
```bash
# Reset database (WARNING: deletes all data)
dropdb ai_visibility_dev
createdb ai_visibility_dev

# Run migrations again
uv run alembic upgrade head
```

## Production-Ready Features

Echo AI includes these enterprise-grade features out of the box:

✅ **Security**
- JWT authentication (15-min access tokens + 7-day refresh)
- Bcrypt password hashing
- API key management
- Rate limiting (login: 5/min, register: 3/hour, experiments: 10/min)
- Input validation (prompt max 5000 chars, competitors max 10)

✅ **Architecture**
- FastAPI async backend
- SQLAlchemy 2.0 with async operations
- Redis caching and task queue
- PostgreSQL with proper indexes
- Next.js 14 with App Router

✅ **Monitoring**
- Real health checks (/health endpoint)
- Prometheus metrics (/metrics endpoint)
- Database connectivity monitoring

✅ **Scalability**
- Connection pooling (10 base + 20 overflow)
- Async operations throughout
- Repository pattern for data access
- Celery for distributed task processing

## API Endpoints

All endpoints are documented at: http://localhost:8000/api/v1/docs

Key endpoints:
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Login (returns JWT)
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/experiments` - Create experiment
- `GET /api/v1/experiments` - List experiments
- `GET /api/v1/experiments/{id}` - Get experiment details
- `GET /api/v1/experiments/{id}/report` - Get analytics report

## Environment Variables Reference

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SECRET_KEY` - JWT signing key (32+ chars)
- At least ONE LLM provider key:
  - `OPENAI_API_KEY`
  - `ANTHROPIC_API_KEY`
  - `PERPLEXITY_API_KEY`

### Optional
- `ENVIRONMENT` - "development" or "production" (default: development)
- `DEBUG` - Enable debug logging (default: true in dev)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)
- `SMTP_*` - Email configuration for password resets
- `SENTRY_DSN` - Error tracking
- `STRIPE_*` - Payment processing (for billing features)

## Next Steps

1. **Add Test Data**: Create a few experiments to see the analytics
2. **Explore API**: Test endpoints using the Swagger UI
3. **Customize Branding**: Update colors, logos in frontend/src
4. **Deploy to Production**: See `DEPLOYMENT.md` for GCP deployment guide
5. **Monitor Usage**: Check health and metrics endpoints

## Support

- **Documentation**: http://localhost:8000/api/v1/docs
- **Health Check**: http://localhost:8000/health
- **GitHub Issues**: https://github.com/Hamidph/ai-visibility/issues

## Security Notes

⚠️ **NEVER commit `.env` files to Git**
⚠️ **Use strong, unique SECRET_KEY in production**
⚠️ **Rotate API keys regularly**
⚠️ **Enable HTTPS in production**
⚠️ **Set up proper firewall rules**

---

**Welcome to Echo AI!** 🎉

You're now running a production-ready AI search analytics platform locally.
