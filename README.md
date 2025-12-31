# Echo AI

**AI Search Analytics Platform** - Quantify your brand's performance across AI search engines with statistical rigor.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

---

## What is Echo AI?

Echo AI measures brand visibility on AI-powered search platforms (ChatGPT, Perplexity, Claude) using probabilistic analysis. Instead of single queries, we run Monte Carlo simulations to provide statistically significant metrics on where your brand appears, how often, and in what context.

### Core Metrics

- **Visibility Rate**: Percentage of queries where your brand appears (with 95% confidence intervals)
- **Share of Voice**: Your brand's mention frequency vs. competitors
- **Average Position**: Where you rank in AI responses
- **Consistency Score**: How reliably your brand appears across iterations
- **Sentiment Analysis**: Tone and context of brand mentions

### Why It Matters

AI search is fundamentally different from traditional SEO. Rankings are non-deterministic—the same query produces different results each time. Echo AI accounts for this variance through repeated sampling, giving you reliable data on brand performance in this new landscape.

---

## Architecture

### Backend
- **FastAPI** - Async Python web framework
- **PostgreSQL 15** - Primary data store with SQLAlchemy 2.0 (async)
- **Redis** - Caching and task queue broker
- **Celery** - Distributed task execution for long-running analyses
- **Pydantic V2** - Request/response validation with strict typing

### Frontend
- **Next.js 14** - React framework with App Router
- **TanStack Query** - Server state management
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety across the application

### Infrastructure
- **Google Cloud Run** - Containerized backend with autoscaling
- **Cloud SQL (PostgreSQL)** - Managed database
- **Cloud Memorystore (Redis)** - Managed cache
- **Vercel** - Frontend hosting with edge caching

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15
- Redis 7+
- uv (Python package manager)

### Local Development

```bash
# Clone repository
git clone https://github.com/Hamidph/ai-visibility.git
cd ai-visibility

# Backend setup
uv sync
cp .env.example .env           # Configure API keys and database
docker compose up -d           # Start PostgreSQL + Redis
uv run alembic upgrade head    # Apply database migrations
uv run uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend setup (separate terminal)
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

**Access**:
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Environment Variables

Required configuration in `.env`:

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/echo_ai

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
SECRET_KEY=<generate-with-openssl-rand-hex-32>

# LLM Providers (at least one required)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
PERPLEXITY_API_KEY=pplx-...

# Email (optional for local dev)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Stripe (optional for local dev)
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Project Structure

```
echo-ai/
├── backend/
│   ├── app/
│   │   ├── core/          # Config, database, security primitives
│   │   ├── models/        # SQLAlchemy ORM models
│   │   ├── routers/       # API route handlers
│   │   ├── schemas/       # Pydantic request/response models
│   │   ├── services/      # Business logic (billing, email)
│   │   ├── builders/      # Analytics engine (providers, runner, analysis)
│   │   ├── repositories/  # Data access layer
│   │   └── main.py        # Application entrypoint
│   └── tests/             # Pytest test suite
│
├── frontend/
│   └── src/
│       ├── app/           # Next.js App Router pages
│       ├── components/    # React components
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # API client and utilities
│       └── types/         # TypeScript definitions
│
├── alembic/               # Database migration scripts
├── .github/workflows/     # CI/CD pipelines
├── docker-compose.yml     # Local development services
└── pyproject.toml         # Python dependencies
```

---

## API Usage

### Authentication

Echo AI supports two authentication methods:

**1. JWT Tokens** (for web applications):
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=yourpassword"

# Returns: {"access_token": "eyJ...", "token_type": "bearer"}
```

**2. API Keys** (for programmatic access):
```bash
# Create API key via dashboard or:
curl -X POST http://localhost:8000/api/v1/auth/api-keys \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"name": "Production API Key"}'

# Use API key in requests:
curl -H "X-API-Key: sk_live_..." http://localhost:8000/api/v1/experiments
```

### Running an Analysis

```bash
curl -X POST http://localhost:8000/api/v1/experiments \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Best CRM software for startups",
    "target_brand": "YourBrand",
    "competitor_brands": ["Salesforce", "HubSpot", "Pipedrive"],
    "iterations": 50,
    "config": {
      "providers": ["openai", "anthropic"],
      "model": "gpt-4",
      "temperature": 1.0
    }
  }'

# Returns: {"experiment_id": "uuid", "status": "queued", "job_id": "..."}

# Check status:
curl http://localhost:8000/api/v1/experiments/{experiment_id} \
  -H "Authorization: Bearer YOUR_JWT"
```

---

## Deployment

### Production (Google Cloud Platform)

```bash
# Set up GCP project
gcloud config set project YOUR_PROJECT_ID

# Deploy backend (Cloud Run)
gcloud builds submit --config cloudbuild.yaml

# Deploy frontend (Vercel)
cd frontend
vercel --prod
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete production deployment instructions, including:
- Cloud SQL setup with connection pooling
- Secret Manager configuration
- Custom domain setup
- Monitoring and alerting
- Auto-scaling configuration

**Estimated Monthly Cost**:
- Development: $0 (within free tiers)
- Production (low traffic): $50-100
- Production (high traffic): $200-500

---

## Testing

```bash
# Run backend tests
uv run pytest tests/ -v --cov=backend

# Run frontend tests
cd frontend
npm test

# Integration tests
docker compose -f docker-compose.test.yml up --abort-on-container-exit
```

---

## Security

Echo AI implements enterprise-grade security practices:

- **Authentication**: JWT tokens with configurable expiration, bcrypt password hashing
- **Authorization**: Role-based access control (admin, user, viewer)
- **Rate Limiting**: Per-user and per-endpoint rate limits
- **Input Validation**: Pydantic schemas prevent injection attacks
- **HTTPS Only**: All production traffic encrypted in transit
- **Secret Management**: Google Secret Manager for API keys and credentials
- **Audit Logging**: All administrative actions logged
- **Monitoring**: Sentry error tracking, Prometheus metrics

See [SECURITY.md](SECURITY.md) for vulnerability reporting.

---

## Performance

### Throughput
- **API Latency**: <200ms p95 for CRUD operations
- **Analysis Execution**: 10-50 iterations in 30-120 seconds (depends on LLM provider rate limits)
- **Concurrent Experiments**: 100+ with Celery worker auto-scaling

### Scalability
- **Database**: Cloud SQL supports 1000+ concurrent connections with PgBouncer
- **Backend**: Cloud Run autoscales to handle traffic spikes
- **Workers**: Celery scales horizontally based on queue depth
- **Frontend**: Edge-cached on Vercel CDN

---

## Contributing

We welcome contributions! Before submitting:

1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Fork the repository
3. Create a feature branch (`git checkout -b feature/your-feature`)
4. Add tests for new functionality
5. Ensure `pytest` and `npm test` pass
6. Submit a pull request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Support

- **Documentation**: [docs.echo-ai.com](https://docs.echo-ai.com) (coming soon)
- **Issues**: [GitHub Issues](https://github.com/Hamidph/ai-visibility/issues)
- **Email**: support@echo-ai.com
- **Discord**: [Join our community](https://discord.gg/echo-ai) (coming soon)

---

**Built with precision for marketing teams that demand accurate AI search analytics.**
