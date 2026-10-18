# 导航组件

导航组件用于后台侧边栏、路径导航、标签页、下拉操作与流程展示。列表型数据均支持 JS property 与 `itemsJson` 两种传法。

## Menu 菜单 `su-menu`

```html
<su-menu id="menu" activeKey="dashboard"></su-menu>

<script type="module">
  const menu = document.querySelector('#menu');
  menu.items = [
    { key: 'dashboard', label: '工作台', icon: 'D' },
    { key: 'orders', label: '订单管理', icon: 'O' },
    { key: 'users', label: '用户管理', icon: 'U' },
  ];
  menu.addEventListener('select', (event) => console.log(event.detail.key));
</script>
```

| 属性        | 说明                            | 类型         | 默认值  |
| ----------- | ------------------------------- | ------------ | ------- |
| `items`     | 菜单项，需通过 JS property 设置 | `MenuItem[]` | `[]`    |
| `itemsJson` | 菜单项 JSON 字符串              | `string`     | `''`    |
| `activeKey` | 当前激活项 key                  | `string`     | `''`    |
| `collapsed` | 是否收起，仅显示 icon           | `boolean`    | `false` |

事件：`select`，detail 直接是当前 `MenuItem`。

收起时保留每项的可访问名称及原生悬停标题。未设置 `activeKey` 或指定的 key 不存在时，首项作为当前项，高亮和 `aria-current` 保持一致。

`MenuItem`：

| 字段    | 说明         | 类型     |
| ------- | ------------ | -------- |
| `key`   | 唯一标识     | `string` |
| `label` | 文案         | `string` |
| `icon`  | 可选图标文本 | `string` |

## Breadcrumb 面包屑 `su-breadcrumb`

```html
<su-breadcrumb id="crumb" separator="/"></su-breadcrumb>

<script type="module">
  document.querySelector('#crumb').items = [
    { label: '首页', key: 'home' },
    { label: '订单管理', key: 'orders' },
    { label: '订单详情' },
  ];
</script>
```

| 属性        | 说明                              | 类型               | 默认值 |
| ----------- | --------------------------------- | ------------------ | ------ |
| `items`     | 面包屑项，需通过 JS property 设置 | `BreadcrumbItem[]` | `[]`   |
| `itemsJson` | 面包屑项 JSON 字符串              | `string`           | `''`   |
| `separator` | 分隔符                            | `string`           | `/`    |

事件：`navigate`，detail 为 `{ item: BreadcrumbItem, index: number }`。

## Tabs 标签页 `su-tabs`

面板内容通过 slot 传入，slot 名对应 tab 的 `key`：

<ClientOnly>
  <su-tabs
    activeKey="basic"
    itemsJson='[{"key":"basic","label":"基本信息"},{"key":"logs","label":"操作日志"},{"key":"other","label":"其他","disabled":true}]'>
    <div slot="basic">基本信息面板</div>
    <div slot="logs">操作日志面板</div>
  </su-tabs>
</ClientOnly>

```html
<su-tabs id="tabs" activeKey="basic">
  <div slot="basic">基本信息面板</div>
  <div slot="logs">操作日志面板</div>
</su-tabs>

<script type="module">
  const tabs = document.querySelector('#tabs');
  tabs.items = [
    { key: 'basic', label: '基本信息' },
    { key: 'logs', label: '操作日志' },
    { key: 'other', label: '其他', disabled: true },
  ];
  tabs.addEventListener('change', (event) => console.log(event.detail.key));
</script>
```

| 属性        | 说明                            | 类型        | 默认值 |
| ----------- | ------------------------------- | ----------- | ------ |
| `items`     | 标签项，需通过 JS property 设置 | `TabItem[]` | `[]`   |
| `itemsJson` | 标签项 JSON 字符串              | `string`    | `''`   |
| `activeKey` | 当前激活 key；为空时默认第一项  | `string`    | `''`   |

事件：`change`，detail 为 `{ key: string, item: TabItem }`。

键盘操作：`ArrowLeft` / `ArrowRight` 循环切换可用标签，`Home` / `End` 跳到首个 / 最后一个可用标签。组件使用 roving tabindex，并为 tab 与 panel 建立 ARIA 关联。

## Dropdown 下拉菜单 `su-dropdown`

<ClientOnly>
  <su-dropdown
    itemsJson='[{"key":"edit","label":"编辑"},{"key":"copy","label":"复制"},{"key":"delete","label":"删除","danger":true}]'>
    <su-button>操作</su-button>
  </su-dropdown>
</ClientOnly>

```html
<su-dropdown id="actions">
  <su-button>操作</su-button>
</su-dropdown>

<script type="module">
  const dropdown = document.querySelector('#actions');
  dropdown.items = [
    { key: 'edit', label: '编辑' },
    { key: 'copy', label: '复制' },
    { key: 'delete', label: '删除', danger: true },
  ];
  dropdown.addEventListener('select', (event) => console.log(event.detail.key));
</script>
```

点击触发器展开，点击外部区域自动收起。触发器应是可聚焦元素；若传入纯文本，组件会自动为触发区域补充键盘焦点。

| 属性        | 说明                            | 类型             | 默认值  |
| ----------- | ------------------------------- | ---------------- | ------- |
| `items`     | 下拉项，需通过 JS property 设置 | `DropdownItem[]` | `[]`    |
| `itemsJson` | 下拉项 JSON 字符串              | `string`         | `''`    |
| `open`      | 是否展开，可用于受控场景        | `boolean`        | `false` |
| `disabled`  | 是否禁用                        | `boolean`        | `false` |

事件：`select`，detail 为 `{ key: string, item: DropdownItem }`。

键盘操作：`ArrowDown` 打开并聚焦第一项；菜单内支持 `ArrowUp` / `ArrowDown`、`Home` / `End`；`Escape` 收起并把焦点还给触发器。

## Steps 步骤条 `su-steps`

```html
<su-steps id="steps" current="1"></su-steps>

<script type="module">
  document.querySelector('#steps').items = [
    { title: '填写信息', description: '基础资料' },
    { title: '确认订单' },
    { title: '完成' },
  ];
</script>
```

`current` 为当前步骤下标，从 0 开始；之前的步骤显示为已完成。

| 属性        | 说明                            | 类型         | 默认值 |
| ----------- | ------------------------------- | ------------ | ------ |
| `items`     | 步骤项，需通过 JS property 设置 | `StepItem[]` | `[]`   |
| `itemsJson` | 步骤项 JSON 字符串              | `string`     | `''`   |
| `current`   | 当前步骤下标                    | `number`     | `0`    |

## 类型汇总

| 类型             | 字段                                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| `BreadcrumbItem` | `{ label: string; key?: string }`                                      |
| `TabItem`        | `{ key: string; label: string; disabled?: boolean }`                   |
| `DropdownItem`   | `{ key: string; label: string; disabled?: boolean; danger?: boolean }` |
| `StepItem`       | `{ title: string; description?: string }`                              |
