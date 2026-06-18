import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "neuron-js",
  description: "AI-friendly TypeScript rules engine for serializable JSON business rules and deterministic workflow decisions.",
  base: '/neuron-js/',
  ignoreDeadLinks: true,
  themeConfig: {
    logo: '/img/neuron-cover640.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Concepts', link: '/overview' },
      { text: 'Examples', link: '/use-cases/runnable-examples' },
      { text: 'Schemas', link: '/schemas-validation-explainability' },
      { text: 'API', link: '/api/README' }
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Overview', link: '/overview' },
          { text: 'Schemas, Validation & Explainability', link: '/schemas-validation-explainability' }
        ]
      },
      {
        text: 'Concepts',
        items: [
          { text: 'Core Engine', link: '/concepts/core-engine' },
          { text: 'Context & State', link: '/concepts/context-and-state' },
          { text: 'Implementation Examples', link: '/concepts/implementation-examples' }
        ]
      },
      {
        text: 'Use Cases',
        items: [
          { text: 'Runnable Examples', link: '/use-cases/runnable-examples' },
          { text: 'Business Rules Engine', link: '/use-cases/business-rules-engine' },
          { text: 'Dynamic Routing', link: '/use-cases/dynamic-routing' }
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
