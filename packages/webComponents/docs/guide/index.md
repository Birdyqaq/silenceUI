# 介绍

SilenceUI 是一套面向后台管理系统的 Web Components 组件库，基于 Lit 3 与 TypeScript 构建。组件注册为标准 Custom Elements，可在 Vue、React、Angular、原生 HTML 等宿主环境中使用。

## 特性

- **跨框架**：对外暴露标准 HTML 标签，不绑定具体框架运行时。
- **后台优先**：覆盖表单、表格、导航、反馈、布局和数据展示等管理系统高频场景。
- **主题可控**：通过 CSS 变量统一管理 design token，支持明暗模式和运行时换肤。
- **类型友好**：包入口导出组件类、主题 API 与命令式消息 API 的类型声明。
- **事件一致**：组件自定义事件使用 `CustomEvent`，业务数据统一放在 `detail`。

## 兼容性

面向持续更新的 Chrome、Edge、Firefox 与 Safari。当前尚未建立各浏览器最低版本的自动化矩阵，因此不承诺未经验证的具体最低版本。基础要求包括 Custom Elements、Shadow DOM 和构建产物使用的现代 JavaScript 语法。

表单、原生日期面板、Tooltip 顶层显示及字素动画还依赖额外能力；降级行为、SSR 和验证范围见[兼容性与验证范围](./compatibility)。

## 为什么选择 SilenceUI？

### 轻量高效

基于浏览器原生 Custom Elements 与 Shadow DOM，组件内部样式默认隔离，接入侧只需要引入一次包入口。

### 开箱即用

入口文件会注册全部组件，并自动恢复持久化的主题配置。引入后即可在页面中使用 `su-` / `se-` 标签。

### 跨框架兼容

简单属性通过 HTML attribute 传递，数组、对象、函数等复杂数据通过 DOM property 传递。Vue 与 React 的接入注意事项见[快速开始](./getting-started)。

### 主题定制

所有主题色来自 `styles/theme.css` 的 CSS 变量，可静态覆盖，也可通过 `setThemeColors` 在运行时切换。
