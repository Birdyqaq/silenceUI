<script setup lang="ts">
import { ref } from 'vue';

const form = ref<HTMLFormElement | null>(null);
const result = ref('尚未提交');

function submit() {
  if (!form.value) return;
  result.value = JSON.stringify(Object.fromEntries(new FormData(form.value)));
}

function resetResult() {
  form.value?.reset();
  result.value = '表单已重置';
}
</script>

<template>
  <form ref="form" class="form-demo" @submit.prevent="submit" @reset="resetResult">
    <su-form-item label="关键词">
      <su-input name="keyword" value="Lit" placeholder="请输入关键词"></su-input>
    </su-form-item>

    <su-form-item label="城市">
      <su-select
        name="city"
        value="sh"
        optionsJson='[{"label":"上海","value":"sh"},{"label":"北京","value":"bj"}]'
      >
      </su-select>
    </su-form-item>

    <su-checkbox name="agreement" value="accepted" label="同意协议" checked></su-checkbox>

    <div class="actions">
      <su-button native-type="reset" type="secondary" @click="resetResult">重置</su-button>
      <su-button native-type="submit" @click="submit">提交</su-button>
    </div>

    <output data-testid="form-result" aria-live="polite">{{ result }}</output>
  </form>
</template>

<style scoped>
.form-demo {
  display: grid;
  gap: 14px;
  max-width: 440px;
  margin: 20px 0;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

output {
  min-height: 36px;
  padding: 8px 10px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  overflow-wrap: anywhere;
}
</style>
