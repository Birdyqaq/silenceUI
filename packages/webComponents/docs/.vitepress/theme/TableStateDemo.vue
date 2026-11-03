<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
const ready = ref(false),
  result = ref('配置列、筛选或导出恢复'),
  table = ref(null);
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
  { key: 'name', label: '姓名', fixed: 'left', width: '100px' },
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
const rows = [
  { id: 1, name: 'Alice', age: 20, city: 'sh' },
  { id: 2, name: 'Bob', age: 30, city: 'bj' },
];
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
    <button @click="save">导出列状态</button><button @click="restore">恢复列状态</button
    ><se-table
      ref="table"
      :columns.prop="columns"
      :data.prop="rows"
      :columnSettings.prop="true"
      :pagination.prop="false"
      @column-state-change="result = JSON.stringify($event.detail)"
      @filter-model-change="result = JSON.stringify($event.detail)"
      @filter-invalid="result = JSON.stringify($event.detail)"
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
