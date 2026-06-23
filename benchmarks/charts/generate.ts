// Renders the five benchmark charts from real harness output.
//
// Every visible number is read verbatim from benchmarks/results/latest.actual.json
// (no averaging/derivation), so charts cannot drift from measured data. Comparison
// metrics use the pricing-discount / medium row; cold-start and bundle size are
// engine-level constants. Run: yarn benchmark:charts
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const RESULTS_PATH = fileURLToPath(
  new URL("../results/latest.actual.json", import.meta.url),
);
const OUT_DIR = fileURLToPath(
  new URL("../../docs/benchmarks/assets/generated/", import.meta.url),
);
const SOURCE_REF = "benchmarks/results/latest.actual.json";

interface Row {
  engine: string;
  scenario: string;
  input_size: string;
  throughput_decisions_per_second: number;
  p50_ms: number;
  p95_ms: number;
  cold_start_ms: number;
  bundle_size_minified_bytes: number;
  validation_overhead_ms: number;
  explanation_overhead_ms: number;
  node_version: string;
  package_version: string;
  commit_sha: string;
}

interface ResultsFile {
  generated_at: string;
  results: Row[];
}

const ENGINE_COLOR: Record<string, string> = {
  "@sebasoft/neuron-js": "#22d3ee",
  "json-rules-engine": "#a78bfa",
  "json-logic-js": "#fbbf24",
  "hand-coded-typescript": "#34d399",
  "rule-engine-js": "#94a3b8",
};
const ENGINES = Object.keys(ENGINE_COLOR);

const data = JSON.parse(readFileSync(RESULTS_PATH, "utf8")) as ResultsFile;

function rowFor(engine: string, scenario: string, size: string): Row {
  const row = data.results.find(
    (item) =>
      item.engine === engine &&
      item.scenario === scenario &&
      item.input_size === size,
  );
  if (!row) throw new Error(`Missing row ${engine}/${scenario}/${size}`);
  return row;
}

const provenance = rowFor(ENGINES[0], "pricing-discount", "medium");

function escapeXml(value: string): string {
  return value.replace(/[<>&]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&amp;",
  );
}

const groupSep = (n: number): string => n.toLocaleString("en-US");

interface ChartSpec {
  file: string;
  title: string;
  metric: keyof Row & string;
  unit: string;
  direction: "higher is better" | "lower is better";
  subtitle: string;
  format: (value: number) => string;
  /** Note rendered when most engines are zero (differentiator metrics). */
  differentiator?: string;
}

const charts: ChartSpec[] = [
  {
    file: "benchmark-chart-throughput.svg",
    title: "Throughput comparison",
    metric: "throughput_decisions_per_second",
    unit: "decisions / second",
    direction: "higher is better",
    subtitle: "pricing-discount · medium (10,000 decisions)",
    format: (v) => `${groupSep(Math.round(v))} dec/s`,
  },
  {
    file: "benchmark-chart-cold-start.svg",
    title: "Cold-start comparison",
    metric: "cold_start_ms",
    unit: "milliseconds",
    direction: "lower is better",
    subtitle: "engine import + first decision, fresh process (median of 5)",
    format: (v) => `${v} ms`,
  },
  {
    file: "benchmark-chart-bundle-size.svg",
    title: "Bundle-size comparison",
    metric: "bundle_size_minified_bytes",
    unit: "minified bytes (esbuild, node platform)",
    direction: "lower is better",
    subtitle: "minified bundle of the engine's public surface",
    format: (v) =>
      v === 0 ? "0 B (no engine dependency)" : `${groupSep(v)} B`,
  },
  {
    file: "benchmark-chart-validation-overhead.svg",
    title: "Validation overhead",
    metric: "validation_overhead_ms",
    unit: "milliseconds per decision",
    direction: "lower is better",
    subtitle: "pricing-discount · validateScript delta · medium",
    format: (v) => `${v} ms`,
    differentiator:
      "Neuron-JS differentiator: competitors provide no schema-validation step (0).",
  },
  {
    file: "benchmark-chart-explanation-overhead.svg",
    title: "Explanation overhead",
    metric: "explanation_overhead_ms",
    unit: "milliseconds per decision",
    direction: "lower is better",
    subtitle: "pricing-discount · explainExecution delta · medium",
    format: (v) => `${v} ms`,
    differentiator:
      "Neuron-JS differentiator: competitors provide no explanation trace (0).",
  },
];

const W = 1200;
const H = 675;
const BAR_X = 250;
const BAR_W = 760;
const FIRST_Y = 196;
const ROW_H = 70;
const BAR_H = 40;

// Comparison row: pricing-discount / medium. cold-start and bundle-size are
// engine-level constants, so this row carries their values too.
const CHART_SCENARIO = "pricing-discount";

function render(spec: ChartSpec): string {
  const rows = ENGINES.map((engine) => ({
    engine,
    value: rowFor(engine, CHART_SCENARIO, "medium")[spec.metric] as number,
  }));
  const max = Math.max(...rows.map((r) => r.value), 1);

  const bars = rows
    .map((r, i) => {
      const y = FIRST_Y + i * ROW_H;
      const width = max > 0 ? (r.value / max) * BAR_W : 0;
      const color = ENGINE_COLOR[r.engine];
      const labelInside = width > 220;
      const valueX = labelInside ? BAR_X + width - 12 : BAR_X + width + 12;
      const valueAnchor = labelInside ? "end" : "start";
      const valueFill = labelInside ? "#020617" : "#e5e7eb";
      return `  <g>
    <text x="${BAR_X - 16}" y="${y + BAR_H / 2 + 6}" text-anchor="end" class="mono engine">${escapeXml(r.engine)}</text>
    <rect x="${BAR_X}" y="${y}" width="${BAR_W}" height="${BAR_H}" rx="8" fill="#0f172a" stroke="#1e293b"/>
    <rect x="${BAR_X}" y="${y}" width="${width.toFixed(1)}" height="${BAR_H}" rx="8" fill="${color}"/>
    <text x="${valueX.toFixed(1)}" y="${y + BAR_H / 2 + 6}" text-anchor="${valueAnchor}" class="mono value" fill="${valueFill}">${escapeXml(spec.format(r.value))}</text>
  </g>`;
    })
    .join("\n");

  const note = spec.differentiator
    ? `<text x="${BAR_X}" y="${FIRST_Y + ENGINES.length * ROW_H + 24}" class="mono note" fill="#22d3ee">${escapeXml(spec.differentiator)}</text>`
    : "";

  const footer = `Source: ${SOURCE_REF} · commit ${provenance.commit_sha.slice(0, 10)} · ${provenance.node_version} · ${data.generated_at.slice(0, 10)}`;
  const altDesc = `${spec.title} (${spec.unit}, ${spec.direction}) by engine from measured Neuron-JS benchmark output: ${rows.map((r) => `${r.engine} ${spec.format(r.value)}`).join(", ")}.`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">${escapeXml(spec.title)}</title>
  <desc id="d">${escapeXml(altDesc)}</desc>
  <metadata>Asset: NJS-GROWTH-07 ${spec.file}. Source: ${SOURCE_REF}. Generated by benchmarks/charts/generate.ts from measured actual_benchmark output. ${footer}</metadata>
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0v40" fill="none" stroke="#1e293b" stroke-width="0.7"/></pattern>
    <style><![CDATA[
      .text{font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;fill:#e5e7eb}
      .mono{font-family:"JetBrains Mono",SFMono-Regular,Menlo,Consolas,monospace}
      .title{font-size:38px;font-weight:750;letter-spacing:-.03em;fill:#e5e7eb}
      .sub{font-size:19px;font-weight:500;fill:#94a3b8}
      .engine{font-size:17px;fill:#cbd5e1}
      .value{font-size:17px;font-weight:600}
      .note{font-size:16px}
      .foot{font-size:15px;fill:#64748b}
      .metric{font-size:16px;fill:#94a3b8}
    ]]></style>
  </defs>
  <rect width="${W}" height="${H}" fill="#020617"/>
  <rect width="${W}" height="${H}" fill="url(#grid)" opacity=".6"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="22" fill="rgba(15,23,42,.55)" stroke="#1e293b" stroke-width="2"/>
  <text x="${BAR_X - 16}" y="92" text-anchor="end" class="text title">${escapeXml(spec.title)}</text>
  <text x="${BAR_X - 16}" y="124" text-anchor="end" class="text sub">${escapeXml(spec.subtitle)}</text>
  <text x="${BAR_X}" y="92" class="metric">metric: ${escapeXml(spec.metric)}</text>
  <text x="${BAR_X}" y="124" class="metric">unit: ${escapeXml(spec.unit)} · ${spec.direction}</text>
${bars}
  ${note}
  <text x="${BAR_X - 16}" y="${H - 40}" text-anchor="end" class="mono foot">Measured · no fabricated values</text>
  <text x="${BAR_X}" y="${H - 40}" class="mono foot">${escapeXml(footer)}</text>
</svg>
`;
}

for (const spec of charts) {
  const svg = render(spec);
  writeFileSync(`${OUT_DIR}${spec.file}`, svg, "utf8");
  process.stdout.write(`wrote ${spec.file}\n`);
}

// Generated showcase page (docs/benchmarks/results.md), built from the same data
// so chart and table values can never drift from the measured source.
const PAGE_PATH = fileURLToPath(
  new URL("../../docs/benchmarks/results.md", import.meta.url),
);

function tableRows(): string {
  const lines: string[] = [];
  for (const engine of ENGINES) {
    for (const scenario of [
      "pricing-discount",
      "eligibility-approval",
      "workflow-routing",
    ]) {
      const r = rowFor(engine, scenario, "medium");
      lines.push(
        `| \`${r.engine}\` | ${r.scenario} | ${groupSep(Math.round(r.throughput_decisions_per_second))} | ${r.p50_ms} | ${r.p95_ms} | ${r.cold_start_ms} | ${groupSep(r.bundle_size_minified_bytes)} | ${r.validation_overhead_ms} | ${r.explanation_overhead_ms} |`,
      );
    }
  }
  return lines.join("\n");
}

const chartSection = charts
  .map(
    (spec) => `## ${spec.title}

metric: \`${spec.metric}\` · ${spec.unit} · _${spec.direction}_

![${spec.title} by engine, measured Neuron-JS benchmark output.](./assets/generated/${spec.file})
${spec.differentiator ? `\n${spec.differentiator}\n` : ""}`,
  )
  .join("\n");

const page = `<!-- GENERATED by benchmarks/charts/generate.ts from benchmarks/results/latest.actual.json. Do not edit by hand; run \`yarn benchmark && yarn benchmark:charts\`. -->
# Benchmark results

These are **measured** results produced by the Neuron-JS benchmark harness
(\`yarn benchmark\`). They compare \`@sebasoft/neuron-js\` against \`json-rules-engine\`,
\`json-logic-js\`, a hand-coded TypeScript baseline, and \`rule-engine-js\` across the
pricing, eligibility, and workflow-routing scenarios. See the
[methodology](./methodology) for how each metric is collected.

Numbers reflect a single machine, Node version, and commit; reproduce locally before
citing. No value on this page is hand-entered — charts and the table below are generated
from the same source file.

## Provenance

| Field | Value |
| --- | --- |
| Generated | \`${data.generated_at}\` |
| Node | \`${provenance.node_version}\` |
| Commit | \`${provenance.commit_sha}\` |
| Neuron-JS version | \`${provenance.package_version}\` |
| Command | \`yarn benchmark\` |
| Raw source | \`${SOURCE_REF}\` |

${chartSection}
## Full results (medium · 10,000 decisions)

Throughput is decisions/second (higher is better); all latency, cold-start, and overhead
columns are milliseconds (lower is better); bundle size is minified bytes.

| Engine | Scenario | Throughput | p50 ms | p95 ms | Cold start ms | Bundle B | Validation ms | Explanation ms |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${tableRows()}

Validation and explanation overhead are Neuron-JS capabilities (\`validateScript\`,
\`explainExecution\`); the other engines provide no equivalent step, so their measured
delta is \`0\`.
`;

writeFileSync(PAGE_PATH, page, "utf8");
process.stdout.write(`wrote ${PAGE_PATH}\n`);
