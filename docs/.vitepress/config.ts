import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "neuron-js",
  description: "AI-friendly TypeScript rules engine for serializable JSON business rules and deterministic workflow decisions.",
  base: '/neuron-js/',
  ignoreDeadLinks: true,
  markdown: {
    config(md) {
      const defaultFence = md.renderer.rules.fence;

      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const language = token.info.trim().split(/\s+/)[0];

        if (language === "mermaid") {
          const source = encodeURIComponent(token.content);

          return `<div class="mermaid" data-mermaid-source="${source}">${md.utils.escapeHtml(token.content)}</div>`;
        }

        return defaultFence?.(tokens, idx, options, env, self) ?? self.renderToken(tokens, idx, options);
      };
    }
  },
  themeConfig: {
    logo: '/img/neuron-cover640.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Concepts', link: '/overview' },
      { text: 'Examples', link: '/use-cases/runnable-examples' },
      { text: 'Schemas', link: '/schemas-validation-explainability' },
      { text: 'Benchmarks', link: '/benchmarks/results' },
      { text: 'Proof', link: '/proof' },
      { text: 'Comparisons', link: '/comparisons/' },
      { text: 'Integrations', link: '/integrations/' },
      { text: 'Guides', link: '/guides/' },
      { text: 'FAQ', link: '/faq' },
      { text: 'AI Docs', link: '/ai-coding-assistants' },
      { text: 'API', link: '/api/README' }
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Overview', link: '/overview' },
          { text: 'Schemas, Validation & Explainability', link: '/schemas-validation-explainability' },
          { text: 'AI Coding Assistants', link: '/ai-coding-assistants' },
          { text: 'FAQ', link: '/faq' }
        ]
      },
      {
        text: 'Concepts',
        items: [
          { text: 'Core Engine', link: '/concepts/core-engine' },
          { text: 'Context & State', link: '/concepts/context-and-state' },
          { text: 'Decision Runtime', link: '/concepts/decision-runtime' },
          { text: 'Agentic Decision Architecture', link: '/concepts/agentic-decision-architecture' },
          { text: 'Implementation Examples', link: '/concepts/implementation-examples' }
        ]
      },
      {
        text: 'Use Cases',
        items: [
          { text: 'Runnable Examples', link: '/use-cases/runnable-examples' },
          { text: 'Generic decision runtime', link: 'https://github.com/SebaSOFT/neuron-js/tree/main/examples/generic-decision-runtime' },
          { text: 'Business Rules Engine', link: '/use-cases/business-rules-engine' },
          { text: 'Dynamic Routing', link: '/use-cases/dynamic-routing' }
        ]
      },
      {
        text: 'Benchmarks & Proof',
        items: [
          { text: 'Overview', link: '/benchmarks/' },
          { text: 'Benchmark Results', link: '/benchmarks/results' },
          { text: 'Methodology', link: '/benchmarks/methodology' },
          { text: 'AI-Rule Safety', link: '/benchmarks/ai-rule-safety' },
          { text: 'Proof & Milestones', link: '/proof' }
        ]
      },
      {
        text: 'Comparisons',
        items: [
          { text: 'Comparison Guide', link: '/comparisons/' },
          { text: 'vs json-rules-engine', link: '/comparisons/json-rules-engine' },
          { text: 'vs JsonLogic', link: '/comparisons/json-logic-js' },
          { text: 'vs node-rules', link: '/comparisons/node-rules' },
          { text: 'vs if/else', link: '/comparisons/if-else' }
        ]
      },
      {
        text: 'Integrations',
        items: [
          { text: 'Integration Guide', link: '/integrations/' },
          { text: 'n8n deterministic routing', link: '/integrations/n8n' },
          { text: 'LangGraph decision node', link: '/integrations/langgraph' },
          { text: 'Jev / Laya governed decisions', link: '/integrations/system-one-models' }
        ]
      },
      {
        text: 'Educational guides',
        items: [
          { text: 'Guide overview', link: '/guides/' },
          { text: 'TypeScript rules engines', link: '/guides/typescript-rules-engine' },
          { text: 'AI-generated validated rules', link: '/guides/ai-generated-validated-rules' },
          { text: 'Explainable business rules', link: '/guides/explainable-business-rules' }
        ]
      },
      {
        text: 'API Reference',
        link: '/api/README'
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SebaSOFT/neuron-js' }
    ]
  }
})
