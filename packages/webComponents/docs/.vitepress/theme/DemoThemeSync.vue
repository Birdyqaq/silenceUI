<script setup>
import { onMounted, onUnmounted, watch } from 'vue';
import { useData } from 'vitepress';
import { getThemeMode, setThemeMode } from '../../../utils/theme';

const { isDark } = useData();
let stop;
function syncFromComponent(event) {
  isDark.value = event.detail.mode === 'dark';
}
onMounted(() => {
  stop = watch(
    isDark,
    (dark) => {
      const mode = dark ? 'dark' : 'light';
      if (getThemeMode() !== mode) setThemeMode(mode);
    },
    { immediate: true }
  );
  window.addEventListener('su-theme-change', syncFromComponent);
});
onUnmounted(() => {
  stop?.();
  window.removeEventListener('su-theme-change', syncFromComponent);
});
</script>

<template><span hidden aria-hidden="true"></span></template>
