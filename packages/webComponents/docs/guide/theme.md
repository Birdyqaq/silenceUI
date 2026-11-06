# 主题定制

## 实际项目按需接入

在应用入口初始化一次，组件通过 CSS 变量自动响应主题变化：

```ts
import 'silenceui/style.css';
import 'silenceui/components/button';
import 'silenceui/components/table';
import { initTheme, setThemeMode, setThemeColors, resetThemeColors } from 'silenceui/theme';

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
import { setThemeMode, toggleThemeMode, getThemeMode } from 'silenceui/theme';

toggleThemeMode(); // 明暗互切
setThemeMode('dark'); // 指定模式
getThemeMode(); // 'light' | 'dark'
```

模式会持久化到 localStorage。根入口自动恢复主题；按需引入时在应用入口调用一次 `initTheme()`。主题 API 修改配置时，`window` 上会派发 `su-theme-change` 事件：

```ts
const onThemeChange = (event: Event) => {
  const detail = (event as CustomEvent).detail;
  console.log(detail.mode, detail.colors);
};
window.addEventListener('su-theme-change', onThemeChange);
// 页面或框架组件卸载时清理：
// window.removeEventListener('su-theme-change', onThemeChange);
```

## 自定义主题色

```ts
import { setThemeColors, resetThemeColors } from 'silenceui/theme';

setThemeColors({ primary: '#7c3aed' }); // 换品牌色
setThemeColors({ success: '#22c55e', error: '#dc2626' }); // 换状态色
resetThemeColors(); // 恢复默认
```

`resetThemeColors()` 仅清除自定义颜色，不改变明暗模式。存储中的无效 JSON、`null`、数组、未知字段及非字符串值会被忽略；可用字段仍可恢复。浏览器禁止访问 localStorage 时，主题 API 仍可切换当前页面，配置不会持久化。

传入 hex 颜色后会自动派生：

- **hover 色**：主色压暗 15%（也可显式传 `primaryHover` 覆盖）
- **rgb 三元组**（`--su-color-*-rgb`）：用于浅色背景、聚焦光圈等半透明衍生色
- **对比文字色**（`--su-color-*-contrast`）：按背景的相对亮度选择对比度更高的黑色或白色。主色按钮的 hover 背景单独派生 `--su-color-primary-hover-contrast`，包括显式提供的 `primaryHover`。

## 静态定制（CSS 覆盖）

不需要运行时切换时，可以直接覆盖 CSS 变量。覆盖彩色背景时，同时设置对应的 `-contrast` 文字色。静态覆盖不会触发颜色派生。

```css
:root {
  --su-color-primary: #7c3aed;
  --su-color-primary-contrast: #ffffff;
  --su-color-primary-hover: #6d28d9;
  --su-color-primary-hover-contrast: #ffffff;
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
| `--su-color-primary-hover-contrast`                     | 主色按钮 hover 文字色   |
| `--su-text-1 / 2 / 3`                                   | 文字色（主/次/辅助）    |
| `--su-bg-page / card / hover / muted`                   | 页面/卡片/悬停/禁用背景 |
| `--su-overlay`                                          | 加载遮罩背景            |
| `--su-border-color / -hover`                            | 边框色                  |
| `--su-radius-sm / md / lg`                              | 圆角                    |
| `--su-font-size-xs / sm / md / lg`                      | 字号                    |
| `--su-shadow-sm / md`                                   | 阴影                    |

## 交互状态与 CSS Parts

`--su-focus-ring-color` 默认跟随品牌主色，共享焦点样式使用此变量。Input 的焦点光圈可通过 `--su-focus-halo` 覆盖，错误底色可通过 `--su-error-surface` 覆盖。禁用状态沿用 `--su-bg-muted` 和 `--su-text-3`，错误边框沿用 `--su-color-error`。

| 组件 | CSS Parts |
| --- | --- |
| Input | `control`、`clear-button` |
| Menu | `list`、`item` |
| Dropdown | `trigger`、`panel`、`item` |
| Tooltip | `bubble` |
| AutoComplete | `control`、`clear-button`、`popup`、`option` |

```css
su-input::part(control) {
  border-radius: 12px;
}
```

主题变量和 Parts 可直接通过 CSS 使用。内部类名属于组件实现。
