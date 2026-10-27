# 后台详情：Collapse 与 Timeline

折叠面板适合筛选条件、配置分组和详情补充信息；时间线适合审批记录与操作日志。两者均使用主题变量，支持明暗模式与自定义主题色。

<script setup>
import { onMounted, ref } from 'vue';
const collapse = ref();
const timeline = ref();
onMounted(() => {
  collapse.value.items = [
    { key: 'account', label: '账号信息', content: '用户名：admin，角色：管理员' },
    { key: 'security', label: '安全设置', content: '已开启双重验证' },
    { key: 'locked', label: '归档配置（只读）', disabled: true },
  ];
  collapse.value.activeKeys = ['account'];
  timeline.value.items = [
    { label: '审批通过', timestamp: '2026-10-27 10:30', description: '审核人：管理员', status: 'success' },
    { label: '提交申请', timestamp: '2026-10-27 09:00', status: 'primary' },
  ];
});
</script>

<ClientOnly>
  <su-collapse ref="collapse" accordion></su-collapse>
  <div style="margin-top:24px"><su-timeline ref="timeline" label="审批记录"></su-timeline></div>
</ClientOnly>

## 引入与数据赋值

```ts
import 'silenceui/style.css';
import 'silenceui/components/data/collapse';
import 'silenceui/components/data/timeline';

const collapse = document.querySelector('su-collapse')!;
collapse.items = [{ key: 'account', label: '账号信息', content: '管理员' }];
collapse.activeKeys = ['account'];
collapse.addEventListener('change', (event) => {
  console.log((event as CustomEvent).detail.activeKeys);
});

const timeline = document.querySelector('su-timeline')!;
timeline.items = [{ label: '保存成功', timestamp: '2026-10-27 10:00', status: 'success' }];
```

复杂数组通过 DOM property 赋值，不支持 JSON attribute。根入口也导出 `SuCollapse`、`CollapseItem`、`SuTimeline`、`TimelineItem` 类型。

## Collapse API

| 属性       | 类型           | 默认值 | 说明                                                       |
| ---------- | -------------- | ------ | ---------------------------------------------------------- |
| items      | CollapseItem[] | []     | 仅 property；唯一非空 key、label、可选 content 与 disabled |
| activeKeys | string[]       | []     | 仅 property；展开 key，数据替换后忽略不存在的 key          |
| accordion  | boolean        | false  | 手风琴；传入多个 key 时展示首个有效项                      |

用户切换时更新 `activeKeys` 并派发冒泡、跨 Shadow DOM 的 `change`，detail 为 `{ activeKeys: string[], key: string }`。程序赋值不派发事件。禁用项不能由用户切换，但可由业务显式展开。无有效项时显示空容器。

每个 key 对应一个同名 slot，可传富内容（避免保留 slot 名 `''`）；没有分配内容时显示纯文本 content。关闭面板保留内容 DOM，隐藏控件不进入正常 Tab 顺序。标题按钮支持 Enter/Space 原生切换、上下方向键循环、Home/End 定位，自动跳过禁用项；面板使用 aria-controls/aria-labelledby 关联。

```html
<su-collapse id="settings">
  <div slot="account"><a href="/account">查看账号</a></div>
</su-collapse>
```

## Timeline API

| 属性    | 类型           | 默认值     | 说明                                                    |
| ------- | -------------- | ---------- | ------------------------------------------------------- |
| items   | TimelineItem[] | []         | 仅 property；label、可选 description、timestamp、status |
| reverse | boolean        | false      | 反转展示，不修改原数组，不自动按时间排序                |
| label   | string         | 操作时间线 | 日志列表的可访问名称                                    |

status 支持 primary/success/warning/error，未知值回退主题主色。状态点仅作装饰，业务应在 label 中明确写出状态；timestamp 原样作为展示文本，不解析时区。没有交互事件，不提供远程分页、可点击节点或 HTML 字符串渲染；无有效数据时显示空列表，可由应用结合 Empty 提示。
