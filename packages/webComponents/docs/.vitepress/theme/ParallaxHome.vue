<template>
  <div class="parallax-home">
    <!-- 视差背景层 -->
    <div class="parallax-bg" ref="parallaxBg">
      <div class="bg-layer bg-layer-1"></div>
      <div class="bg-layer bg-layer-2"></div>
      <div class="bg-layer bg-layer-3"></div>
    </div>

    <!-- 浮动粒子效果 -->
    <div class="particles" ref="particles">
      <div v-for="i in 50" :key="i" class="particle" :style="getParticleStyle(i)"></div>
    </div>

    <!-- Hero 区域 -->
    <section class="hero-section" ref="heroSection">
      <div class="hero-content">
        <h1 class="hero-title" ref="heroTitle">
          <span class="title-word">Silence</span>
          <span class="title-word">UI</span>
        </h1>
        <div class="hero-text-container">
          <p class="hero-text">
            一次编写，到处
            <span class="typewriter-text">{{ currentTech }}</span>
            <span class="cursor">|</span>
            使用
          </p>
        </div>
        <p class="hero-tagline" ref="heroTagline">
          基于 Web Components 标准的现代组件库，轻量、高效、易用
        </p>

        <div class="hero-actions" ref="heroActions">
          <a href="/guide/getting-started" class="action-button primary">
            <span>快速开始</span>
            <div class="button-bg"></div>
          </a>
          <a href="/components/" class="action-button secondary">
            <span>查看组件</span>
            <div class="button-bg"></div>
          </a>
        </div>
      </div>

      <!-- 滚动提示 -->
      <div class="scroll-indicator" ref="scrollIndicator">
        <div class="scroll-arrow"></div>
        <span>向下滚动探索更多</span>
      </div>
    </section>

    <!-- 特性区域 -->
    <section class="features-section" ref="featuresSection">
      <div class="features-container">
        <h2 class="section-title">核心优势</h2>
        <div class="feature-grid">
          <div v-for="(feature, index) in features" :key="index" class="feature-card" ref="featureCards"
            :style="{ animationDelay: `${index * 0.2}s` }">
            <div class="feature-icon-wrapper">
              <div class="feature-icon">{{ feature.icon }}</div>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 应用场景展示 -->
    <section class="scenarios-section" ref="scenariosSection">
      <div class="scenarios-container">
        <h2 class="section-title">应用场景</h2>
        <div class="scenarios-grid">
          <div v-for="scenario in scenarios" :key="scenario.name" class="scenario-item" ref="scenarioItems">
            <div class="scenario-icon">{{ scenario.icon }}</div>
            <h3>{{ scenario.name }}</h3>
            <p>{{ scenario.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术栈展示 -->
    <!-- <section class="tech-section" ref="techSection">
      <div class="tech-container">
        <h2 class="section-title">技术栈</h2>
        <div class="tech-grid">
          <div v-for="tech in techStack" :key="tech.name" class="tech-item" ref="techItems">
            <div class="tech-icon">{{ tech.icon }}</div>
            <h3>{{ tech.name }}</h3>
          </div>
        </div>
      </div>
    </section> -->

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// 响应式引用
const parallaxBg = ref(null)
const particles = ref(null)
const heroSection = ref(null)
const heroTitle = ref(null)
const heroTagline = ref(null)
const heroActions = ref(null)
const scrollIndicator = ref(null)
const featuresSection = ref(null)
const featureCards = ref([])
const scenariosSection = ref(null)
const scenarioItems = ref([])
const techSection = ref(null)
const techItems = ref([])

// 打字机效果
const techs = ['Vue', 'React', 'Angular', 'Svelte']
const currentTech = ref('Vue')
let techIndex = 0
let charIndex = 0
let isDeleting = false
let typeTimer = null

// 数据
const features = [
  {
    icon: '⚡',
    title: '轻量高效',
    description: '基于原生 Web Components，无需额外框架依赖，体积小巧，性能卓越'
  },
  {
    icon: '🔧',
    title: '开箱即用',
    description: '提供完整的组件库和工具链，无需复杂配置即可快速上手'
  },
  {
    icon: '🎨',
    title: '主题定制',
    description: '支持 CSS 变量和 UnoCSS，轻松实现个性化主题定制'
  },
  {
    icon: '📱',
    title: '响应式设计',
    description: '移动优先的设计理念，完美适配各种屏幕尺寸和设备'
  },
  {
    icon: '🛠️',
    title: '开发友好',
    description: '完善的 TypeScript 支持和开发工具，提升开发体验'
  },
  {
    icon: '🔒',
    title: '质量保障',
    description: '严格的代码规范和测试覆盖，确保组件的稳定性和可靠性'
  }
]

const scenarios = [
  {
    name: '企业官网',
    icon: '🏢',
    description: '快速构建专业的企业展示网站'
  },
  {
    name: '管理后台',
    icon: '📊',
    description: '高效开发数据管理和业务操作界面'
  },
  {
    name: '营销页面',
    icon: '📢',
    description: '创建吸引用户的产品宣传页面'
  }
]

const techStack = [
  { name: 'Web Components', icon: '🧩' },
  { name: 'TypeScript', icon: '🔷' },
  { name: 'UnoCSS', icon: '🎨' },
  { name: 'Vite', icon: '⚡' },
  { name: 'Vitest', icon: '🧪' },
  { name: 'ESLint', icon: '🔍' }
]

// 粒子样式生成
const getParticleStyle = (index) => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 10 + 's',
    animationDuration: (Math.random() * 10 + 5) + 's'
  }
}

// 打字机效果
const typeWriter = () => {
  const targetText = techs[techIndex]

  if (!isDeleting) {
    currentTech.value = targetText.slice(0, charIndex + 1)
    charIndex++

    if (charIndex === targetText.length) {
      setTimeout(() => {
        isDeleting = true
      }, 2000)
    }
  } else {
    currentTech.value = targetText.slice(0, charIndex - 1)
    charIndex--

    if (charIndex === 0) {
      isDeleting = false
      techIndex = (techIndex + 1) % techs.length
    }
  }

  const speed = isDeleting ? 100 : 200
  typeTimer = setTimeout(typeWriter, speed)
}

// 滚动视差效果
const handleScroll = () => {
  const scrolled = window.pageYOffset
  const rate = scrolled * -0.5

  // 背景视差
  if (parallaxBg.value) {
    parallaxBg.value.style.transform = `translateY(${rate}px)`
  }

  // Hero 内容视差
  if (heroTitle.value) {
    heroTitle.value.style.transform = `translateY(${scrolled * 0.3}px)`
  }

  if (heroTagline.value) {
    heroTagline.value.style.transform = `translateY(${scrolled * 0.2}px)`
  }

  if (heroActions.value) {
    heroActions.value.style.transform = `translateY(${scrolled * 0.1}px)`
  }

  // 滚动指示器淡出
  if (scrollIndicator.value) {
    const opacity = Math.max(0, 1 - scrolled / 300)
    scrollIndicator.value.style.opacity = opacity
  }
}

// Intersection Observer 动画
const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  }, { threshold: 0.1 })

  // 观察特性卡片
  featureCards.value?.forEach(card => {
    if (card) observer.observe(card)
  })

  // 观察应用场景
  scenarioItems.value?.forEach(item => {
    if (item) observer.observe(item)
  })

  // 观察技术栈项目
  techItems.value?.forEach(item => {
    if (item) observer.observe(item)
  })

  // 观察区域标题
  if (featuresSection.value) observer.observe(featuresSection.value)
  if (scenariosSection.value) observer.observe(scenariosSection.value)
  if (techSection.value) observer.observe(techSection.value)
}

onMounted(async () => {
  await nextTick()

  // 启动打字机效果
  typeWriter()

  // 绑定滚动事件
  window.addEventListener('scroll', handleScroll)

  // 设置观察器
  observeElements()

  // 初始动画
  setTimeout(() => {
    if (heroTitle.value) heroTitle.value.classList.add('animate-in')
  }, 500)

  setTimeout(() => {
    if (heroTagline.value) heroTagline.value.classList.add('animate-in')
  }, 800)

  setTimeout(() => {
    if (heroActions.value) heroActions.value.classList.add('animate-in')
  }, 1100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (typeTimer) clearTimeout(typeTimer)
})
</script>

<style scoped>
.parallax-home {
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

/* 视差背景 */
.parallax-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 120%;
  height: 120%;
  z-index: -1;
}

.bg-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-layer-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-layer-2 {
  background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3), transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3), transparent 50%);
}

.bg-layer-3 {
  background: radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2), transparent 50%);
}

/* 粒子效果 */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float linear infinite;
}

@keyframes float {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    transform: translateY(-100vh) scale(1);
    opacity: 0;
  }
}

/* Hero 区域 */
.hero-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

.hero-content {
  max-width: 800px;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  margin-bottom: 2rem;
  color: #fff;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: translateY(50px);
  transition: all 1s ease;
}

.hero-title.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.title-word {
  display: inline-block;
  animation: titleBounce 2s ease infinite alternate;
}

.title-word:nth-child(2) {
  animation-delay: 0.5s;
}

@keyframes titleBounce {
  0% {
    transform: translateY(0px);
  }

  100% {
    transform: translateY(-10px);
  }
}

.hero-text-container {
  margin-bottom: 1.5rem;
}

.hero-text {
  font-size: clamp(1.3rem, 4vw, 2.5rem);
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
    opacity: 1;
  }

  51%,
  100% {
    opacity: 0;
  }
}

.hero-tagline {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease 0.3s;
}

.hero-tagline.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* 按钮样式 */
.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease 0.6s;
}

.hero-actions.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.action-button {
  position: relative;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.action-button span {
  position: relative;
  z-index: 2;
}

.button-bg {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  transition: left 0.3s ease;
  z-index: 1;
}

.action-button.primary {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #333;
}

.action-button.primary .button-bg {
  background: linear-gradient(45deg, #ffed4e, #fff59d);
}

.action-button.secondary {
  border-color: rgba(255, 255, 255, 0.5);
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.action-button.secondary .button-bg {
  background: rgba(255, 255, 255, 0.2);
}

.action-button:hover .button-bg {
  left: 0;
}

.action-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* 滚动指示器 */
.scroll-indicator {
  position: absolute;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  transition: opacity 0.3s ease;
}

.scroll-arrow {
  width: 24px;
  height: 24px;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(45deg);
  margin-bottom: 0.5rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: rotate(45deg) translateY(0);
  }

  40% {
    transform: rotate(45deg) translateY(-10px);
  }

  60% {
    transform: rotate(45deg) translateY(-5px);
  }
}

/* 特性区域 */
.features-section,
.tech-section {
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 3;
}

.features-container,
.tech-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
  margin-bottom: 4rem;
  color: #333;
  background: linear-gradient(45deg, #667eea, #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: #fff;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(50px);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.feature-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
}

.feature-icon-wrapper {
  margin-bottom: 1.5rem;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* 应用场景区域 */
.scenarios-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  z-index: 3;
}

.scenarios-container {
  max-width: 1200px;
  margin: 0 auto;
}

.scenarios-section .section-title {
  color: white;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.scenario-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.scenario-item.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.scenario-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.scenario-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.scenario-item h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffd700;
}

.scenario-item p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

/* 技术栈区域调整 */
.tech-section {
  background: #f8fafc;
}

.tech-section .section-title {
  background: linear-gradient(45deg, #4f46e5, #7c3aed);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.tech-item {
  background: #fff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
  border: 1px solid rgba(79, 70, 229, 0.1);
}

.tech-item.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.tech-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(79, 70, 229, 0.15);
}

.tech-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.tech-item h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

/* 深色模式样式 */
:root {
  --parallax-bg-light: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --parallax-bg-dark: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.dark .parallax-home {
  background: var(--parallax-bg-dark);
}

.dark .bg-layer-1 {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.dark .features-section,
.dark .tech-section {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.dark .feature-card {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.dark .tech-item {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .action-button {
    width: 200px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
