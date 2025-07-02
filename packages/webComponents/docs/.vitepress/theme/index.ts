import DefaultTheme from 'vitepress/theme'
import ParallaxHome from './ParallaxHome.vue'
import './custom-home.css'
import './hero-typewriter.css'

export default {
  extends: DefaultTheme, // 使用 extends 而不是展开
  enhanceApp({ app }) {
    // 调用默认主题的 enhanceApp
    DefaultTheme.enhanceApp?.({ app })

    // 注册自定义组件
    app.component('ParallaxHome', ParallaxHome)

    // 导入并注册 Web Components
    if (typeof window !== 'undefined') {
      // 等待 DOM 加载完成后再导入组件
      const loadComponents = async () => {
        try {
          await import('../../../index.ts')
          console.log('Web Components loaded successfully')

          // 确保所有自定义元素都已定义
          const checkCustomElements = () => {
            const button = document.querySelector('su-button')
            if (button && !customElements.get('su-button')) {
              console.warn('su-button not registered, retrying...')
              setTimeout(checkCustomElements, 100)
            }
          }

          // 延迟检查，确保组件注册完成
          setTimeout(checkCustomElements, 500)
        } catch (err) {
          console.error('Failed to load Web Components:', err)
        }
      }

      // 在 DOM 内容加载完成后执行
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadComponents)
      } else {
        loadComponents()
      }
    }

    // 在客户端添加打字机效果
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        initTypewriter()
      }, 100)
    }
  }
}

function initTypewriter() {
  const heroText = document.querySelector('.VPHeroInfo .text')
  if (!heroText) return

  const texts = [
    '一次编写，到处Vue运行',
    '一次编写，到处React运行',
    '一次编写，到处Angular运行',
    '一次编写，到处运行'
  ]

  let currentTextIndex = 0
  let currentCharIndex = 0
  let isDeleting = false

  function typeWriter() {
    const currentText = texts[currentTextIndex]

    if (!isDeleting) {
      if (heroText) {
        heroText.textContent = currentText.slice(0, currentCharIndex + 1)
      }
      currentCharIndex++

      if (currentCharIndex === currentText.length) {
        setTimeout(() => {
          isDeleting = true
        }, 2000)
      }
    } else {
      if (heroText) {
        heroText.textContent = currentText.slice(0, currentCharIndex - 1)
      }
      currentCharIndex--

      if (currentCharIndex === 0) {
        isDeleting = false
        currentTextIndex = (currentTextIndex + 1) % texts.length
      }
    }

    const speed = isDeleting ? 100 : 200
    setTimeout(typeWriter, speed)
  }

  typeWriter()
}
