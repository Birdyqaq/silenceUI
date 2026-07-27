# 开发规范（Lit 3）

面向 `packages/webComponents` 的后续开发约定，结合当前项目实践与 Lit 3 推荐写法。

## 组件骨架

```ts
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseControlStyles, focusRingStyles } from '../_shared/styles';

@customElement('su-example')
export class SuExample extends LitElement {
  @property({ type: String }) value = '';
  @property({ type: Boolean, reflect: true }) disabled = false;

  static styles = [
    baseControlStyles,
    focusRingStyles,
    css`
      /* ... */
    `,
  ];

  private emitChange() {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`<slot></slot>`;
  }
}
```

## 必须遵守

1. **标签前缀**：新组件使用 `su-`；历史 `se-*` 保持兼容，不随意改名。
2. **样式隔离**：样式写在 `static styles`；颜色只引用 `styles/theme.css` 的 CSS 变量，禁止写死品牌色。
3. **事件穿透**：自定义事件一律 `bubbles: true, composed: true`，保证 Vue / React 宿主能收到。
4. **复杂数据**：数组/对象用 property（`.items=${...}`）；纯 HTML 场景可另提供 `itemsJson`。
5. **生命周期清理**：在 `connectedCallback` 注册的全局监听，必须在 `disconnectedCallback` 移除。
6. **共享能力**：基础字体/盒模型用 `baseControlStyles`，可聚焦控件叠加 `focusRingStyles`。
7. **目录**：按 `form` / `data` / `navigation` / `feedback` / `layout` 归类，并在 `index.ts` 同步 import + export。
8. **布尔属性**：文档示例不能写 `disabled="false"` 这类用法；需要 false 时用 JS property。
9. **类型入口**：新导出的公共 API 要能从 `index.ts` 追踪到 `dist/index.d.ts`。

## 建议遵守

- 布尔属性默认 `false`，并用 `reflect: true` 映射到 attribute（如 `disabled`、`open`）。
- 弹层组件提供 Escape 关闭与 `role="dialog"` / `aria-modal`。
- 类型定义放在同目录 `type.ts`，供组件与文档复用。
- 每个新组件至少覆盖：默认渲染、属性响应、事件触发三类测试。

## 禁止事项

- 在 Shadow DOM 的 `css` 模板里使用 `@apply` / UnoCSS 原子类（不会生效）。
- 把构建产物、IDE 配置（`.idea` / `.vscode`）当作组件源码提交。
- 在组件内硬编码与主题无关的绝对色值（中性色也应走 token）。

## 提交前检查

```bash
npx tsc -p tsconfig.json --noEmit
pnpm build
pnpm test -- --run
pnpm docs:build
```
