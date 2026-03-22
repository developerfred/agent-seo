# AgentSEO API Reference

## Base URL

```
https://api.agentseo.tech
```

## Authentication

All API requests require an API key in the Authorization header:

```bash
curl "https://api.agentseo.tech/analyze?url=https://example.com" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Rate Limits

| Plan | Requests/Day | Requests/Minute |
|------|---------------|-----------------|
| Free | 100 | 10 |
| Pro | 10,000 | 100 |
| Enterprise | Unlimited | 1000 |

## Endpoints

### Analysis

#### `GET /analyze`

Full SEO analysis including AI readiness and traditional SEO.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | URL to analyze |
| `include_entities` | boolean | No | Include entity extraction (default: true) |
| `include_recommendations` | boolean | No | Include recommendations (default: true) |

**Response:**
```json
{
  "url": "https://example.com",
  "analyzed_at": "2026-03-22T12:00:00Z",
  "score": 85,
  "ai_readiness": {
    "score": 90,
    "structured_data": {
      "found": ["Article", "Organization", "WebSite"],
      "missing": ["BreadcrumbList"],
      "score": 85
    },
    "semantic_html": {
      "score": 95,
      "uses_semantic_tags": true,
      "heading_hierarchy": "valid"
    },
    "entity_extraction": {
      "score": 88,
      "entities_found": 15,
      "top_entities": [
        { "name": "Entity Name", "type": "Organization", "confidence": 0.95 }
      ]
    }
  },
  "traditional_seo": {
    "score": 80,
    "meta_tags": {
      "title": true,
      "description": true,
      "og_tags": true
    },
    "headings": {
      "h1_count": 1,
      "h2_count": 4,
      "valid_structure": true
    },
    "images": {
      "total": 10,
      "with_alt": 8,
      "score": 80
    },
    "links": {
      "internal": 15,
      "external": 5
    }
  },
  "recommendations": [
    {
      "priority": "high",
      "category": "structured_data",
      "title": "Add BreadcrumbList schema",
      "description": "BreadcrumbList helps AI understand your site structure",
      "impact": "medium"
    }
  ]
}
```

---

#### `GET /ai-ready`

Check how well a URL is optimized for AI agents.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | URL to check |

**Response:**
```json
{
  "url": "https://example.com",
  "ai_ready_score": 85,
  "checks": {
    "schema_org": { "pass": true, "score": 100 },
    "json_ld": { "pass": true, "score": 100 },
    "semantic_html": { "pass": true, "score": 90 },
    "entity_definitions": { "pass": true, "score": 80 },
    "gptbot_access": { "pass": true },
    "claude_indexable": { "pass": true }
  },
  "issues": [],
  "summary": "Well optimized for AI agents"
}
```

---

#### `GET /extract-schema`

Extract and validate all structured data from a URL.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | URL to extract from |
| `format` | string | No | Output format: `json`, `rdf`, `microdata` (default: `json`) |

**Response:**
```json
{
  "url": "https://example.com",
  "schemas": [
    {
      "type": "Article",
      "data": { ... },
      "valid": true,
      "warnings": []
    },
    {
      "type": "Organization",
      "data": { ... },
      "valid": true,
      "warnings": []
    }
  ],
  "summary": {
    "total": 2,
    "valid": 2,
    "warnings": 0
  }
}
```

---

#### `GET /entities`

Extract and analyze entities from content.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | URL to analyze |
| `types` | string | No | Comma-separated entity types (Person, Organization, etc.) |

**Response:**
```json
{
  "url": "https://example.com",
  "entities": [
    {
      "name": "Apple Inc.",
      "type": "Organization",
      "confidence": 0.98,
      "occurrences": 5,
      "contexts": [
        "Apple Inc. announced...",
        "...competing with Apple..."
      ]
    },
    {
      "name": "Tim Cook",
      "type": "Person",
      "confidence": 0.95,
      "occurrences": 2
    }
  ],
  "knowledge_graph": {
    "connected_entities": 12,
    "main_topics": ["Technology", "Business"]
  }
}
```

---

#### `GET /compare`

Compare two URLs for AI visibility.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url1` | string | Yes | First URL |
| `url2` | string | Yes | Second URL |

**Response:**
```json
{
  "comparison": {
    "url1": {
      "url": "https://example1.com",
      "score": 85
    },
    "url2": {
      "url": "https://example2.com",
      "score": 72
    }
  },
  "winner": "url1",
  "advantages": [
    {
      "category": "structured_data",
      "winner": "url1",
      "difference": "+25%"
    }
  ],
  "recommendations": [
    {
      "for": "url2",
      "message": "Add more structured data schemas"
    }
  ]
}
```

---

### Agent Endpoints

#### `GET /agent/crawl`

Simulate how an AI agent would crawl a page.

**Response:**
```json
{
  "url": "https://example.com",
  "crawl_result": {
    "extracted_entities": [...],
    "understood_main_topics": [...],
    "confidence": 0.85,
    "missing_context": [...]
  },
  "what_ai_learned": {
    "primary_subject": "...",
    "entities": [...],
    "relationships": [...]
  }
}
```

---

#### `GET /agent/understand`

Get an AI comprehension score for content.

**Response:**
```json
{
  "url": "https://example.com",
  "comprehension_score": 88,
  "factors": {
    "clarity": 90,
    "structure": 85,
    "completeness": 88,
    "entity_definition": 90
  },
  "what_ai_understands": [
    "This is an article about...",
    "The main entity is...",
    "The key points are..."
  ],
  "what_ai_missing": [
    "Publication date",
    "Author credentials"
  ]
}
```

---

#### `GET /agent/recommend`

Get AI-driven recommendations for improving visibility.

**Response:**
```json
{
  "url": "https://example.com",
  "recommendations": [
    {
      "priority": 1,
      "category": "structured_data",
      "recommendation": "Add FAQPage schema",
      "reasoning": "FAQ schemas are heavily used by AI for direct answers",
      "example": { ... }
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "invalid_url",
  "message": "The provided URL is not valid",
  "details": "URL must start with http:// or https://"
}
```

### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "message": "Invalid or missing API key"
}
```

### 429 Too Many Requests
```json
{
  "error": "rate_limit_exceeded",
  "message": "Daily quota exceeded",
  "upgrade": "https://agentseo.tech/pricing"
}
```

### 500 Server Error
```json
{
  "error": "internal_error",
  "message": "An unexpected error occurred",
  "request_id": "req_abc123"
}
```

## SDKs

### JavaScript/TypeScript

```bash
npm install @agentseo/sdk
```

```typescript
import { AgentSEO } from '@agentseo/sdk';

const client = new AgentSEO({ apiKey: 'your-key' });

// Full analysis
const analysis = await client.analyze('https://example.com');

// AI readiness check
const aiReady = await client.aiReady('https://example.com');

// Extract entities
const entities = await client.entities('https://example.com');
```

### Python

```bash
pip install agentseo
```

```python
from agentseo import Client

client = Client(api_key='your-key')

# Full analysis
analysis = client.analyze('https://example.com')

# AI readiness check
ai_ready = client.ai_ready('https://example.com')
```

## Webhooks

For monitoring and alerts, configure webhooks:

```bash
curl -X POST "https://api.agentseo.tech/webhooks" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"url": "https://your-webhook.com/agentseo", "events": ["score_dropped", "new_issue"]}'
```
