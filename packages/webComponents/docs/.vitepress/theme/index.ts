import DefaultTheme from 'vitepress/theme';
import FormDemo from './FormDemo.vue';
import ParallaxHome from './ParallaxHome.vue';
import TypewriterDemo from './TypewriterDemo.vue';
import './custom-home.css';

export default {
  extends: DefaultTheme, // 使用 extends 而不是展开
  enhanceApp({ app }) {
    // 调用默认主题的 enhanceApp
    DefaultTheme.enhanceApp?.({ app });

    // 注册自定义组件
    app.component('ParallaxHome', ParallaxHome);
    app.component('FormDemo', FormDemo);
    app.component('TypewriterDemo', TypewriterDemo);

    // 导入并注册 Web Components
    if (typeof window !== 'undefined') {
      const loadComponents = async () => {
        try {
          await import('../../../index.ts');
        } catch (err) {
          console.error('Failed to load Web Components:', err);
        }
      };

      // 在 DOM 内容加载完成后执行
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadComponents);
      } else {
        loadComponents();
      }
    }
  },
};
