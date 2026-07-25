# Table 表格

面向业务数据场景的表格组件，支持排序、分页、行选择、无限滚动和大数据虚拟渲染。

## 基础用法

```html
<se-table id="table-basic"></se-table>
```

```js
const table = document.querySelector('#table-basic')
table.columns = [
  { key: 'name', label: '姓名', sortable: true, align: 'left' },
  { key: 'age', label: '年龄', sortable: true, width: '88px', align: 'right' },
  { key: 'city', label: '城市', ellipsis: true }
]
table.data = [
  { id: 1, name: 'Alice', age: 24, city: 'Shanghai' },
  { id: 2, name: 'Bob', age: 28, city: 'Beijing' },
  { id: 3, name: 'Cindy', age: 26, city: 'Shenzhen' }
]
table.pageSize = 5
table.striped = true
table.hoverable = true
```

## 无限滚动加载

```html
<se-table id="table-infinite"></se-table>
```

```js
const table = document.querySelector('#table-infinite')
table.columns = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'title', label: '标题', align: 'left', ellipsis: true },
  { key: 'createdAt', label: '时间', width: '180px' }
]
table.infiniteScroll = true
table.pagination = false
table.height = '480px'
table.hasMore = true

let page = 1
const pageSize = 50
const allRows = Array.from({ length: 300 }, (_, i) => ({
  id: i + 1,
  title: `记录 ${i + 1}`,
  createdAt: new Date(Date.now() - i * 60_000).toISOString()
}))

const appendPage = () => {
  const start = (page - 1) * pageSize
  const next = allRows.slice(start, start + pageSize)
  table.data = [...table.data, ...next]
  table.hasMore = start + pageSize < allRows.length
}

appendPage()

table.addEventListener('load-more', async () => {
  if (!table.hasMore || table.loadingMore) return
  table.loadingMore = true
  await new Promise((resolve) => setTimeout(resolve, 300))
  page += 1
  appendPage()
  table.loadingMore = false
})
```

## 行选择

```js
const table = document.querySelector('#table-select')
table.selectable = true
table.rowKey = 'id' // 选中标识取自该字段，务必保证唯一

table.addEventListener('selection-change', (e) => {
  console.log(e.detail.keys) // 选中的 key 数组
  console.log(e.detail.rows) // 选中的行数据
})

// 也可受控设置
table.selectedKeys = ['1', '3']
```

表头复选框可全选/取消当前页（分页模式）或已加载数据（滚动模式），部分选中时显示半选状态。

## 加载状态

```js
table.loading = true // 显示加载遮罩
const rows = await fetchData()
table.data = rows
table.loading = false
```

## 1 万条数据渲染优化（虚拟滚动）

```js
const table = document.querySelector('#table-big-data')
table.columns = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: '姓名', align: 'left' },
  { key: 'score', label: '分数', align: 'right' }
]

table.data = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `User-${i + 1}`,
  score: Math.floor(Math.random() * 1000)
}))

table.virtualScroll = true
table.pagination = false
table.height = '560px'
table.virtualRowHeight = 44
table.virtualBuffer = 10
table.stickyHeader = true
```

## 合并单元格

```js
const table = document.querySelector('#table-merge')
table.columns = [
  { key: 'category', label: '分类' },
  { key: 'name', label: '名称', align: 'left' },
  { key: 'amount', label: '数量', align: 'right' }
]
table.data = [
  { id: 1, category: '水果', name: '苹果', amount: 10 },
  { id: 2, category: '水果', name: '香蕉', amount: 20 },
  { id: 3, category: '饮料', name: '可乐', amount: 30 },
  { id: 4, category: '饮料', name: '雪碧', amount: 40 }
]

// 支持返回 [rowspan, colspan] 或 { rowspan, colspan }
table.spanMethod = ({ rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    if (rowIndex === 0) return [2, 1]
    if (rowIndex === 1) return [0, 0]
    if (rowIndex === 2) return [2, 1]
    if (rowIndex === 3) return [0, 0]
  }
  return [1, 1]
}
```

## API

### 列配置

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| key | 数据字段名 | `string` |
| label | 表头文案 | `string` |
| sortable | 是否支持排序 | `boolean` |
| width | 列宽 | `string` |
| align | 对齐方式 | `'left' \| 'center' \| 'right'` |
| ellipsis | 单行省略 | `boolean` |
| formatter | 单元格格式化 | `(value, row, rowIndex) => unknown` |

### 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列配置 | `Column[]` | `[]` |
| data | 数据源 | `Array<Record<string, unknown>>` | `[]` |
| noDataText | 空数据提示 | `string` | `暂无数据` |
| borderStyle | 边框样式 | `string` | `1px solid var(--su-border-color)` |
| rowLines | 行分隔线 | `boolean` | `true` |
| columnLines | 列分隔线 | `boolean` | `true` |
| theadBgColor | 表头背景色（CSS 颜色值，默认跟随主题） | `string` | `''` |
| theadTextColor | 表头文字色（CSS 颜色值，默认跟随主题） | `string` | `''` |
| selectable | 开启行选择 | `boolean` | `false` |
| selectedKeys | 选中的行 key（JS 设置，可受控） | `string[]` | `[]` |
| loading | 加载遮罩 | `boolean` | `false` |
| pageSize | 每页数量 | `number` | `10` |
| pagination | 是否启用分页 | `boolean` | `true` |
| striped | 斑马纹 | `boolean` | `false` |
| hoverable | 悬停高亮 | `boolean` | `false` |
| stickyHeader | 是否吸顶表头 | `boolean` | `false` |
| height | 表格滚动容器高度 | `string` | `''` |
| rowKey | 行主键字段 | `string` | `'id'` |
| spanMethod | 合并单元格回调（JS 设置） | `(args) => [rowspan, colspan] \| {rowspan, colspan}` | `undefined` |
| infiniteScroll | 开启滚动加载 | `boolean` | `false` |
| hasMore | 是否仍有更多数据 | `boolean` | `false` |
| loadingMore | 是否正在加载更多 | `boolean` | `false` |
| loadMoreOffset | 距离底部触发阈值（px） | `number` | `80` |
| virtualScroll | 是否强制虚拟滚动 | `boolean` | `false` |
| virtualThreshold | 超过该行数自动虚拟化 | `number` | `1000` |
| virtualRowHeight | 虚拟行高（px） | `number` | `44` |
| virtualBuffer | 视口外预渲染行数 | `number` | `8` |

### 事件

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| sort-change | 排序变化 | `{ column: string, direction: 'asc' \| 'desc' \| '' }` |
| page-change | 分页变化 | `{ currentPage: number }` |
| row-click | 行点击 | `{ row: Record<string, unknown>, rowIndex: number }` |
| load-more | 触底加载 | `{ loadedCount: number }` |
| selection-change | 行选择变化 | `{ keys: string[], rows: Record<string, unknown>[] }` |

### 合并单元格说明

1. `spanMethod` 中返回 `[0, 0]` 或 `{ rowspan: 0, colspan: 0 }` 表示该单元格被上方/左侧单元格覆盖，不渲染。
2. 启用 `spanMethod` 时组件会自动关闭虚拟滚动，确保跨行合并逻辑正确。

## 设计文档

- [Table 设计说明](./table-design)
