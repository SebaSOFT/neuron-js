import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ROOT = new URL("../../", import.meta.url);

function readJson(relativeFromRoot: string): { version?: string } {
  const path = fileURLToPath(new URL(relativeFromRoot, ROOT));
  return JSON.parse(readFileSync(path, "utf8")) as { version?: string };
}

const ownPackage = readJson("package.json");

/** Schema engine key -> resolved package version (or inline note). */
export function packageVersion(engine: string): string {
  switch (engine) {
    case "@sebasoft/neuron-js":
      return ownPackage.version ?? "0.0.0";
    case "hand-coded-typescript":
      return "inline (no package)";
    default:
      return (
        readJson(`node_modules/${engine}/package.json`).version ?? "unknown"
      );
  }
}

export function commitSha(): string {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

export const nodeVersion = process.version;
export const benchmarkDate = new Date().toISOString();
