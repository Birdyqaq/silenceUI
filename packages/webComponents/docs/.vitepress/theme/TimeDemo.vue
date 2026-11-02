<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
const ready = ref(false);
const result = ref('填写排班后提交，范围会以同名字段重复提交');
let disposed = false;
onMounted(async () => {
  await import('../../../index.ts');
  if (!disposed) ready.value = true;
});
onUnmounted(() => {
  disposed = true;
});
function submit(event) {
  result.value = JSON.stringify(Array.from(new FormData(event.target).entries()));
}
</script>
<template>
  <section v-if="ready" class="time-demo">
    <su-form @valid-submit="result = JSON.stringify($event.detail.values)">
      <form novalidate>
        <su-form-item label="签到时间"
          ><su-time-picker
            name="arrival"
            value="09:00"
            min="08:00"
            max="18:00"
            :step.prop="900"
            required
        /></su-form-item>
        <su-form-item label="工作时段"
          ><su-time-range
            name="shift"
            :value.prop="['09:00', '18:00']"
            min="08:00"
            max="20:00"
            :step.prop="900"
            required
        /></su-form-item>
        <button type="submit">校验排班</button><button type="reset">重置</button>
      </form>
    </su-form>
    <form @submit.prevent="submit">
      <su-time-range name="break" label="休息时段（可选）" />
      <button type="submit">查看原生 FormData</button>
    </form>
    <output aria-live="polite">{{ result }}</output>
  </section>
</template>
<style scoped>
.time-demo,
form {
  display: grid;
  gap: 12px;
  min-width: 0;
}
output {
  overflow-wrap: anywhere;
}
</style>
