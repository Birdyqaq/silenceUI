# 安装

## 环境要求

- 支持 Custom Elements 与 Shadow DOM 的现代浏览器。
- 使用 npm 包需要支持 ESM 的现代前端构建工具。

仓库开发环境固定为：

- Node.js `22.17.1`
- pnpm `8.15.9`

版本声明位于仓库根目录 `.nvmrc` 与 `package.json`。开发前执行：

```bash
nvm use
corepack enable
cd packages/webComponents
pnpm install --frozen-lockfile
```

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

仅使用少量组件时，可通过独立入口按需注册，避免把全部组件放进应用产物：

```ts
import 'webcomponents/style.css';
import 'webcomponents/components/button';
import 'webcomponents/components/form/select';
import 'webcomponents/components/table';
```

入口路径与源码组件目录一致，例如 `data/tree`、`feedback/modal`、`navigation/menu`。每个入口只注册对应组件及其必要依赖；主题工具可从 `webcomponents/theme` 引入。不要同时引入根入口和按需入口，否则根入口仍会注册全部组件。

当前生产构建中，独立入口约为 1.6–28.9 KB（未压缩），最大入口 `table` 约 7.1 KB gzip；完整根入口约 249.8 KB（46.2 KB gzip）。实际应用体积还会受构建器去重、压缩和使用组件组合影响。

## 产物入口

包发布产物位于 `dist`：

| 字段                        | 文件                 | 适用场景                          |
| --------------------------- | -------------------- | --------------------------------- |
| `exports.import` / `module` | `dist/index.js`      | Vite、Webpack、Rollup 等 ESM 构建 |
| `exports.require` / `main`  | `dist/index.cjs`     | CommonJS 消费场景                 |
| `types`                     | `dist/index.d.ts`    | TypeScript 类型声明               |
| `style.css`                 | `dist/style.css`     | 主题变量与全局样式                |
| `components/*`              | 独立 ESM 入口        | 按需注册单个组件                  |
| `theme`                     | 主题工具 ESM 入口    | 按需使用主题 API                  |
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

按需模式下使用主题工具和命令式消息：

```ts
import { setThemeColors, toggleThemeMode } from 'webcomponents/theme';
import { message } from 'webcomponents/components/feedback/message';
```

如果在 React JSX 中直接写自定义元素，需要为标签补充 JSX IntrinsicElements 声明，示例见[快速开始](./getting-started#react)。

## 仓库开发

在本仓库调试组件库：

```bash
pnpm dev
pnpm test:run
pnpm typecheck
pnpm typecheck:dist
pnpm lint
pnpm build
pnpm docs:dev
```

提交前可以运行完整检查：

```bash
pnpm check
```
