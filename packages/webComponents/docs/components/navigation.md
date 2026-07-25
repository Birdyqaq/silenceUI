# 导航组件

## Menu 菜单 `su-menu`

后台侧边栏菜单：

```html
<su-menu id="menu" activeKey="dashboard"></su-menu>
<script>
  const menu = document.querySelector('#menu')
  menu.items = [
    { key: 'dashboard', label: '工作台', icon: '📊' },
    { key: 'orders', label: '订单管理', icon: '📦' },
    { key: 'users', label: '用户管理', icon: '👥' }
  ]
  menu.addEventListener('select', (e) => console.log(e.detail.key))
</script>
```

## Breadcrumb 面包屑 `su-breadcrumb`

```html
<su-breadcrumb id="crumb" separator="/"></su-breadcrumb>
<script>
  document.querySelector('#crumb').items = [
    { label: '首页', key: 'home' },
    { label: '订单管理', key: 'orders' },
    { label: '订单详情' }
  ]
</script>
```

事件：`navigate` → `{ item, index }`

## Tabs 标签页 `su-tabs`

面板内容通过 slot 传入，slot 名对应 tab 的 `key`：

```html
<su-tabs id="tabs" activeKey="basic">
  <div slot="basic">基本信息面板</div>
  <div slot="logs">操作日志面板</div>
</su-tabs>
<script>
  const tabs = document.querySelector('#tabs')
  tabs.items = [
    { key: 'basic', label: '基本信息' },
    { key: 'logs', label: '操作日志' },
    { key: 'other', label: '其他', disabled: true }
  ]
  tabs.addEventListener('change', (e) => console.log(e.detail.key))
</script>
```

## Dropdown 下拉菜单 `su-dropdown`

```html
<su-dropdown id="actions">
  <su-button>操作 ▾</su-button>
</su-dropdown>
<script>
  const dropdown = document.querySelector('#actions')
  dropdown.items = [
    { key: 'edit', label: '编辑' },
    { key: 'copy', label: '复制' },
    { key: 'delete', label: '删除', danger: true }
  ]
  dropdown.addEventListener('select', (e) => console.log(e.detail.key))
</script>
```

点击触发器展开，点击外部区域自动收起。

## Steps 步骤条 `su-steps`

```html
<su-steps id="steps" current="1"></su-steps>
<script>
  document.querySelector('#steps').items = [
    { title: '填写信息', description: '基础资料' },
    { title: '确认订单' },
    { title: '完成' }
  ]
</script>
```

`current` 为当前步骤下标（从 0 开始），之前的步骤显示为已完成（✓）。
