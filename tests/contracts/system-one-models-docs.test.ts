import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const guidePath = "docs/integrations/system-one-models.md";

describe("System One model integration guide", () => {
  it("publishes a Jev/Laya guide from the integrations surface", () => {
    expect(existsSync(guidePath)).toBe(true);

    const guide = readFileSync(guidePath, "utf8");
    const config = readFileSync("docs/.vitepress/config.ts", "utf8");

    expect(config).toContain("/integrations/system-one-models");
    expect(guide).toContain("Jev");
    expect(guide).toContain("Laya");
    expect(guide).toContain("validateExecutionContext");
    expect(guide).toContain("deterministic boundary");
    expect(guide).toContain("Laya's official runtime is Python-based");
  });

  it("documents a safe failure path before any side effect", () => {
    const guide = readFileSync(guidePath, "utf8");

    expect(guide).toContain("MODEL_DECISION_INVALID");
    expect(guide).toContain("POLICY_EXECUTION_FAILED");
    expect(guide).toContain("outbox");
    expect(guide).toContain("human review");
  });

  it("documents the boolean and selector plugins with prefetched answers", () => {
    const guide = readFileSync(guidePath, "utf8");

    expect(guide).toContain("LayaBooleanEvaluator");
    expect(guide).toContain("LayaSelectorAction");
    expect(guide).toContain("modelAnswers");
    expect(guide).toContain("MODEL_ANSWER_MISSING");
    expect(guide).toContain("interpolate");
    expect(guide).toContain("deterministic compare");
  });

  it("keeps examples inside the real engine contract: sync core and hooks", () => {
    const guide = readFileSync(guidePath, "utf8");

    // Prefetch pattern instead of I/O inside plugins
    expect(guide).toContain("Plugins must never perform I/O");
    expect(guide).toContain("before Synapse.execute()");

    // Hook wiring as documented in the engine
    expect(guide).toContain("HookEmitter");
    expect(guide).toContain("ON_CONDITION_ERROR");
    expect(guide).toContain("ON_SCRIPT_ERROR");
    expect(guide).toContain("registerCondition");
    expect(guide).toContain("registerAction");

    // Two-channel semantics: verdict vs broken condition
    expect(guide).toContain("the model said no");
    expect(guide).toContain("Condition type not found");
  });
});
