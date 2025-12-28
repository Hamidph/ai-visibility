"""
Pydantic schemas for the probabilistic runner.

This module defines data models for batch execution results,
iteration tracking, and statistical aggregation.

Innovation: The BatchResult schema captures per-iteration variance data
enabling Monte Carlo-style statistical analysis of LLM responses.
"""

from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

from backend.app.schemas.llm import LLMProvider, LLMResponse


class IterationStatus(str, Enum):
    """Status of a single iteration in a batch run."""

    SUCCESS = "success"
    FAILED = "failed"
    RATE_LIMITED = "rate_limited"
    TIMEOUT = "timeout"
    AUTH_ERROR = "auth_error"


class IterationResult(BaseModel):
    """
    Result of a single iteration in a probabilistic batch.

    Innovation: Each iteration captures timing and error data for
    variance analysis and reliability metrics.
    """

    iteration_index: int = Field(description="Zero-based index of this iteration")
    status: IterationStatus = Field(description="Outcome status of this iteration")
    response: LLMResponse | None = Field(
        default=None,
        description="The LLM response if successful",
    )
    error_message: str | None = Field(
        default=None,
        description="Error message if iteration failed",
    )
    latency_ms: float | None = Field(
        default=None,
        description="Total latency for this iteration in milliseconds",
    )
    retry_count: int = Field(
        default=0,
        description="Number of retries before success/failure",
    )


class BatchConfig(BaseModel):
    """Configuration for a batch run."""

    iterations: int = Field(
        default=10,
        ge=1,
        le=1000,
        description="Number of iterations to run",
    )
    max_concurrency: int = Field(
        default=10,
        ge=1,
        le=100,
        description="Maximum concurrent requests",
    )
    temperature: float = Field(
        default=0.7,
        ge=0.0,
        le=2.0,
        description="Sampling temperature for LLM",
    )
    max_tokens: int | None = Field(
        default=None,
        ge=1,
        le=4096,
        description="Maximum tokens per response",
    )
    model: str | None = Field(
        default=None,
        description="Model override (uses provider default if not set)",
    )
    system_prompt: str | None = Field(
        default=None,
        description="System prompt to prepend to all iterations",
    )


class BatchResult(BaseModel):
    """
    Result of a probabilistic batch execution.

    Innovation: This is the core output of the Monte Carlo simulation,
    containing N iterations of the same prompt for statistical analysis.
    The variance in responses enables visibility rate calculations.
    """

    batch_id: UUID = Field(
        default_factory=uuid4,
        description="Unique identifier for this batch run",
    )
    provider: LLMProvider = Field(description="The LLM provider used")
    model: str = Field(description="The model that generated responses")
    prompt: str = Field(description="The user prompt that was run N times")
    system_prompt: str | None = Field(
        default=None,
        description="System prompt used for all iterations",
    )
    config: BatchConfig = Field(description="Configuration used for this batch")

    # Timing
    started_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="When the batch started",
    )
    completed_at: datetime | None = Field(
        default=None,
        description="When the batch completed",
    )
    total_duration_ms: float | None = Field(
        default=None,
        description="Total batch execution time in milliseconds",
    )

    # Results
    iterations: list[IterationResult] = Field(
        default_factory=list,
        description="Results from each iteration",
    )

    # Aggregated Statistics
    # Innovation: Pre-computed stats for quick access without re-processing
    total_iterations: int = Field(
        default=0,
        description="Total number of iterations attempted",
    )
    successful_iterations: int = Field(
        default=0,
        description="Number of successful iterations",
    )
    failed_iterations: int = Field(
        default=0,
        description="Number of failed iterations",
    )
    success_rate: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
        description="Proportion of successful iterations",
    )

    # Token Usage Aggregation
    total_prompt_tokens: int = Field(default=0, description="Total prompt tokens used")
    total_completion_tokens: int = Field(default=0, description="Total completion tokens used")
    total_tokens: int = Field(default=0, description="Total tokens used across all iterations")

    # Latency Statistics
    avg_latency_ms: float | None = Field(
        default=None,
        description="Average response latency in milliseconds",
    )
    min_latency_ms: float | None = Field(
        default=None,
        description="Minimum response latency in milliseconds",
    )
    max_latency_ms: float | None = Field(
        default=None,
        description="Maximum response latency in milliseconds",
    )

    # Raw content for analysis phase
    raw_responses: list[str] = Field(
        default_factory=list,
        description="Raw text content from successful iterations for analysis",
    )

    def compute_statistics(self) -> None:
        """
        Compute aggregated statistics from iteration results.

        This method should be called after all iterations complete
        to populate the summary statistics fields.
        """
        if not self.iterations:
            return

        self.total_iterations = len(self.iterations)
        self.successful_iterations = sum(
            1 for i in self.iterations if i.status == IterationStatus.SUCCESS
        )
        self.failed_iterations = self.total_iterations - self.successful_iterations
        self.success_rate = (
            self.successful_iterations / self.total_iterations if self.total_iterations > 0 else 0.0
        )

        # Collect successful responses
        self.raw_responses = []
        latencies: list[float] = []

        for iteration in self.iterations:
            if iteration.status == IterationStatus.SUCCESS and iteration.response:
                self.raw_responses.append(iteration.response.content)

                # Aggregate usage
                if iteration.response.usage:
                    self.total_prompt_tokens += iteration.response.usage.prompt_tokens
                    self.total_completion_tokens += iteration.response.usage.completion_tokens
                    self.total_tokens += iteration.response.usage.total_tokens

                # Collect latency
                if iteration.response.latency_ms is not None:
                    latencies.append(iteration.response.latency_ms)

        # Compute latency statistics
        if latencies:
            self.avg_latency_ms = sum(latencies) / len(latencies)
            self.min_latency_ms = min(latencies)
            self.max_latency_ms = max(latencies)


class RunnerRequest(BaseModel):
    """Request to run a probabilistic batch."""

    prompt: str = Field(
        min_length=1,
        max_length=10000,
        description="The prompt to run N times",
    )
    provider: LLMProvider = Field(description="The LLM provider to use")
    config: BatchConfig = Field(
        default_factory=BatchConfig,
        description="Batch configuration",
    )


class RunnerProgress(BaseModel):
    """Progress update for a running batch."""

    batch_id: UUID = Field(description="Batch identifier")
    completed: int = Field(description="Number of completed iterations")
    total: int = Field(description="Total iterations")
    successful: int = Field(description="Number of successful iterations")
    failed: int = Field(description="Number of failed iterations")
    progress_percent: float = Field(description="Completion percentage")
