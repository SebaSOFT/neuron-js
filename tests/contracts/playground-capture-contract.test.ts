import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const captureSpecPath = 'docs/playground/readme-demo-capture.md';
const storyboardPath = 'docs/benchmarks/assets/storyboard/playground-readme-gif.md';
const pricingRulePath = 'examples/pricing-rules/rules.json';
const pricingInputPath = 'examples/pricing-rules/input.json';
const pricingExpectedOutputPath = 'examples/pricing-rules/expected-output.json';

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

describe('playground README demo capture contract', () => {
  it('publishes a concrete capture spec and storyboard while playground implementation is pending', () => {
    expect(existsSync(captureSpecPath)).toBe(true);
    expect(existsSync(storyboardPath)).toBe(true);

    const spec = readFileSync(captureSpecPath, 'utf8');
    const storyboard = readFileSync(storyboardPath, 'utf8');

    expect(spec).toContain('Blocked on playground implementation, not on missing planning.');
    expect(spec).toContain('/playground/?example=pricing-rules&capture=readme');
    expect(spec).toContain('yarn capture:playground-readme --example pricing-rules --format mp4,gif');
    expect(storyboard).toContain('docs/benchmarks/assets/generated/playground-readme-demo.mp4');
    expect(storyboard).toContain('docs/benchmarks/assets/generated/playground-readme-demo.gif');
  });

  it('locks browser automation to stable selectors for every required demo flow panel', () => {
    const spec = readFileSync(captureSpecPath, 'utf8');
    const requiredSelectors = [
      '[data-testid="example-select"]',
      '[data-testid="rule-json-panel"]',
      '[data-testid="input-json-panel"]',
      '[data-testid="validation-status"]',
      '[data-testid="validation-errors"]',
      '[data-testid="trace-panel"]',
      '[data-testid="trace-row-vip-order-discount"]',
      '[data-testid="result-panel"]',
      '[data-testid="share-url"]',
    ];

    for (const selector of requiredSelectors) {
      expect(spec).toContain(selector);
    }
  });

  it('backs the visible demo result with the runnable pricing example fixtures', () => {
    const spec = readFileSync(captureSpecPath, 'utf8');
    const script = readJson<{ id: string; rules: Array<{ id: string }> }>(pricingRulePath);
    const input = readJson<{ state: { cart: { subtotal: number; currency: string } } }>(pricingInputPath);
    const expected = readJson<{
      ok: boolean;
      rulesExecuted: number;
      finalTotal: number;
      discountAmount: number;
      messages: string[];
    }>(pricingExpectedOutputPath);

    expect(script.id).toBe('pricing-rules-demo');
    expect(script.rules[0]?.id).toBe('vip-order-discount');
    expect(input.state.cart.subtotal).toBe(125);
    expect(input.state.cart.currency).toBe('USD');
    expect(expected).toEqual({
      ok: true,
      rulesExecuted: 1,
      finalTotal: 105,
      discountAmount: 20,
      messages: ['Applied 16% discount: -20'],
    });

    for (const value of ['pricing-rules-demo', 'vip-order-discount', '125', 'finalTotal: 105', 'discountAmount: 20']) {
      expect(spec).toContain(value);
    }
  });

  it('links the capture spec from proof-asset docs and VitePress navigation', () => {
    const proofIndex = readFileSync('docs/benchmarks/index.md', 'utf8');
    const config = readFileSync('docs/.vitepress/config.ts', 'utf8');

    expect(proofIndex).toContain('../playground/readme-demo-capture.md');
    expect(config).toContain("{ text: 'Playground Capture Spec', link: '/playground/readme-demo-capture' }");
  });
});
