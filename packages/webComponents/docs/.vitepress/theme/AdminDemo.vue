<script setup>
import { onMounted, ref } from 'vue';
const form = ref(null);
const select = ref(null);
const menu = ref(null);
const tree = ref(null);
const table = ref(null);
const result = ref('试试空表单提交、菜单展开、权限勾选和列筛选。');
onMounted(() => {
  form.value.rules = {
    username: [
      { required: true, message: '请输入用户名' },
      { validator: (value) => (String(value).length < 2 ? '至少输入两个字符' : '') },
    ],
    roles: [{ required: true, message: '至少选择一个角色' }],
  };
  select.value.options = [
    { label: '管理员', value: 'admin' },
    { label: '编辑', value: 'editor' },
    { label: '访客', value: 'guest' },
  ];
  menu.value.items = [
    {
      key: 'system',
      label: '系统管理',
      iconName: 'settings',
      children: [
        { key: 'users', label: '用户管理', iconName: 'user' },
        { key: 'roles', label: '角色管理' },
        { key: 'locked', label: '未授权入口', disabled: true },
      ],
    },
  ];
  tree.value.nodes = [
    {
      key: 'users',
      label: '用户权限',
      children: [
        { key: 'read', label: '查看' },
        { key: 'write', label: '编辑' },
        { key: 'locked', label: '超级管理员权限', disabled: true },
      ],
    },
  ];
  tree.value.expandedKeys = ['users'];
  table.value.columns = [
    { key: 'name', label: '用户名', sortable: true, filterable: true },
    { key: 'role', label: '角色', filterable: true },
  ];
  table.value.data = [
    { name: 'Alice', role: '管理员' },
    { name: 'Bob', role: '编辑' },
    { name: 'Cindy', role: '访客' },
  ];
});
function report(event) {
  result.value = JSON.stringify(event.detail);
}
</script>

<template>
  <section class="admin-demo">
    <h3>用户表单</h3>
    <su-form ref="form" @valid-submit="report" @validate="report">
      <form novalidate>
        <su-form-item label="用户名" required
          ><su-input name="username" clearable></su-input
        ></su-form-item>
        <su-form-item label="角色" required
          ><su-select ref="select" name="roles" multiple searchable clearable></su-select
        ></su-form-item>
        <su-form-item label="有效期"><su-date-range name="period"></su-date-range></su-form-item>
        <div class="actions">
          <su-button icon="check" native-type="submit">验证并保存</su-button>
          <su-button type="secondary" native-type="reset">重置</su-button>
        </div>
      </form>
    </su-form>
    <h3>多级导航</h3>
    <su-menu ref="menu" @select="report"></su-menu>
    <h3>权限树</h3>
    <su-tree ref="tree" checkable @check="report"></su-tree>
    <h3>用户列表筛选</h3>
    <se-table ref="table" @filter-change="report"></se-table>
    <p role="status">{{ result }}</p>
  </section>
</template>

<style scoped>
.admin-demo {
  padding: 20px;
  border: 1px solid var(--su-border-color);
  border-radius: 12px;
  background: var(--su-bg-card);
  color: var(--su-text-1);
}
form {
  display: grid;
  gap: 16px;
}
.actions {
  display: flex;
  gap: 12px;
}
p {
  overflow-wrap: anywhere;
}
</style>
