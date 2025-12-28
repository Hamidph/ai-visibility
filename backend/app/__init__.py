"""
Probabilistic LLM Analytics Platform - Backend Application.

This package contains the core FastAPI application for running probabilistic
visibility analysis across multiple LLM providers. The architecture follows
the Builder pattern for modularity and testability.

Innovation: This platform treats every query as a Monte Carlo experiment,
running N iterations to calculate statistical variance in LLM responses.
"""
