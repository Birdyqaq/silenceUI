# FilterPanel 筛选面板

筛选面板用于后台列表的查询和重置。默认插槽放常用条件，`advanced` 插槽放较少使用的条件。折叠高级筛选时保留输入值。

<script setup>
import { ref } from 'vue';

const keyword = ref('');
const status = ref('');
const source = [
  { id: '1', name: '更新值班手册', status: '待处理' },
  { id: '2', name: '复核排班计划', status: '已完成' },
  { id: '3', name: '提交巡检记录', status: '待处理' },
];
const rows = ref(source);
const columns = [{ key: 'name', label: '任务' }, { key: 'status', label: '状态' }];

function apply() {
  const term = keyword.value.trim();
  rows.value = source.filter(row =>
    row.name.includes(term) && (!status.value || row.status === status.value)
  );
}

function reset() {
  keyword.value = '';
  status.value = '';
  rows.value = source;
}
</script>

<ClientOnly>
  <su-filter-panel @apply="apply" @reset-filters="reset">
    <label class="demo-filter">任务关键词 <input v-model="keyword" /></label>
    <label slot="advanced" class="demo-filter">任务状态
      <select v-model="status">
        <option value="">全部</option>
        <option value="待处理">待处理</option>
        <option value="已完成">已完成</option>
      </select>
    </label>
  </su-filter-panel>
  <se-table :columns.prop="columns" :data.prop="rows" :pagination.prop="false"></se-table>
</ClientOnly>

<style scoped>
.demo-filter { display: grid; gap: 4px; min-width: 0; max-width: 100%; }
.demo-filter input, .demo-filter select {
  min-width: 0;
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
}
</style>

## 接入

按需导入 `silenceui/components/form/filter-panel`，并加载 `silenceui/style.css`。筛选值和查询结果由应用管理，远程请求期间可设 `pending`，结束后恢复按钮。

| 属性       | 类型      | 说明                                 |
| ---------- | --------- | ------------------------------------ |
| `expanded` | `boolean` | 高级筛选是否展开，默认折叠。         |
| `pending`  | `boolean` | 查询中禁用查询和重置。               |
| `label`    | `string`  | 面板的可访问名称，默认「筛选条件」。 |

| 事件            | `detail`                | 触发时机                                   |
| --------------- | ----------------------- | ------------------------------------------ |
| `apply`         | —                       | 用户点击查询。应用读取当前条件并更新列表。 |
| `reset-filters` | —                       | 用户点击重置。应用还原条件和列表。         |
| `expand-change` | `{ expanded: boolean }` | 用户展开或折叠高级条件。                   |

没有高级条件时隐藏展开按钮。折叠后已填条件仍可参与查询。查询和重置通过组件事件交给宿主，按钮可用键盘激活。样式可通过 `panel`、`fields`、`actions` 和 `advanced` CSS Parts 定制。
