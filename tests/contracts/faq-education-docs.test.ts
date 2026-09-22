import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const educationalPages = [
  {
    filePath: 'docs/guides/typescript-rules-engine.md',
    title: '# TypeScript rules engines: when business logic should become data',
    requiredTerms: ['Neuron', 'Synapse', 'validateScript', 'explainExecution'],
  },
  {
    filePath: 'docs/guides/ai-generated-validated-rules.md',
    title: '# AI-generated rules: validate, review, then execute',
    requiredTerms: ['validateScript', 'validateExecutionContext', 'Neuron', 'Synapse'],
  },
  {
    filePath: 'docs/guides/explainable-business-rules.md',
    title: '# Explainable business rules: produce decision traces',
    requiredTerms: [
      'explainExecution',
      'summarizeExecutionOutput',
      'validateExecutionExplanation',
      'validateExecutionOutput',
    ],
  },
];

const publicPaths = [
  'https://sebasoft.github.io/neuron-js/faq.html',
  'https://sebasoft.github.io/neuron-js/guides/',
  'https://sebasoft.github.io/neuron-js/guides/typescript-rules-engine.html',
  'https://sebasoft.github.io/neuron-js/guides/ai-generated-validated-rules.html',
  'https://sebasoft.github.io/neuron-js/guides/explainable-business-rules.html',
];

describe('FAQ and educational documentation contracts', () => {
  it('publishes the source-backed FAQ and guide pages', () => {
    expect(existsSync('docs/faq.md')).toBe(true);
    expect(existsSync('docs/guides/index.md')).toBe(true);

    const faq = readFileSync('docs/faq.md', 'utf8');
    expect(faq).toContain('# Neuron-JS FAQ');
    expect(faq).toContain('## Sources');
    expect(faq).toContain('validateScript');
    expect(faq).toContain('explainExecution');

    for (const page of educationalPages) {
      expect(existsSync(page.filePath)).toBe(true);
      const content = readFileSync(page.filePath, 'utf8');
      expect(content).toContain(page.title);
      expect(content).toContain('## Sources and next steps');

      for (const term of page.requiredTerms) {
        expect(content).toContain(term);
      }
    }
  });

  it('exposes the FAQ and guides in VitePress navigation', () => {
    const config = readFileSync('docs/.vitepress/config.ts', 'utf8');

    expect(config).toContain("{ text: 'Guides', link: '/guides/' }");
    expect(config).toContain("{ text: 'FAQ', link: '/faq' }");

    for (const page of educationalPages) {
      const route = page.filePath.replace('docs', '').replace(/\.md$/, '');
      expect(config).toContain(route);
    }
  });

  it('makes the FAQ and education paths available to AI readers', () => {
    const llms = readFileSync('docs/public/llms.txt', 'utf8');
    const llmsFull = readFileSync('docs/public/llms-full.txt', 'utf8');

    for (const publicPath of publicPaths) {
      expect(llms).toContain(publicPath);
      expect(llmsFull).toContain(publicPath);
    }
  });
});
