# Table 增强接口约定（第 10 天）

本页记录第 10 天冻结的接口方向。2026-11-03 已实现第 11—13 天的 columnSettings/columnState、导入导出与类型筛选，具体已支持 API 见[Table 文档](../components/table)。**编辑草稿与保存接口仍未实现**，不能调用。以下“拟新增”文字保留作为原始设计记录，不能替代当前 API 文档。

## 身份与列状态

列由非空唯一 `column.key` 标识；行编辑要求稳定且唯一的业务 `rowKey`，不能用可变行号。缺失/重复 key 时不启用编辑或状态导入，不擅自选择第一行。设置列/选择列/展开列等内部列不参与业务列顺序与显隐设置。固定列只能在各自 left/normal/right 分组内调整。

拟新增 `columnState: { key: string; hidden?: boolean; width?: number }[]`（property，数组顺序即展示顺序）；`column-state-change.detail = { columnState }`。外部赋值不触发事件。未知 key 忽略、新增列按原 columns 顺序补到所属组末尾；重复 key/非法宽度忽略并保留该列默认值。所有列均隐藏时保留设置入口，不把用户数据恢复为全显示。

`exportColumnState()` 返回 `{ version: 1, columns: [...] }` 独立副本；`importColumnState(value)` 仅接受 version=1，整包格式/版本错误不应用且返回 false，合法结构按上述逐项规则归一化并返回 true。宽度受列 minWidth/maxWidth 约束，不修改 columns；持久化由宿主负责，不读写业务 localStorage。columns 替换后按 key 重算。

## 筛选

旧 `filters` 文本模型不变，拟新增 `filterModels: Record<string, { type: 'enum'; values: string[] } | { type: 'number'; min?: number; max?: number }>`。同列新模型存在时优先于旧文本模型；不同列 AND，枚举集合内 OR；数值含边界，非有限或反向区间不应用并报告配置无效。空集合/双空区间等同清空；不将空字符串自动转成数值 0。

拟新增 `filter-model-change.detail = { filters, filterModels }`。用户实际修改重置 page=1；程序赋值不派发业务 change。local 执行筛选后排序分页；remote 只在既有请求事件中携带新模型，不发网络请求，也不对服务器数据再做本地筛选。新旧请求过期由宿主取消或按请求序号拒绝。

## 编辑草稿、校验与保存

首版编辑器限定 text/number，列需显式 `editable`。只读/禁用列不可进入。拟以 `{ rowKey, columnKey, originalValue, draftValue }` 保存草稿；不直接修改传入 row。Enter 请求保存，Escape 取消且恢复原单元格焦点；编辑区域内部事件不触发行选择或排序。

拟新增 `cell-edit-request.detail = { requestId, rowKey, columnKey, originalValue, value, resolve, reject }`。宿主负责网络保存，必须显式 resolve/reject；只有当前 requestId 且行/列身份及原值未变时应用结果。保存期间禁重复提交；失败保留草稿与错误供重试。取消、行删除/替换、列移除使旧请求失效，迟到结果不得修改新行。组件卸载后不恢复焦点。成功由宿主替换数据，组件不自行持久化，也不把请求派发当作保存成功。

后续实现必须补公开 TypeScript 类型、原生键盘和动态替换回归、remote 活例及虚拟滚动组合测试后才能更新为已支持。本批只交付接口文档，不新增未实现的运行时属性或占位方法。
