<template>
  <div class="custom-home">
    <div class="hero-section">
      <h1 class="hero-title">{{ siteName }}</h1>
      <p class="hero-text">
        一次编写，到处
        <span class="typewriter-text">{{ currentFramework }}</span>
        <span class="cursor">|</span>
        运行
      </p>
      <p class="hero-tagline">基于 Lit 的现代组件库，支持跨框架使用</p>

      <div class="hero-actions">
        <a href="/guide/getting-started" class="action-button primary">快速开始</a>
        <a href="/components/" class="action-button secondary">查看组件</a>
      </div>
    </div>

    <div class="features-section">
      <div class="feature-grid">
        <div class="feature-item">
          <div class="feature-icon">🚀</div>
          <h3>现代技术栈</h3>
          <p>基于 Lit、TypeScript、UnoCSS 等现代前端技术</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🎯</div>
          <h3>跨框架支持</h3>
          <p>Web Components 标准，支持 Vue、React、Angular 等</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📦</div>
          <h3>按需引入</h3>
          <p>支持 ES/UMD 多格式输出，按需引入和全局引入</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🧪</div>
          <h3>测试覆盖</h3>
          <p>完善的单元测试，保障组件稳定性</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const siteName = 'SilenceUI'
const frameworks = ['Vue', 'React', 'Angular', 'Svelte']
const currentFramework = ref('Vue')

let frameIndex = 0
let charIndex = 0
let isDeleting = false
let timer = null

const typeWriter = () => {
  const targetText = frameworks[frameIndex]

  if (!isDeleting) {
    currentFramework.value = targetText.slice(0, charIndex + 1)
    charIndex++

    if (charIndex === targetText.length) {
      setTimeout(() => {
        isDeleting = true
      }, 2000)
    }
  } else {
    currentFramework.value = targetText.slice(0, charIndex - 1)
    charIndex--

    if (charIndex === 0) {
      isDeleting = false
      frameIndex = (frameIndex + 1) % frameworks.length
    }
  }

  const speed = isDeleting ? 100 : 200
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
.custom-home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 0 24px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 24px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-text {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.typewriter-text {
  color: #ffd700;
  min-width: 120px;
  display: inline-block;
}

.cursor {
  color: #ffd700;
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

/* .hero-tagline {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 48px;
} */

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-button {
  padding: 12px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-button.primary {
  background: #ffd700;
  color: #333;
}

.action-button.primary:hover {
  background: #ffed4e;
  transform: translateY(-2px);
}

.action-button.secondary {
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
}

.action-button.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

.features-section {
  padding: 80px 24px;
  background: rgba(255, 255, 255, 0.05);
}

.feature-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.feature-item {
  text-align: center;
  padding: 32px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.feature-item h3 {
  font-size: 1.5rem;
  margin-bottom: 12px;
  color: #ffd700;
}

.feature-item p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-text {
    font-size: 1.8rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
