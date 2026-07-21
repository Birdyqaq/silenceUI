# SilenceUI Web Components

基于 Lit + UnoCSS 的跨框架 Web Components 组件库，适用于后台管理系统场景。

## 安装

```bash
pnpm add webcomponents
```

## 使用

```ts
import 'webcomponents';
```

```html
<su-container>
  <su-menu slot="sider"></su-menu>
  <div slot="header">管理后台</div>

  <su-card>
    <span slot="header">查询条件</span>
    <su-form-item label="关键词">
      <su-input placeholder="请输入关键词"></su-input>
    </su-form-item>
  </su-card>
</su-container>
```

## 在 Vue 中使用

```ts
// vite.config.ts：告诉 Vue 编译器 su-/se- 开头的是原生自定义元素
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('su-') || tag.startsWith('se-')
        }
      }
    })
  ]
});
```

```vue
<script setup lang="ts">
import 'webcomponents';
import { toggleThemeMode, setThemeColors } from 'webcomponents';
</script>

<template>
  <!-- 一键明暗切换 -->
  <su-theme-toggle />
  <!-- 或者绑定到自己的按钮 -->
  <su-button @click="toggleThemeMode()">切换主题</su-button>
  <su-button @click="setThemeColors({ primary: '#7c3aed' })">换成紫色</su-button>
</template>
```

## 在 React 中使用

```tsx
import 'webcomponents';
import { toggleThemeMode, setThemeColors, getThemeMode } from 'webcomponents';
import { useEffect, useState } from 'react';

// 订阅主题变化的 hook
function useThemeMode() {
  const [mode, setMode] = useState(getThemeMode());
  useEffect(() => {
    const handler = () => setMode(getThemeMode());
    window.addEventListener('su-theme-change', handler);
    return () => window.removeEventListener('su-theme-change', handler);
  }, []);
  return mode;
}

export function Header() {
  const mode = useThemeMode();
  return (
    <header>
      {/* 直接使用内置切换按钮 */}
      <su-theme-toggle />
      {/* 或者自己控制 */}
      <button onClick={() => toggleThemeMode()}>当前：{mode}</button>
      <button onClick={() => setThemeColors({ primary: '#7c3aed' })}>换成紫色</button>
    </header>
  );
}
```

React（19 之前）对自定义元素的复杂属性和自定义事件支持有限：传对象数组请用 ref 赋值（`ref.current.items = [...]`），监听组件事件请用 `addEventListener`。如果用 TypeScript，需要在 `d.ts` 中为 JSX 声明标签类型：

```ts
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'su-theme-toggle': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'su-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
```

## 组件目录规范

```text
components/
  _shared/           # 共享样式/工具
  form/              # 表单组件
  data/              # 数据展示组件
  navigation/        # 导航组件
  feedback/          # 反馈组件
  layout/            # 布局组件
  button input table pagination image line asset-viewer  # 历史兼容组件
```

## 可用组件（后台系统常用）

- 表单：`su-button` `su-input` `su-input-number` `su-select` `su-textarea` `su-checkbox` `su-radio-group` `su-switch` `su-form-item`
- 数据：`se-table` `se-pagination` `su-card` `su-stat-card` `su-tag` `su-badge` `su-avatar` `su-empty` `su-skeleton` `su-descriptions` `se-image` `se-asset-viewer`
- 导航：`su-menu` `su-breadcrumb` `su-tabs` `su-dropdown` `su-steps`
- 反馈：`su-modal` `su-drawer` `su-alert` `su-message` `su-tooltip` `su-spin` `su-progress`
- 布局：`su-container` `su-divider`

命令式消息提示：

```ts
import { message } from 'webcomponents';

message.success('保存成功');
message.error('请求失败', 5000);
```

## 主题系统

- 组件主题 token 在 `styles/theme.css`，全部基于 CSS 变量
- 明暗模式与自定义颜色的状态会持久化到 `localStorage`，刷新后自动恢复

### 一键明暗切换

```html
<!-- 放在页面任意位置，点击即可切换，多个实例自动同步 -->
<su-theme-toggle></su-theme-toggle>
```

```ts
import { setThemeMode, toggleThemeMode, getThemeMode } from 'webcomponents';

toggleThemeMode();      // 明暗互切
setThemeMode('dark');   // 指定模式
getThemeMode();         // 'light' | 'dark'

// 主题变化时收到通知
window.addEventListener('su-theme-change', (e) => {
  console.log((e as CustomEvent).detail.mode);
});
```

### 自定义主题色

```ts
import { setThemeColors, resetThemeColors } from 'webcomponents';

// 传入 hex 色值即可，primary 会自动派生 hover 色和浅色背景
setThemeColors({ primary: '#7c3aed' });
setThemeColors({ success: '#22c55e', error: '#dc2626' });

resetThemeColors(); // 恢复默认
```

也可以直接在 CSS 中覆盖变量做静态定制：

```css
:root {
  --su-color-primary: #7c3aed;
  --su-color-primary-hover: #6d28d9;
  --su-color-primary-rgb: 124, 58, 237;
}
```

## 开发

```bash
pnpm dev
pnpm build
pnpm test -- --run
```
