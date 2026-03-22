#!/usr/bin/env node

/**
 * AgentSEO CLI v2 - SEO for the Agentic Era
 * Improved with better UX and more commands
 */

import { AgentSEO } from './index.js';

const args = process.argv.slice(2);
const command = args[0];
const url = args[1];

// Colors
const c = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

const log = (color, ...args) => console.log(color, ...args, c.reset);
const error = (msg) => log(c.red, `❌ ${msg}`);
const success = (msg) => log(c.green, `✅ ${msg}`);
const info = (msg) => log(c.cyan, `ℹ️  ${msg}`);
const warn = (msg) => log(c.yellow, `⚠️  ${msg}`);

// Get API key
const apiKey = process.env.AGENTSEO_API_KEY || 
  args.find(a => a.startsWith('--api-key='))?.split('=')[1];
const outputJson = args.includes('--json');
const client = new AgentSEO({ apiKey, baseUrl: 'http://localhost:3000' });

// Help text
const help = `
${c.cyan}╔══════════════════════════════════════════════════════════╗
║     🤖 AgentSEO CLI v2 - SEO for the Agentic Era         ║
╚══════════════════════════════════════════════════════════╝${c.reset}

${c.bright}USAGE:${c.reset}
  agentseo <command> [options]

${c.bright}COMMANDS:${c.reset}
  ${c.green}analyze${c.reset} <url>       Full SEO analysis for AI agents
  ${c.green}ai-ready${c.reset} <url>      Check AI crawler compatibility
  ${c.green}schemas${c.reset} <url>        Extract structured data (JSON-LD)
  ${c.green}entities${c.reset} <url>       Extract entities from page
  ${c.green}compare${c.reset} <u1> <u2>    Compare two URLs
  ${c.green}crawl${c.reset} <url>          Simulate AI crawl
  ${c.green}understand${c.reset} <url>     AI comprehension score
  ${c.green}recommend${c.reset} <url>      AI-driven recommendations
  ${c.green}quick${c.reset} <url>         Quick score check (fast)
  ${c.green}bulk${c.reset} <file>         Bulk analyze URLs from file
  ${c.green}monitor${c.reset} <url>        Monitor URL over time
  ${c.green}health${c.reset}               Check API health

${c.bright}OPTIONS:${c.reset}
  ${c.yellow}--json${c.reset}              Output as JSON
  ${c.yellow}--api-key${c.reset} <key>    Your API key
  ${c.yellow}--format${c.reset} <fmt>      Output format: text|json|compact

${c.bright}EXAMPLES:${c.reset}
  ${c.dim}# Analyze a website${c.reset}
  agentseo analyze https://example.com

  ${c.dim}# Quick AI readiness check${c.reset}
  agentseo ai-ready https://example.com

  ${c.dim}# Compare two sites${c.reset}
  agentseo compare https://yours.com https://competitor.com

  ${c.dim}# Bulk analysis from file${c.reset}
  agentseo bulk urls.txt

  ${c.dim}# JSON output for automation${c.reset}
  agentseo analyze https://example.com --json

${c.bright}ENVIRONMENT:${c.reset}
  AGENTSEO_API_KEY   Your API key

${c.bright}GETTING STARTED:${c.reset}
  1. Get an API key at ${c.underline}https://agentseo.tech${c.reset}
  2. Export: ${c.green}export AGENTSEO_API_KEY=your-key${c.reset}
  3. Run: ${c.green}agentseo analyze https://your-site.com${c.reset}

${c.bright}MORE INFO:${c.reset}
  Website: https://agentseo.tech
  Docs:    https://docs.agentseo.tech
  GitHub:  https://github.com/developerfred/agent-seo
`;

// Print score bar
function scoreBar(score) {
  const filled = Math.round(score / 10);
  const empty = 10 - filled;
  const color = score >= 80 ? c.green : score >= 60 ? c.yellow : c.red;
  return `${color}[${'█'.repeat(filled)}${'░'.repeat(empty)}]${c.reset}`;
}

// Format score with color
function formatScore(label, score, max = 100) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 80 ? c.green : pct >= 60 ? c.yellow : c.red;
  return `  ${scoreBar(score)} ${score}/${max} ${c.dim}(${pct}%)${c.reset}`;
}

async function cmdAnalyze() {
  if (!url) {
    error('URL required');
    info('Usage: agentseo analyze <url>');
    process.exit(1);
  }

  info(`Analyzing: ${url}`);
  const start = Date.now();

  try {
    const result = await client.analyze(url);
    const ms = Date.now() - start;

    if (outputJson) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    console.log();
    log(c.bright, `📊 ANALYSIS RESULTS (${ms}ms)`);
    console.log('─'.repeat(50));
    
    log(c.bright, `🏆 Overall Score:`);
    console.log(formatScore('', result.score));
    
    log(c.bright, `\n🤖 AI Readiness:`);
    console.log(formatScore('  Structured Data', result.ai_readiness.structured_data.score));
    console.log(formatScore('  Semantic HTML', result.ai_readiness.semantic_html.score));
    console.log(formatScore('  Entity Extraction', result.ai_readiness.entity_extraction.score));
    
    log(c.bright, `\n📝 Traditional SEO:`);
    console.log(formatScore('', result.traditional_seo.score));
    
    // Meta tags status
    const { meta_tags, headings, images } = result.traditional_seo;
    console.log();
    console.log(`  ${c.dim}Meta tags:${c.reset}`);
    console.log(`    Title:       ${meta_tags.title ? success('✓') : error('✗')}`);
    console.log(`    Description: ${meta_tags.description ? success('✓') : error('✗')}`);
    console.log(`    OG Tags:     ${meta_tags.og_tags ? success('✓') : error('✗')}`);
    console.log(`  ${c.dim}Headings:${c.reset}`);
    console.log(`    H1: ${headings.h1_count} ${headings.h1_count === 1 ? success('✓') : warn('should be 1')}`);
    console.log(`    H2: ${headings.h2_count}`);
    console.log(`  ${c.dim}Images:${c.reset}`);
    console.log(`    Total: ${images.total} | With alt: ${images.with_alt}`);

    // Recommendations
    if (result.recommendations?.length > 0) {
      console.log();
      log(c.bright, `💡 RECOMMENDATIONS (${result.recommendations.length})`);
      console.log('─'.repeat(50));
      
      const sorted = [...result.recommendations].sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      });

      sorted.slice(0, 7).forEach((rec, i) => {
        const pColor = rec.priority === 'high' ? c.red : rec.priority === 'medium' ? c.yellow : c.blue;
        console.log(`  ${c.dim}${i + 1}.${c.reset} [${pColor}${rec.priority.toUpperCase()}${c.reset}] ${rec.message}`);
      });

      if (sorted.length > 7) {
        console.log(`  ${c.dim}... and ${sorted.length - 7} more${c.reset}`);
      }
    }

    console.log();
    info(`Full report: https://agentseo.tech/analyze?url=${encodeURIComponent(url)}`);
    console.log();

  } catch (err) {
    error(`Analysis failed: ${err.message}`);
    if (err.code) warn(`Error code: ${err.code}`);
    process.exit(1);
  }
}

async function cmdAIReady() {
  if (!url) {
    error('URL required');
    process.exit(1);
  }

  info(`Checking AI Readiness: ${url}`);

  try {
    const result = await client.aiReady(url);

    if (outputJson) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    console.log();
    log(c.bright, `🤖 AI READINESS CHECK`);
    console.log('─'.repeat(50));
    
    const score = result.ai_ready_score;
    const summaryColor = score >= 80 ? c.green : score >= 60 ? c.yellow : c.red;
    
    log(c.bright, `\n📊 AI Ready Score:`);
    console.log(formatScore('', score));
    console.log(`  ${summaryColor}${result.summary}${c.reset}`);

    console.log();
    log(c.bright, `📋 CHECKS`);
    console.log('─'.repeat(50));

    const checks = [
      ['Schema.org', result.checks.schema_org],
      ['JSON-LD', result.checks.json_ld],
      ['Semantic HTML', result.checks.semantic_html],
      ['Entity Definitions', result.checks.entity_definitions],
      ['GPTBot Access', { passed: result.checks.gptbot_access }],
      ['Claude Indexable', { passed: result.checks.claude_indexable }],
    ];

    checks.forEach(([name, check]) => {
      const passed = check.passed !== false;
      const status = passed ? `${c.green}✅ PASS` : `${c.red}❌ FAIL`;
      const score = typeof check.score === 'number' ? ` ${c.dim}(${check.score}%)${c.reset}` : '';
      console.log(`  ${status} ${name}${score}`);
    });

    if (result.issues?.length > 0) {
      console.log();
      log(c.red, `⚠️  ISSUES (${result.issues.length})`);
      console.log('─'.repeat(50));
      result.issues.forEach(issue => {
        const sColor = issue.severity === 'high' ? c.red : c.yellow;
        console.log(`  [${sColor}${issue.severity}${c.reset}] ${issue.message}`);
      });
    }

    console.log();

  } catch (err) {
    error(`Check failed: ${err.message}`);
    process.exit(1);
  }
}

async function cmdQuick() {
  if (!url) {
    error('URL required');
    process.exit(1);
  }

  try {
    const result = await client.quickScore(url);

    if (outputJson) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    console.log();
    log(c.bright, `⚡ QUICK SCORE`);
    console.log('─'.repeat(50));
    console.log(formatScore('Overall', result.score));
    console.log(formatScore('AI Score', result.ai_score));
    console.log(formatScore('SEO Score', result.seo_score));
    console.log();
    console.log(`  ${c.dim}Breakdown:${c.reset}`);
    console.log(`    AI SEO:   ${(result.ai_score / result.score * 100).toFixed(0)}%`);
    console.log(`    Trad SEO: ${(result.seo_score / result.score * 100).toFixed(0)}%`);
    console.log();

  } catch (err) {
    error(`Quick score failed: ${err.message}`);
    process.exit(1);
  }
}

async function cmdCompare() {
  const url2 = args[2];
  if (!url || !url2) {
    error('Two URLs required');
    info('Usage: agentseo compare <url1> <url2>');
    process.exit(1);
  }

  info(`Comparing URLs...`);
  console.log(`  1: ${url}`);
  console.log(`  2: ${url2}`);

  try {
    const result = await client.compare(url, url2);

    if (outputJson) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    console.log();
    log(c.bright, `⚖️  COMPARISON`);
    console.log('─'.repeat(50));
    
    const score1 = result.comparison.url1.score;
    const score2 = result.comparison.url2.score;
    const winner = result.winner === 'url1' ? url : url2;
    const winnerScore = result.winner === 'url1' ? score1 : score2;
    const loserScore = result.winner === 'url1' ? score2 : score1;

    console.log(`  ${scoreBar(score1)} ${score1}/100  ${c.cyan}${url}${c.reset}`);
    console.log(`  ${scoreBar(score2)} ${score2}/100  ${c.cyan}${url2}${c.reset}`);
    
    console.log();
    log(c.green, `🏆 WINNER: ${winner}`);
    log(c.green, `   Score: ${winnerScore} vs ${loserScore} (+${winnerScore - loserScore})`);
    console.log();

  } catch (err) {
    error(`Comparison failed: ${err.message}`);
    process.exit(1);
  }
}

async function cmdBulk() {
  const file = args[1];
  if (!file) {
    error('File required');
    info('Usage: agentseo bulk <file>');
    process.exit(1);
  }

  info(`Reading URLs from: ${file}`);
  
  try {
    const fs = await import('fs');
    const urls = fs.readFileSync(file, 'utf-8')
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#'));

    if (urls.length === 0) {
      warn('No URLs found in file');
      return;
    }

    info(`Found ${urls.length} URLs, analyzing...`);
    console.log();

    const results = await client.analyzeBulk(urls, 3);
    
    console.log();
    log(c.bright, `📊 BULK RESULTS (${results.length}/${urls.length} succeeded)`);
    console.log('─'.repeat(50));

    results
      .sort((a, b) => b.score - a.score)
      .forEach((r, i) => {
        const rank = `${i + 1}.`.padStart(3);
        console.log(`${c.dim}${rank}${c.reset} ${scoreBar(r.score)} ${r.score} ${c.cyan}${r.url}${c.reset}`);
      });

    console.log();
    const avg = results.reduce((s, r) => s + r.score, 0) / results.length;
    info(`Average score: ${avg.toFixed(1)}`);

  } catch (err) {
    error(`Bulk analysis failed: ${err.message}`);
    process.exit(1);
  }
}

async function cmdHealth() {
  try {
    const health = await client.health();
    
    if (outputJson) {
      console.log(JSON.stringify(health, null, 2));
      return;
    }

    console.log();
    log(c.bright, `🏥 API HEALTH`);
    console.log('─'.repeat(50));
    console.log(`  Status:  ${c.green}● ONLINE${c.reset}`);
    console.log(`  Version: ${health.version}`);
    console.log(`  Time:    ${new Date().toISOString()}`);
    console.log();

  } catch (err) {
    error(`Health check failed: ${err.message}`);
    process.exit(1);
  }
}

// Main dispatcher
const commands = {
  analyze: cmdAnalyze,
  'ai-ready': cmdAIReady,
  'ai_ready': cmdAIReady,
  quick: cmdQuick,
  compare: cmdCompare,
  bulk: cmdBulk,
  health: cmdHealth,
  help: () => console.log(help),
  '--help': () => console.log(help),
};

async function main() {
  if (!command || command === 'help') {
    console.log(help);
    return;
  }

  const cmd = commands[command];
  if (!cmd) {
    error(`Unknown command: ${command}`);
    info('Run "agentseo help" for usage');
    process.exit(1);
  }

  await cmd();
}

main().catch(err => {
  error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
