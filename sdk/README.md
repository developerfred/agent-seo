# AgentSEO SDKs

Official SDKs for the AgentSEO API - SEO for the Agentic Era

## Available SDKs

| Language | Package | Install |
|----------|---------|---------|
| **JavaScript/TypeScript** | `@agentseo/sdk` | `npm install @agentseo/sdk` |
| **Python** | `agentseo` | `pip install agentseo` |

---

## JavaScript / TypeScript SDK

### Installation

```bash
npm install @agentseo/sdk
```

### Quick Start

```typescript
import { AgentSEO } from '@agentseo/sdk';

const client = new AgentSEO();

// Analyze a URL
const result = await client.analyze('https://example.com');

console.log(`Overall Score: ${result.score}`);
console.log(`AI Readiness: ${result.ai_readiness.score}`);
console.log(`Traditional SEO: ${result.traditional_seo.score}`);

// Check AI readiness
const aiReady = await client.aiReady('https://example.com');
console.log(`AI Ready Score: ${aiReady.ai_ready_score}`);
```

### Full Example

```typescript
import { AgentSEO } from '@agentseo/sdk';

async function main() {
  const client = new AgentSEO({ 
    apiKey: process.env.AGENTSEO_API_KEY 
  });

  // Full analysis
  const result = await client.analyze('https://example.com');
  
  // Print recommendations
  console.log('\n💡 Recommendations:');
  result.recommendations.forEach((rec, i) => {
    console.log(`  ${i + 1}. [${rec.priority}] ${rec.message}`);
  });

  // Extract entities
  const entities = await client.extractEntities('https://example.com');
  console.log(`\n🔗 Found ${entities.entities.length} entities`);
  
  // Compare with competitor
  const comparison = await client.compare(
    'https://yours.com',
    'https://competitor.com'
  );
  console.log(`\n🏆 Winner: ${comparison.winner}`);
}

main();
```

### Bulk Analysis

```typescript
const urls = [
  'https://example1.com',
  'https://example2.com',
  'https://example3.com',
];

// Analyze multiple URLs in parallel
const results = await client.analyzeBulk(urls, 5);

results.forEach(r => {
  console.log(`${r.url}: ${r.score}/100`);
});
```

---

## Python SDK

### Installation

```bash
pip install agentseo
```

### Quick Start

```python
from agentseo import AgentSEO

client = AgentSEO(api_key="your-api-key")

# Analyze a URL
result = client.analyze("https://example.com")

print(f"Overall Score: {result.score}")
print(f"AI Readiness: {result.ai_readiness.score}")
print(f"Traditional SEO: {result.traditional_seo.score}")
```

### Full Example

```python
from agentseo import AgentSEO

def main():
    client = AgentSEO(api_key="your-api-key")
    
    # Full analysis
    result = client.analyze("https://example.com")
    
    # Print recommendations
    print("\n💡 Recommendations:")
    for i, rec in enumerate(result.recommendations, 1):
        print(f"  {i}. [{rec.priority}] {rec.message}")
    
    # Check AI readiness
    ai_ready = client.ai_ready("https://example.com")
    print(f"\n🤖 AI Ready Score: {ai_ready.ai_ready_score}")
    
    # Extract entities
    entities = client.extract_entities("https://example.com")
    print(f"\n🔗 Found {len(entities.entities)} entities")
    print(f"Main topics: {entities.knowledge_graph.main_topics}")
    
    # Compare with competitor
    comparison = client.compare("https://yours.com", "https://competitor.com")
    print(f"\n🏆 Winner: {comparison.winner}")

if __name__ == "__main__":
    main()
```

### Using Models

```python
from agentseo import AgentSEO, AnalysisResult

client = AgentSEO()

# Type hints are supported
def process_result(result: AnalysisResult) -> int:
    return result.score

result = client.analyze("https://example.com")
score = process_result(result)
print(f"Score: {score}")
```

---

## API Reference

### Common Methods

| Method | Description |
|--------|-------------|
| `client.analyze(url)` | Full SEO analysis |
| `client.ai_ready(url)` | AI readiness check |
| `client.extract_schemas(url)` | Extract structured data |
| `client.extract_entities(url)` | Extract entities |
| `client.compare(url1, url2)` | Compare two URLs |
| `client.crawl(url)` | Simulate AI crawl |
| `client.understand(url)` | AI comprehension score |
| `client.recommend(url)` | Get recommendations |
| `client.analyze_bulk(urls)` | Bulk analysis |
| `client.quick_score(url)` | Quick score check |

### Response Objects

- `AnalysisResult` - Full analysis with AI readiness and traditional SEO
- `AIReadinessResult` - AI compatibility check
- `SchemaResult` - Extracted schemas
- `EntityResult` - Extracted entities with knowledge graph
- `CompareResult` - URL comparison

---

## Rate Limits

| Plan | Requests/Day | Requests/Minute |
|------|-------------|-----------------|
| Free | 100 | 10 |
| Pro | 10,000 | 100 |
| Enterprise | Unlimited | 1000 |

---

## Error Handling

### JavaScript

```typescript
import { AgentSEO, AgentSEOError } from '@agentseo/sdk';

const client = new AgentSEO();

try {
  const result = await client.analyze('https://example.com');
} catch (error) {
  if (error instanceof AgentSEOError) {
    console.error(`API Error: ${error.message}`);
    console.error(`Code: ${error.code}`);
    console.error(`Status: ${error.statusCode}`);
  }
}
```

### Python

```python
from agentseo import AgentSEO, AgentSEOError

client = AgentSEO()

try:
    result = client.analyze("https://example.com")
except AgentSEOError as e:
    print(f"API Error: {e.message}")
    print(f"Code: {e.code}")
    print(f"Status: {e.status_code}")
```

---

## More Info

- [API Documentation](https://docs.agentseo.tech)
- [Main README](../README.md)
- [AgentSEO Website](https://agentseo.tech)
