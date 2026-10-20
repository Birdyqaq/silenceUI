import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import DemoThemeSync from './DemoThemeSync.vue';
import FormDemo from './FormDemo.vue';
import ParallaxHome from './ParallaxHome.vue';
import TypewriterDemo from './TypewriterDemo.vue';
import ComponentDemo from './ComponentDemo.vue';
import AdminDemo from './AdminDemo.vue';
import './custom-home.css';

export default {
  extends: DefaultTheme, // 使用 extends 而不是展开
  Layout: () => h(DefaultTheme.Layout, null, { 'layout-bottom': () => h(DemoThemeSync) }),
  async enhanceApp({ app }) {
    // 调用默认主题的 enhanceApp
    await DefaultTheme.enhanceApp?.({ app });

    // 注册自定义组件
    app.component('ParallaxHome', ParallaxHome);
    app.component('FormDemo', FormDemo);
    app.component('TypewriterDemo', TypewriterDemo);
    app.component('ComponentDemo', ComponentDemo);
    app.component('AdminDemo', AdminDemo);

    // 导入并注册 Web Components
    if (typeof window !== 'undefined') {
      // VitePress 会等待 enhanceApp，保证 Vue 挂载前已注册自定义元素。
      await import('../../../index.ts');
    }
  },
};
