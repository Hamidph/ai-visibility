# Probabilistic LLM Analytics Platform

A Monte Carlo simulation engine for analyzing brand visibility across LLM providers (OpenAI, Anthropic, Perplexity).

## Innovation Statement

> While competitors build simple wrappers, we are building a **statistical auditing layer**. Our core innovation is the **'Probabilistic Engine'**, an asynchronous architecture that treats every user query as an experiment. By running multi-shot variance analysis, we identify 'Hallucination Rates' and 'Consistency Scores' that single-shot tools cannot detect. This creates a new category of data: **Generative Risk Analytics**.

## Features

- **Probabilistic Analysis**: Run N iterations of prompts to calculate statistical variance
- **Multi-Provider Support**: OpenAI, Anthropic, and Perplexity (Sonar) integration
- **Statistical Metrics**: Visibility Rate, Share of Voice, Rank Variance, Hallucination Rate
- **Async Architecture**: High-concurrency workloads with FastAPI and Celery
- **Builder Pattern**: Modular, testable business logic

## Tech Stack

- **Python 3.11+** with strict typing
- **FastAPI** for async API endpoints
- **PostgreSQL** with SQLAlchemy 2.0 (async)
- **Redis** for caching and Celery broker
- **Celery** for distributed task processing
- **Pydantic V2** for validation

## Quick Start

### Prerequisites

- Python 3.11+
- Docker and Docker Compose
- uv (Python package manager)

### Setup

1. **Clone and install dependencies:**

```bash
cd ai_visibility
uv sync
```

2. **Start infrastructure services:**

```bash
docker compose up -d
```

3. **Configure environment:**

```bash
cp env.example .env
# Edit .env with your API keys
```

4. **Run the application:**

```bash
uv run uvicorn backend.app.main:app --reload
```

5. **Access the API:**

- API Documentation: http://localhost:8000/api/v1/docs
- Health Check: http://localhost:8000/health

## Project Structure

```
ai_visibility/
├── backend/
│   └── app/
│       ├── builders/        # Business logic (PromptBuilder, RunnerBuilder, AnalysisBuilder)
│       ├── core/            # Configuration, database, Redis
│       ├── models/          # SQLAlchemy ORM models
│       ├── repositories/    # Data access layer
│       ├── routers/         # FastAPI route definitions
│       ├── schemas/         # Pydantic validation models
│       └── main.py          # Application entry point
├── tests/                   # Test suite
├── docker-compose.yml       # Infrastructure services
└── pyproject.toml           # Dependencies and tooling
```

## Development

### Running Tests

```bash
uv run pytest
```

### Type Checking

```bash
uv run mypy backend/
```

### Linting

```bash
uv run ruff check backend/
uv run ruff format backend/
```

## License

MIT

