<template>
  <div class="framework-typewriter">
    一次编写，到处
    <span class="framework-text">{{ displayText }}</span>
    <span class="cursor">|</span>
    运行
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const frameworks = ['Vue', 'React', 'Angular', 'Svelte', '原生JS']
const displayText = ref('')
let currentIndex = ref(0)
let charIndex = ref(0)
let isDeleting = ref(false)
let timer = null

const typeWriter = () => {
  const currentFramework = frameworks[currentIndex.value]

  if (!isDeleting.value) {
    displayText.value = currentFramework.slice(0, charIndex.value + 1)
    charIndex.value++

    if (charIndex.value === currentFramework.length) {
      setTimeout(() => {
        isDeleting.value = true
      }, 2000) // 停留2秒
    }
  } else {
    displayText.value = currentFramework.slice(0, charIndex.value - 1)
    charIndex.value--

    if (charIndex.value === 0) {
      isDeleting.value = false
      currentIndex.value = (currentIndex.value + 1) % frameworks.length
    }
  }

  const speed = isDeleting.value ? 100 : 200
  timer = setTimeout(typeWriter, speed)
}

onMounted(() => {
  typeWriter()
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.framework-typewriter {
  font-size: 2rem;
  font-weight: bold;
  color: var(--vp-c-text-1);
  text-align: center;
  padding: 20px 0;
}

.framework-text {
  color: var(--vp-c-brand-1);
  min-width: 80px;
  display: inline-block;
  text-align: left;
}

.cursor {
  color: var(--vp-c-brand-1);
  animation: blink 1s infinite;
}

@keyframes blink {

  0%,
  50% {
    opacity: 1
  }

  51%,
  100% {
    opacity: 0
  }
}

@media (max-width: 768px) {
  .framework-typewriter {
    font-size: 1.5rem;
  }
}
</style>
