<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
const ready = ref(false),
  result = ref('配置列、筛选或导出恢复'),
  table = ref(null);
const remote = ref(false);
const failNext = ref(false);
let disposed = false,
  saved;
onMounted(async () => {
  await import('../../../index.ts');
  if (!disposed) ready.value = true;
});
onUnmounted(() => {
  disposed = true;
});
const columns = [
  {
    key: 'name',
    label: '姓名',
    fixed: 'left',
    width: '140px',
    editable: {
      type: 'text',
      validate: (value) => (String(value).trim() ? undefined : '姓名不能为空'),
    },
  },
  { key: 'age', label: '年龄', resizable: true, filterable: true, filterType: 'number' },
  {
    key: 'city',
    label: '城市',
    filterable: true,
    filterType: 'enum',
    filterOptions: [
      { value: 'sh', label: '上海' },
      { value: 'bj', label: '北京' },
    ],
  },
];
const rows = ref([
  { id: 1, name: 'Alice', age: 20, city: 'sh' },
  { id: 2, name: 'Bob', age: 30, city: 'bj' },
]);
async function saveCell({ detail }) {
  const { signal, resolve, reject, rowKey, columnKey, value } = detail;
  await new Promise((done) => setTimeout(done, 250));
  if (disposed || signal.aborted) return;
  if (failNext.value) {
    failNext.value = false;
    reject('模拟保存失败，可重试');
    return;
  }
  if (!resolve()) return;
  rows.value = rows.value.map((row) =>
    String(row.id) === rowKey ? { ...row, [columnKey]: value } : row
  );
  result.value = '宿主已更新数据（模拟保存）';
}
function save() {
  saved = table.value.exportColumnState();
  result.value = JSON.stringify(saved);
}
function restore() {
  result.value = String(table.value.importColumnState(saved));
}
</script>
<template>
  <section v-if="ready">
    <label><input v-model="remote" type="checkbox" /> remote 模式（模拟服务器）</label>
    <label><input v-model="failNext" type="checkbox" /> 下次保存失败</label>
    <button @click="save">导出列状态</button><button @click="restore">恢复列状态</button
    ><se-table
      ref="table"
      :columns.prop="columns"
      :data.prop="rows"
      :remote.prop="remote"
      :columnSettings.prop="true"
      :pagination.prop="false"
      @column-state-change="result = JSON.stringify($event.detail)"
      @filter-model-change="result = JSON.stringify($event.detail)"
      @filter-invalid="result = JSON.stringify($event.detail)"
      @cell-edit-request="saveCell"
    /><output>{{ result }}</output>
  </section>
</template>
<style scoped>
section {
  min-width: 0;
}
output {
  display: block;
  overflow-wrap: anywhere;
}
</style>
