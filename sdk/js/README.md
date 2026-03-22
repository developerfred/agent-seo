#!/usr/bin/env node

/**
 * AgentSEO CLI
 * SEO for the Agentic Era
 */

import { AgentSEO, analyze, aiReady } from './dist/index.mjs';

const args = process.argv.slice(2);
const command = args[0];
const url = args[1];

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

function help() {
  log(colors.cyan, `
🤖 AgentSEO CLI - SEO for the Agentic Era

${colors.bright}USAGE:${colors.reset}
  agentseo <command> [options]

${colors.bright}COMMANDS:${colors.reset}
  ${colors.green}analyze${colors.reset} <url>    Full SEO analysis for AI agents
  ${colors.green}ai-ready${colors.reset} <url>   Check AI crawler compatibility
  ${colors.green}schemas${colors.reset} <url>    Extract structured data
  ${colors.green}entities${colors.reset} <url>   Extract entities from page
  ${colors.green}compare${colors.reset} <url1> <url2>  Compare two URLs
  ${colors.green}crawl${colors.reset} <url>      Simulate AI crawl
  ${colors.green}understand${colors.reset} <url> Get AI comprehension score
  ${colors.green}recommend${colors.reset} <url>  Get AI-driven recommendations
  ${colors.green}quick${colors.reset} <url>       Quick score check
  ${colors.green}bulk${colors.reset} <file>      Bulk analyze URLs from file
  ${colors.green}help${colors.reset}             Show this help

${colors.bright}OPTIONS:${colors.reset}
  --json             Output as JSON
  --api-key <key>    Your API key

${colors.bright}EXAMPLES:${colors.reset}
  agentseo analyze https://example.com
  agentseo ai-ready https://example.com --json
  agentseo compare https://yours.com https://competitor.com

${colors.bright}ENVIRONMENT:${colors.reset}
  AGENTSEO_API_KEY   Your API key

${colors.bright}GETTING STARTED:${colors.reset}
  1. Get an API key at https://agentseo.tech
  2. Set it: export AGENTSEO_API_KEY=your-key
  3. Run: agentseo analyze https://your-site.com
`);
}

async function main() {
  if (!command || command === 'help' || command === '--help') {
    help();
    process.exit(0);
  }

  const apiKey = process.env.AGENTSEO_API_KEY || args.find(a => a.startsWith('--api-key='))?.split('=')[1];
  const outputJson = args.includes('--json');
  
  const client = new AgentSEO({ apiKey });

  try {
    switch (command) {
      case 'analyze': {
        if (!url) {
          log(colors.red, '❌ Error: URL required');
          log(colors.yellow, 'Usage: agentseo analyze <url>');
          process.exit(1);
        }
        
        log(colors.cyan, `🔍 Analyzing: ${url}`);
        const result = await client.analyze(url);
        
        if (outputJson) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log();
          log(colors.bright, `📊 Overall Score: ${result.score}/100`);
          log(colors.green, `   AI Readiness:  ${result.ai_readiness.score}/100`);
          log(colors.blue,  `   Traditional: ${result.traditional_seo.score}/100`);
          console.log();
          
          log(colors.bright, '🤖 AI Readiness Details:');
          log(colors.cyan, `   Structured Data: ${result.ai_readiness.structured_data.score}/100`);
          log(colors.cyan, `   Semantic HTML:   ${result.ai_readiness.semantic_html.score}/100`);
          log(colors.cyan, `   Entities:        ${result.ai_readiness.entity_extraction.score}/100`);
          
          if (result.recommendations?.length > 0) {
            console.log();
            log(colors.bright, '💡 Top Recommendations:');
            result.recommendations.slice(0, 5).forEach((rec, i) => {
              const color = rec.priority === 'high' ? colors.red : 
                           rec.priority === 'medium' ? colors.yellow : colors.blue;
              log(color, `   ${i + 1}. [${rec.priority}] ${rec.message}`);
            });
          }
          console.log();
        }
        break;
      }

      case 'ai-ready': {
        if (!url) {
          log(colors.red, '❌ Error: URL required');
          process.exit(1);
        }
        
        log(colors.cyan, `🤖 Checking AI Readiness: ${url}`);
        const result = await client.aiReady(url);
        
        if (outputJson) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log();
          const scoreColor = result.ai_ready_score >= 80 ? colors.green :
                            result.ai_ready_score >= 60 ? colors.yellow : colors.red;
          log(colors.bright, `📊 AI Ready Score: `);
          log(scoreColor, `   ${result.ai_ready_score}/100`);
          console.log();
          log(colors.bright, '📋 Checks:');
          
          for (const [check, data] of Object.entries(result.checks)) {
            const status = data.passed ? `${colors.green}✅` : `${colors.red}❌`;
            const score = typeof data.score === 'number' ? ` (${data.score}%)` : '';
            log(colors.reset, `   ${status} ${check}${score}${colors.reset}`);
          }
          
          if (result.issues?.length > 0) {
            console.log();
            log(colors.red, '⚠️  Issues:');
            result.issues.forEach(issue => {
              log(colors.yellow, `   • [${issue.severity}] ${issue.message}`);
            });
          }
          console.log();
        }
        break;
      }

      case 'quick': {
        if (!url) {
          log(colors.red, '❌ Error: URL required');
          process.exit(1);
        }
        
        log(colors.cyan, `⚡ Quick Score: ${url}`);
        const result = await client.quickScore(url);
        
        if (outputJson) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log();
          log(colors.bright, `📊 Score:      ${result.score}`);
          log(colors.green, `🤖 AI Score:   ${result.ai_score}`);
          log(colors.blue, `📝 SEO Score:  ${result.seo_score}`);
          console.log();
        }
        break;
      }

      case 'compare': {
        const url2 = args[2];
        if (!url || !url2) {
          log(colors.red, '❌ Error: Two URLs required');
          log(colors.yellow, 'Usage: agentseo compare <url1> <url2>');
          process.exit(1);
        }
        
        log(colors.cyan, `⚖️  Comparing:`);
        log(colors.cyan, `   1: ${url}`);
        log(colors.cyan, `   2: ${url2}`);
        
        const result = await client.compare(url, url2);
        
        if (outputJson) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log();
          log(colors.bright, '📊 Results:');
          log(colors.green, `   ${url}: ${result.comparison.url1.score}`);
          log(colors.blue,  `   ${url}: ${result.comparison.url2.score}`);
          console.log();
          log(colors.bright, `🏆 Winner: `);
          log(result.winner === 'url1' ? colors.green : colors.blue, 
              result.winner === 'url1' ? url : url2);
          console.log();
        }
        break;
      }

      default:
        log(colors.red, `❌ Unknown command: ${command}`);
        log(colors.yellow, 'Run "agentseo help" for usage');
        process.exit(1);
    }
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`);
    if (error.code) {
      log(colors.yellow, `   Code: ${error.code}`);
    }
    process.exit(1);
  }
}

main();
