import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const requiredFields = [
  'engine',
  'scenario',
  'input_size',
  'warmup_iterations',
  'measured_iterations',
  'throughput_decisions_per_second',
  'p50_ms',
  'p95_ms',
  'cold_start_ms',
  'bundle_size_minified_bytes',
  'validation_overhead_ms',
  'explanation_overhead_ms',
  'node_version',
  'package_version',
  'commit_sha',
  'result_kind',
];

const requiredEngines = [
  '@sebasoft/neuron-js',
  'json-rules-engine',
  'json-logic-js',
  'hand-coded-typescript',
  'rule-engine-js',
];

const requiredScenarios = [
  'pricing-discount',
  'eligibility-approval',
  'workflow-routing',
];

const requiredInputSizes = ['smoke', 'small', 'medium', 'large'];

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;
}

describe('benchmark result-data contract', () => {
  it('publishes methodology, JSON schema, and placeholder sample data files', () => {
    expect(existsSync('docs/benchmarks/methodology.md')).toBe(true);
    expect(existsSync('docs/public/benchmarks/results.schema.json')).toBe(true);
    expect(existsSync('benchmarks/sample-results.placeholder.json')).toBe(true);
  });

  it('defines every NJS-GROWTH-07 metric with a stable type, unit, and source note', () => {
    const schema = readJson('docs/public/benchmarks/results.schema.json');
    const resultProperties = ((schema.properties as Record<string, unknown>).results as Record<string, unknown>).items as Record<string, unknown>;
    const properties = resultProperties.properties as Record<string, Record<string, unknown>>;
    const required = resultProperties.required as string[];

    for (const field of requiredFields) {
      expect(required).toContain(field);
      expect(properties[field]).toBeDefined();
      expect(properties[field].description).toEqual(expect.any(String));
      expect(properties[field].description as string).not.toHaveLength(0);
      expect(properties[field].unit).toEqual(expect.any(String));
      expect(properties[field].source).toEqual(expect.any(String));
    }
  });

  it('links benchmark methodology from VitePress navigation and sidebar', () => {
    const config = readFileSync('docs/.vitepress/config.ts', 'utf8');

    expect(config).toContain("{ text: 'Benchmarks', link: '/benchmarks/methodology' }");
  });

  it('documents the complete competitor, scenario, and input-size matrix', () => {
    const methodology = readFileSync('docs/benchmarks/methodology.md', 'utf8');
    const schema = readFileSync('docs/public/benchmarks/results.schema.json', 'utf8');

    for (const engine of requiredEngines) {
      expect(methodology).toContain(engine);
      expect(schema).toContain(engine);
    }

    for (const scenario of requiredScenarios) {
      expect(methodology).toContain(scenario);
      expect(schema).toContain(scenario);
    }

    for (const size of requiredInputSizes) {
      expect(methodology).toContain(size);
      expect(schema).toContain(size);
    }
  });

  it('marks sample data as placeholder and prevents accidental benchmark claims', () => {
    const sample = readJson('benchmarks/sample-results.placeholder.json');

    expect(sample.result_kind).toBe('placeholder_sample');
    expect(sample.is_placeholder).toBe(true);
    expect(sample.claims_allowed).toBe(false);
    expect(sample.disclaimer).toEqual(expect.stringContaining('not benchmark results'));

    const rows = sample.results as Record<string, unknown>[];
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      for (const field of requiredFields) {
        expect(row).toHaveProperty(field);
      }
      expect(row.result_kind).toBe('placeholder_sample');
      expect(row.notes).toEqual(expect.stringContaining('synthetic placeholder'));
    }
  });
});
