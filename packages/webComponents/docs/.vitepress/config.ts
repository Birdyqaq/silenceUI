import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'SilenceUI',
  description: '基于 Lit 的 Web Components UI 组件库',
  base: '/silenceUI/',
  appearance: true, // 启用深色模式切换

  vite: {
    define: {
      global: 'globalThis',
    },
    optimizeDeps: {
      include: ['lit', 'lit/decorators.js'],
      exclude: ['@iconify/utils'],
    },
    ssr: {
      noExternal: ['lit'],
    },
  },

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/' },
      { text: 'GitHub', link: 'https://github.com/Birdyqaq/silenceUI' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
            { text: 'API 约定', link: '/guide/api-conventions' },
          ],
        },
        {
          text: '进阶',
          items: [
            { text: '设计方案', link: '/guide/design' },
            { text: '主题定制', link: '/guide/theme' },
            { text: '开发规范', link: '/guide/development' },
          ],
        },
      ],
      '/components/': [
        {
          text: '总览',
          items: [{ text: '组件总览', link: '/components/' }],
        },
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Image 图片', link: '/components/image' },
            { text: 'Line 分割线', link: '/components/line' },
            { text: 'AssetViewer 资源预览', link: '/components/asset-viewer' },
          ],
        },
        {
          text: '表单',
          items: [{ text: 'Form 表单组件', link: '/components/form' }],
        },
        {
          text: '数据展示',
          items: [
            { text: 'Table 表格', link: '/components/table' },
            { text: 'Data 数据组件', link: '/components/data' },
          ],
        },
        {
          text: '导航',
          items: [{ text: 'Navigation 导航组件', link: '/components/navigation' }],
        },
        {
          text: '反馈',
          items: [{ text: 'Feedback 反馈组件', link: '/components/feedback' }],
        },
        {
          text: '布局',
          items: [{ text: 'Layout 布局组件', link: '/components/layout' }],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/Birdyqaq/silenceUI' }],
  },
});
