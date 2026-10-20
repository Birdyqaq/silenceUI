# Icon 图标

本地打包的 Lucide 图标，不请求在线服务，不依赖 UnoCSS。颜色继承 `currentColor`。

<ClientOnly>
  <div style="display:flex;gap:16px;align-items:center">
    <su-icon name="search" size="24" label="搜索"></su-icon>
    <su-icon name="settings" size="24" label="设置"></su-icon>
    <su-icon name="loader" size="24" spin label="加载中"></su-icon>
    <su-button icon="plus">新增用户</su-button>
  </div>
</ClientOnly>

```html
<su-icon name="search" size="20" label="搜索"></su-icon> <su-button icon="plus">新增用户</su-button>
```

| 属性  | 类型    | 默认值 | 说明                                 |
| ----- | ------- | ------ | ------------------------------------ |
| name  | string  | `''`   | 内置名称；未知名称不渲染             |
| size  | string  | `1em`  | 数值字符串按 px 处理，也可用 em/rem  |
| label | string  | `''`   | 有值时提供图像名称；为空视为装饰图标 |
| spin  | boolean | false  | 旋转；尊重减少动态效果设置           |

内置名称：`search`、`plus`、`check`、`x`、`settings`、`user`、`trash`、`pencil`、`chevron-down`、`chevron-right`、`loader`。可从包入口导入 `iconNames`、`IconName` 和 `SuIcon`；按需注册路径为 `silenceui/components/icon`。只打包以上常用图标，不包含完整图库；暂不开放原始 SVG 或远程 URL 输入。

Button 新增 `icon`，沿用 `iconposition` 控制位置；新旧属性同时提供时优先 `icon`。旧 `iconclass` 保留兼容，但不会自动加载第三方 CSS。纯图标按钮仍需给按钮提供可访问名称。

图标来自 [Lucide](https://lucide.dev)，许可见发布包 `THIRD_PARTY_NOTICES.md`。
