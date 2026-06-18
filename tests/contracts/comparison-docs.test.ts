import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const comparisonPages = [
  {
    filePath: 'docs/comparisons/json-rules-engine.md',
    publicPath: 'https://sebasoft.github.io/neuron-js/comparisons/json-rules-engine.html',
    title: 'Neuron-JS vs json-rules-engine',
    alternativeHeading: '## Choose json-rules-engine when',
  },
  {
    filePath: 'docs/comparisons/json-logic-js.md',
    publicPath: 'https://sebasoft.github.io/neuron-js/comparisons/json-logic-js.html',
    title: 'Neuron-JS vs JsonLogic / json-logic-js',
    alternativeHeading: '## Choose JsonLogic when',
  },
  {
    filePath: 'docs/comparisons/node-rules.md',
    publicPath: 'https://sebasoft.github.io/neuron-js/comparisons/node-rules.html',
    title: 'Neuron-JS vs node-rules',
    alternativeHeading: '## Choose node-rules when',
  },
  {
    filePath: 'docs/comparisons/if-else.md',
    publicPath: 'https://sebasoft.github.io/neuron-js/comparisons/if-else.html',
    title: 'Rules engine vs if/else',
    alternativeHeading: '## Choose if/else when',
  },
];


const articleDrafts = [
  'content-drafts/njs-growth-05/neuron-js-vs-json-rules-engine.md',
  'content-drafts/njs-growth-05/neuron-js-vs-jsonlogic.md',
  'content-drafts/njs-growth-05/neuron-js-vs-node-rules.md',
  'content-drafts/njs-growth-05/rules-engine-vs-if-else.md',
];

const supportedDraftCodeFenceLanguages = new Set(['json', 'typescript']);

const requiredMigrationTerms = [
  '## Decision matrix',
  '## Choose Neuron-JS when',
  '## Migration guide',
  '## Migration checklist',
  'validateScript',
  'validateExecutionContext',
  'summarizeExecutionOutput',
  'explainExecution',
];

describe('comparison and migration documentation contracts', () => {
  it('publishes the comparison hub and required migration pages', () => {
    expect(existsSync('docs/comparisons/index.md')).toBe(true);

    for (const page of comparisonPages) {
      expect(existsSync(page.filePath)).toBe(true);
    }
  });

  it.each(comparisonPages)('keeps $title migration structure complete', (page) => {
    const content = readFileSync(page.filePath, 'utf8');

    expect(content).toContain(`# ${page.title}`);
    expect(content).toContain(page.alternativeHeading);

    for (const term of requiredMigrationTerms) {
      expect(content).toContain(term);
    }
  });

  it('links comparison pages from VitePress navigation and sidebar', () => {
    const config = readFileSync('docs/.vitepress/config.ts', 'utf8');

    expect(config).toContain("{ text: 'Comparisons', link: '/comparisons/' }");

    for (const page of comparisonPages) {
      const route = page.filePath
        .replace('docs', '')
        .replace(/\.md$/, '')
        .replace('/index', '/');
      expect(config).toContain(route);
    }
  });



  it.each(articleDrafts)('keeps %s ready for the SebaSOFT.app drafting editor', (draftPath) => {
    const content = readFileSync(draftPath, 'utf8');

    expect(content).toContain('# Drafting fields');
    expect(content).toMatch(/^Title: .+/m);
    expect(content).toMatch(/^Alias: [a-z0-9-]+$/m);
    expect(content).toMatch(/^Description: .{40,3999}$/m);
    expect(content).toMatch(/^Tags: [a-z0-9, -]+$/m);
    expect(content).toContain('# Markdown body');
    expect(content).toContain('https://sebasoft.github.io/neuron-js/comparisons/');

    const codeFenceLanguages = [...content.matchAll(/^```(\w+)/gm)].map((match) => match[1]);
    for (const language of codeFenceLanguages) {
      expect(supportedDraftCodeFenceLanguages.has(language)).toBe(true);
    }

    expect(content).not.toContain('```mermaid');
    expect(content).not.toContain('$$');
  });

  it('exposes comparison pages to AI-readable docs and README discovery paths', () => {
    const llms = readFileSync('docs/public/llms.txt', 'utf8');
    const llmsFull = readFileSync('docs/public/llms-full.txt', 'utf8');
    const readme = readFileSync('README.md', 'utf8');
    const aiDocs = readFileSync('docs/ai-coding-assistants.md', 'utf8');

    expect(readme).toContain('docs/comparisons/');
    expect(aiDocs).toContain('/comparisons/');

    for (const page of comparisonPages) {
      expect(llms).toContain(page.publicPath);
      expect(llmsFull).toContain(page.publicPath);
    }
  });
});
