# AI Visibility Platform 🚀

> **Probabilistic LLM Analytics Platform** - Measure your brand's visibility across AI platforms with statistical significance using Monte Carlo simulation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

## Innovation Statement

> While competitors build simple wrappers, we are building a **statistical auditing layer**. Our core innovation is the **'Probabilistic Engine'**, an asynchronous architecture that treats every user query as an experiment. By running multi-shot variance analysis, we identify 'Hallucination Rates' and 'Consistency Scores' that single-shot tools cannot detect. This creates a new category of data: **Generative Risk Analytics**.

## ✨ Features

### Core Analytics
- 🧪 **Probabilistic Analysis** - Monte Carlo simulation with confidence intervals
- 🤖 **Multi-Provider Support** - OpenAI, Anthropic, Perplexity integration
- 📊 **Statistical Metrics** - Visibility Rate, Share of Voice, Rank Variance
- 📈 **Real-time Analytics** - Track brand mentions and trends over time
- 🔄 **Async Architecture** - High-concurrency workloads with FastAPI and Celery

### Production-Ready SaaS
- 🔐 **Authentication** - JWT-based auth with email verification
- 💳 **Stripe Billing** - Subscription management (Free, Starter, Pro, Enterprise)
- 🔑 **API Keys** - Programmatic access for integrations
- 📧 **Email Service** - Verification, password reset, notifications
- 🎨 **Beautiful Frontend** - Modern Next.js dashboard with Tailwind CSS
- 🚀 **GCP Deployment** - Production-ready Cloud Run + Cloud SQL + Redis
- 🔒 **Enterprise Security** - Rate limiting, monitoring, secret management

## 🛠 Tech Stack

### Backend
- **Python 3.11+** with strict typing
- **FastAPI** for async API endpoints
- **PostgreSQL 15** with SQLAlchemy 2.0 (async)
- **Redis** for caching and Celery broker
- **Celery** for distributed task processing
- **Pydantic V2** for validation
- **Alembic** for migrations
- **JWT Auth** + **Stripe** + **Email** (aiosmtplib)

### Frontend
- **Next.js 14** (App Router)
- **React 18** + **Tailwind CSS**
- **TanStack Query** for data fetching
- **Zustand** for state management
- **Recharts** for analytics visualizations

## 🚀 Quick Start

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/Hamidph/ai-visibility.git
cd ai-visibility

# 2. Backend Setup
uv sync                          # Install Python dependencies
cp .env.example .env             # Configure environment variables
docker compose up -d             # Start PostgreSQL + Redis
uv run alembic upgrade head      # Run migrations
uv run uvicorn backend.app.main:app --reload  # Start backend

# 3. Frontend Setup (in another terminal)
cd frontend
npm install                      # Install dependencies
cp .env.local.example .env.local # Configure environment
npm run dev                      # Start frontend
```

**Access Points:**
- 🎨 Frontend: http://localhost:3000
- 🔌 API: http://localhost:8000
- 📚 API Docs: http://localhost:8000/docs

### Production Deployment

See **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for complete GCP + Vercel deployment instructions.

**Quick Deploy:**
```bash
# Backend (GCP Cloud Run)
gcloud builds submit --config cloudbuild.yaml

# Frontend (Vercel)
cd frontend && vercel --prod
```

**Estimated Cost:** $42-156/month (or FREE with GCP $300 credit for demos)

## 📁 Project Structure

```
ai-visibility/
├── backend/
│   ├── app/
│   │   ├── core/           # Configuration, database, security
│   │   ├── models/         # SQLAlchemy ORM models (User, Experiment, etc.)
│   │   ├── routers/        # FastAPI endpoints (auth, billing, experiments)
│   │   ├── schemas/        # Pydantic validation models
│   │   ├── services/       # Business logic (email, billing, LLM providers)
│   │   ├── builders/       # Analysis builders (PromptBuilder, RunnerBuilder)
│   │   └── main.py         # Application entry point
│   ├── alembic/            # Database migrations
│   └── tests/              # Pytest test suite
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js 14 App Router
│   │   │   ├── (auth)/    # Auth pages (login, register)
│   │   │   └── dashboard/ # Dashboard pages
│   │   ├── components/     # React components
│   │   ├── lib/           # API client and utilities
│   │   └── types/         # TypeScript type definitions
│   └── public/            # Static assets
├── .github/workflows/     # CI/CD GitHub Actions
├── alembic/               # Database migrations
├── Dockerfile             # Backend container
├── Dockerfile.worker      # Celery worker container
├── cloudbuild.yaml        # GCP Cloud Build config
├── docker-compose.yml     # Local development services
└── pyproject.toml         # Python dependencies
```

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete deployment guide for GCP and Vercel
- **[IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md)** - Comprehensive technical report with rationale
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Original deployment documentation
- **[backend/README.md](backend/README.md)** - Backend-specific documentation
- **[frontend/README.md](frontend/README.md)** - Frontend-specific documentation

## 🧪 Development

### Running Tests

```bash
# Backend tests
uv run pytest tests/ -v

# Frontend tests
cd frontend && npm test

# With coverage
uv run pytest --cov=backend tests/
```

### Code Quality

```bash
# Type checking
uv run mypy backend/

# Linting
uv run ruff check backend/

# Format code
uv run ruff format backend/
```

## 💰 Pricing & Cost

### Development Tiers

| Tier | Monthly Cost | Use Case |
|------|-------------|----------|
| **Local Dev** | $0 | Development & testing |
| **Demo (GCP Free)** | $0 | Investor demos (6 months with $300 credit) |
| **Production (Optimized)** | $156 | Production with moderate traffic |
| **Enterprise** | $500+ | High availability + dedicated support |

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed cost breakdown.

## 🗺 Roadmap

- [x] Core probabilistic analytics engine
- [x] Multi-provider LLM integration
- [x] User authentication & authorization
- [x] Stripe billing & subscriptions
- [x] Email verification system
- [x] Beautiful frontend dashboard
- [x] GCP deployment infrastructure
- [ ] Deploy to production
- [ ] Marketing website
- [ ] More LLM providers (Google Gemini, Llama)
- [ ] Historical trend tracking
- [ ] Competitor comparison
- [ ] API webhooks & Zapier integration
- [ ] White-label options

## 🤝 Contributing

Contributions welcome! Please see our development workflow:

```bash
# Install pre-commit hooks
pip install pre-commit
pre-commit install

# Create feature branch
git checkout -b feature/your-feature

# Make changes, commit, and push
git commit -m "feat: your feature"
git push origin feature/your-feature

# Open a Pull Request
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

**Made with ❤️ for the future of AI analytics**

**[Documentation](IMPLEMENTATION_REPORT.md)** | **[Deploy Guide](DEPLOYMENT_GUIDE.md)** | **[GitHub](https://github.com/Hamidph/ai-visibility)**

