# SilenceUI Web Components

基于 Lit 与 CSS 主题变量的跨框架 Web Components 组件库，适用于后台管理系统场景。UnoCSS 为历史构建配置，并非组件内部样式依赖。

后台新增：`su-icon` 本地图标、`su-form` 规则校验、`su-date-range` 日期范围。Select、多级 Menu、Table 筛选与 Tree 权限勾选见文档「后台管理增强」。

> Maintainer: [Birdyqaq](https://github.com/Birdyqaq)

> 联系邮箱：[wuzheng011@gmail.com](mailto:wuzheng011@gmail.com) · [仓库介绍](https://github.com/Birdyqaq/silenceUI#readme) · [贡献指南](https://github.com/Birdyqaq/silenceUI/blob/dev/CONTRIBUTING.md)

当前提供 51 个自定义元素，覆盖后台表单、数据展示、导航与反馈。Tabs 已支持可关闭页签、固定项、关闭拦截及相邻回退；路由和页面缓存仍由宿主负责。

## 安装

新增 `su-tree-select`：树形单多选、搜索、清空及原生表单/规则校验；按需入口 `silenceui/components/form/tree-select`。禁用节点的子树同样禁用，不做父子级联。

当前版本为 `0.0.0`，尚未发布到 npm。以下包名用于发布后的接入；当前请先执行 `pnpm pack --pack-destination /tmp`，再在应用内安装 `/tmp/silenceui-0.0.0.tgz`。

后台详情新增：`su-collapse` 折叠面板（多开/手风琴、键盘导航、富内容插槽）、`su-timeline` 时间线（状态、说明与反序）。按需路径为 `silenceui/components/data/collapse` 和 `silenceui/components/data/timeline`。

```bash
pnpm add silenceui
```

## 使用

```ts
import 'silenceui/style.css';
import 'silenceui';
```

当前包根入口会注册全部组件，并自动恢复持久化的主题配置。只使用少量组件时可按需注册：

```ts
import 'silenceui/style.css';
import 'silenceui/components/button';
import 'silenceui/components/form/select';
import { initTheme } from 'silenceui/theme';

initTheme();
```

独立入口与组件目录对应，并保留完整 TypeScript 类型。不要同时引入根入口和按需入口，否则根入口仍会注册全部组件。

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
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('su-') || tag.startsWith('se-'),
        },
      },
    }),
  ],
});
```

```vue
<script setup lang="ts">
import 'silenceui/style.css';
import 'silenceui';
import { toggleThemeMode, setThemeColors } from 'silenceui';
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
import 'silenceui/style.css';
import 'silenceui';
import { toggleThemeMode, setThemeColors, getThemeMode } from 'silenceui';
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
import type * as React from 'react';

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

- 基础：`su-button` `su-input` `line-component`（历史分割线）
- 表单：`su-input-number` `su-select` `su-textarea` `su-checkbox` `su-radio-group` `su-switch` `su-form-item` `su-date-picker` `su-cascader` `su-upload`
- 数据：`se-table` `se-pagination` `su-card` `su-stat-card` `su-tag` `su-badge` `su-avatar` `su-empty` `su-skeleton` `su-descriptions` `su-tree` `su-typewriter` `se-image` `se-asset-viewer`
- 导航：`su-menu` `su-breadcrumb` `su-tabs` `su-dropdown` `su-steps`
- 反馈：`su-modal` `su-drawer` `su-alert` `su-message` `su-notification` `su-popconfirm` `su-tooltip` `su-spin` `su-progress`
- 布局：`su-container` `su-divider` `su-theme-toggle`

`se-image-preview` 由图片入口注册并用于内部预览，通常通过 `se-image` 打开。完整 API 清单与在线示例见文档站组件总览；兼容性、SSR 和 ElementInternals 降级见 `docs/guide/compatibility.md`。尚未建立最低浏览器版本矩阵。

命令式消息提示：

```ts
import { message } from 'silenceui';

message.success('保存成功');
message.error('请求失败', 5000);
```

## API 约定

- 简单属性用 HTML attribute：`<su-button type="primary" loading>保存</su-button>`
- 布尔属性只要存在就表示 true；需要 false 时移除 attribute 或通过 JS property 设置
- 数组、对象、函数通过 DOM property 赋值：`table.columns = [...]`
- 纯 HTML 场景可用 `itemsJson` / `optionsJson` 传 JSON 字符串
- 自定义事件使用 `CustomEvent`，业务数据放在 `event.detail`
- 表单控件设置 `name` 后会进入原生 `FormData`，并支持 `form.reset()`
- 包内置 `HTMLElementTagNameMap`，原生 TypeScript 可推断组件实例类型

原生表单集成要求浏览器支持 `ElementInternals.setFormValue`；不支持时由应用手动收集/恢复值。React 旧版中数组和布尔值均通过 ref 的 DOM property 赋值；SSR 中只在客户端注册组件。

## 主题系统

- 组件主题 token 在 `styles/theme.css`，全部基于 CSS 变量
- 明暗模式与自定义颜色的状态会持久化到 `localStorage`，刷新后自动恢复

### 一键明暗切换

```html
<!-- 放在页面任意位置，点击即可切换，多个实例自动同步 -->
<su-theme-toggle></su-theme-toggle>
```

```ts
import { setThemeMode, toggleThemeMode, getThemeMode } from 'silenceui';

toggleThemeMode(); // 明暗互切
setThemeMode('dark'); // 指定模式
getThemeMode(); // 'light' | 'dark'

// 主题变化时收到通知
window.addEventListener('su-theme-change', (e) => {
  console.log((e as CustomEvent).detail.mode);
});
```

### 自定义主题色

```ts
import { setThemeColors, resetThemeColors } from 'silenceui';

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

仓库开发工具链固定为 Node.js `22.17.1` 与 pnpm `8.15.9`。首次进入仓库时执行：

```bash
nvm use
corepack enable
cd packages/webComponents
pnpm install --frozen-lockfile
```

```bash
pnpm dev
pnpm build
pnpm test:run
pnpm lint
pnpm typecheck
pnpm typecheck:dist
pnpm docs:dev
```

提交前建议执行：

```bash
pnpm check
```

`dist/`、`docs/.vitepress/dist/`、`docs/.vitepress/cache/` 均为生成物，已由 `.gitignore` 排除，不要提交进 Git。本地或 CI 需要时再执行 `pnpm build` / `pnpm docs:build`。
