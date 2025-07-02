import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'SilenceUI',
  description: '基于 Lit 的 Web Components UI 组件库',
  base: '/silenceUI/',
  appearance: true, // 启用深色模式切换

  vite: {
    define: {
      global: 'globalThis'
    },
    optimizeDeps: {
      include: ['lit', 'lit/decorators.js'],
      exclude: ['@iconify/utils']
    },
    ssr: {
      noExternal: ['lit']
    }
  },

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/' },
      { text: 'GitHub', link: 'https://github.com/Birdyqaq/silenceUI' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' }
          ]
        }
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Table 表格', link: '/components/table' },
            { text: 'Image 图片', link: '/components/image' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Birdyqaq/silenceUI' }
    ]
  }
})
