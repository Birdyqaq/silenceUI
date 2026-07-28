# 数据展示组件

数据展示组件用于卡片、指标、状态、空态、骨架屏和详情信息展示。表格与图片组件有独立页面：[`se-table`](./table)、[`se-image`](./image)、[`se-asset-viewer`](./asset-viewer)。

## Card 卡片 `su-card`

```html
<su-card>
  <span slot="header">标题</span>
  内容区域
  <span slot="footer">底部</span>
</su-card>
```

| Slot     | 说明         |
| -------- | ------------ |
| 默认     | 卡片主体内容 |
| `header` | 顶部区域     |
| `footer` | 底部区域     |

## StatCard 指标卡片 `su-stat-card`

```html
<su-stat-card title="今日订单" value="1,286" trend="+12.5%" trendType="up"></su-stat-card>
```

| 属性        | 说明     | 类型                       | 默认值 |
| ----------- | -------- | -------------------------- | ------ |
| `title`     | 指标名称 | `string`                   | `''`   |
| `value`     | 指标值   | `string`                   | `''`   |
| `trend`     | 趋势文案 | `string`                   | `''`   |
| `trendType` | 趋势方向 | `'up' \| 'down' \| 'flat'` | `flat` |

## Tag 标签 `su-tag`

```html
<su-tag type="success">已上线</su-tag>
<su-tag type="warning">待审核</su-tag>
<su-tag type="error">已驳回</su-tag>
```

| 属性   | 说明     | 类型                                                          | 默认值    |
| ------ | -------- | ------------------------------------------------------------- | --------- |
| `type` | 标签语义 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error'` | `default` |

## Badge 徽标数 `su-badge`

```html
<su-badge count="5"><su-button>消息</su-button></su-badge>
<su-badge dot><span>通知</span></su-badge>
```

| 属性       | 说明                    | 类型      | 默认值  |
| ---------- | ----------------------- | --------- | ------- |
| `count`    | 数字                    | `number`  | `0`     |
| `max`      | 封顶值，超出显示 `max+` | `number`  | `99`    |
| `dot`      | 红点模式                | `boolean` | `false` |
| `showZero` | 为 0 时也显示           | `boolean` | `false` |

| Slot | 说明             |
| ---- | ---------------- |
| 默认 | 被徽标包裹的内容 |

## Avatar 头像 `su-avatar`

```html
<su-avatar src="/avatar.png" name="王小明"></su-avatar>
<su-avatar name="王小明" size="large" shape="square"></su-avatar>
```

图片加载失败或未提供 `src` 时，组件会显示 `name` 的首字符。

| 属性    | 说明                            | 类型                             | 默认值   |
| ------- | ------------------------------- | -------------------------------- | -------- |
| `src`   | 图片地址                        | `string`                         | `''`     |
| `name`  | 头像名称，用于 alt 和首字母占位 | `string`                         | `''`     |
| `size`  | 尺寸                            | `'small' \| 'medium' \| 'large'` | `medium` |
| `shape` | 形状                            | `'circle' \| 'square'`           | `circle` |

## Empty 空状态 `su-empty`

```html
<su-empty description="暂无搜索结果">
  <su-button size="small">重新搜索</su-button>
</su-empty>
```

| 属性          | 说明       | 类型     | 默认值     |
| ------------- | ---------- | -------- | ---------- |
| `description` | 空状态说明 | `string` | `暂无数据` |

| Slot | 说明       |
| ---- | ---------- |
| 默认 | 可选操作区 |

## Skeleton 骨架屏 `su-skeleton`

```html
<su-skeleton rows="4" avatar></su-skeleton>

<su-skeleton id="content-skeleton">
  <div>真实内容</div>
</su-skeleton>

<script type="module">
  document.querySelector('#content-skeleton').loading = false;
</script>
```

`loading` 为 `false` 时会渲染默认插槽中的真实内容。

| 属性       | 说明                    | 类型      | 默认值  |
| ---------- | ----------------------- | --------- | ------- |
| `rows`     | 骨架行数，最少渲染 1 行 | `number`  | `3`     |
| `avatar`   | 是否显示头像占位        | `boolean` | `false` |
| `animated` | 是否显示 shimmer 动画   | `boolean` | `true`  |
| `loading`  | 是否显示骨架屏          | `boolean` | `true`  |

## Descriptions 描述列表 `su-descriptions`

详情页字段展示：

```html
<su-descriptions id="detail" header="订单信息" column="2" bordered></su-descriptions>

<script type="module">
  document.querySelector('#detail').items = [
    { label: '订单号', value: 'SO-20260716-001' },
    { label: '状态', value: '已发货' },
    { label: '收货人', value: '王小明' },
    { label: '金额', value: '¥1,024.00' },
  ];
</script>
```

纯 HTML：

```html
<su-descriptions
  header="订单信息"
  column="2"
  itemsJson='[{"label":"订单号","value":"SO-001"},{"label":"状态","value":"已发货"}]'
>
</su-descriptions>
```

| 属性        | 说明                            | 类型                | 默认值  |
| ----------- | ------------------------------- | ------------------- | ------- |
| `items`     | 描述项，需通过 JS property 设置 | `DescriptionItem[]` | `[]`    |
| `itemsJson` | 描述项 JSON 字符串              | `string`            | `''`    |
| `header`    | 标题                            | `string`            | `''`    |
| `column`    | 列数，小于 1 时按 1 处理        | `number`            | `2`     |
| `bordered`  | 是否显示边框                    | `boolean`           | `false` |

`DescriptionItem`：

| 字段    | 说明   | 类型     |
| ------- | ------ | -------- |
| `label` | 字段名 | `string` |
| `value` | 字段值 | `string` |
