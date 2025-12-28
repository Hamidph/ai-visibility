"""
Pydantic schemas for LLM provider requests and responses.

This module defines strictly typed data models for interacting with
various LLM providers (OpenAI, Anthropic, Perplexity).

Innovation: Unified schema design enables provider-agnostic probabilistic
analysis while preserving provider-specific metadata for variance tracking.
"""

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class LLMProvider(str, Enum):
    """Supported LLM providers for visibility analysis."""

    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    PERPLEXITY = "perplexity"


class MessageRole(str, Enum):
    """Message roles in a conversation."""

    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


class Message(BaseModel):
    """A single message in a conversation."""

    role: MessageRole = Field(description="The role of the message author")
    content: str = Field(description="The content of the message")


class LLMRequest(BaseModel):
    """
    Unified request schema for LLM completions.

    This schema abstracts provider-specific parameters into a common interface
    for the probabilistic engine to use across all providers.
    """

    messages: list[Message] = Field(
        description="List of messages comprising the conversation",
        min_length=1,
    )
    model: str | None = Field(
        default=None,
        description="Model identifier (provider-specific, uses default if not set)",
    )
    temperature: float = Field(
        default=0.2,
        ge=0.0,
        le=2.0,
        description="Sampling temperature for response randomness",
    )
    max_tokens: int | None = Field(
        default=None,
        ge=1,
        le=4096,
        description="Maximum tokens in the response",
    )
    top_p: float = Field(
        default=0.9,
        ge=0.0,
        le=1.0,
        description="Nucleus sampling threshold",
    )


class UsageInfo(BaseModel):
    """Token usage information from an LLM response."""

    prompt_tokens: int = Field(description="Tokens in the prompt")
    completion_tokens: int = Field(description="Tokens in the completion")
    total_tokens: int = Field(description="Total tokens used")


class LLMResponse(BaseModel):
    """
    Unified response schema from LLM providers.

    Innovation: Captures both the generated content and metadata needed
    for probabilistic analysis (timing, tokens, provider info).
    """

    id: str = Field(description="Unique identifier for this completion")
    provider: LLMProvider = Field(description="The provider that generated this response")
    model: str = Field(description="The model that generated the response")
    content: str = Field(description="The generated text content")
    finish_reason: str | None = Field(
        default=None,
        description="Why the model stopped generating (stop, length, etc.)",
    )
    usage: UsageInfo | None = Field(
        default=None,
        description="Token usage statistics",
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="When this response was created",
    )
    latency_ms: float | None = Field(
        default=None,
        description="Response latency in milliseconds",
    )
    raw_response: dict[str, Any] | None = Field(
        default=None,
        description="Raw provider response for debugging",
    )


class PerplexitySearchResult(BaseModel):
    """Search result from Perplexity's web search."""

    title: str = Field(description="Title of the search result")
    url: str = Field(description="URL of the search result")
    date: str | None = Field(default=None, description="Publication date if available")


class PerplexityResponse(LLMResponse):
    """
    Extended response schema for Perplexity with search results.

    Innovation: Perplexity's search results enable cross-referencing
    brand mentions with source URLs for citation analysis.
    """

    search_results: list[PerplexitySearchResult] | None = Field(
        default=None,
        description="Web search results used to generate the response",
    )
    citations: list[str] | None = Field(
        default=None,
        description="Citation URLs extracted from the response",
    )


class LLMError(BaseModel):
    """Error information from an LLM provider."""

    provider: LLMProvider = Field(description="The provider that returned the error")
    error_type: str = Field(description="Type of error (rate_limit, auth, etc.)")
    message: str = Field(description="Error message")
    status_code: int | None = Field(default=None, description="HTTP status code if applicable")
    retry_after: float | None = Field(
        default=None,
        description="Seconds to wait before retrying (for rate limits)",
    )
