# AgentSEO

> **SEO for the Agentic Era** - Helping AI agents and humans optimize content for AI discovery

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Agentic SEO](https://img.shields.io/badge/SEO-Agentic%20Ready-purple)

## 🤖 What is AgentSEO?

AgentSEO is the first SEO platform designed for the **agentic era** - where AI agents crawl, read, and index content differently than traditional search engines.

### Key Differences

| Traditional SEO | Agentic SEO |
|----------------|-------------|
| Keywords for humans | Structured data for AI agents |
| Backlinks popularity | Entity relationships |
| Page rank | Understanding depth |
| Meta descriptions | JSON-LD schemas |
| Sitemap for crawlers | Machine-readable knowledge graphs |

## 🎯 For Who?

### AI Agents
- Parse and understand websites automatically
- Extract structured data correctly
- Evaluate content quality
- Build knowledge graphs

### Humans
- Optimize content for AI discovery
- Understand how AI sees their content
- Track AI visibility metrics
- Compare traditional vs agentic SEO

## 🚀 Quick Start

### Analyze a URL
```bash
curl "https://api.agentseo.tech/analyze?url=https://example.com"
```

### Check AI Readiness
```bash
curl "https://api.agentseo.tech/ai-ready?url=https://example.com"
```

### Get Structured Data
```bash
curl "https://api.agentseo.tech/extract-schema?url=https://example.com"
```

## 📊 Features

### Core Analysis
- [x] Schema.org validation
- [x] JSON-LD extraction and scoring
- [x] Semantic HTML analysis
- [x] Entity relationship mapping
- [x] Content quality scoring

### AI Readiness
- [x] GPTBot compatibility check
- [x] Claude indexable check
- [x] AI crawler detection
- [x] Structured data completeness

### Traditional SEO
- [x] Meta tag analysis
- [x] Heading hierarchy
- [x] Image alt text
- [x] Internal/external links
- [x] Core Web Vitals indicators

### Content Intelligence
- [x] Entity extraction
- [x] Topic classification
- [x] Sentiment analysis
- [x] Readability scoring
- [x] Knowledge graph connections

## 🔌 API Endpoints

### Analysis Endpoints

| Endpoint | Description | Price |
|----------|-------------|-------|
| `GET /analyze` | Full SEO analysis | $0.01 |
| `GET /ai-ready` | AI crawler compatibility | $0.005 |
| `GET /extract-schema` | JSON-LD extraction | $0.003 |
| `GET /entities` | Entity extraction | $0.005 |
| `GET /compare` | vs competitor | $0.015 |

### Agent Endpoints

| Endpoint | Description | Price |
|----------|-------------|-------|
| `GET /agent/crawl` | Simulate AI crawl | $0.008 |
| `GET /agent/understand` | AI comprehension score | $0.01 |
| `GET /agent/recommend` | AI-driven recommendations | $0.012 |

## 💰 Pricing

### Free Tier
- 100 requests/day
- Basic analysis
- Limited schemas

### Pro - $29/month
- 10,000 requests/day
- Full analysis
- All schemas
- Priority support

### Enterprise
- Unlimited requests
- Custom integrations
- Dedicated support
- SLA guarantee

## 📦 Libraries

### JavaScript/TypeScript
```bash
npm install @agentseo/sdk
```

```typescript
import { AgentSEO } from '@agentseo/sdk';

const client = new AgentSEO({ apiKey: 'your-key' });
const analysis = await client.analyze('https://example.com');
```

### Python
```bash
pip install agentseo
```

```python
from agentseo import Client

client = Client(api_key='your-key')
analysis = client.analyze('https://example.com')
```

## 🛠️ Tools

### CLI
```bash
npm install -g @agentseo/cli

# Analyze a site
agentseo analyze https://example.com

# Check AI readiness
agentseo ai-ready https://example.com

# Compare with competitor
agentseo compare https://example.com https://competitor.com
```

### Browser Extension
- Chrome Extension coming soon
- Firefox Extension coming soon

## 📚 Resources

### Documentation
- [Getting Started](./docs/getting-started.md)
- [API Reference](./docs/api.md)
- [Best Practices](./docs/best-practices.md)
- [Case Studies](./docs/cases.md)

### Blog
- [SEO in the Agentic Era](https://agentseo.tech/blog/seo-agentic-era)
- [How AI Agents Read Content](https://agentseo.tech/blog/how-ai-agents-read)
- [Structured Data for AI](https://agentseo.tech/blog/structured-data-ai)

## 🌍 Data Sources

AgentSEO combines multiple intelligence sources:

| Source | Purpose |
|--------|---------|
| **Moltbook** | Social signals and entity mentions |
| **Web Index** | Content analysis and crawling |
| **Knowledge Graphs** | Entity relationships |
| **AI Models** | Comprehension scoring |

## 🤝 Contributing

Contributions welcome! Please read our [contributing guide](./CONTRIBUTING.md).

## 📄 License

MIT © 2026 AIPOP Fun LTD

## 🔗 Links

- **Website:** https://agentseo.tech
- **API:** https://api.agentseo.tech
- **Docs:** https://docs.agentseo.tech
- **GitHub:** https://github.com/developerfred/agent-seo
- **Twitter:** @AgentSEO

---

**Built for the Agentic Era** 🌐
