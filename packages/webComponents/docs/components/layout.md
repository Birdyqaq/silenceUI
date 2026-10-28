# 布局组件

<ClientOnly><ComponentDemo category="layout" /></ClientOnly>

布局组件提供后台页面骨架、分割线和主题切换入口。

## Container 后台布局容器 `su-container`

经典「侧边栏 + 顶栏 + 内容区」布局，窄屏自动堆叠为 header、sider、content。

```html
<su-container siderWidth="220px" headerHeight="56px">
  <su-menu slot="sider"></su-menu>
  <div slot="header">
    管理后台
    <su-theme-toggle></su-theme-toggle>
  </div>
  <su-card>页面内容</su-card>
</su-container>
```

| 属性           | 说明       | 类型     | 默认值  |
| -------------- | ---------- | -------- | ------- |
| `siderWidth`   | 侧边栏宽度 | `string` | `220px` |
| `headerHeight` | 顶栏高度   | `string` | `56px`  |

| Slot     | 说明       |
| -------- | ---------- |
| `sider`  | 侧边栏内容 |
| `header` | 顶栏内容   |
| 默认     | 主内容区   |

## Divider 分割线 `su-divider`

```html
<su-divider></su-divider>
<su-divider dashed>带文字的分割线</su-divider>
<span>行内</span><su-divider direction="vertical"></su-divider><span>分隔</span>
```

| 属性        | 说明     | 类型                         | 默认值       |
| ----------- | -------- | ---------------------------- | ------------ |
| `direction` | 方向     | `'horizontal' \| 'vertical'` | `horizontal` |
| `dashed`    | 是否虚线 | `boolean`                    | `false`      |

| Slot | 说明                                     |
| ---- | ---------------------------------------- |
| 默认 | 水平分割线中间文案；垂直分割线不渲染文案 |

## ThemeToggle 主题切换 `su-theme-toggle`

一键明暗切换按钮，状态持久化，多实例自动同步：

```html
<su-theme-toggle></su-theme-toggle>
```

点击后会调用 `toggleThemeMode()`，并派发组件级 `change` 事件。

| 事件     | detail                        |
| -------- | ----------------------------- |
| `change` | `{ mode: 'light' \| 'dark' }` |

主题变化还会在 `window` 上派发全局事件 `su-theme-change`，detail 为 `{ mode, colors }`。主题 API 详见[主题定制](/guide/theme)。
