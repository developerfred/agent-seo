"""AgentSEO Python SDK - SEO for the Agentic Era"""

from .client import AgentSEO, AgentSEOError
from .models import (
    AnalysisResult,
    AIReadinessResult,
    SchemaResult,
    EntityResult,
    CompareResult,
)

__version__ = "1.0.0"
__all__ = [
    "AgentSEO",
    "AgentSEOError",
    "AnalysisResult",
    "AIReadinessResult", 
    "SchemaResult",
    "EntityResult",
    "CompareResult",
]
