"""
Builders module - Core business logic following the Builder pattern.

This module contains the three core builders:
- PromptBuilder: Generates prompt variations for experiments
- RunnerBuilder: Executes probabilistic LLM queries (N iterations)
- AnalysisBuilder: Calculates statistical metrics from results

Innovation: The Builder pattern decouples business logic from API routes,
enabling independent scaling and testing of each component.
"""
