# 安装

## 环境要求

- Node.js >= 16
- 现代浏览器支持 Web Components

## 包管理器安装

### npm

```bash
npm install webcomponents
```

### yarn

```bash
yarn add webcomponents
```

### pnpm

```bash
pnpm add webcomponents
```

## CDN 引入

### unpkg

```html
<script src="https://unpkg.com/webcomponents@latest/lib/index.js"></script>
```

### jsDelivr

```html
<script src="https://cdn.jsdelivr.net/npm/webcomponents@latest/lib/index.js"></script>
```

## 开发环境配置

### Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // 配置项
})
```

### Webpack

```javascript
// webpack.config.js
module.exports = {
  // 配置项
}
```

## TypeScript 支持

如果你使用 TypeScript，组件库已经内置了类型定义文件，无需额外配置。

```typescript
import 'webcomponents'

// TypeScript 会自动识别组件类型
const button = document.createElement('su-button')
button.type = 'primary' // 有类型提示
```
