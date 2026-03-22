// AgentSEO API Server
// SEO for the Agentic Era

import express from 'express';
import cors from 'cors';
import { analyzeURL, checkAIReadiness, extractSchemas, extractEntities } from './analyzer.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware to check API key
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  // For now, allow all requests
  next();
};

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    service: 'AgentSEO API'
  });
});

// Main analyze endpoint
app.get('/analyze', apiKeyAuth, async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({
        error: 'missing_url',
        message: 'URL parameter is required'
      });
    }
    
    const analysis = await analyzeURL(url);
    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'analysis_failed',
      message: error.message
    });
  }
});

// AI Readiness check
app.get('/ai-ready', apiKeyAuth, async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({
        error: 'missing_url',
        message: 'URL parameter is required'
      });
    }
    
    const result = await checkAIReadiness(url);
    res.json(result);
  } catch (error) {
    console.error('AI readiness error:', error);
    res.status(500).json({
      error: 'check_failed',
      message: error.message
    });
  }
});

// Schema extraction
app.get('/extract-schema', apiKeyAuth, async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({
        error: 'missing_url',
        message: 'URL parameter is required'
      });
    }
    
    const schemas = await extractSchemas(url);
    res.json(schemas);
  } catch (error) {
    console.error('Schema extraction error:', error);
    res.status(500).json({
      error: 'extraction_failed',
      message: error.message
    });
  }
});

// Entity extraction
app.get('/entities', apiKeyAuth, async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({
        error: 'missing_url',
        message: 'URL parameter is required'
      });
    }
    
    const entities = await extractEntities(url);
    res.json(entities);
  } catch (error) {
    console.error('Entity extraction error:', error);
    res.status(500).json({
      error: 'extraction_failed',
      message: error.message
    });
  }
});

// Compare two URLs
app.get('/compare', apiKeyAuth, async (req, res) => {
  try {
    const { url1, url2 } = req.query;
    
    if (!url1 || !url2) {
      return res.status(400).json({
        error: 'missing_urls',
        message: 'Both url1 and url2 parameters are required'
      });
    }
    
    const [analysis1, analysis2] = await Promise.all([
      analyzeURL(url1),
      analyzeURL(url2)
    ]);
    
    res.json({
      comparison: {
        url1: { url: url1, score: analysis1.score },
        url2: { url: url2, score: analysis2.score }
      },
      winner: analysis1.score >= analysis2.score ? 'url1' : 'url2',
      analysis: {
        url1: analysis1,
        url2: analysis2
      }
    });
  } catch (error) {
    console.error('Compare error:', error);
    res.status(500).json({
      error: 'comparison_failed',
      message: error.message
    });
  }
});

// Agent-specific endpoints

// Simulate AI crawl
app.get('/agent/crawl', apiKeyAuth, async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({
        error: 'missing_url',
        message: 'URL parameter is required'
      });
    }
    
    const [analysis, entities] = await Promise.all([
      analyzeURL(url),
      extractEntities(url)
    ]);
    
    res.json({
      url,
      crawl_result: {
        extracted_entities: entities.entities.slice(0, 10),
        understood_main_topics: analysis.ai_readiness.entity_extraction?.top_entities?.slice(0, 5) || [],
        confidence: analysis.ai_readiness.score / 100,
        missing_context: analysis.recommendations?.slice(0, 3).map(r => r.message) || []
      },
      what_ai_learned: {
        primary_subject: entities.entities[0]?.name || 'Unknown',
        entities: entities.entities.map(e => e.name),
        relationships: []
      }
    });
  } catch (error) {
    console.error('Agent crawl error:', error);
    res.status(500).json({
      error: 'crawl_failed',
      message: error.message
    });
  }
});

// AI comprehension score
app.get('/agent/understand', apiKeyAuth, async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({
        error: 'missing_url',
        message: 'URL parameter is required'
      });
    }
    
    const [analysis, schemas] = await Promise.all([
      analyzeURL(url),
      extractSchemas(url)
    ]);
    
    const clarity = schemas.schemas.length > 0 ? 90 : 50;
    const structure = analysis.traditional_seo?.headings?.valid_structure ? 85 : 60;
    const completeness = schemas.schemas.length >= 3 ? 90 : schemas.schemas.length >= 1 ? 70 : 50;
    const entityDefinition = analysis.ai_readiness?.entity_extraction?.score || 50;
    
    const comprehensionScore = Math.round(
      (clarity * 0.25 + structure * 0.25 + completeness * 0.25 + entityDefinition * 0.25)
    );
    
    res.json({
      url,
      comprehension_score: comprehensionScore,
      factors: {
        clarity,
        structure,
        completeness,
        entity_definition: entityDefinition
      },
      what_ai_understands: [
        `This is a ${schemas.schemas[0]?.type || 'webpage'}`,
        `The main entity is ${analysis.ai_readiness?.entity_extraction?.entities_found || 0}`,
        `The key topic is defined through ${schemas.schemas.length} schema(s)`
      ],
      what_ai_missing: analysis.recommendations?.slice(0, 3) || []
    });
  } catch (error) {
    console.error('Understand error:', error);
    res.status(500).json({
      error: 'comprehension_failed',
      message: error.message
    });
  }
});

// AI-driven recommendations
app.get('/agent/recommend', apiKeyAuth, async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({
        error: 'missing_url',
        message: 'URL parameter is required'
      });
    }
    
    const analysis = await analyzeURL(url);
    
    res.json({
      url,
      recommendations: (analysis.recommendations || []).map((rec, i) => ({
        priority: i + 1,
        category: rec.category,
        recommendation: rec.message,
        reasoning: getReasoning(rec),
        impact: rec.priority === 'high' ? 'high' : 'medium'
      }))
    });
  } catch (error) {
    console.error('Recommend error:', error);
    res.status(500).json({
      error: 'recommendation_failed',
      message: error.message
    });
  }
});

function getReasoning(rec) {
  const reasonings = {
    'structured_data': 'Structured data helps AI understand your content context and relationships',
    'semantic_html': 'Semantic HTML improves AI comprehension of content hierarchy',
    'meta_tags': 'Meta tags provide AI with summary context',
    'entity': 'Clear entity definitions help AI connect your content to knowledge graphs'
  };
  return reasonings[rec.category] || 'This recommendation improves AI content understanding';
}

// Start server
app.listen(PORT, () => {
  console.log(`🤖 AgentSEO API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
