# Table 组件设计说明

## 目标

1. 在 `lit + unocss` 的基础上，提供可扩展的通用 Table。
2. 支持滚动触发加载更多（Infinite Scroll）。
3. 支持万级数据渲染优化（Virtual Scroll）。
4. 保持常规能力可用：排序、分页、斑马纹、悬停、对齐、省略、行点击等。
5. 支持合并单元格（`spanMethod`）。

## 总体架构

`se-table` 组件采用“数据处理层 + 渲染层”分离：

1. 数据处理层：
- 接收 `data / columns`。
- 维护 `sortedColumns / sortedData`。
- 根据模式组合出 `sourceData`（分页模式下为页切片，非分页下为全量已加载数据）。

2. 渲染层：
- 普通模式：渲染全部 `sourceData`。
- 虚拟模式：仅渲染窗口内行，并插入上下占位行（spacer）。
- 合并模式：根据 `spanMethod` 计算 `rowspan/colspan`，并自动跳过被覆盖单元格。
- 滚动容器统一监听 `scroll`，同时驱动虚拟窗口和加载更多触发。

## 核心数据流

1. `data/columns` 变化：
- 重建 `sortedColumns`（清空 sortDirection）。
- 重建 `sortedData`。
- 重置分页到第 1 页。

2. 点击表头排序：
- 方向在 `asc -> desc -> ''` 之间循环。
- `''` 回退到原始 `data` 顺序。
- 派发 `sort-change` 事件。

3. 分页变化：
- 更新 `currentPage`。
- 重置滚动位置。
- 派发 `page-change`。

## Infinite Scroll 设计

### 触发条件

滚动容器触发 `scroll` 时，满足以下条件才派发 `load-more`：

1. `infiniteScroll = true`
2. `hasMore = true`
3. `loadingMore = false`
4. 未处于本轮触发锁（`loadMorePending = false`）
5. 距离底部 `<= loadMoreOffset`

### 防抖/防重

1. 一次触发后 `loadMorePending = true`，防止连续触发。
2. 外部请求完成并将 `loadingMore` 设置回 `false` 后，解除锁，允许下一次触发。

### 外部协作约定

父层需要负责：

1. 接收 `load-more` 事件。
2. 设置 `loadingMore`。
3. 追加数据到 `table.data`。
4. 正确维护 `hasMore`。

## Virtual Scroll 设计

### 启用策略

满足任一条件启用虚拟滚动：

1. `virtualScroll = true`
2. `sourceData.length >= virtualThreshold`

### 窗口计算

参数：

1. `scrollTop`
2. `viewportHeight`
3. `virtualRowHeight`
4. `virtualBuffer`

计算：

1. `start = floor(scrollTop / rowHeight) - buffer`
2. `visibleCount = ceil(viewportHeight / rowHeight) + buffer * 2`
3. `end = start + visibleCount`
4. 真实渲染行为 `sourceData[start, end)`
5. 上下占位高度：
- `topPadding = start * rowHeight`
- `bottomPadding = (total - end) * rowHeight`

### 性能收益

万级数据下，DOM 行节点维持在“可视区 + buffer”规模，避免一次性挂载 10000+ 行导致的主线程卡顿。

## 常规能力增强

1. 列能力：
- `align`：左/中/右对齐。
- `ellipsis`：单行省略。
- `formatter`：格式化渲染。

2. 交互能力：
- `row-click` 事件。
- `stickyHeader` 吸顶表头（滚动模式下）。

3. 分页能力：
- `pagination` 开关。
- 输入页码 + 上一页/下一页按钮。

4. 合并单元格能力：
- `spanMethod(args)` 支持返回 `[rowspan, colspan]` 或 `{ rowspan, colspan }`。
- 返回 `[0, 0]` / `{ rowspan: 0, colspan: 0 }` 表示该单元格被覆盖，不渲染。

## 与 Native UI Table 对齐建议（下一步）

1. 增加 `rowSelection`（多选、全选、受控 keys）。
2. 增加 `column.fixed`（左右固定列）。
3. 增加 `expandable`（可展开行）。
4. 增加 `remote` 模式（排序/分页/筛选由服务端驱动）。
5. 增加 `summary` 与 `empty` slot。

## 风险与边界

1. 虚拟滚动默认假设固定行高（`virtualRowHeight`），若未来要支持动态行高，需要引入高度缓存与回流校正。
2. `formatter` 当前为函数，建议只在 JS 场景配置，不建议通过 HTML attribute 透传。
3. 无限滚动与分页同时开启时，组件会自动关闭分页逻辑（由 `infiniteScroll` 优先）。
4. `spanMethod` 与虚拟滚动同时使用时，组件会优先保证正确性，自动退化为非虚拟渲染。
