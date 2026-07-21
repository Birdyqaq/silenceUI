# 布局组件

## Container 后台布局容器 `su-container`

经典「侧边栏 + 顶栏 + 内容区」布局，窄屏自动堆叠：

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

## Divider 分割线 `su-divider`

```html
<su-divider></su-divider>
<su-divider dashed>带文字的分割线</su-divider>
<span>行内</span><su-divider direction="vertical"></su-divider><span>分隔</span>
```

## ThemeToggle 主题切换 `su-theme-toggle`

一键明暗切换按钮，状态持久化，多实例自动同步：

```html
<su-theme-toggle></su-theme-toggle>
```

事件：`change` → `{ mode: 'light' | 'dark' }`。主题 API 详见[主题定制](/guide/theme)。
