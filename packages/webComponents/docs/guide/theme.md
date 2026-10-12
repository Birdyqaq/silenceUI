# 主题定制

## 实际项目按需接入

在应用入口初始化一次，组件通过 CSS 变量自动响应主题变化：

```ts
import 'webcomponents/style.css';
import 'webcomponents/components/button';
import 'webcomponents/components/table';
import { initTheme, setThemeMode, setThemeColors, resetThemeColors } from 'webcomponents/theme';

initTheme(); // 恢复上次保存的主题
setThemeMode('dark'); // 切换暗色；light 为亮色
setThemeColors({ primary: '#7c3aed' }); // 切换品牌色，并派生 hover、RGB 和文字色
// resetThemeColors(); // 恢复默认品牌色
```

可在业务按钮点击或颜色选择器的 change 事件中调用上述 API，无需重新注册组件。主色建议使用 `#RGB` 或 `#RRGGBB`，以保证派生色正确。主色、明暗模式会持久化；设置新主色时会重新生成 hover 色，也可同时传入 `primaryHover` 自定义。

宿主页面可使用 `color: var(--su-text-1)` 和 `background: var(--su-bg-page)`，让业务页面与组件同步切换。

所有组件的颜色都来自 `styles/theme.css` 中的 CSS 变量（design token），因此换肤对全部组件一次性生效。

## 一键明暗切换

```html
<su-theme-toggle></su-theme-toggle>
```

或使用 API：

```ts
import { setThemeMode, toggleThemeMode, getThemeMode } from 'webcomponents';

toggleThemeMode(); // 明暗互切
setThemeMode('dark'); // 指定模式
getThemeMode(); // 'light' | 'dark'
```

模式会持久化到 localStorage，刷新页面后自动恢复。主题变化时 `window` 上会派发 `su-theme-change` 事件：

```ts
window.addEventListener('su-theme-change', (e) => {
  console.log(e.detail.mode, e.detail.colors);
});
```

## 自定义主题色

```ts
import { setThemeColors, resetThemeColors } from 'webcomponents';

setThemeColors({ primary: '#7c3aed' }); // 换品牌色
setThemeColors({ success: '#22c55e', error: '#dc2626' }); // 换状态色
resetThemeColors(); // 恢复默认
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

| 变量                                                    | 说明                    |
| ------------------------------------------------------- | ----------------------- |
| `--su-color-primary / success / warning / error / info` | 语义色                  |
| `--su-color-*-rgb`                                      | 对应色的 RGB 三元组     |
| `--su-color-*-contrast`                                 | 叠加在对应色上的文字色  |
| `--su-color-primary-hover`                              | 主色 hover 态           |
| `--su-text-1 / 2 / 3`                                   | 文字色（主/次/辅助）    |
| `--su-bg-page / card / hover / muted`                   | 页面/卡片/悬停/禁用背景 |
| `--su-overlay`                                          | 加载遮罩背景            |
| `--su-border-color / -hover`                            | 边框色                  |
| `--su-radius-sm / md / lg`                              | 圆角                    |
| `--su-font-size-xs / sm / md / lg`                      | 字号                    |
| `--su-shadow-sm / md`                                   | 阴影                    |
