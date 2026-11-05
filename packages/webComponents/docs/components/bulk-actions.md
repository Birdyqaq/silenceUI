# BulkActions 批量操作栏

将表格或列表的选中项交给批量操作栏，可统一显示已选数量、业务操作和清空按钮。

<script setup>
import { ref } from 'vue';

const keys = ref([]);
const result = ref('');
const actions = [{ key: 'archive', label: '批量归档' }, { key: 'export', label: '导出所选' }];
const columns = [{ key: 'name', label: '任务' }, { key: 'owner', label: '负责人' }];
const rows = [
  { id: 'handbook', name: '更新值班手册', owner: '林晓' },
  { id: 'review', name: '复核排班计划', owner: '陈宁' },
];

function request({ detail }) {
  const label = actions.find(action => action.key === detail.action)?.label;
  result.value = label + '请求，' + detail.keys.length + ' 项';
}
</script>

<ClientOnly>
  <su-bulk-actions :selectedKeys.prop="keys" :actions.prop="actions"
    @action-request="request" @clear-selection="keys = []; result = ''"></su-bulk-actions>
  <se-table :columns.prop="columns" :data.prop="rows" rowKey="id" selectable
    :pagination.prop="false" :selectedKeys.prop="keys"
    @selection-change="keys = $event.detail.keys"></se-table>
  <p v-if="result" role="status">{{ result }}</p>
</ClientOnly>

## 接入

按需导入 `silenceui/components/data/bulk-actions`，并加载 `silenceui/style.css`。将 [Table 行选择](./table#行选择)的 `selection-change.detail.keys` 赋给 `selectedKeys`。收到清空事件时，将表格和操作栏共用的选择状态设为空数组。

| 属性           | 类型                    | 说明                                                                  |
| -------------- | ----------------------- | --------------------------------------------------------------------- |
| `selectedKeys` | `readonly string[]`     | 通过 property 传入选中 key。重复 key 只计一次。                       |
| `actions`      | `readonly BulkAction[]` | 通过 property 传入按钮。每项包含 `key`、`label` 和可选的 `disabled`。 |
| `pending`      | `boolean`               | 宿主执行操作期间设为 `true`，暂停所有按钮。                           |
| `label`        | `string`                | 操作栏的可访问名称，默认「批量操作」。                                |

| 事件              | `detail`                             | 触发时机           |
| ----------------- | ------------------------------------ | ------------------ |
| `action-request`  | `{ action: string, keys: string[] }` | 用户激活业务按钮。 |
| `clear-selection` | `{ keys: string[] }`                 | 用户请求清空选择。 |

事件中的 `keys` 是派发时的快照。宿主负责执行操作和更新选择。无选中项时按钮禁用。通过 `bar` CSS Part 定制外观。
