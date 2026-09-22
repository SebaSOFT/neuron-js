import { readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

const textFile = (path: string) => readFileSync(path, "utf8");

describe("release documentation surfaces", () => {
  test("keeps the source release claim aligned with the package manifest and changelog", () => {
    const packageJson = JSON.parse(textFile("package.json")) as { version: string };
    const changelog = textFile("CHANGELOG.md");
    const overview = textFile("docs/overview.md");

    expect(changelog).toContain(`## ${packageJson.version}`);
    expect(overview).toContain(`\`${packageJson.version}\` source release`);
    expect(overview).toContain("Published package availability is a separate npm-registry fact");
  });
});