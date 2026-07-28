# 反馈组件

反馈组件用于确认、抽屉详情、页面提示、全局消息、悬浮说明、加载与进度展示。

## Modal 模态框 `su-modal`

```html
<su-modal id="confirm-modal" title="删除确认">确定要删除这条记录吗？</su-modal>

<script type="module">
  const modal = document.querySelector('#confirm-modal');
  modal.open = true;
  modal.addEventListener('confirm', () => console.log('已确认'));
  modal.addEventListener('close', (event) => console.log('关闭来源:', event.detail.source));
</script>
```

支持 `slot="footer"` 自定义底部。打开后焦点会进入弹层，Tab 焦点不会跑出弹层，关闭后焦点会回到打开前的元素，页面滚动也会恢复。

点击确认按钮时会先触发可取消的 `confirm`，再触发 `close`。监听器调用 `event.preventDefault()` 可以阻止本次关闭，适合在提交校验失败时保留弹层。

| 属性           | 说明                              | 类型      | 默认值  |
| -------------- | --------------------------------- | --------- | ------- |
| `open`         | 是否显示，会 reflect 到 attribute | `boolean` | `false` |
| `title`        | 标题                              | `string`  | `提示`  |
| `maskClosable` | 点击遮罩或按 Escape 是否关闭      | `boolean` | `true`  |
| `hideFooter`   | 是否隐藏底部按钮区                | `boolean` | `false` |
| `confirmText`  | 确认按钮文案                      | `string`  | `确定`  |
| `cancelText`   | 取消按钮文案                      | `string`  | `取消`  |

| 事件      | detail                                                    |
| --------- | --------------------------------------------------------- |
| `confirm` | 无                                                        |
| `close`   | `{ source: 'mask' \| 'cancel' \| 'confirm' \| 'escape' }` |

## Drawer 抽屉 `su-drawer`

```html
<su-drawer id="detail-drawer" title="订单详情" width="480px" placement="right">
  抽屉内容
</su-drawer>
```

支持 Escape 与遮罩点击关闭，并具备与 Modal 一致的焦点循环、焦点恢复及页面滚动锁定。

| 属性           | 说明                              | 类型                | 默认值     |
| -------------- | --------------------------------- | ------------------- | ---------- |
| `open`         | 是否显示，会 reflect 到 attribute | `boolean`           | `false`    |
| `title`        | 标题                              | `string`            | `侧边面板` |
| `width`        | 抽屉宽度                          | `string`            | `360px`    |
| `maskClosable` | 点击遮罩或按 Escape 是否关闭      | `boolean`           | `true`     |
| `placement`    | 出现位置                          | `'left' \| 'right'` | `right`    |

事件：`close`，detail 为 `{ source: 'mask' | 'close' | 'escape' }`。

## Alert 警告提示 `su-alert`

```html
<su-alert type="warning" header="注意" closable>该操作不可撤销。</su-alert>
<su-alert type="success">保存成功。</su-alert>
```

| 属性       | 说明             | 类型                                          | 默认值  |
| ---------- | ---------------- | --------------------------------------------- | ------- |
| `type`     | 提示类型         | `'info' \| 'success' \| 'warning' \| 'error'` | `info`  |
| `header`   | 标题             | `string`                                      | `''`    |
| `closable` | 是否显示关闭按钮 | `boolean`                                     | `false` |
| `showIcon` | 是否显示图标     | `boolean`                                     | `true`  |

事件：`close`，无 detail。

## Message 全局消息 `message`

命令式调用，自动挂载到页面顶部居中，超时自动消失：

```ts
import { message } from 'webcomponents';

message.success('保存成功');
message.error('请求失败', 5000);
message('普通提示', { type: 'info', duration: 3000 });
```

| API                                   | 说明                            |
| ------------------------------------- | ------------------------------- |
| `message(content, options)`           | 创建消息，返回 `SuMessage` 元素 |
| `message.info(content, duration?)`    | 信息提示                        |
| `message.success(content, duration?)` | 成功提示                        |
| `message.warning(content, duration?)` | 警告提示                        |
| `message.error(content, duration?)`   | 错误提示                        |

`MessageOptions`：

| 字段       | 说明                                           | 类型                                          | 默认值 |
| ---------- | ---------------------------------------------- | --------------------------------------------- | ------ |
| `type`     | 消息类型                                       | `'info' \| 'success' \| 'warning' \| 'error'` | `info` |
| `duration` | 自动关闭时间，单位 ms；小于等于 0 时不自动关闭 | `number`                                      | `3000` |

`su-message` 元素关闭时触发 `close`。

## Tooltip 文字提示 `su-tooltip`

```html
<su-tooltip content="这里是说明文字" placement="top">
  <su-button>悬停查看</su-button>
</su-tooltip>
```

| 属性        | 说明     | 类型                                     | 默认值 |
| ----------- | -------- | ---------------------------------------- | ------ |
| `content`   | 提示内容 | `string`                                 | `''`   |
| `placement` | 展示方向 | `'top' \| 'bottom' \| 'left' \| 'right'` | `top`  |

Tooltip 在 hover 或 focus-within 时显示。

## Spin 加载中 `su-spin`

```html
<su-spin tip="加载中..."></su-spin>

<su-spin id="area" spinning>
  <su-card>被遮罩的内容</su-card>
</su-spin>
```

| 属性       | 说明             | 类型                             | 默认值   |
| ---------- | ---------------- | -------------------------------- | -------- |
| `spinning` | 是否显示加载状态 | `boolean`                        | `true`   |
| `size`     | 加载图标尺寸     | `'small' \| 'medium' \| 'large'` | `medium` |
| `tip`      | 加载文案         | `string`                         | `''`     |

无默认插槽内容时，`spinning` 为 true 会独立展示加载图标；有内容时会显示覆盖层。

## Progress 进度条 `su-progress`

```html
<su-progress percent="60"></su-progress>
<su-progress percent="100" status="success"></su-progress>
<su-progress percent="30" status="error" strokeHeight="6px"></su-progress>
```

`percent` 会被限制在 `0` 到 `100` 之间。

| 属性           | 说明               | 类型                               | 默认值   |
| -------------- | ------------------ | ---------------------------------- | -------- |
| `percent`      | 当前进度           | `number`                           | `0`      |
| `status`       | 状态               | `'normal' \| 'success' \| 'error'` | `normal` |
| `showText`     | 是否显示百分比文字 | `boolean`                          | `true`   |
| `strokeHeight` | 进度条高度         | `string`                           | `8px`    |
