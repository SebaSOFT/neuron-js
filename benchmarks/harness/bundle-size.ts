import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const NEURON_SRC = fileURLToPath(
  new URL("../../src/index.ts", import.meta.url),
);

/** Re-export entry per engine; the hand-coded baseline has no library. */
const ENTRY_MODULE: Record<string, string> = {
  "@sebasoft/neuron-js": NEURON_SRC,
  "json-rules-engine": "json-rules-engine",
  "json-logic-js": "json-logic-js",
  "rule-engine-js": "rule-engine-js",
};

/**
 * Minified bundle size in bytes for an engine's full public surface. Bundles
 * `export * from "<engine>"` with esbuild (bundle + minify, esm, node platform so
 * builtins stay external) and returns the output byte length. The hand-coded
 * baseline has no library dependency, so its footprint is 0.
 */
export async function measureBundleSizeBytes(engine: string): Promise<number> {
  if (engine === "hand-coded-typescript") return 0;

  const entryModule = ENTRY_MODULE[engine];
  if (!entryModule) throw new Error(`No bundle entry for engine ${engine}`);

  const result = await build({
    stdin: {
      contents: `export * from ${JSON.stringify(entryModule)};`,
      resolveDir: ROOT,
      loader: "ts",
    },
    bundle: true,
    minify: true,
    format: "esm",
    platform: "node",
    write: false,
    logLevel: "silent",
  });

  return result.outputFiles[0].contents.length;
}
