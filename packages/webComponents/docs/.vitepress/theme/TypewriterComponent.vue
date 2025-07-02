<template>
  <div class="typewriter-wrapper">
    <span class="typewriter-text">{{ displayText }}</span>
    <span class="cursor">|</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  texts: {
    type: Array,
    default: () => ['现代化组件库', '跨框架支持', '开箱即用']
  },
  speed: {
    type: Number,
    default: 100
  }
})

const displayText = ref('')
let currentTextIndex = ref(0)
let currentCharIndex = ref(0)
let isDeleting = ref(false)
let timer = null

const typeWriter = () => {
  const currentText = props.texts[currentTextIndex.value]
  let isDeleting = ref(false)
  if (!isDeleting.value) {
    displayText.value = currentText.slice(0, currentCharIndex.value + 1)
    currentCharIndex.value++

    if (currentCharIndex.value === currentText.length) {
      setTimeout(() => {
        isDeleting.value = true
      }, 2000)
    }
  } else {
    displayText.value = currentText.slice(0, currentCharIndex.value - 1)
    currentCharIndex.value--

    if (currentCharIndex.value === 0) {
      isDeleting.value = false
      currentTextIndex.value = (currentTextIndex.value + 1) % props.texts.length
    }
  }

  timer = setTimeout(typeWriter, isDeleting.value ? props.speed / 2 : props.speed)
}

onMounted(() => {
  typeWriter()
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.typewriter-wrapper {
  display: inline-block;
  font-size: 1.5em;
  font-weight: bold;
  color: var(--vp-c-brand);
}

.cursor {
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
</style>
