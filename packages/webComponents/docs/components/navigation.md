# 导航组件

<ClientOnly><ComponentDemo category="navigation" /></ClientOnly>

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
    closable label="后台工作台"
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

新增 `closable: boolean`（默认 false）控制关闭按钮，`label: string`（默认「标签页」）提供标签栏名称。单项 `{ key, label, disabled?, closable? }` 中 `closable: false` 可固定首页。key 必须是唯一非空字符串，非法/重复项会忽略。

关闭前派发可取消的 `close`（detail `{ key, item }`）；调用 `event.preventDefault()` 可阻止关闭，例如业务需要确认未保存内容时。允许关闭后组件更新 items；JSON 输入转为 property 数据并清空 itemsJson。关闭当前页优先选择右侧可用页，再选择左侧；无可用页时 change 为 `{ key: '', item: undefined }`。关闭非当前页不触发 change，禁用项不可关闭。

`Delete` 关闭聚焦的可关闭标签。标签栏可横向滚动，方向键切换时滚动到目标页签。每项关联独立 tabpanel，切换只隐藏非当前面板，保留插槽 DOM 状态；全部禁用时不显示面板。关闭页签不会删除调用方 light DOM。路由、页面缓存、关闭确认和历史持久化由宿主管理，不是组件内置业务。

相同 key 的标题与面板节点在重排后保持身份。数据已替换但 DOM 尚未重绘时，旧关闭按钮不会操作已删除/禁用项；change 回调若把焦点移到业务对话框，组件不会在更新后抢回焦点。

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

动态设置 `disabled` 会收起已展开的菜单并阻止选择；解除禁用不会自动重新展开。禁用期间设置 `open = true` 同样不会打开菜单。

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

非法步骤项会被忽略，current 按有效步骤列表计算。负数按 0、小数向下取整，NaN/Infinity 按 0 展示；current 大于等于有效步骤数时，所有步骤标记为已完成且没有当前项。归一化只影响展示，不修改传入属性；代码更新 items/current 后自动刷新样式和可访问状态。

| 属性        | 说明                            | 类型         | 默认值 |
| ----------- | ------------------------------- | ------------ | ------ |
| `items`     | 步骤项，需通过 JS property 设置 | `StepItem[]` | `[]`   |
| `itemsJson` | 步骤项 JSON 字符串              | `string`     | `''`   |
| `current`   | 当前步骤下标                    | `number`     | `0`    |

## 类型汇总

| 类型             | 字段                                                                     |
| ---------------- | ------------------------------------------------------------------------ |
| `BreadcrumbItem` | `{ label: string; key?: string }`                                        |
| `TabItem`        | `{ key: string; label: string; disabled?: boolean; closable?: boolean }` |
| `DropdownItem`   | `{ key: string; label: string; disabled?: boolean; danger?: boolean }`   |
| `StepItem`       | `{ title: string; description?: string }`                                |

## PageHeader 页面头部

<ClientOnly>
  <su-page-header heading="成员管理" description="查看团队成员与权限" level="2" show-back>
    <su-breadcrumb slot="breadcrumb" itemsJson='[{"label":"后台"},{"label":"成员管理"}]'></su-breadcrumb>
    <button slot="actions" type="button">新增成员</button>
  </su-page-header>
</ClientOnly>

`heading` 为标题文本，`description` 为描述，`level` 支持 1—6（非法值回退到 1）。`show-back` 显示返回按钮，`back-label` 自定义文字。返回派发冒泡、可穿透 Shadow DOM 的 `back`，不会自行调用路由或浏览器历史。动作通过 `actions` 插槽传入，保留原生键盘焦点；面包屑通过 `breadcrumb` 插槽传入。按需入口：`silenceui/components/navigation/page-header`。

## Segmented 视图切换

<ClientOnly>
  <su-segmented label="成员视图" value="list" :options.prop="[{ value: 'list', label: '列表' }, { value: 'grid', label: '网格' }]"></su-segmented>
</ClientOnly>

`su-segmented` 通过 JS 属性 `options: SegmentedOption[]` 接收具有唯一 `value` 的选项，每项包含 `label` 和可选的 `disabled`。设置 `value` 指定当前项，`label` 为单选组命名。用户切换时派发 `change`，详情为 `{ value }`。方向键循环切换可用项，Home/End 到达首尾。选中项移除时，首个可用项成为 Tab 入口。宿主根据选值渲染视图。

## Menu 与 Dropdown 的定位和焦点

Menu 的子项随展开状态在导航内联布局。收起模式保留可访问名称和方向键操作，子项仍在导航内部展开。需要浮层操作时可单独使用 Dropdown。

Dropdown 会优先向下展开，空间不足时向上翻转，并在可视视口内限制尺寸。弹层打开期间跟随滚动祖先和可视视口变化。支持原生 Popover 的浏览器会将面板放在顶层，避开普通容器的裁切。ArrowDown 和 ArrowUp 分别打开并聚焦首尾可用项，Escape 返回触发器，Tab 或转移到外部焦点时关闭。选择事件的宿主处理器若已移动焦点，组件保留该焦点。

### 收起菜单浮层与页签路由

设置 `collapsed` 与 `collapsed-flyout` 后，点击父级或按右方向键可打开其浮层。多层子菜单的叶子按路径展示，禁用分支不会展开。选择叶子仍派发 Menu 的 `select`，Escape 返回父级触发器。

<ClientOnly><RouteTabsDemo /></ClientOnly>

示例用 URL 的 `demo-tab` 查询参数模拟路由。切换页签会写入历史，浏览器前进和后退会同步激活页签。关闭页签后清理该页签的备注缓存，关闭当前页签时由 Tabs 选择相邻页。
