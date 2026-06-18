import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const requiredFiles = [
  'docs/public/llms.txt',
  'docs/public/llms-full.txt',
  'docs/ai-coding-assistants.md',
  'docs/public/skills/neuron-js/SKILL.md',
  'ai/skills/neuron-js/SKILL.md',
  '.github/copilot-instructions.md',
  '.cursor/rules/neuron-js.mdc',
];

describe('AI-readable documentation contracts', () => {
  it.each(requiredFiles)('publishes %s', (filePath) => {
    expect(existsSync(filePath)).toBe(true);
  });

  it('documents the mandatory validation-before-execution workflow', () => {
    const skill = readFileSync('docs/public/skills/neuron-js/SKILL.md', 'utf8');

    expect(skill).toContain('validateScript(script)');
    expect(skill).toContain('validateExecutionContext(context)');
    expect(skill).toContain('explainExecution({ script, result })');
    expect(skill).toContain('Do not invent deep imports');
  });

  it('exposes public schema and skill URLs from llms.txt', () => {
    const llms = readFileSync('docs/public/llms.txt', 'utf8');

    expect(llms).toContain('https://sebasoft.github.io/neuron-js/skills/neuron-js/SKILL.md');
    expect(llms).toContain('https://sebasoft.github.io/neuron-js/schemas/script.schema.json');
    expect(llms).toContain('summarizeExecutionOutput');
  });
});
