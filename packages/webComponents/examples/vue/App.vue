<script setup lang="ts">
import { ref } from 'vue';
import 'silenceui/style.css';
import 'silenceui/components/form/auto-complete';
import type {
  AutoCompleteChangeDetail,
  AutoCompleteOption,
} from 'silenceui/components/form/auto-complete';
import { initTheme, setThemeColors, toggleThemeMode } from 'silenceui/theme';

initTheme();

const options: AutoCompleteOption[] = [
  { value: '上海', label: '上海' },
  { value: '杭州', label: '杭州' },
];
const disabled = ref(false);
const value = ref('');
const submitted = ref('');

function change(event: Event) {
  value.value = (event as CustomEvent<AutoCompleteChangeDetail>).detail.value;
}

function submit(event: SubmitEvent) {
  submitted.value = String(new FormData(event.currentTarget as HTMLFormElement).get('city') ?? '');
}
</script>

<template>
  <main>
    <h1>Vue 城市查询</h1>
    <button @click="setThemeColors({ primary: '#7c3aed' })">紫色主题</button>
    <button @click="toggleThemeMode()">切换明暗</button>
    <button @click="disabled = !disabled">切换禁用</button>
    <form @submit.prevent="submit">
      <su-auto-complete
        name="city"
        label="城市"
        :options.prop="options"
        :disabled.prop="disabled"
        :required.prop="true"
        @change="change"
      />
      <button type="submit">提交</button>
    </form>
    <p>
      当前值 <output id="value">{{ value }}</output>
    </p>
    <p>
      提交值 <output id="submitted">{{ submitted }}</output>
    </p>
  </main>
</template>

<style>
body {
  background: var(--su-bg-page);
  color: var(--su-text-1);
  font-family: system-ui;
}
main {
  max-width: 32rem;
  margin: 2rem auto;
  padding: 1rem;
}
form {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}
su-auto-complete {
  flex: 1;
}
</style>
