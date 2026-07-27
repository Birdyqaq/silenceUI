# 安装

## 环境要求

- Node.js 16 或更高版本。
- 支持 Custom Elements 与 Shadow DOM 的现代浏览器。

## 包管理器

```bash
npm install webcomponents
# 或
yarn add webcomponents
# 或
pnpm add webcomponents
```

在应用入口注册组件：

```ts
import 'webcomponents/style.css';
import 'webcomponents';
```

## 产物入口

包发布产物位于 `dist`：

| 字段                        | 文件                 | 适用场景                          |
| --------------------------- | -------------------- | --------------------------------- |
| `exports.import` / `module` | `dist/index.js`      | Vite、Webpack、Rollup 等 ESM 构建 |
| `exports.require` / `main`  | `dist/index.cjs`     | CommonJS 消费场景                 |
| `types`                     | `dist/index.d.ts`    | TypeScript 类型声明               |
| `style.css`                 | `dist/style.css`     | 主题变量与全局样式                |
| `unpkg` / `jsdelivr`        | `dist/index.umd.cjs` | CDN 直接引入                      |

发布包会输出独立的 `dist/style.css`。使用 npm 包时建议通过 `webcomponents/style.css` 引入；使用 CDN 时需要额外引入 CSS 链接。

## CDN

```html
<link rel="stylesheet" href="https://unpkg.com/webcomponents@latest/dist/style.css" />
<script src="https://unpkg.com/webcomponents@latest/dist/index.umd.cjs"></script>

<su-button type="primary">Hello World</su-button>
```

或使用 jsDelivr：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/webcomponents@latest/dist/style.css" />
<script src="https://cdn.jsdelivr.net/npm/webcomponents@latest/dist/index.umd.cjs"></script>
```

生产环境建议固定版本号，避免 `latest` 带来的不可预期升级：

```html
<link rel="stylesheet" href="https://unpkg.com/webcomponents@0.0.0/dist/style.css" />
<script src="https://unpkg.com/webcomponents@0.0.0/dist/index.umd.cjs"></script>
```

## Vite

Vite 项目只需在入口文件引入：

```ts
// main.ts
import 'webcomponents/style.css';
import 'webcomponents';
```

Vue 项目还需要在 `@vitejs/plugin-vue` 中配置 `isCustomElement`，详见[快速开始](./getting-started#vue-3)。

## TypeScript

包入口导出组件类、主题 API 与命令式消息 API 类型：

```ts
import 'webcomponents/style.css';
import 'webcomponents';
import { message, setThemeColors, toggleThemeMode } from 'webcomponents';

message.success('保存成功');
setThemeColors({ primary: '#2563eb' });
toggleThemeMode();
```

如果在 React JSX 中直接写自定义元素，需要为标签补充 JSX IntrinsicElements 声明，示例见[快速开始](./getting-started#react)。

## 仓库开发

在本仓库调试组件库：

```bash
cd packages/webComponents
pnpm dev
pnpm test -- --run
pnpm build
pnpm docs:dev
```
