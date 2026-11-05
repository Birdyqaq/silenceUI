<script setup>
import { computed, ref } from 'vue';

const departments = [
  { key: 'engineering', label: '研发' },
  { key: 'ops', label: '运营' },
];
const roles = [
  { key: 'read', label: '读取' },
  { key: 'write', label: '维护' },
];
const rows = ref([
  {
    id: 'alice',
    name: '林晓',
    department: 'engineering',
    roles: ['read'],
    hours: ['09:00', '18:00'],
  },
  {
    id: 'bob',
    name: '陈宁',
    department: 'ops',
    roles: ['read', 'write'],
    hours: ['10:00', '19:00'],
  },
]);
const columns = [
  {
    key: 'name',
    label: '姓名',
    editable: {
      type: 'text',
      validate: (value) => (String(value).trim() ? undefined : '姓名不能为空'),
    },
  },
];
const selected = ref('');
const draft = ref(null);
const active = computed(() => rows.value.find((row) => row.id === selected.value));
function update(id, patch) {
  rows.value = rows.value.map((row) => (row.id === id ? { ...row, ...patch } : row));
}
function editCell({ detail }) {
  if (detail.resolve()) update(detail.rowKey, { name: detail.value });
}
function open(id) {
  selected.value = id;
  const { department, roles, hours } = active.value;
  draft.value = { department, roles: [...roles], hours: [...hours] };
}
function save() {
  update(selected.value, draft.value);
  draft.value = null;
}
</script>

<template>
  <section aria-label="成员角色与排班联动">
    <se-table
      :columns.prop="columns"
      :data.prop="rows"
      :pagination.prop="false"
      @cell-edit-request="editCell"
    />
    <button v-for="row in rows" :key="row.id" type="button" @click="open(row.id)">
      编辑 {{ row.name }} 的角色与排班
    </button>
    <p v-if="active" aria-live="polite">
      {{ active.name }} · {{ departments.find((item) => item.key === active.department)?.label }} ·
      {{
        roles
          .filter((item) => active.roles.includes(item.key))
          .map((item) => item.label)
          .join('、')
      }}
      · {{ active.hours.join('–') }}
    </p>
    <su-drawer title="编辑角色与排班" :open.prop="Boolean(draft)" @close="draft = null">
      <form v-if="draft" @submit.prevent="save">
        <su-tree-select
          label="部门"
          :nodes.prop="departments"
          :value.prop="draft.department"
          @change="draft.department = $event.detail.value"
        />
        <su-transfer
          :items.prop="roles"
          :targetKeys.prop="draft.roles"
          @change="draft.roles = $event.detail.targetKeys"
        />
        <su-time-range
          label="排班"
          :value.prop="draft.hours"
          required
          @change="draft.hours = $event.detail.value"
        />
        <button type="submit">保存成员设置</button>
      </form>
    </su-drawer>
  </section>
</template>
