# 数据展示组件

## Card 卡片 `su-card`

```html
<su-card>
  <span slot="header">标题</span>
  内容区域
  <span slot="footer">底部</span>
</su-card>
```

## StatCard 指标卡片 `su-stat-card`

仪表盘顶部的统计数字卡片：

```html
<su-stat-card title="今日订单" value="1,286" trend="+12.5%" trendType="up"></su-stat-card>
```

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 指标名 | `string` | `''` |
| value | 指标值 | `string` | `''` |
| trend | 趋势文案 | `string` | `''` |
| trendType | 趋势方向 | `'up' \| 'down' \| 'flat'` | `flat` |

## Tag 标签 `su-tag`

```html
<su-tag type="success">已上线</su-tag>
<su-tag type="warning">待审核</su-tag>
<su-tag type="error">已驳回</su-tag>
```

## Badge 徽标数 `su-badge`

```html
<su-badge count="5"><su-button>消息</su-button></su-badge>
<su-badge dot><span>通知</span></su-badge>
```

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| count | 数字 | `number` | `0` |
| max | 封顶值，超出显示 `max+` | `number` | `99` |
| dot | 红点模式 | `boolean` | `false` |
| showZero | 为 0 时也显示 | `boolean` | `false` |

## Avatar 头像 `su-avatar`

```html
<su-avatar src="/avatar.png" name="王小明"></su-avatar>
<!-- 图片加载失败或无 src 时显示 name 首字符 -->
<su-avatar name="王小明" size="large" shape="square"></su-avatar>
```

## Empty 空状态 `su-empty`

```html
<su-empty description="暂无搜索结果">
  <su-button size="small">重新搜索</su-button>
</su-empty>
```

## Skeleton 骨架屏 `su-skeleton`

```html
<su-skeleton rows="4" avatar></su-skeleton>
<!-- loading=false 时渲染插槽里的真实内容 -->
<su-skeleton id="sk"><div>真实内容</div></su-skeleton>
```

## Descriptions 描述列表 `su-descriptions`

详情页字段展示：

```html
<su-descriptions id="detail" header="订单信息" column="2" bordered></su-descriptions>
<script>
  document.querySelector('#detail').items = [
    { label: '订单号', value: 'SO-20260716-001' },
    { label: '状态', value: '已发货' },
    { label: '收货人', value: '王小明' },
    { label: '金额', value: '¥1,024.00' }
  ]
</script>
```
