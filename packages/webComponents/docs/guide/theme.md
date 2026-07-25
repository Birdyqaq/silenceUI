# 主题定制

所有组件的颜色都来自 `styles/theme.css` 中的 CSS 变量（design token），因此换肤对全部组件一次性生效。

## 一键明暗切换

```html
<su-theme-toggle></su-theme-toggle>
```

或使用 API：

```ts
import { setThemeMode, toggleThemeMode, getThemeMode } from 'webcomponents'

toggleThemeMode()    // 明暗互切
setThemeMode('dark') // 指定模式
getThemeMode()       // 'light' | 'dark'
```

模式会持久化到 localStorage，刷新页面后自动恢复。主题变化时 `window` 上会派发 `su-theme-change` 事件：

```ts
window.addEventListener('su-theme-change', (e) => {
  console.log(e.detail.mode, e.detail.colors)
})
```

## 自定义主题色

```ts
import { setThemeColors, resetThemeColors } from 'webcomponents'

setThemeColors({ primary: '#7c3aed' })                    // 换品牌色
setThemeColors({ success: '#22c55e', error: '#dc2626' })  // 换状态色
resetThemeColors()                                        // 恢复默认
```

传入 hex 颜色后会自动派生：

- **hover 色**：主色压暗 15%（也可显式传 `primaryHover` 覆盖）
- **rgb 三元组**（`--su-color-*-rgb`）：用于浅色背景、聚焦光圈等半透明衍生色
- **对比文字色**（`--su-color-*-contrast`）：按 YIQ 感知亮度自动选择深色或白色文字，保证按钮等彩色背景上的文字可读

## 静态定制（CSS 覆盖）

不需要运行时切换时，直接覆盖变量即可：

```css
:root {
  --su-color-primary: #7c3aed;
  --su-color-primary-hover: #6d28d9;
  --su-color-primary-rgb: 124, 58, 237;
  --su-radius-sm: 4px;
}
```

## Token 一览

| 变量 | 说明 |
| --- | --- |
| `--su-color-primary / success / warning / error / info` | 语义色 |
| `--su-color-*-rgb` | 对应色的 RGB 三元组 |
| `--su-color-*-contrast` | 叠加在对应色上的文字色 |
| `--su-color-primary-hover` | 主色 hover 态 |
| `--su-text-1 / 2 / 3` | 文字色（主/次/辅助） |
| `--su-bg-page / card / hover / muted` | 页面/卡片/悬停/禁用背景 |
| `--su-overlay` | 加载遮罩背景 |
| `--su-border-color / -hover` | 边框色 |
| `--su-radius-sm / md / lg` | 圆角 |
| `--su-font-size-xs / sm / md / lg` | 字号 |
| `--su-shadow-sm / md` | 阴影 |
