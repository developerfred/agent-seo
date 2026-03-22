// AgentSEO Analyzer
// Core analysis engine for SEO in the agentic era

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

// Common Schema.org types for AI agents
const IMPORTANT_SCHEMAS = [
  'Article', 'NewsArticle', 'BlogPosting', 'WebPage', 'WebSite',
  'Organization', 'Person', 'Product', 'Event', 'BreadcrumbList',
  'FAQPage', 'HowTo', 'Recipe', 'Video', 'AudioObject'
];

// Entity types for extraction
const ENTITY_TYPES = [
  'Person', 'Organization', 'Place', 'LocalBusiness', 'Product',
  'Event', 'Movie', 'Book', 'SoftwareApplication'
];

/**
 * Main analysis function - comprehensive SEO analysis for AI agents
 */
export async function analyzeURL(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AgentSEO Bot (+https://agentseo.tech)',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract all components
    const [schemas, entities, htmlAnalysis, metaTags] = await Promise.all([
      extractSchemasFromHTML(html),
      extractEntitiesFromHTML($),
      analyzeSemanticHTML($),
      extractMetaTags($)
    ]);
    
    // Calculate scores
    const aiReadinessScore = calculateAIReadinessScore(schemas, entities, htmlAnalysis);
    const traditionalSEOScore = calculateTraditionalSEOScore(metaTags, htmlAnalysis);
    const overallScore = Math.round(aiReadinessScore * 0.6 + traditionalSEOScore * 0.4);
    
    // Generate recommendations
    const recommendations = generateRecommendations(schemas, entities, htmlAnalysis, metaTags);
    
    return {
      url,
      analyzed_at: new Date().toISOString(),
      score: overallScore,
      ai_readiness: {
        score: aiReadinessScore,
        structured_data: {
          found: schemas.map(s => s.type),
          missing: IMPORTANT_SCHEMAS.filter(t => !schemas.find(s => s.type === t)),
          score: schemas.length >= 3 ? 100 : schemas.length >= 1 ? 70 : 30
        },
        semantic_html: {
          score: htmlAnalysis.semanticScore,
          uses_semantic_tags: htmlAnalysis.usesSemantic,
          heading_hierarchy: htmlAnalysis.headingValid ? 'valid' : 'invalid'
        },
        entity_extraction: {
          score: entities.length >= 5 ? 100 : entities.length >= 2 ? 70 : 40,
          entities_found: entities.length,
          top_entities: entities.slice(0, 5).map(e => ({
            name: e.name,
            type: e.type,
            confidence: e.confidence
          }))
        }
      },
      traditional_seo: {
        score: traditionalSEOScore,
        meta_tags: {
          title: !!metaTags.title,
          description: !!metaTags.description,
          og_tags: !!metaTags.ogTags
        },
        headings: {
          h1_count: htmlAnalysis.h1Count,
          h2_count: htmlAnalysis.h2Count,
          valid_structure: htmlAnalysis.headingValid
        },
        images: {
          total: htmlAnalysis.imageCount,
          with_alt: htmlAnalysis.imagesWithAlt,
          score: htmlAnalysis.imagesWithAlt >= htmlAnalysis.imageCount * 0.8 ? 100 : 50
        },
        links: {
          internal: htmlAnalysis.internalLinks,
          external: htmlAnalysis.externalLinks
        }
      },
      recommendations
    };
  } catch (error) {
    throw new Error(`Failed to analyze URL: ${error.message}`);
  }
}

/**
 * Check AI readiness - focused analysis for AI agent compatibility
 */
export async function checkAIReadiness(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AgentSEO Bot (+https://agentseo.tech)'
      }
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const schemas = await extractSchemasFromHTML(html);
    const htmlAnalysis = analyzeSemanticHTML($);
    const metaTags = extractMetaTags($);
    
    // Check for AI crawler compatibility
    const robots = await checkRobotsTxt(url);
    
    const checks = {
      schema_org: {
        pass: schemas.length > 0,
        score: schemas.length >= 3 ? 100 : schemas.length >= 1 ? 70 : 30
      },
      json_ld: {
        pass: html.includes('application/ld+json'),
        score: html.includes('application/ld+json') ? 100 : 0
      },
      semantic_html: {
        pass: htmlAnalysis.usesSemantic && htmlAnalysis.headingValid,
        score: htmlAnalysis.semanticScore
      },
      entity_definitions: {
        pass: schemas.some(s => ['Organization', 'Person', 'WebSite'].includes(s.type)),
        score: schemas.some(s => ['Organization', 'Person', 'WebSite'].includes(s.type)) ? 80 : 30
      },
      gptbot_access: robots.gptbotAllowed,
      claude_indexable: true // Most sites are indexable by Claude
    };
    
    const passCount = Object.values(checks).filter(c => c.pass !== false).length;
    const aiReadyScore = Math.round((passCount / Object.keys(checks).length) * 100);
    
    const issues = [];
    if (!checks.schema_org.pass) issues.push({ severity: 'high', message: 'No Schema.org structured data found' });
    if (!checks.json_ld.pass) issues.push({ severity: 'medium', message: 'No JSON-LD script found' });
    if (!checks.semantic_html.pass) issues.push({ severity: 'medium', message: 'Semantic HTML issues detected' });
    if (!checks.entity_definitions.pass) issues.push({ severity: 'high', message: 'No Organization or Person schema defined' });
    
    return {
      url,
      ai_ready_score: aiReadyScore,
      checks,
      issues,
      summary: aiReadyScore >= 80 ? 'Well optimized for AI agents' :
               aiReadyScore >= 60 ? 'Partially optimized - room for improvement' :
               'Needs significant optimization for AI agents'
    };
  } catch (error) {
    throw new Error(`Failed to check AI readiness: ${error.message}`);
  }
}

/**
 * Extract all Schema.org structured data from HTML
 */
export async function extractSchemas(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AgentSEO Bot (+https://agentseo.tech)'
      }
    });
    
    const html = await response.text();
    const schemas = await extractSchemasFromHTML(html);
    
    return {
      url,
      schemas,
      summary: {
        total: schemas.length,
        valid: schemas.filter(s => s.valid).length,
        warnings: schemas.flatMap(s => s.warnings || [])
      }
    };
  } catch (error) {
    throw new Error(`Failed to extract schemas: ${error.message}`);
  }
}

/**
 * Extract entities from HTML content
 */
export async function extractEntities(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AgentSEO Bot (+https://agentseo.tech)'
      }
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);
    const entities = await extractEntitiesFromHTML($);
    
    // Group by type
    const byType = {};
    entities.forEach(e => {
      if (!byType[e.type]) byType[e.type] = [];
      byType[e.type].push(e);
    });
    
    return {
      url,
      entities,
      by_type: byType,
      knowledge_graph: {
        connected_entities: entities.length,
        main_topics: Object.keys(byType).slice(0, 5)
      }
    };
  } catch (error) {
    throw new Error(`Failed to extract entities: ${error.message}`);
  }
}

// Helper functions

async function extractSchemasFromHTML(html) {
  const schemas = [];
  
  // Extract JSON-LD
  const jsonLdRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      const type = data['@type'];
      if (type) {
        schemas.push({
          type,
          data,
          format: 'json-ld',
          valid: true,
          warnings: validateSchema(data)
        });
      }
    } catch (e) {
      schemas.push({
        type: 'Unknown',
        data: null,
        format: 'json-ld',
        valid: false,
        warnings: ['Invalid JSON-LD']
      });
    }
  }
  
  // Extract Microdata
  const microdataRegex = /itemtype="https?:\/\/schema\.org\/(\w+)"/gi;
  const foundTypes = new Set();
  
  while ((match = microdataRegex.exec(html)) !== null) {
    const type = match[1];
    if (!foundTypes.has(type)) {
      foundTypes.add(type);
      schemas.push({
        type,
        format: 'microdata',
        valid: true,
        warnings: []
      });
    }
  }
  
  // Extract RDFa
  const rdfaRegex = /typeof="https?:\/\/schema\.org\/(\w+)"/gi;
  
  while ((match = rdfaRegex.exec(html)) !== null) {
    const type = match[1];
    schemas.push({
      type,
      format: 'rdfa',
      valid: true,
      warnings: []
    });
  }
  
  return schemas;
}

function validateSchema(data) {
  const warnings = [];
  
  if (!data['@context']?.includes('schema.org')) {
    warnings.push('@context should be schema.org');
  }
  
  if (!data['@type']) {
    warnings.push('Missing @type');
  }
  
  return warnings;
}

async function extractEntitiesFromHTML($) {
  const entities = [];
  const seen = new Set();
  
  // Extract from Schema.org
  $('[itemscope]').each((i, el) => {
    const type = $(el).attr('itemtype')?.split('/').pop();
    if (type && !seen.has(type + i)) {
      seen.add(type + i);
      
      const nameEl = $(el).find('[itemprop="name"]').first();
      const name = nameEl.text().trim() || $(el).text().trim().slice(0, 50);
      
      if (name && name.length > 2) {
        entities.push({
          name,
          type,
          source: 'schema',
          confidence: 0.95
        });
      }
    }
  });
  
  // Extract from JSON-LD
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const data = JSON.parse($(el).html());
      const type = data['@type'];
      const name = data.name || data.headline;
      
      if (type && name && !seen.has(type + name)) {
        seen.add(type + name);
        entities.push({
          name,
          type,
          source: 'json-ld',
          confidence: 0.98
        });
      }
    } catch (e) {}
  });
  
  // Common entity patterns (simple NER simulation)
  const text = $('body').text();
  const orgPatterns = /(?:Inc|LLC|Corp|Ltd)\.?/g;
  const datePatterns = /\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}/g;
  
  // Look for capitalized phrases that might be organizations
  const capitalPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;
  let match;
  while ((match = capitalPattern.exec(text)) !== null) {
    const name = match[0];
    if (!seen.has(name) && name.length > 4) {
      seen.add(name);
      entities.push({
        name,
        type: 'Organization',
        source: 'text',
        confidence: 0.6
      });
    }
  }
  
  return entities.slice(0, 50); // Limit to top 50
}

function analyzeSemanticHTML($) {
  // Check for semantic elements
  const semanticTags = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer'];
  const usesSemantic = semanticTags.some(tag => $(tag).length > 0);
  
  // Heading analysis
  const h1Count = $('h1').length;
  const h2Count = $('h2').length;
  const headingValid = h1Count === 1 && h1Count < $('h2').length;
  
  // Image analysis
  const imageCount = $('img').length;
  const imagesWithAlt = $('img[alt]').length;
  
  // Link analysis
  const internalLinks = $('a[href^="/"], a[href*="' + window.location.host + '"]').length;
  const externalLinks = $('a[href^="http"]').length - internalLinks;
  
  // Calculate semantic score
  let semanticScore = 50;
  if (usesSemantic) semanticScore += 20;
  if (headingValid) semanticScore += 15;
  if (imagesWithAlt === imageCount) semanticScore += 15;
  
  return {
    usesSemantic,
    headingValid,
    h1Count,
    h2Count,
    semanticScore: Math.min(100, semanticScore),
    imageCount,
    imagesWithAlt,
    internalLinks,
    externalLinks
  };
}

function extractMetaTags($) {
  return {
    title: $('title').text().trim(),
    description: $('meta[name="description"]').attr('content'),
    ogTags: {
      title: $('meta[property="og:title"]').attr('content'),
      description: $('meta[property="og:description"]').attr('content'),
      image: $('meta[property="og:image"]').attr('content')
    },
    twitterTags: {
      card: $('meta[name="twitter:card"]').attr('content'),
      title: $('meta[name="twitter:title"]').attr('content')
    }
  };
}

async function checkRobotsTxt(url) {
  try {
    const urlObj = new URL(url);
    const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;
    
    const response = await fetch(robotsUrl);
    const robotsTxt = await response.text();
    
    return {
      gptbotAllowed: !robotsTxt.includes('Disallow:') || !robotsTxt.includes('GPTBot'),
      claudeAllowed: !robotsTxt.includes('Disallow:') || !robotsTxt.includes('Claude')
    };
  } catch (e) {
    return { gptbotAllowed: true, claudeAllowed: true };
  }
}

function calculateAIReadinessScore(schemas, entities, htmlAnalysis) {
  let score = 0;
  
  // Structured data (40%)
  if (schemas.length >= 5) score += 40;
  else if (schemas.length >= 3) score += 30;
  else if (schemas.length >= 1) score += 20;
  
  // Entities (30%)
  if (entities.length >= 10) score += 30;
  else if (entities.length >= 5) score += 20;
  else if (entities.length >= 2) score += 15;
  
  // Semantic HTML (30%)
  if (htmlAnalysis.usesSemantic && htmlAnalysis.headingValid) score += 30;
  else if (htmlAnalysis.usesSemantic || htmlAnalysis.headingValid) score += 15;
  
  return Math.min(100, score);
}

function calculateTraditionalSEOScore(metaTags, htmlAnalysis) {
  let score = 50;
  
  if (metaTags.title) score += 10;
  if (metaTags.description) score += 10;
  if (metaTags.ogTags.title) score += 5;
  if (metaTags.ogTags.description) score += 5;
  if (htmlAnalysis.headingValid) score += 10;
  if (htmlAnalysis.imagesWithAlt === htmlAnalysis.imageCount) score += 10;
  
  return Math.min(100, score);
}

function generateRecommendations(schemas, entities, htmlAnalysis, metaTags) {
  const recommendations = [];
  
  // Structured data recommendations
  if (schemas.length === 0) {
    recommendations.push({
      priority: 'high',
      category: 'structured_data',
      message: 'Add Schema.org structured data to help AI understand your content'
    });
  }
  
  if (!schemas.find(s => s.type === 'Organization')) {
    recommendations.push({
      priority: 'high',
      category: 'structured_data',
      message: 'Add Organization schema to define your entity'
    });
  }
  
  if (!schemas.find(s => s.type === 'WebSite')) {
    recommendations.push({
      priority: 'medium',
      category: 'structured_data',
      message: 'Add WebSite schema with siteSearch capability'
    });
  }
  
  if (!schemas.find(s => ['Article', 'BlogPosting', 'NewsArticle'].includes(s.type))) {
    recommendations.push({
      priority: 'medium',
      category: 'structured_data',
      message: 'Add Article schema for content pages'
    });
  }
  
  // HTML recommendations
  if (!htmlAnalysis.usesSemantic) {
    recommendations.push({
      priority: 'high',
      category: 'semantic_html',
      message: 'Use semantic HTML5 elements (header, nav, main, article, footer)'
    });
  }
  
  if (!htmlAnalysis.headingValid) {
    recommendations.push({
      priority: 'high',
      category: 'semantic_html',
      message: 'Fix heading structure: use exactly one H1 and proper hierarchy'
    });
  }
  
  // Entity recommendations
  if (entities.length < 5) {
    recommendations.push({
      priority: 'medium',
      category: 'entity',
      message: 'Clearly define entities using schema markup'
    });
  }
  
  // Meta tag recommendations
  if (!metaTags.description) {
    recommendations.push({
      priority: 'medium',
      category: 'meta_tags',
      message: 'Add meta description for better AI context'
    });
  }
  
  if (!metaTags.ogTags.title) {
    recommendations.push({
      priority: 'low',
      category: 'meta_tags',
      message: 'Add Open Graph tags for social AI understanding'
    });
  }
  
  return recommendations;
}
