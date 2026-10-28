<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const writer = ref(null);
const effect = ref('type');
const cursor = ref('line');
const speed = ref(70);
const paused = ref(false);
const ready = ref(false);
let disposed = false;
const phrases = [
  '你好，欢迎来到 SilenceUI 👋',
  '一次编写，在 Vue / React 中使用',
  '让文字拥有自己的节奏 ✨',
];

onMounted(async () => {
  await customElements.whenDefined('su-typewriter');
  if (disposed) return;
  ready.value = true;
});
onUnmounted(() => {
  disposed = true;
});

function restart() {
  writer.value?.restart();
}
</script>

<template>
  <section class="typewriter-demo" aria-label="打字机交互演示">
    <div class="controls">
      <label
        >文字效果
        <select v-model="effect">
          <option value="type">经典逐字</option>
          <option value="fade">淡入</option>
          <option value="slide">上滑</option>
          <option value="blur">模糊显现</option>
          <option value="rainbow">主题彩色</option>
        </select>
      </label>
      <label
        >光标
        <select v-model="cursor">
          <option value="line">竖线</option>
          <option value="block">方块</option>
          <option value="underscore">下划线</option>
          <option value="none">隐藏</option>
        </select>
      </label>
      <label
        >每字 {{ speed }} ms
        <input v-model.number="speed" type="range" min="20" max="200" step="10"
      /></label>
      <button type="button" :disabled="!ready" @click="paused = !paused">
        {{ paused ? '继续' : '暂停' }}
      </button>
      <button type="button" :disabled="!ready" @click="restart">重播</button>
    </div>
    <div class="preview">
      <su-typewriter
        v-if="ready"
        ref="writer"
        :texts.prop="phrases"
        :effect="effect"
        :cursor="cursor"
        :speed="speed"
        :paused.prop="paused"
        loop
      />
    </div>
    <p class="hint">跟随站点主题色；系统开启“减少动态效果”时显示完整静态内容。</p>
  </section>
</template>

<style scoped>
.typewriter-demo {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
  background: var(--vp-c-bg-soft);
}
.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 16px;
}
label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}
select,
button {
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
button {
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: default;
}
input {
  accent-color: var(--vp-c-brand-1);
}
.preview {
  min-height: 100px;
  padding: 28px 0;
  font-size: clamp(18px, 3vw, 26px);
  line-height: 1.6;
}
.hint {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
