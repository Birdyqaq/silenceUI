# 反馈组件

## Modal 模态框 `su-modal`

```html
<su-modal id="confirm-modal" title="删除确认">确定要删除这条记录吗？</su-modal>
<script>
  const modal = document.querySelector('#confirm-modal')
  modal.open = true
  modal.addEventListener('confirm', () => console.log('已确认'))
  modal.addEventListener('close', (e) => console.log('关闭来源:', e.detail.source))
</script>
```

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否显示 | `boolean` | `false` |
| title | 标题 | `string` | `提示` |
| maskClosable | 点击遮罩/Escape 关闭 | `boolean` | `true` |
| hideFooter | 隐藏底部按钮区 | `boolean` | `false` |
| confirmText / cancelText | 按钮文案 | `string` | `确定` / `取消` |

支持 `slot="footer"` 自定义底部。事件：`confirm`、`close` → `{ source }`

## Drawer 抽屉 `su-drawer`

```html
<su-drawer id="detail-drawer" title="订单详情" width="480px" placement="right">
  抽屉内容
</su-drawer>
```

支持 `placement="left|right"`，Escape 与遮罩点击关闭。

## Alert 警告提示 `su-alert`

```html
<su-alert type="warning" header="注意" closable>该操作不可撤销。</su-alert>
<su-alert type="success">保存成功。</su-alert>
```

## Message 全局消息 `su-message`

命令式调用，自动挂载到页面顶部居中，超时自动消失：

```ts
import { message } from 'webcomponents'

message.success('保存成功')
message.error('请求失败', 5000) // 第二个参数为时长（ms）
message('普通提示', { type: 'info', duration: 3000 })
```

## Tooltip 文字提示 `su-tooltip`

```html
<su-tooltip content="这里是说明文字" placement="top">
  <su-button>悬停查看</su-button>
</su-tooltip>
```

`placement` 支持 `top / bottom / left / right`。

## Spin 加载中 `su-spin`

```html
<!-- 独立使用 -->
<su-spin tip="加载中..."></su-spin>

<!-- 包裹内容，spinning 时显示遮罩 -->
<su-spin id="area" spinning>
  <su-card>被遮罩的内容</su-card>
</su-spin>
```

## Progress 进度条 `su-progress`

```html
<su-progress percent="60"></su-progress>
<su-progress percent="100" status="success"></su-progress>
<su-progress percent="30" status="error" strokeHeight="6px"></su-progress>
```
