# SilenceUI

面向后台管理系统的跨框架 Web Components 组件库。基于 **Lit + TypeScript**，通过原生自定义元素接入页面，使用 CSS 主题变量统一明暗模式与品牌色。

适合构建管理列表、配置表单、详情页和审批流程。项目持续开发中，目前组件包版本为 `0.0.0`；**尚未发布到 npm，不是可直接投入生产的完整后台模板**。

## 项目亮点

- **跨框架接入**：标准自定义元素，可接入原生页面、Vue、React 等；复杂数据通过 DOM property 传递，自定义事件通过 DOM 监听。
- **后台常用能力**：52 个自定义元素，覆盖表单、表格、导航、反馈与布局；包含 TreeSelect、Transfer、权限树勾选、表格文本筛选、可关闭 Tabs、折叠面板和时间线。
- **统一主题**：明暗切换、自定义主色与语义色，组件内部使用 Lit CSS 与共享变量，不要求业务项目安装 UnoCSS。
- **本地图标**：统一 `su-icon`，按需打包常用 Lucide 图标，不依赖在线图标服务。
- **表单协作**：原生表单值同步、约束校验桥接、同步/异步规则、错误关联与过期校验结果保护。
- **交付检查**：类型、代码规范、单元测试、根/按需入口、发布包内容与文档构建统一验收。

这些能力有明确边界，测试覆盖不等同于所有复杂业务都已支持。具体 API 与限制以组件文档为准。

## 快速运行文档

环境：Node.js `22.17.1`、pnpm `8.15.9`。先在本机准备好对应工具，再执行：

```bash
git clone https://github.com/Birdyqaq/silenceUI.git
cd silenceUI
nvm use
corepack enable
cd packages/webComponents
pnpm install --frozen-lockfile
pnpm docs:dev --host 127.0.0.1 --port 5175 --strictPort
```

打开 [本地组件文档](http://127.0.0.1:5175/silenceUI/)。该地址需要本机文档服务运行，不是在线部署地址。

## 如何使用

正式包名为 `silenceui`，展示名称为 **SilenceUI**。尚未发布时，请从仓库根目录进入组件包，生成本地安装包：

```bash
cd packages/webComponents
pnpm pack --pack-destination /tmp
```

再在你的应用项目中执行：

```bash
npm install /tmp/silenceui-0.0.0.tgz
```

发布后的安装命令将是 `npm install silenceui`，目前不应将其视为已发布说明。

```ts
// 应用入口：全量注册
import 'silenceui/style.css';
import 'silenceui';
```

```html
<su-card>
  <span slot="header">用户管理</span>
  <su-button>新增用户</su-button>
  <su-theme-toggle></su-theme-toggle>
</su-card>
```

按需注册与全量注册二选一：

```ts
import 'silenceui/style.css';
import 'silenceui/components/button';
import 'silenceui/components/navigation/tabs';
import { initTheme, setThemeColors } from 'silenceui/theme';

initTheme();
setThemeColors({ primary: '#7c3aed' });
```

Vue 需要配置 `isCustomElement`，React 应通过 ref 给组件赋复杂属性，并绑定原生自定义事件。完整示例见[快速开始](packages/webComponents/docs/guide/getting-started.md)和[包使用说明](packages/webComponents/README.md)。

## 组件覆盖

| 场景 | 主要组件与能力 |
| --- | --- |
| 表单录入 | Input、Select、Textarea、Checkbox、RadioGroup、Switch、InputNumber、Cascader、DatePicker、DateRange、Upload、Form / FormItem |
| 数据与详情 | Table、Pagination、Tree、Descriptions、Card、StatCard、Tag、Badge、Avatar、Empty、Skeleton、Collapse、Timeline |
| 导航 | Menu、Breadcrumb、Tabs（可关闭、固定项、关闭拦截、相邻回退）、Dropdown、Steps |
| 反馈 | Modal、Drawer、Alert、Message、Notification、Popconfirm、Tooltip、Spin、Progress |
| 布局与资源 | Container、Divider、ThemeToggle、Icon、Image、AssetViewer、Typewriter |

新组件使用 `su-` 前缀；历史 `se-table`、`se-pagination` 等保留兼容。完整标签与属性见[组件 API 清单](packages/webComponents/docs/guide/component-inventory.md)。

## 支持边界与路线

- Table 已支持文本筛选、排序、分页、行选择等，但不等同于具备单元格编辑、枚举/区间筛选和列设置的完整业务表格。
- 日期组件使用浏览器原生日期输入；Upload 负责选文件和校验，不包含上传服务或断点续传。
- Tabs 提供页签交互，不接管应用路由、页面缓存或持久化。
- Tree 的勾选是前端交互，不替代服务端权限校验。
- 组件使用 Shadow DOM；SSR 时应避免在服务端直接执行浏览器组件注册，主题变量和受支持的 CSS Parts 用于样式定制。
- 后续优先补齐时间选择、表格编辑和 PageHeader。详见[后台扩展计划](packages/webComponents/docs/guide/admin-roadmap.md)。
- 当前执行路线见 [30 天完善计划](packages/webComponents/docs/guide/30-day-plan.md)，按质量基线、时间组件、Table、后台页面与联动验收推进。

## 仓库结构

```text
packages/
  webComponents/       核心组件包 silenceui、文档、示例与检查脚本
  vue2/                Vue 2 示例项目
  excelExportPlugin/   独立 Excel 导出相关包
```

核心开发位于 `packages/webComponents`。根目录不是可发布的组件包，请在该目录执行组件开发命令。

## 开发与贡献

```bash
cd packages/webComponents
pnpm test:run       # 单元测试
pnpm docs:dev       # 文档开发
pnpm build          # 根入口与按需入口构建
pnpm check          # 提交前完整检查
```

欢迎通过 [Issues](https://github.com/Birdyqaq/silenceUI/issues) 反馈问题或提出组件需求。提交 PR 前请阅读[贡献指南](CONTRIBUTING.md)，为交互与边界行为补充测试，并同步文档、类型与变更记录。

## 作者与联系

- 维护者：[Birdyqaq](https://github.com/Birdyqaq)
- 邮箱：[wuzheng011@gmail.com](mailto:wuzheng011@gmail.com)
- 仓库：[Birdyqaq/silenceUI](https://github.com/Birdyqaq/silenceUI)

组件包元数据声明 ISC 许可；第三方图标许可见[第三方声明](packages/webComponents/THIRD_PARTY_NOTICES.md)。仓库尚无独立 LICENSE 文件，完整许可文本仍待补齐。
