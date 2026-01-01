# Prompt for Claude Code: Set Up Echo AI on Mac

Copy and paste this prompt to Claude Code on your Mac:

---

I want you to help me set up and run the Echo AI project on my local Mac. This is a production-ready AI search analytics platform built with FastAPI (backend) and Next.js (frontend).

## Project Information

- **Repository**: https://github.com/Hamidph/ai-visibility
- **Branch**: `claude/analyze-codebase-A9hr5` (production-ready branch)
- **Tech Stack**:
  - Backend: Python 3.11+, FastAPI, SQLAlchemy, PostgreSQL, Redis
  - Frontend: Next.js 14, TypeScript, Tailwind CSS
  - Task Queue: Celery
  - Package Managers: uv (Python), npm (Node.js)

## What I Need You to Do

Please follow these steps in order:

### 1. Check Prerequisites
First, check if I have the required tools installed on my Mac:
- Python 3.11+ (with uv package manager)
- Node.js 18+ (preferably v22)
- PostgreSQL 15+
- Redis
- Git

If any are missing, provide Homebrew installation commands for Mac.

### 2. Clone Repository
Clone the repository and checkout the production-ready branch:
```bash
git clone https://github.com/Hamidph/ai-visibility.git
cd ai-visibility
git checkout claude/analyze-codebase-A9hr5
```

### 3. Set Up PostgreSQL Database
- Create database named `ai_visibility_dev`
- Verify connection works
- Provide troubleshooting if needed

### 4. Start Redis
- Start Redis service (if not running)
- Verify it's working with `redis-cli ping`

### 5. Configure Environment Variables

**Backend (.env file):**
I need help creating/editing the `.env` file with these critical values:

**Required - You MUST ask me for these:**
- At least ONE LLM provider API key (I'll provide):
  - `OPENAI_API_KEY` (from https://platform.openai.com/api-keys)
  - OR `ANTHROPIC_API_KEY` (from https://console.anthropic.com/settings/keys)
  - OR `PERPLEXITY_API_KEY` (from https://www.perplexity.ai/settings/api)

**Auto-generate these:**
- `SECRET_KEY` - Generate a secure 32-character random string using:
  ```bash
  python3 -c "import secrets; print(secrets.token_urlsafe(32))"
  ```

**Database connections (should work with defaults):**
- `DATABASE_URL="postgresql+asyncpg://localhost/ai_visibility_dev"`
- `REDIS_URL="redis://localhost:6379/0"`

**Frontend (frontend/.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME="Echo AI"
```

### 6. Install Dependencies

**Backend:**
```bash
uv sync
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### 7. Run Database Migrations
```bash
uv run alembic upgrade head
```

Verify you see migrations 001, 002, and 003 being applied.

### 8. Start the Application

Start both services:

**Backend (in background or separate terminal):**
```bash
uv run uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend (in background or separate terminal):**
```bash
cd frontend
npm run dev
```

### 9. Verify Everything Works

Check these URLs and confirm they're working:

1. **Backend Health**: http://localhost:8000/health
   - Should return `{"status": "healthy", "services": {"redis": "healthy", "database": "healthy"}}`

2. **API Documentation**: http://localhost:8000/api/v1/docs
   - Should show Swagger UI with "Echo AI - AI Search Analytics Platform"

3. **Frontend**: http://localhost:3000
   - Should show Echo AI landing page with modern dark theme
   - Logo should say "ECHO" in cyan-to-violet gradient

### 10. Test the Full Flow

Help me test the application:
1. Register a new account at http://localhost:3000/register
2. Login at http://localhost:3000/login
3. Try creating a test experiment (if I provided an API key)

## Important Notes

**Security:**
- NEVER commit `.env` file to git (it's already in .gitignore)
- The SECRET_KEY must be unique and random
- API keys are sensitive - handle with care

**What This App Does:**
Echo AI is an AI search analytics platform that measures brand visibility across AI-powered search engines (ChatGPT, Perplexity, Claude). It runs Monte Carlo simulations to provide statistically significant metrics on brand mentions, positioning, and sentiment.

**Production-Ready Features:**
- JWT authentication (15-min access + 7-day refresh tokens)
- Rate limiting (prevents abuse)
- Input validation
- User-scoped data isolation
- Async operations for scalability
- Real health checks and monitoring

## Troubleshooting

If you encounter issues:

**PostgreSQL not connecting:**
- Check if running: `brew services list | grep postgresql`
- Start it: `brew services start postgresql@15`
- Verify database exists: `psql -l | grep ai_visibility_dev`

**Redis not connecting:**
- Check if running: `brew services list | grep redis`
- Start it: `brew services start redis`
- Test: `redis-cli ping` should return "PONG"

**Port already in use:**
- Backend (8000): `lsof -ti:8000 | xargs kill -9`
- Frontend (3000): `lsof -ti:3000 | xargs kill -9`

**Python version issues:**
- Install Python 3.11+: `brew install python@3.11`
- Reinstall uv: `curl -LsSf https://astral.sh/uv/install.sh | sh`

## What I Expect

After you complete these steps, I should be able to:
- Access the backend API at http://localhost:8000
- Access the frontend at http://localhost:3000
- See healthy status from health check endpoint
- Create an account and login
- View API documentation
- Run experiments (if I provided API keys)

Please guide me through this process step by step, checking each step before moving to the next. If you need any information from me (like API keys), please ask!

---

## My API Keys (Fill this in before giving to Claude Code)

**Option 1 - OpenAI:**
```
OPENAI_API_KEY="sk-proj-your-actual-key-paste-here"
```

**Option 2 - Anthropic:**
```
ANTHROPIC_API_KEY="sk-ant-your-actual-key-paste-here"
```

**Option 3 - Perplexity:**
```
PERPLEXITY_API_KEY="pplx-your-actual-key-paste-here"
```

**Note:** Only ONE provider key is required, but you can add all three if you have them.
