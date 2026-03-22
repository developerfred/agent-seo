/**
 * AgentSEO JavaScript/TypeScript SDK
 * SEO for the Agentic Era
 */

import { fetch } from 'undici';

export interface AgentSEOConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}

export interface AnalysisResult {
  url: string;
  analyzed_at: string;
  score: number;
  ai_readiness: AIReadiness;
  traditional_seo: TraditionalSEO;
  recommendations: Recommendation[];
}

export interface AIReadiness {
  score: number;
  structured_data: {
    found: string[];
    missing: string[];
    score: number;
  };
  semantic_html: {
    score: number;
    uses_semantic_tags: boolean;
    heading_hierarchy: string;
  };
  entity_extraction: {
    score: number;
    entities_found: number;
    top_entities: Entity[];
  };
}

export interface Entity {
  name: string;
  type: string;
  confidence: number;
}

export interface TraditionalSEO {
  score: number;
  meta_tags: {
    title: boolean;
    description: boolean;
    og_tags: boolean;
  };
  headings: {
    h1_count: number;
    h2_count: number;
    valid_structure: boolean;
  };
  images: {
    total: number;
    with_alt: number;
    score: number;
  };
  links: {
    internal: number;
    external: number;
  };
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  message: string;
}

export interface AIReadinessResult {
  url: string;
  ai_ready_score: number;
  checks: {
    schema_org: { pass: boolean; score: number };
    json_ld: { pass: boolean; score: number };
    semantic_html: { pass: boolean; score: number };
    entity_definitions: { pass: boolean; score: number };
    gptbot_access: boolean;
    claude_indexable: boolean;
  };
  issues: { severity: string; message: string }[];
  summary: string;
}

export interface SchemaResult {
  url: string;
  schemas: Schema[];
  summary: {
    total: number;
    valid: number;
    warnings: string[];
  };
}

export interface Schema {
  type: string;
  data?: Record<string, unknown>;
  format: 'json-ld' | 'microdata' | 'rdfa';
  valid: boolean;
  warnings: string[];
}

export interface EntityResult {
  url: string;
  entities: ExtractedEntity[];
  by_type: Record<string, ExtractedEntity[]>;
  knowledge_graph: {
    connected_entities: number;
    main_topics: string[];
  };
}

export interface ExtractedEntity {
  name: string;
  type: string;
  source: string;
  confidence: number;
}

export interface CompareResult {
  comparison: {
    url1: { url: string; score: number };
    url2: { url: string; score: number };
  };
  winner: 'url1' | 'url2';
  analysis: {
    url1: AnalysisResult;
    url2: AnalysisResult;
  };
}

export interface AgentCrawlResult {
  url: string;
  crawl_result: {
    extracted_entities: ExtractedEntity[];
    understood_main_topics: Entity[];
    confidence: number;
    missing_context: string[];
  };
  what_ai_learned: {
    primary_subject: string;
    entities: string[];
    relationships: unknown[];
  };
}

export interface AgentUnderstandResult {
  url: string;
  comprehension_score: number;
  factors: {
    clarity: number;
    structure: number;
    completeness: number;
    entity_definition: number;
  };
  what_ai_understands: string[];
  what_ai_missing: Recommendation[];
}

export interface AgentRecommendResult {
  url: string;
  recommendations: {
    priority: number;
    category: string;
    recommendation: string;
    reasoning: string;
    impact: 'high' | 'medium' | 'low';
  }[];
}

export class AgentSEOError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AgentSEOError';
  }
}

export class AgentSEO {
  private apiKey?: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: AgentSEOConfig = {}) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.agentseo.tech';
    this.timeout = config.timeout || 30000;
  }

  /**
   * Set API key for authenticated requests
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Make authenticated request to API
   */
  private async request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new AgentSEOError(
          error.message || 'API request failed',
          error.code,
          response.status
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof AgentSEOError) throw error;
      throw new AgentSEOError(
        error instanceof Error ? error.message : 'Network request failed',
        'NETWORK_ERROR'
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // MAIN ANALYSIS METHODS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Full SEO analysis including AI readiness and traditional SEO
   * 
   * @example
   * const result = await client.analyze('https://example.com');
   * console.log(result.score); // Overall SEO score
   */
  async analyze(url: string): Promise<AnalysisResult> {
    return this.request<AnalysisResult>('/analyze', { url });
  }

  /**
   * Check AI readiness - focused analysis for AI agent compatibility
   * 
   * @example
   * const result = await client.aiReady('https://example.com');
   * console.log(result.ai_ready_score); // AI compatibility score
   */
  async aiReady(url: string): Promise<AIReadinessResult> {
    return this.request<AIReadinessResult>('/ai-ready', { url });
  }

  /**
   * Extract and validate all structured data from a URL
   * 
   * @example
   * const schemas = await client.extractSchemas('https://example.com');
   * schemas.schemas.forEach(s => console.log(s.type));
   */
  async extractSchemas(url: string): Promise<SchemaResult> {
    return this.request<SchemaResult>('/extract-schema', { url });
  }

  /**
   * Extract and analyze entities from content
   * 
   * @example
   * const entities = await client.extractEntities('https://example.com');
   * console.log(entities.knowledge_graph.main_topics);
   */
  async extractEntities(url: string): Promise<EntityResult> {
    return this.request<EntityResult>('/entities', { url });
  }

  /**
   * Compare two URLs for AI visibility
   * 
   * @example
   * const comparison = await client.compare(
   *   'https://example1.com',
   *   'https://example2.com'
   * );
   * console.log(comparison.winner); // 'url1' or 'url2'
   */
  async compare(url1: string, url2: string): Promise<CompareResult> {
    return this.request<CompareResult>('/compare', { url1, url2 });
  }

  // ═══════════════════════════════════════════════════════════════
  // AGENT-SPECIFIC METHODS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Simulate how an AI agent would crawl a page
   * 
   * @example
   * const crawl = await client.crawl('https://example.com');
   * console.log(crawl.what_ai_learned.primary_subject);
   */
  async crawl(url: string): Promise<AgentCrawlResult> {
    return this.request<AgentCrawlResult>('/agent/crawl', { url });
  }

  /**
   * Get an AI comprehension score for content
   * 
   * @example
   * const understanding = await client.understand('https://example.com');
   * console.log(understanding.comprehension_score);
   */
  async understand(url: string): Promise<AgentUnderstandResult> {
    return this.request<AgentUnderstandResult>('/agent/understand', { url });
  }

  /**
   * Get AI-driven recommendations for improving visibility
   * 
   * @example
   * const recs = await client.recommend('https://example.com');
   * recs.recommendations.forEach(r => console.log(r.recommendation));
   */
  async recommend(url: string): Promise<AgentRecommendResult> {
    return this.request<AgentRecommendResult>('/agent/recommend', { url });
  }

  // ═══════════════════════════════════════════════════════════════
  // BULK OPERATIONS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Analyze multiple URLs in parallel
   * 
   * @example
   * const results = await client.analyzeBulk([
   *   'https://example1.com',
   *   'https://example2.com'
   * ]);
   */
  async analyzeBulk(urls: string[], concurrency: number = 3): Promise<AnalysisResult[]> {
    const chunks: string[][] = [];
    
    for (let i = 0; i < urls.length; i += concurrency) {
      chunks.push(urls.slice(i, i + concurrency));
    }

    const results: AnalysisResult[] = [];
    
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(url => this.analyze(url).catch(err => {
          console.error(`Failed to analyze ${url}: ${err.message}`);
          return null;
        }))
      );
      results.push(...chunkResults.filter((r): r is AnalysisResult => r !== null));
    }

    return results;
  }

  /**
   * Get AI readiness for multiple URLs
   */
  async aiReadyBulk(urls: string[], concurrency: number = 3): Promise<AIReadinessResult[]> {
    return Promise.all(
      urls.map(url => this.aiReady(url).catch(err => {
        console.error(`Failed to check ${url}: ${err.message}`);
        return null;
      }))
    ).then(results => results.filter((r): r is AIReadinessResult => r !== null));
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get service health status
   */
  async health(): Promise<{ status: string; version: string }> {
    return this.request<{ status: string; version: string }>('/health');
  }

  /**
   * Get score summary for quick checks
   */
  async quickScore(url: string): Promise<{ score: number; ai_score: number; seo_score: number }> {
    const result = await this.analyze(url);
    return {
      score: result.score,
      ai_score: result.ai_readiness.score,
      seo_score: result.traditional_seo.score,
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// CONVENIENCE EXPORTS
// ═══════════════════════════════════════════════════════════════

export default AgentSEO;

// Factory function for quick usage without class instantiation
export function createClient(config?: AgentSEOConfig): AgentSEO {
  return new AgentSEO(config);
}

// Quick analysis helpers
export async function analyze(url: string, config?: AgentSEOConfig): Promise<AnalysisResult> {
  const client = new AgentSEO(config);
  return client.analyze(url);
}

export async function aiReady(url: string, config?: AgentSEOConfig): Promise<AIReadinessResult> {
  const client = new AgentSEO(config);
  return client.aiReady(url);
}

export async function quickScore(url: string, config?: AgentSEOConfig): Promise<number> {
  const client = new AgentSEO(config);
  const result = await client.analyze(url);
  return result.score;
}
