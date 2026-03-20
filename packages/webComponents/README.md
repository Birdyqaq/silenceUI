# SilenceUI Web Components

基于 Lit 的跨框架 Web Components 组件库，可直接在任意前端项目中使用。

## 安装

```bash
npm install webcomponents
# 或者
pnpm add webcomponents
```

## 快速使用

```html
<!-- 直接在 HTML 中使用 -->
<script type="module">
  import 'webcomponents'
</script>

<su-button type="primary">提交</su-button>
<su-input placeholder="请输入内容"></su-input>
<se-table></se-table>
```

按需引入单个组件：

```js
import 'webcomponents/components/button/index.js'
import 'webcomponents/components/input/index.js'
```

## 已提供的组件

- `su-button` 按钮，支持多种语义、尺寸、水波纹与加载态。
- `su-input` 输入框，支持标签、错误提示、禁用/只读、清空按钮与输入事件。
- `se-table` 表格，支持列配置、升降序排序、分页、斑马纹与悬停高亮。
- `se-image` 图片，内置懒加载、占位与预览。
- `line-component` 分割线，支持横向/纵向与自定义颜色。
- `se-asset-viewer` 资源预览卡片，支持图片/视频/音频/PDF 预览与下载。

更多用法请访问 `docs` 目录的 VitePress 文档或在线站点（本地运行 `npm run docs:dev`）。
