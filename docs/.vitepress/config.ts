import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "neuron-js",
  description: "Pluggable rules engine",
  base: '/neuron-js/',
  themeConfig: {
    logo: '🧠',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Concepts', link: '/overview' },
      { text: 'API', link: '/api/' }
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Overview', link: '/overview' }
        ]
      },
      {
        text: 'Concepts',
        items: [
          { text: 'Core Engine', link: '/concepts/core-engine' },
          { text: 'Context & State', link: '/concepts/context-and-state' }
        ]
      },
      {
        text: 'API Reference',
        link: '/api/'
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SebaSOFT/neuron-js' }
    ]
  }
})
