# 组件库设计方案

SilenceUI 是一套面向后台管理系统的 Web Components 组件库，基于 [Lit 3](https://lit.dev) 构建，可在 Vue、React、原生 HTML 等任意宿主环境中使用。

## 设计目标

1. **框架无关**：产出标准 Custom Elements，一次编写，Vue / React / 原生均可直接消费。
2. **后台场景优先**：组件清单围绕「增删改查 + 布局 + 反馈」的后台典型需求裁剪，不追求大而全。
3. **主题可定制**：所有颜色经由 CSS 变量（design token）流转，支持一键明暗切换与运行时换肤。
4. **轻量**：仅依赖 Lit（约 5KB gzip 运行时），无其他运行时依赖。

## 技术选型

| 事项     | 选择                                           | 理由                                          |
| -------- | ---------------------------------------------- | --------------------------------------------- |
| 组件模型 | Lit 3 + 装饰器                                 | 响应式属性、Shadow DOM 样式隔离、模板高效更新 |
| 样式方案 | Shadow DOM 内 `static styles` + 全局 CSS 变量  | 隔离宿主样式污染，token 从外部穿透实现主题化  |
| 构建     | Vite（ES / CJS / UMD 三产物）+ vite-plugin-dts | 类型声明齐全，兼容各种引入方式                |
| 测试     | Vitest + jsdom + Testing Library               | 与 Vite 共享配置                              |
| 文档     | VitePress                                      | Markdown 驱动，支持组件演示                   |

## 目录结构

```text
components/
  _shared/           # 共享样式（baseControlStyles、focusRingStyles）与工具（parseJsonArray）
  form/              # 表单：select、switch、textarea、checkbox、radio-group、input-number、form-item
  data/              # 数据展示：card、stat-card、tag、badge、avatar、empty、skeleton、descriptions
  navigation/        # 导航：menu、breadcrumb、tabs、dropdown、steps
  feedback/          # 反馈：modal、drawer、alert、message、tooltip、spin、progress
  layout/            # 布局：container、divider、theme-toggle
  button/ input/ table/ pagination/ image/ line/ asset-viewer/   # 历史目录，保持兼容
styles/theme.css     # 全局 design token（唯一颜色来源）
utils/theme.ts       # 主题管理器（模式切换、自定义色、持久化）
```

## 命名与 API 规范

### 标签名

- 新组件统一使用 `su-` 前缀（如 `su-button`、`su-modal`）。
- `se-table`、`se-pagination`、`se-image` 等为历史前缀，保持兼容不改名。

### 属性（Props）

- 简单值（string / number / boolean）用 attribute 传递，`camelCase` 属性对应 `camelcase` 或 `kebab-case` attribute。
- 复杂值（数组 / 对象 / 函数）通过 property 赋值（`.items=${...}` 或 `el.items = [...]`）。
- 列表型数据同时提供 `xxxJson` 字符串 attribute 作为纯 HTML 场景的降级方案，内部经 `parseJsonArray` 安全解析。
- 布尔属性默认 `false`，与 HTML attribute 语义一致。

### 事件

- 统一使用 `CustomEvent`，负载放 `detail`，并设置 `bubbles: true, composed: true` 让事件穿出 Shadow DOM。
- 命名使用小写单词或 kebab-case：`change`、`close`、`select`、`sort-change`、`load-more`。
- 全局事件挂在 `window` 上并加 `su-` 前缀，如 `su-theme-change`。

### 插槽

- 主内容用默认插槽；结构性区域用具名插槽（`header` / `footer` / `sider`）。
- 动态面板（如 tabs）用「slot 名对应数据 key」的约定。

## 主题系统

### Token 分层

```text
颜色语义层  --su-color-primary / success / warning / error / info
衍生层      --su-color-*-rgb（浅色背景、聚焦光圈）
            --su-color-*-contrast（叠加文字色，按 YIQ 亮度自动计算）
            --su-color-primary-hover（自动压暗 15%）
中性色层    --su-text-1/2/3、--su-bg-page/card/hover/muted、--su-border-color、--su-overlay
规格层      --su-radius-*、--su-font-size-*、--su-shadow-*
```

**规则：组件样式内禁止写死颜色值，必须引用 token。** 这是运行时换肤能全局生效的前提。

### 运行时切换

- 明暗模式：在 `<html>` 上切换 `data-su-theme` 属性（兼容 `.su-theme-dark` 类），`utils/theme.ts` 提供 `setThemeMode` / `toggleThemeMode`，状态持久化到 localStorage。
- 自定义颜色：`setThemeColors({ primary: '#7c3aed' })` 在根元素写入 CSS 变量，并自动派生 hover 色、rgb 三元组与对比文字色。
- `su-theme-toggle` 组件提供开箱即用的一键切换按钮，多实例通过 `su-theme-change` 事件同步。

## 无障碍（a11y）

- 交互元素使用原生 `button` / `input` / `select`，天然获得键盘与焦点行为。
- 导航组件提供可识别的语义：菜单项使用 `menuitem`，面包屑使用 `aria-current="page"`，步骤条使用 `list` / `listitem` 与 `aria-current="step"`。
- 菜单支持 `ArrowUp` / `ArrowDown` / `Home` / `End` 在菜单项之间移动焦点；组件外层应避免再包一层同样响应这些按键的容器。
- 弹层类组件（modal / drawer）标注 `role="dialog"` + `aria-modal`，支持 Escape 关闭。
- 状态类组件标注 `role="alert" / "status" / "progressbar"` 等语义角色。
- 共享的 `focusRingStyles` 提供统一的 `:focus-visible` 焦点环。

## 测试与质量

- 单元测试放在组件目录内（`*.test.ts`），用 Vitest + jsdom 断言渲染结果与事件行为。
- 新组件的验收基线：默认渲染、属性响应、事件触发三类用例。

## 路线图

- [x] date-picker（原生日期能力、边界与表单关联）
- [x] upload（文件类型、大小、数量校验与表单关联）
- [x] notification（右上角通知，支持堆叠与自动关闭）
- [x] popconfirm（危险操作二次确认）
- [x] tree / cascader（组织架构、分类选择与键盘交互）
- [x] 表格列固定、列宽拖拽
- [x] 按需引入（每组件独立入口）
