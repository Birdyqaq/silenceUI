# Button 按钮

常用的操作按钮。

## 基础用法

<ClientOnly>
  <div style="display: flex; gap: 16px; margin: 20px 0;">
    <su-button type="primary">Primary</su-button>
    <su-button type="secondary">Secondary</su-button>
    <su-button type="success">Success</su-button>
    <su-button type="warning">Warning</su-button>
    <su-button type="danger">Danger</su-button>
  </div>
</ClientOnly>

```html
<su-button type="primary">Primary</su-button>
<su-button type="secondary">Secondary</su-button>
<su-button type="success">Success</su-button>
<su-button type="warning">Warning</su-button>
<su-button type="danger">Danger</su-button>
```

## 不同尺寸

<ClientOnly>
  <div style="display: flex; gap: 16px; align-items: center; margin: 20px 0;">
    <su-button type="primary" size="small">Small</su-button>
    <su-button type="primary" size="medium">Medium</su-button>
    <su-button type="primary" size="large">Large</su-button>
  </div>
</ClientOnly>

```html
<su-button type="primary" size="small">Small</su-button>
<su-button type="primary" size="medium">Medium</su-button>
<su-button type="primary" size="large">Large</su-button>
```

## 水波纹效果

<ClientOnly>
  <div style="display: flex; flex-direction: column; gap: 16px; margin: 20px 0;">
    <div style="display: flex; gap: 16px; align-items: center;">
      <su-button type="primary" ripple="true">Primary 默认水波纹</su-button>
      <su-button type="secondary" ripple="true">Secondary 默认水波纹</su-button>
      <su-button type="success" ripple="true">Success 默认水波纹</su-button>
    </div>
    <div style="display: flex; gap: 16px; align-items: center;">
      <su-button type="warning" ripple="true">Warning 默认水波纹</su-button>
      <su-button type="danger" ripple="true">Danger 默认水波纹</su-button>
      <su-button type="primary" ripple="false">禁用水波纹</su-button>
    </div>
    <div style="display: flex; gap: 16px; align-items: center;">
      <su-button type="primary" ripple-color="rgba(255, 0, 0, 0.4)">红色水波纹</su-button>
      <su-button type="success" ripple-color="rgba(255, 255, 0, 0.4)">黄色水波纹</su-button>
      <su-button type="secondary" ripple-color="rgba(0, 255, 255, 0.4)">青色水波纹</su-button>
    </div>
  </div>
</ClientOnly>

```html
<!-- 默认水波纹 -->
<su-button type="primary" ripple="true">Primary 默认水波纹</su-button>
<su-button type="secondary" ripple="true">Secondary 默认水波纹</su-button>

<!-- 禁用水波纹 -->
<su-button type="primary" ripple="false">禁用水波纹</su-button>

<!-- 自定义水波纹颜色 -->
<su-button type="primary" ripple-color="rgba(255, 0, 0, 0.4)">红色水波纹</su-button>
<su-button type="success" ripple-color="rgba(255, 255, 0, 0.4)">黄色水波纹</su-button>
```

## API

### 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `primary` \| `secondary` \| `success` \| `warning` \| `danger` | `primary` |
| size | 按钮尺寸 | `small` \| `medium` \| `large` | `medium` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |
| ripple | 是否启用水波纹效果 | `boolean` | `true` |
| ripple-color | 水波纹颜色 | `string` | `rgba(255, 255, 255, 0.3)` |
| icon-class | 图标类名 | `string` | - |
| icon-position | 图标位置 | `left` \| `right` | `left` |
