# Table 表格

<ClientOnly><ComponentDemo category="table" /></ClientOnly>

面向业务数据场景的表格组件，支持排序、分页、行选择、固定列、列宽调整、可展开行、服务端数据和大数据虚拟渲染。

## 基础用法

```html
<se-table id="table-basic"></se-table>
```

```js
const table = document.querySelector('#table-basic');
table.columns = [
  { key: 'name', label: '姓名', sortable: true, align: 'left' },
  { key: 'age', label: '年龄', sortable: true, width: '88px', align: 'right' },
  { key: 'city', label: '城市', ellipsis: true },
];
table.data = [
  { id: 1, name: 'Alice', age: 24, city: 'Shanghai' },
  { id: 2, name: 'Bob', age: 28, city: 'Beijing' },
  { id: 3, name: 'Cindy', age: 26, city: 'Shenzhen' },
];
table.pageSize = 5;
table.striped = true;
table.hoverable = true;
```

可排序列的表头包含原生按钮，支持 Tab 聚焦、Enter/Space 激活。排序按“升序 → 降序 → 无排序”循环，`aria-sort` 同步反映方向。调整列宽不会触发排序。

## 服务端分页与排序

独立使用 `se-pagination` 时，`pageSize` 小于 1 或不是有限数字会回退到 10，其余值向下取整；`total` 归一化为非负整数。当前页始终限制为有效整数页码，总数减少后自动回到有效范围。外部属性校正不派发 `page-change`，只有用户操作改变有效页码时派发；业务层需要主动处理数据更新后的请求。

设置 `remote = true`、`total = 服务端总数`、`currentPage = 当前页码`。`data` 只传当前页数据，组件不会再切片或本地排序。数据响应不会重置页码或排序方向；修改 `pageSize` 时默认回到第 1 页，同一批更新中显式设置的 `currentPage` 优先。

```html
<se-table id="table-remote"></se-table>
<p id="table-error" role="status"></p>
```

```js
const table = document.querySelector('#table-remote');
const errorText = document.querySelector('#table-error');
table.remote = true;
table.columns = [{ key: 'name', label: '姓名', sortable: true }];
let sort = { column: '', direction: '' };
let pending;

async function loadRows() {
  pending?.abort();
  const request = new AbortController();
  pending = request;
  table.loading = true;
  errorText.textContent = '';
  try {
    const params = new URLSearchParams({
      page: String(table.currentPage),
      pageSize: String(table.pageSize),
      sort: sort.column,
      direction: sort.direction,
    });
    const response = await fetch(`/api/users?${params}`, { signal: request.signal });
    if (!response.ok) throw new Error('加载失败，请重试');
    const result = await response.json(); // 业务接口约定：{ rows, total }
    if (pending !== request || request.signal.aborted) return;
    table.data = result.rows;
    table.total = result.total;
  } catch (error) {
    if (!request.signal.aborted && pending === request) {
      errorText.textContent = String(error);
    }
  } finally {
    if (pending === request) table.loading = false;
  }
}

table.addEventListener('page-change', loadRows);
table.addEventListener('sort-change', (event) => {
  sort = event.detail;
  loadRows(); // 排序时表格已将 currentPage 重置为 1
});
loadRows();
// 页面卸载时调用 pending?.abort()，框架组件还应清理其注册的事件监听。
```

每次分页操作只向业务层发送一次 `page-change`。排序触发 `sort-change` 并重置页码，不额外派发 `page-change`；业务层在排序回调中请求第 1 页即可。

## 固定列与列宽调整

```js
table.columns = [
  { key: 'name', label: '姓名', width: '160px', fixed: 'left', resizable: true },
  { key: 'department', label: '部门', width: '220px', resizable: true, minWidth: 120 },
  { key: 'status', label: '状态', width: '120px' },
  { key: 'action', label: '操作', width: '140px', fixed: 'right' },
];

table.addEventListener('column-resize', (event) => {
  console.log(event.detail); // { column: 'name', width: 190 }
});
```

`fixed` 支持 `left` 和 `right`。固定列应配置明确的像素宽度，以保证多列偏移准确。将鼠标拖动表头右侧分隔条可调整宽度；聚焦分隔条后，也可使用左右方向键以 10px 为步长调整。

## 无限滚动加载

```html
<se-table id="table-infinite"></se-table>
```

```js
const table = document.querySelector('#table-infinite');
table.columns = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'title', label: '标题', align: 'left', ellipsis: true },
  { key: 'createdAt', label: '时间', width: '180px' },
];
table.infiniteScroll = true;
table.pagination = false;
table.height = '480px';
table.hasMore = true;

let page = 1;
const pageSize = 50;
const allRows = Array.from({ length: 300 }, (_, i) => ({
  id: i + 1,
  title: `记录 ${i + 1}`,
  createdAt: new Date(Date.now() - i * 60_000).toISOString(),
}));

const appendPage = () => {
  const start = (page - 1) * pageSize;
  const next = allRows.slice(start, start + pageSize);
  table.data = [...table.data, ...next];
  table.hasMore = start + pageSize < allRows.length;
};

appendPage();

table.addEventListener('load-more', async () => {
  if (!table.hasMore || table.loadingMore) return;
  table.loadingMore = true;
  await new Promise((resolve) => setTimeout(resolve, 300));
  page += 1;
  appendPage();
  table.loadingMore = false;
});
```

## 可展开行

```js
table.expandable = true;
table.rowKey = 'id'; // 稳定且唯一的主键
table.expandedKeys = ['1'];
table.rowExpandable = (row) => row.hasDetails !== false;
table.expandedRowRender = (row) => `详细信息：${row.name}`;
table.addEventListener('expand-change', (event) => console.log(event.detail));
```

展开按钮支持原生键盘操作，点击不会触发 `row-click`。`expandedKeys` 可由外部更新；`expandedRowRender` 可返回文本或 Lit 模板。展开内容会改变行高，因此开启 `expandable` 后关闭虚拟渲染。合并单元格的 rowspan 不应跨越展开详情行。

| 属性              | 说明                                      | 默认值      |
| ----------------- | ----------------------------------------- | ----------- |
| expandable        | 启用行展开                                | `false`     |
| expandedKeys      | 展开行主键数组，仅 property               | `[]`        |
| rowExpandable     | `(row, rowIndex) => boolean`，仅 property | `undefined` |
| expandedRowRender | `(row, rowIndex) => unknown`，仅 property | `undefined` |

`expand-change` 事件内容：`{ key, row, expanded, keys }`。

## 行选择

推荐为每行提供稳定且唯一的 `rowKey`。缺少主键时，组件以同一行对象的身份生成临时 key，避免本地分页或排序导致选中串行；请求后用新对象替换数据时临时 key 不保持，因此服务端分页和跨请求保留选择必须提供业务主键。

```js
const table = document.querySelector('#table-select');
table.selectable = true;
table.rowKey = 'id'; // 选中标识取自该字段，务必保证唯一

table.addEventListener('selection-change', (e) => {
  console.log(e.detail.keys); // 选中的 key 数组
  console.log(e.detail.rows); // 选中的行数据
});

// 也可受控设置
table.selectedKeys = ['1', '3'];
```

表头复选框可全选/取消当前页（分页模式）或已加载数据（滚动模式），部分选中时显示半选状态。

## 加载状态

```js
table.loading = true; // 显示加载遮罩
const rows = await fetchData();
table.data = rows;
table.loading = false;
```

## 1 万条数据渲染优化（虚拟滚动）

虚拟滚动会限制渲染窗口到有效数据范围，数据缩减后不会因旧滚动位置而空白。`pageSize`、`currentPage`、`virtualBuffer` 使用整数；非法 pageSize 回退 10，非法 virtualRowHeight 回退 44，非法 virtualBuffer 回退 8，非法 virtualThreshold 回退 1000。服务端模式仍由业务层管理页码与请求。

```js
const table = document.querySelector('#table-big-data');
table.columns = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: '姓名', align: 'left' },
  { key: 'score', label: '分数', align: 'right' },
];

table.data = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `User-${i + 1}`,
  score: Math.floor(Math.random() * 1000),
}));

table.virtualScroll = true;
table.pagination = false;
table.height = '560px';
table.virtualRowHeight = 44;
table.virtualBuffer = 10;
table.stickyHeader = true;
```

## 合并单元格

```js
const table = document.querySelector('#table-merge');
table.columns = [
  { key: 'category', label: '分类' },
  { key: 'name', label: '名称', align: 'left' },
  { key: 'amount', label: '数量', align: 'right' },
];
table.data = [
  { id: 1, category: '水果', name: '苹果', amount: 10 },
  { id: 2, category: '水果', name: '香蕉', amount: 20 },
  { id: 3, category: '饮料', name: '可乐', amount: 30 },
  { id: 4, category: '饮料', name: '雪碧', amount: 40 },
];

// 支持返回 [rowspan, colspan] 或 { rowspan, colspan }
table.spanMethod = ({ rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    if (rowIndex === 0) return [2, 1];
    if (rowIndex === 1) return [0, 0];
    if (rowIndex === 2) return [2, 1];
    if (rowIndex === 3) return [0, 0];
  }
  return [1, 1];
};
```

## API

### 列配置

| 字段      | 说明                   | 类型                                |
| --------- | ---------------------- | ----------------------------------- |
| key       | 数据字段名             | `string`                            |
| label     | 表头文案               | `string`                            |
| sortable  | 是否支持排序           | `boolean`                           |
| width     | 列宽                   | `string`                            |
| align     | 对齐方式               | `'left' \| 'center' \| 'right'`     |
| ellipsis  | 单行省略               | `boolean`                           |
| formatter | 单元格格式化           | `(value, row, rowIndex) => unknown` |
| fixed     | 固定到表格左侧或右侧   | `'left' \| 'right'`                 |
| resizable | 是否允许调整列宽       | `boolean`                           |
| minWidth  | 可调整的最小宽度（px） | `number`                            |
| maxWidth  | 可调整的最大宽度（px） | `number`                            |

### 属性

| 属性              | 说明                                      | 类型                                                 | 默认值                             |
| ----------------- | ----------------------------------------- | ---------------------------------------------------- | ---------------------------------- |
| columns           | 列配置                                    | `Column[]`                                           | `[]`                               |
| data              | 数据源                                    | `Array<Record<string, unknown>>`                     | `[]`                               |
| noDataText        | 空数据提示                                | `string`                                             | `暂无数据`                         |
| borderStyle       | 边框样式                                  | `string`                                             | `1px solid var(--su-border-color)` |
| rowLines          | 行分隔线                                  | `boolean`                                            | `true`                             |
| columnLines       | 列分隔线                                  | `boolean`                                            | `true`                             |
| theadBgColor      | 表头背景色（CSS 颜色值，默认跟随主题）    | `string`                                             | `''`                               |
| theadTextColor    | 表头文字色（CSS 颜色值，默认跟随主题）    | `string`                                             | `''`                               |
| selectable        | 开启行选择                                | `boolean`                                            | `false`                            |
| selectedKeys      | 选中的行 key（JS 设置，可受控）           | `string[]`                                           | `[]`                               |
| loading           | 加载遮罩                                  | `boolean`                                            | `false`                            |
| pageSize          | 每页数量                                  | `number`                                             | `10`                               |
| pagination        | 是否启用分页                              | `boolean`                                            | `true`                             |
| remote            | 服务端数据模式，不执行本地分页切片或排序  | `boolean`                                            | `false`                            |
| total             | 服务端模式下的数据总数                    | `number`                                             | `0`                                |
| currentPage       | 当前页码，从 1 开始，可通过 property 设置 | `number`                                             | `1`                                |
| expandable        | 开启行展开，自动关闭虚拟渲染              | `boolean`                                            | `false`                            |
| expandedKeys      | 展开行主键，仅 property                   | `string[]`                                           | `[]`                               |
| rowExpandable     | 判断行是否可展开，仅 property             | `(row, rowIndex) => boolean`                         | `undefined`                        |
| expandedRowRender | 展开内容渲染，仅 property                 | `(row, rowIndex) => unknown`                         | `undefined`                        |
| striped           | 斑马纹                                    | `boolean`                                            | `false`                            |
| hoverable         | 悬停高亮                                  | `boolean`                                            | `false`                            |
| stickyHeader      | 是否吸顶表头                              | `boolean`                                            | `false`                            |
| height            | 表格滚动容器高度                          | `string`                                             | `''`                               |
| rowKey            | 行主键字段                                | `string`                                             | `'id'`                             |
| spanMethod        | 合并单元格回调（JS 设置）                 | `(args) => [rowspan, colspan] \| {rowspan, colspan}` | `undefined`                        |
| infiniteScroll    | 开启滚动加载                              | `boolean`                                            | `false`                            |
| hasMore           | 是否仍有更多数据                          | `boolean`                                            | `false`                            |
| loadingMore       | 是否正在加载更多                          | `boolean`                                            | `false`                            |
| loadMoreOffset    | 距离底部触发阈值（px）                    | `number`                                             | `80`                               |
| virtualScroll     | 是否强制虚拟滚动                          | `boolean`                                            | `false`                            |
| virtualThreshold  | 超过该行数自动虚拟化                      | `number`                                             | `1000`                             |
| virtualRowHeight  | 虚拟行高（px）                            | `number`                                             | `44`                               |
| virtualBuffer     | 视口外预渲染行数                          | `number`                                             | `8`                                |

### 事件

| 事件名           | 说明                       | 参数                                                      |
| ---------------- | -------------------------- | --------------------------------------------------------- |
| sort-change      | 排序变化                   | `{ column: string, direction: 'asc' \| 'desc' \| '' }`    |
| page-change      | 分页变化                   | `{ currentPage: number }`                                 |
| row-click        | 行点击                     | `{ row: Record<string, unknown>, rowIndex: number }`      |
| load-more        | 触底加载                   | `{ loadedCount: number }`                                 |
| selection-change | 行选择变化                 | `{ keys: string[], rows: Record<string, unknown>[] }`     |
| column-resize    | 列宽调整完成或通过键盘调整 | `{ column: string, width: number }`                       |
| expand-change    | 行展开状态变化             | `{ key: string, row, expanded: boolean, keys: string[] }` |

### 合并单元格说明

1. `spanMethod` 中返回 `[0, 0]` 或 `{ rowspan: 0, colspan: 0 }` 表示该单元格被上方/左侧单元格覆盖，不渲染。
2. 启用 `spanMethod` 时组件会自动关闭虚拟滚动，确保跨行合并逻辑正确。

## 设计文档

- [Table 设计说明](./table-design)
