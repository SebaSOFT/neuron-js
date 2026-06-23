# Benchmark visual source data

This folder is reserved for benchmark source artifacts consumed by generated visuals.

Current status: no publishable benchmark result artifact exists.

Allowed files:

- `*.actual.json`: measured benchmark output that matches `../../results.schema.json` and sets `result_kind: "actual_benchmark"`, `is_placeholder: false`, and `claims_allowed: true`.
- `*.metadata.md`: adjacent methodology notes for generated assets.
- `*.example.json`: schema examples only, never public performance claims.

Rejected for final chart claims:

- `benchmarks/sample-results.placeholder.json`
- any file with `result_kind: "placeholder_sample"`
- any file with `is_placeholder: true`
- any file with `claims_allowed: false`
- any row whose notes contain `synthetic placeholder`
