# AgentSEO - Getting Started

## What is AgentSEO?

AgentSEO is a comprehensive SEO platform designed for the **agentic era** - where AI agents like GPT, Claude, and others actively crawl, read, and use content from the web.

## Core Concepts

### Traditional vs Agentic SEO

In traditional SEO, we optimize for:
- Google/Bing/Bing crawlers
- Human readers
- Keyword rankings

In Agentic SEO, we optimize for:
- AI agents that consume content
- Knowledge graph extraction
- Structured data comprehension
- Entity resolution

### How AI Agents Read Content

AI agents don't "crawl" like Google. They:

1. **Extract structured data** - JSON-LD, Schema.org
2. **Build knowledge graphs** - Entities and relationships
3. **Understand context** - Semantic meaning
4. **Evaluate quality** - Authority, freshness, relevance
5. **Cross-reference** - Connect to known entities

## Quick Start

### 1. Get an API Key

Sign up at https://agentseo.tech to get your API key.

### 2. Analyze Your First URL

```bash
curl "https://api.agentseo.tech/analyze?url=https://example.com" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 3. Check AI Readiness

```bash
curl "https://api.agentseo.tech/ai-ready?url=https://example.com" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Common Use Cases

### Use Case 1: Pre-Publish Check

Before publishing content, check how AI agents will see it:

```bash
agentseo ai-ready https://your-content.com/article
```

### Use Case 2: Competitor Analysis

See how you compare to competitors in AI visibility:

```bash
agentseo compare https://yours.com https://competitor.com
```

### Use Case 3: Ongoing Monitoring

Track your AI visibility over time:

```bash
# Run weekly
agentseo monitor https://yours.com --schedule weekly
```

## Best Practices

### 1. Always Include Structured Data

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Article Title",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "datePublished": "2026-03-22",
  "publisher": {
    "@type": "Organization",
    "name": "Your Company"
  }
}
</script>
```

### 2. Use Semantic HTML

```html
<!-- Good -->
<article>
  <header>
    <h1>Article Title</h1>
    <p>Published <time datetime="2026-03-22">March 22, 2026</time></p>
  </header>
  <section>
    <h2>Section Title</h2>
    <p>Content...</p>
  </section>
</article>

<!-- Avoid -->
<div class="content">
  <div class="title">Article Title</div>
  <div class="text">Content...</div>
</div>
```

### 3. Define Clear Entities

Make it clear what your content is about:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://yourcompany.com",
  "sameAs": [
    "https://twitter.com/yourcompany",
    "https://linkedin.com/company/yourcompany"
  ]
}
</script>
```

## API Response Examples

### Analysis Response

```json
{
  "url": "https://example.com",
  "score": 85,
  "ai_readiness": {
    "score": 90,
    "structured_data": true,
    "semantic_html": true,
    "entities_defined": true
  },
  "traditional_seo": {
    "score": 80,
    "meta_tags": true,
    "headings": true,
    "images_alt": true
  },
  "recommendations": [
    {
      "priority": "high",
      "category": "structured_data",
      "message": "Add Article schema to improve AI comprehension"
    }
  ]
}
```

## Next Steps

- Read the [API Reference](./api.md)
- Check [Best Practices](./best-practices.md)
- Explore [Case Studies](./cases.md)
