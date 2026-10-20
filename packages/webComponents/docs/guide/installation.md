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

npm 包名统一为小写 `silenceui`，样式入口为 `silenceui/style.css`。以下安装命令用于发布后；发布前可在组件包目录执行 `pnpm pack`，再在业务项目安装生成的 `.tgz` 文件。

```bash
npm install silenceui
# 或
yarn add silenceui
# 或
pnpm add silenceui
```

在应用入口注册组件：

```ts
import 'silenceui/style.css';
import 'silenceui';
```

仅使用少量组件时，可通过独立入口按需注册，避免把全部组件放进应用产物：

```ts
import 'silenceui/style.css';
import 'silenceui/components/button';
import 'silenceui/components/form/select';
import 'silenceui/components/table';
```

入口路径与源码组件目录一致，例如 `data/tree`、`feedback/modal`、`navigation/menu`。每个入口只注册对应组件及其必要依赖；主题工具可从 `silenceui/theme` 引入。不要同时引入根入口和按需入口，否则根入口仍会注册全部组件。

独立 ESM 入口复用 Lit 和共享代码块，根入口还包含全部组件与运行时，不能只比较单个入口文件来估算应用体积。以宿主项目的最终生产构建为准，并将 Lit、共享代码块和 CSS 计入下载成本。

`pnpm package:verify` 会检查全部组件入口及其类型声明，每个入口 JS 文件上限为 80 KiB、gzip 上限为 20 KiB。这些是单文件回归阈值，不包含依赖代码块，也不是整个应用的体积承诺。入口数会随源码自动更新，当前组件清单见 [组件 API 基线](./component-inventory)。

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

发布包会输出独立的 `dist/style.css`。使用 npm 包时建议通过 `silenceui/style.css` 引入；使用 CDN 时需要额外引入 CSS 链接。

## CDN

以下为发布后的 URL 格式示例。当前仓库版本为 `0.0.0`，不代表公共 npm/CDN 上已有同名同版本产物；发布前请使用本地打包或 workspace 接入，发布后核验包名与版本再填写生产地址。CDN 连通性不属于文档构建的校验范围。

```html
<link rel="stylesheet" href="https://unpkg.com/silenceui@latest/dist/style.css" />
<script src="https://unpkg.com/silenceui@latest/dist/index.umd.cjs"></script>

<su-button type="primary">Hello World</su-button>
```

或使用 jsDelivr：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/silenceui@latest/dist/style.css" />
<script src="https://cdn.jsdelivr.net/npm/silenceui@latest/dist/index.umd.cjs"></script>
```

生产环境建议固定版本号，避免 `latest` 带来的不可预期升级：

```html
<link rel="stylesheet" href="https://unpkg.com/silenceui@0.0.0/dist/style.css" />
<script src="https://unpkg.com/silenceui@0.0.0/dist/index.umd.cjs"></script>
```

## Vite

Vite 项目只需在入口文件引入：

```ts
// main.ts
import 'silenceui/style.css';
import 'silenceui';
```

Vue 项目还需要在 `@vitejs/plugin-vue` 中配置 `isCustomElement`，详见[快速开始](./getting-started#vue-3)。

## TypeScript

包入口导出组件类、主题 API 与命令式消息 API 类型：

```ts
import 'silenceui/style.css';
import 'silenceui';
import { message, setThemeColors, toggleThemeMode } from 'silenceui';

message.success('保存成功');
setThemeColors({ primary: '#2563eb' });
toggleThemeMode();
```

按需模式下使用主题工具和命令式消息：

```ts
import { setThemeColors, toggleThemeMode } from 'silenceui/theme';
import { message } from 'silenceui/components/feedback/message';
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
