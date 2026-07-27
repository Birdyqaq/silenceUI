# Line 分割线

用于在布局中创建水平或垂直分隔。该组件为历史兼容组件，新页面优先使用主题化的 [`su-divider`](./layout#divider-分割线-su-divider)。

## 基础用法

<ClientOnly>
  <div style="display: grid; gap: 12px; align-items: center; width: 280px; margin: 20px 0;">
    <line-component color="#0ea5e9"></line-component>
    <line-component direction="vertical" color="#e11d48" style="height: 80px;"></line-component>
  </div>
</ClientOnly>

```html
<line-component color="#0ea5e9"></line-component>
<line-component direction="vertical" color="#e11d48" style="height: 80px;"></line-component>
```

## API

| 属性      | 说明     | 类型                           | 默认值         |
| --------- | -------- | ------------------------------ | -------------- |
| direction | 方向     | `'horizontal'` \| `'vertical'` | `'horizontal'` |
| color     | 线条颜色 | `string`                       | `#000`         |
