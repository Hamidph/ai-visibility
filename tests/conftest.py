"""
Pytest configuration and fixtures for the test suite.

This module provides shared fixtures for database sessions,
test clients, and mock LLM providers.
"""

from collections.abc import AsyncGenerator
from typing import Any

import pytest
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient

from backend.app.main import app


@pytest.fixture
def client() -> TestClient:
    """
    Provide a synchronous test client for FastAPI.

    Returns:
        TestClient: A test client instance.
    """
    return TestClient(app)


@pytest.fixture
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    """
    Provide an asynchronous test client for FastAPI.

    Yields:
        AsyncClient: An async test client instance.
    """
    async with AsyncClient(
        transport=ASGITransport(app=app),  # type: ignore[arg-type]
        base_url="http://test",
    ) as ac:
        yield ac


@pytest.fixture
def mock_settings() -> dict[str, Any]:
    """
    Provide mock settings for testing.

    Returns:
        dict: Mock configuration values.
    """
    return {
        "app_name": "Test Platform",
        "app_version": "0.0.1",
        "environment": "development",
        "debug": True,
        "default_iterations": 5,
        "max_iterations": 10,
        "confidence_level": 0.95,
    }

