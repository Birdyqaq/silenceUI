<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const routes = [
  { key: 'home', label: '首页', closable: false },
  { key: 'members', label: '成员管理', closable: true },
  { key: 'shifts', label: '排班管理', closable: true },
];
const tabs = ref([routes[0]]);
const activeKey = ref('home');
const cache = ref({});

function open(key) {
  const route = routes.find((item) => item.key === key) ?? routes[0];
  if (!tabs.value.some((item) => item.key === route.key)) tabs.value = [...tabs.value, route];
  activeKey.value = route.key;
}

function syncFromLocation() {
  open(new URL(location.href).searchParams.get('demo-tab'));
}

function navigate(key) {
  open(key);
  const url = new URL(location.href);
  if (activeKey.value === 'home') url.searchParams.delete('demo-tab');
  else url.searchParams.set('demo-tab', activeKey.value);
  if (url.href !== location.href) history.pushState(history.state, '', url);
}

function close(event) {
  const { key } = event.detail;
  const element = event.currentTarget;
  queueMicrotask(() => {
    if (event.defaultPrevented || element.items.some((item) => item.key === key)) return;
    tabs.value = [...element.items];
    delete cache.value[key];
  });
}

onMounted(() => {
  syncFromLocation();
  window.addEventListener('popstate', syncFromLocation);
});
onUnmounted(() => window.removeEventListener('popstate', syncFromLocation));
</script>

<template>
  <div>
    <button v-for="route in routes" :key="route.key" type="button" @click="navigate(route.key)">
      打开{{ route.label }}
    </button>
    <su-tabs
      :items.prop="tabs"
      :activeKey.prop="activeKey"
      closable
      @close="close"
      @change="navigate($event.detail.key)"
    />
    <label>
      {{ routes.find((route) => route.key === activeKey)?.label }}临时备注
      <input v-model="cache[activeKey]" />
    </label>
  </div>
</template>
