<script setup lang="ts">
import 'webcomponents/style.css';
import 'webcomponents/components/button';
import 'webcomponents/components/input';
import { initTheme, setThemeColors, toggleThemeMode } from 'webcomponents/theme';

initTheme();
</script>

<template>
  <main style="color: var(--su-text-1); background: var(--su-bg-page); padding: 24px">
    <su-input placeholder="查询关键词" />
    <su-button @click="setThemeColors({ primary: '#7c3aed' })">紫色主题</su-button>
    <su-button @click="setThemeColors({ primary: '#2563eb' })">蓝色主题</su-button>
    <su-button @click="toggleThemeMode()">切换明暗</su-button>
  </main>
</template>
