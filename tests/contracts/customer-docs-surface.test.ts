import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// The customer-facing site publishes only user-relevant proof. Internal
// asset-production docs (prompts, storyboards, design system, manifests, capture
// spec, asset metadata) live in the private chaos-vault wiki, not in docs/.

const customerPages = [
  'docs/benchmarks/index.md',
  'docs/benchmarks/results.md',
  'docs/benchmarks/methodology.md',
  'docs/benchmarks/ai-rule-safety.md',
];

const relocatedInternalPages = [
  'docs/benchmarks/prompt-kit.md',
  'docs/benchmarks/visual-proof-system.md',
  'docs/benchmarks/benchmark-visual-pack.md',
  'docs/benchmarks/assets/asset-manifest.md',
  'docs/benchmarks/assets/README.md',
  'docs/benchmarks/assets/source-data/README.md',
  'docs/benchmarks/assets/prompts/benchmark-chart-prompts.md',
  'docs/benchmarks/assets/prompts/methodology-infographic.md',
  'docs/benchmarks/assets/prompts/ai-rule-safety-carousel.md',
  'docs/benchmarks/assets/storyboard/ai-rule-safety-carousel.md',
  'docs/benchmarks/assets/storyboard/playground-readme-gif.md',
  'docs/benchmarks/assets/generated/explainability-trace-diagram.md',
  'docs/benchmarks/assets/generated/methodology-card.md',
  'docs/benchmarks/assets/generated/ai-rule-safety-carousel.md',
  'docs/playground/readme-demo-capture.md',
];

const customerChartSvgs = [
  'docs/benchmarks/assets/generated/benchmark-chart-throughput.svg',
  'docs/benchmarks/assets/generated/explainability-trace-diagram.svg',
  'docs/benchmarks/assets/generated/ai-rule-safety-carousel-1.svg',
];

describe('customer docs surface', () => {
  it('keeps the user-facing proof pages', () => {
    for (const page of customerPages) {
      expect(existsSync(page), page).toBe(true);
    }
  });

  it('keeps the generated SVG assets referenced by customer pages', () => {
    for (const svg of customerChartSvgs) {
      expect(existsSync(svg), svg).toBe(true);
    }
  });

  it('does not ship internal asset-production docs on the site', () => {
    for (const page of relocatedInternalPages) {
      expect(existsSync(page), page).toBe(false);
    }
  });

  it('keeps customer pages free of private wiki references', () => {
    for (const page of customerPages) {
      const text = readFileSync(page, 'utf8');
      expect(text).not.toContain('chaos-vault');
    }
  });
});
