#!/usr/bin/env node

// AgentSEO CLI
// Quick SEO analysis from the command line

import { analyzeURL, checkAIReadiness } from './analyzer.js';

const args = process.argv.slice(2);
const command = args[0];
const url = args[1];

if (!url) {
  console.log(`
🤖 AgentSEO CLI

Usage:
  agentseo analyze <url>   Analyze URL for AI SEO
  agentseo ai-ready <url>  Check AI readiness
  agentseo help            Show this help

Examples:
  agentseo analyze https://example.com
  agentseo ai-ready https://example.com
`);
  process.exit(0);
}

async function main() {
  try {
    if (command === 'analyze' || !command) {
      console.log(`\n🔍 Analyzing: ${url}\n`);
      const result = await analyzeURL(url);
      
      console.log(`📊 Overall Score: ${result.score}/100`);
      console.log(`\n🤖 AI Readiness: ${result.ai_readiness.score}/100`);
      console.log(`   - Structured Data: ${result.ai_readiness.structured_data.score}/100`);
      console.log(`   - Semantic HTML: ${result.ai_readiness.semantic_html.score}/100`);
      console.log(`   - Entities: ${result.ai_readiness.entity_extraction.score}/100`);
      
      console.log(`\n📝 Traditional SEO: ${result.traditional_seo.score}/100`);
      
      if (result.recommendations?.length > 0) {
        console.log(`\n💡 Top Recommendations:`);
        result.recommendations.slice(0, 5).forEach((rec, i) => {
          console.log(`   ${i + 1}. [${rec.priority}] ${rec.message}`);
        });
      }
      
      console.log(`\n✅ Full report: https://agentseo.tech/analyze?url=${encodeURIComponent(url)}\n`);
      
    } else if (command === 'ai-ready') {
      console.log(`\n🤖 Checking AI Readiness: ${url}\n`);
      const result = await checkAIReadiness(url);
      
      console.log(`📊 AI Ready Score: ${result.ai_ready_score}/100`);
      console.log(`\n📋 Checks:`);
      
      for (const [check, data] of Object.entries(result.checks)) {
        const status = data.pass ? '✅' : '❌';
        console.log(`   ${status} ${check}: ${data.score || (data.pass ? 'pass' : 'fail')}`);
      }
      
      if (result.issues?.length > 0) {
        console.log(`\n⚠️  Issues:`);
        result.issues.forEach(issue => {
          console.log(`   - [${issue.severity}] ${issue.message}`);
        });
      }
      
      console.log(`\n💬 ${result.summary}\n`);
      
    } else if (command === 'help') {
      console.log(`
🤖 AgentSEO CLI - Help

Commands:
  analyze <url>   Full SEO analysis for AI agents
  ai-ready <url>  Quick AI crawler compatibility check
  
Examples:
  agentseo analyze https://example.com
  agentseo ai-ready https://example.com
      `);
    } else {
      console.log(`Unknown command: ${command}`);
      console.log(`Run 'agentseo help' for usage`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
