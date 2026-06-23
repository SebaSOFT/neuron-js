import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const SCHEMA_PATH = 'docs/public/benchmarks/results.schema.json';
const RESULTS_PATH = 'benchmarks/results/latest.actual.json';

const engines = [
  '@sebasoft/neuron-js',
  'json-rules-engine',
  'json-logic-js',
  'hand-coded-typescript',
  'rule-engine-js',
];
const scenarios = ['pricing-discount', 'eligibility-approval', 'workflow-routing'];
const inputSizes = ['smoke', 'small', 'medium'];

const numericRowFields = [
  'warmup_iterations',
  'measured_iterations',
  'throughput_decisions_per_second',
  'p50_ms',
  'p95_ms',
  'cold_start_ms',
  'bundle_size_minified_bytes',
  'validation_overhead_ms',
  'explanation_overhead_ms',
];

function readJson(path: string): Record<string, any> {
  return JSON.parse(readFileSync(path, 'utf8'));
}

describe('measured benchmark results contract', () => {
  const schema = readJson(SCHEMA_PATH);
  const data = readJson(RESULTS_PATH);
  const rows = data.results as Record<string, any>[];

  it('publishes a real actual_benchmark file with claims unlocked', () => {
    expect(data.result_kind).toBe('actual_benchmark');
    expect(data.is_placeholder).toBe(false);
    expect(data.claims_allowed).toBe(true);
    expect(data.generated_at).toEqual(expect.any(String));
  });

  it('includes every top-level field the schema requires', () => {
    for (const key of schema.required as string[]) {
      expect(data[key]).toBeDefined();
    }
    expect(data.competitors).toEqual(engines);
    expect(data.scenarios).toEqual(scenarios);
    expect(data.input_sizes).toEqual(inputSizes);
  });

  it('covers the full engine x scenario x input-size matrix', () => {
    expect(rows.length).toBe(engines.length * scenarios.length * inputSizes.length);
    for (const engine of engines) {
      for (const scenario of scenarios) {
        for (const size of inputSizes) {
          const match = rows.find(
            (row) =>
              row.engine === engine &&
              row.scenario === scenario &&
              row.input_size === size,
          );
          expect(match, `${engine}/${scenario}/${size}`).toBeDefined();
        }
      }
    }
  });

  it('emits every required row field with valid, finite, non-negative metrics', () => {
    const requiredRowFields = ((schema.properties.results.items as Record<string, any>)
      .required) as string[];
    for (const row of rows) {
      for (const field of requiredRowFields) {
        expect(row[field], `${row.engine}/${row.scenario}/${row.input_size}.${field}`).toBeDefined();
      }
      for (const field of numericRowFields) {
        expect(Number.isFinite(row[field])).toBe(true);
        expect(row[field]).toBeGreaterThanOrEqual(0);
      }
      expect(row.result_kind).toBe('actual_benchmark');
      expect(engines).toContain(row.engine);
      expect(scenarios).toContain(row.scenario);
      expect(inputSizes).toContain(row.input_size);
      expect(row.node_version).toEqual(expect.any(String));
      expect(row.commit_sha).toEqual(expect.any(String));
    }
  });

  it('only attributes validation/explanation overhead to the engine that provides it', () => {
    for (const row of rows) {
      if (row.engine !== '@sebasoft/neuron-js') {
        expect(row.validation_overhead_ms).toBe(0);
        expect(row.explanation_overhead_ms).toBe(0);
      }
    }
  });
});
