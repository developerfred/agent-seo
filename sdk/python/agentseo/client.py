"""AgentSEO Python Client"""

import json
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional, Union

from .models import (
    AnalysisResult,
    AIReadinessResult,
    SchemaResult,
    EntityResult,
    CompareResult,
)


class AgentSEOError(Exception):
    """AgentSEO API Error"""
    def __init__(self, message: str, code: Optional[str] = None, status_code: Optional[int] = None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code


class AgentSEO:
    """
    AgentSEO Python SDK
    
    SEO for the Agentic Era - Optimize content for AI agents
    
    Example:
        from agentseo import AgentSEO
        
        client = AgentSEO(api_key="your-api-key")
        result = client.analyze("https://example.com")
        print(f"Score: {result.score}")
    """
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = "https://api.agentseo.tech",
        timeout: int = 30
    ):
        """
        Initialize AgentSEO client
        
        Args:
            api_key: Optional API key for authenticated requests
            base_url: API base URL (default: https://api.agentseo.tech)
            timeout: Request timeout in seconds (default: 30)
        """
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
    
    def _make_request(self, endpoint: str, params: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """Make authenticated request to API"""
        url = f"{self.base_url}{endpoint}"
        
        if params:
            query = '&'.join(f"{k}={urllib.parse.quote(v)}" for k, v in params.items())
            url = f"{url}?{query}"
        
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        
        if self.api_key:
            headers['Authorization'] = f"Bearer {self.api_key}"
        
        try:
            request = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                return json.loads(response.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            try:
                error_data = json.loads(e.read().decode('utf-8'))
                raise AgentSEOError(
                    error_data.get('message', 'API error'),
                    error_data.get('code'),
                    e.code
                )
            except:
                raise AgentSEOError(f"HTTP Error: {e.code}", status_code=e.code)
        except urllib.error.URLError as e:
            raise AgentSEOError(f"Network error: {e.reason}", code="NETWORK_ERROR")
        except Exception as e:
            raise AgentSEOError(str(e), code="UNKNOWN_ERROR")
    
    # ═══════════════════════════════════════════════════════════════
    # MAIN ANALYSIS METHODS
    # ═══════════════════════════════════════════════════════════════
    
    def analyze(self, url: str) -> AnalysisResult:
        """
        Full SEO analysis including AI readiness and traditional SEO
        
        Args:
            url: URL to analyze
            
        Returns:
            AnalysisResult with full SEO analysis
            
        Example:
            result = client.analyze("https://example.com")
            print(f"AI Readiness: {result.ai_readiness.score}")
            print(f"Recommendations: {len(result.recommendations)}")
        """
        data = self._make_request('/analyze', {'url': url})
        return AnalysisResult.from_dict(data)
    
    def ai_ready(self, url: str) -> AIReadinessResult:
        """
        Check AI readiness - focused analysis for AI agent compatibility
        
        Args:
            url: URL to check
            
        Returns:
            AIReadinessResult with AI compatibility analysis
            
        Example:
            result = client.ai_ready("https://example.com")
            print(f"AI Ready Score: {result.ai_ready_score}")
            print(f"GPTBot Access: {result.checks['gptbot_access'].passed}")
        """
        data = self._make_request('/ai-ready', {'url': url})
        return AIReadinessResult.from_dict(data)
    
    def extract_schemas(self, url: str) -> SchemaResult:
        """
        Extract and validate all structured data from a URL
        
        Args:
            url: URL to extract schemas from
            
        Returns:
            SchemaResult with extracted schemas
            
        Example:
            result = client.extract_schemas("https://example.com")
            for schema in result.schemas:
                print(f"Type: {schema.type}, Valid: {schema.valid}")
        """
        data = self._make_request('/extract-schema', {'url': url})
        return SchemaResult.from_dict(data)
    
    def extract_entities(self, url: str) -> EntityResult:
        """
        Extract and analyze entities from content
        
        Args:
            url: URL to extract entities from
            
        Returns:
            EntityResult with extracted entities
            
        Example:
            result = client.extract_entities("https://example.com")
            print(f"Found {len(result.entities)} entities")
            print(f"Main topics: {result.knowledge_graph.main_topics}")
        """
        data = self._make_request('/entities', {'url': url})
        return EntityResult.from_dict(data)
    
    def compare(self, url1: str, url2: str) -> CompareResult:
        """
        Compare two URLs for AI visibility
        
        Args:
            url1: First URL to compare
            url2: Second URL to compare
            
        Returns:
            CompareResult with comparison analysis
            
        Example:
            result = client.compare("https://example1.com", "https://example2.com")
            print(f"Winner: {result.winner}")
        """
        data = self._make_request('/compare', {'url1': url1, 'url2': url2})
        return CompareResult.from_dict(data)
    
    # ═══════════════════════════════════════════════════════════════
    # AGENT-SPECIFIC METHODS
    # ═══════════════════════════════════════════════════════════════
    
    def crawl(self, url: str) -> Dict[str, Any]:
        """
        Simulate how an AI agent would crawl a page
        
        Args:
            url: URL to crawl
            
        Returns:
            Dictionary with crawl simulation results
        """
        return self._make_request('/agent/crawl', {'url': url})
    
    def understand(self, url: str) -> Dict[str, Any]:
        """
        Get an AI comprehension score for content
        
        Args:
            url: URL to analyze
            
        Returns:
            Dictionary with comprehension analysis
        """
        return self._make_request('/agent/understand', {'url': url})
    
    def recommend(self, url: str) -> Dict[str, Any]:
        """
        Get AI-driven recommendations for improving visibility
        
        Args:
            url: URL to get recommendations for
            
        Returns:
            Dictionary with recommendations
        """
        return self._make_request('/agent/recommend', {'url': url})
    
    # ═══════════════════════════════════════════════════════════════
    # BULK OPERATIONS
    # ═══════════════════════════════════════════════════════════════
    
    def analyze_bulk(self, urls: List[str], concurrency: int = 3) -> List[AnalysisResult]:
        """
        Analyze multiple URLs in parallel
        
        Args:
            urls: List of URLs to analyze
            concurrency: Number of concurrent requests (default: 3)
            
        Returns:
            List of AnalysisResult objects
            
        Example:
            results = client.analyze_bulk([
                "https://example1.com",
                "https://example2.com",
                "https://example3.com"
            ])
            for r in results:
                print(f"{r.url}: {r.score}")
        """
        results = []
        for url in urls:
            try:
                results.append(self.analyze(url))
            except AgentSEOError as e:
                print(f"Failed to analyze {url}: {e.message}")
        return results
    
    def ai_ready_bulk(self, urls: List[str]) -> List[AIReadinessResult]:
        """
        Check AI readiness for multiple URLs
        
        Args:
            urls: List of URLs to check
            
        Returns:
            List of AIReadinessResult objects
        """
        results = []
        for url in urls:
            try:
                results.append(self.ai_ready(url))
            except AgentSEOError as e:
                print(f"Failed to check {url}: {e.message}")
        return results
    
    # ═══════════════════════════════════════════════════════════════
    # UTILITY METHODS
    # ═══════════════════════════════════════════════════════════════
    
    def health(self) -> Dict[str, Any]:
        """
        Get service health status
        
        Returns:
            Dictionary with health status
        """
        return self._make_request('/health')
    
    def quick_score(self, url: str) -> Dict[str, int]:
        """
        Get score summary for quick checks
        
        Args:
            url: URL to check
            
        Returns:
            Dictionary with score, ai_score, and seo_score
        """
        result = self.analyze(url)
        return {
            'score': result.score,
            'ai_score': result.ai_readiness.score,
            'seo_score': result.traditional_seo.score
        }


# Add missing import
import urllib.parse
