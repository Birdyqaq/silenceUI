# 兼容性与验证范围

组件面向持续更新的桌面与移动浏览器。项目尚未提供最低浏览器版本矩阵；文档构建和 jsdom 测试不等于真实浏览器兼容性验证。

## 基础要求

需要 Custom Elements、Shadow DOM、CSS variables，以及构建产物使用的现代 JavaScript 语法。按需入口使用 ESM 并依赖 Lit；UMD 面向浏览器脚本加载，不代表旧浏览器已获得 polyfill。

| 能力                                     | 缺少支持时的行为                                                         | 接入建议                                                |
| ---------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------- |
| `ElementInternals.setFormValue`          | 控件仍可交互，但不会自动写入原生 FormData；原生 reset/状态恢复也不能保证 | 提交时通过组件 property 收集值，重置时显式恢复 property |
| 原生 `input[type=date]` / `showPicker()` | 日期面板取决于浏览器；没有 showPicker 时调用不打开面板                   | 使用手动输入，若产品要求一致面板则由应用提供替代控件    |
| Popover API                              | Tooltip 退回 fixed 定位，受变换或裁剪祖先影响                            | 避免将触发器放在限制显示的容器中，并测试实际布局        |
| `ResizeObserver`                         | Tooltip 仍响应滚动和窗口变化；仅尺寸变化时不保证立即重定位               | 使用静态提示内容并测试动态布局                          |
| `Intl.Segmenter`                         | 头像和打字机退回 Unicode 码点，组合 emoji 可能分步显示                   | 需要完整字素效果时由应用提供兼容实现                    |
| `localStorage` 可用性                    | 主题仍可切换，但不能持久化                                               | 业务可自行保存配置并调用主题 API                        |

原生 FormData 不是组件验证系统：`su-form-item.required` 仅显示必填标记，不会自动为子控件增加校验。支持表单关联自定义元素的浏览器会将 `fieldset[disabled]` 的有效禁用状态通知控件；内部控件同时禁用并从提交中排除，重新启用后仍保留各控件自身的 `disabled` 设置。不支持原生表单集成的环境需由应用逐项同步 `disabled`。请在业务层验证提交数据。

## SSR 与异步注册

组件注册会访问浏览器对象。在 Nuxt、Next.js 等 SSR 框架中使用客户端组件或客户端生命周期进行动态 import，不要在服务器执行根入口。

```ts
// 仅在客户端执行
await import('webcomponents/components/form/select');
await customElements.whenDefined('su-select');
const select = document.querySelector('su-select');
if (select) select.options = [{ label: '上海', value: 'sh' }];
```

异步加载时先等待注册完成，再传数组、函数和布尔 property，避免元素升级前创建同名自有属性。Vue 示例可先注册再挂载，或在 `whenDefined` 后用 `v-if` 渲染；React 示例使用 ref 和 `addEventListener`，布尔值也用 property 赋值。

表单控件的 name property 会同步到 name attribute，原生 JS 的 `element.name = 'keyword'` 与 Vue 的 `name="keyword"` 均可参与原生提交。删除 name attribute 会恢复空字符串；动态改名会使用新的字段名提交。未命名的 RadioGroup 仅生成内部原生单选组名字，不会自动创建随机的表单提交字段。

## 验证范围

- `pnpm check`：TypeScript、ESLint、jsdom 交互测试、全量与按需构建、公开声明、发布包与文档构建。
- `pnpm docs:verify`：文档属性示例、组件目录与在线示例覆盖、远程演示资源和文档必需页面的静态检查。
- 文档在线演示使用本地图片，不依赖第三方图片服务；媒体 URL 示例是接入格式，用户提供资源的可用性、编码、CORS 与 PDF 渲染仍需在目标浏览器验证。
- 本轮浏览器实测范围记录在[文档验收](./docs-validation)。Chrome、Firefox、Safari 全量矩阵及移动真机测试仍是发布前工作，不能由构建成功推断。
