"""AgentSEO Data Models"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional


@dataclass
class Entity:
    """Represents an extracted entity"""
    name: str
    type: str
    confidence: float = 0.0
    source: str = ""


@dataclass
class Recommendation:
    """SEO Recommendation"""
    priority: str  # 'high', 'medium', 'low'
    category: str
    message: str


@dataclass
class StructuredDataScore:
    """Structured data scoring"""
    found: List[str]
    missing: List[str]
    score: int


@dataclass
class SemanticHTMLScore:
    """Semantic HTML scoring"""
    score: int
    uses_semantic_tags: bool
    heading_hierarchy: str


@dataclass
class EntityExtractionScore:
    """Entity extraction scoring"""
    score: int
    entities_found: int
    top_entities: List[Entity] = field(default_factory=list)


@dataclass
class AIReadiness:
    """AI Readiness metrics"""
    score: int
    structured_data: StructuredDataScore
    semantic_html: SemanticHTMLScore
    entity_extraction: EntityExtractionScore


@dataclass
class MetaTags:
    """Meta tags status"""
    title: bool
    description: bool
    og_tags: bool


@dataclass
class Headings:
    """Heading structure"""
    h1_count: int
    h2_count: int
    valid_structure: bool


@dataclass
class Images:
    """Image analysis"""
    total: int
    with_alt: int
    score: int


@dataclass
class Links:
    """Link analysis"""
    internal: int
    external: int


@dataclass
class TraditionalSEO:
    """Traditional SEO metrics"""
    score: int
    meta_tags: MetaTags
    headings: Headings
    images: Images
    links: Links


@dataclass
class AnalysisResult:
    """Full SEO Analysis Result"""
    url: str
    analyzed_at: str
    score: int
    ai_readiness: AIReadiness
    traditional_seo: TraditionalSEO
    recommendations: List[Recommendation] = field(default_factory=list)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'AnalysisResult':
        """Create from API response dictionary"""
        ai_readiness = AIReadiness(
            score=data['ai_readiness']['score'],
            structured_data=StructuredDataScore(
                found=data['ai_readiness']['structured_data']['found'],
                missing=data['ai_readiness']['structured_data']['missing'],
                score=data['ai_readiness']['structured_data']['score']
            ),
            semantic_html=SemanticHTMLScore(
                score=data['ai_readiness']['semantic_html']['score'],
                uses_semantic_tags=data['ai_readiness']['semantic_html']['uses_semantic_tags'],
                heading_hierarchy=data['ai_readiness']['semantic_html']['heading_hierarchy']
            ),
            entity_extraction=EntityExtractionScore(
                score=data['ai_readiness']['entity_extraction']['score'],
                entities_found=data['ai_readiness']['entity_extraction']['entities_found'],
                top_entities=[
                    Entity(**e) for e in data['ai_readiness']['entity_extraction'].get('top_entities', [])
                ]
            )
        )
        
        traditional_seo = TraditionalSEO(
            score=data['traditional_seo']['score'],
            meta_tags=MetaTags(**data['traditional_seo']['meta_tags']),
            headings=Headings(**data['traditional_seo']['headings']),
            images=Images(**data['traditional_seo']['images']),
            links=Links(**data['traditional_seo']['links'])
        )
        
        return cls(
            url=data['url'],
            analyzed_at=data['analyzed_at'],
            score=data['score'],
            ai_readiness=ai_readiness,
            traditional_seo=traditional_seo,
            recommendations=[Recommendation(**r) for r in data.get('recommendations', [])]
        )


@dataclass
class AICheck:
    """Individual AI readiness check"""
    pass_: bool
    score: Optional[int] = None
    
    @property
    def passed(self) -> bool:
        return self.pass_
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'AICheck':
        return cls(pass_=data.get('pass', False), score=data.get('score'))


@dataclass
class AIReadinessResult:
    """AI Readiness Check Result"""
    url: str
    ai_ready_score: int
    checks: Dict[str, AICheck]
    issues: List[Dict[str, str]]
    summary: str
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'AIReadinessResult':
        checks = {}
        for key, value in data.get('checks', {}).items():
            if isinstance(value, dict):
                checks[key] = AICheck.from_dict(value)
            else:
                checks[key] = AICheck(pass_=bool(value))
        
        return cls(
            url=data['url'],
            ai_ready_score=data['ai_ready_score'],
            checks=checks,
            issues=data.get('issues', []),
            summary=data.get('summary', '')
        )


@dataclass
class Schema:
    """Schema.org structured data"""
    type: str
    data: Optional[Dict[str, Any]] = None
    format: str = "json-ld"
    valid: bool = True
    warnings: List[str] = field(default_factory=list)


@dataclass 
class SchemaSummary:
    """Schema extraction summary"""
    total: int
    valid: int
    warnings: List[str]


@dataclass
class SchemaResult:
    """Schema Extraction Result"""
    url: str
    schemas: List[Schema]
    summary: SchemaSummary
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'SchemaResult':
        return cls(
            url=data['url'],
            schemas=[Schema(**s) for s in data.get('schemas', [])],
            summary=SchemaSummary(**data.get('summary', {}))
        )


@dataclass
class ExtractedEntity:
    """Extracted entity"""
    name: str
    type: str
    source: str
    confidence: float


@dataclass
class KnowledgeGraph:
    """Knowledge graph data"""
    connected_entities: int
    main_topics: List[str]


@dataclass
class EntityResult:
    """Entity Extraction Result"""
    url: str
    entities: List[ExtractedEntity]
    by_type: Dict[str, List[ExtractedEntity]]
    knowledge_graph: KnowledgeGraph
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'EntityResult':
        entities = [ExtractedEntity(**e) for e in data.get('entities', [])]
        by_type = {}
        for entity in entities:
            if entity.type not in by_type:
                by_type[entity.type] = []
            by_type[entity.type].append(entity)
        
        return cls(
            url=data['url'],
            entities=entities,
            by_type=by_type,
            knowledge_graph=KnowledgeGraph(**data.get('knowledge_graph', {}))
        )


@dataclass
class CompareResult:
    """URL Comparison Result"""
    url1: str
    url1_score: int
    url2: str
    url2_score: int
    winner: str  # 'url1' or 'url2'
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'CompareResult':
        comparison = data.get('comparison', {})
        url1_data = comparison.get('url1', {})
        url2_data = comparison.get('url2', {})
        return cls(
            url1=url1_data.get('url', ''),
            url1_score=url1_data.get('score', 0),
            url2=url2_data.get('url', ''),
            url2_score=url2_data.get('score', 0),
            winner=data.get('winner', '')
        )
