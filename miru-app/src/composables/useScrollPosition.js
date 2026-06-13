import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 滚动位置监听 composable（使用 rAF 节流 + passive 事件优化性能）
 * @param {Object} options
 * @param {number} options.threshold - 触发 showBackToTop 的阈值
 * @returns {{ scrollY: Ref<number>, showBackToTop: Ref<boolean> }}
 */
export function useScrollPosition(options = {}) {
  const { threshold = 300 } = options
  const showBackToTop = ref(false)

  let ticking = false

  function handleScroll() {
    if (ticking) return
    ticking = true

    requestAnimationFrame(() => {
      showBackToTop.value = window.scrollY > threshold
      ticking = false
    })
  }

  onMounted(() => {
    // 使用 passive 选项优化滚动性能
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 初始化
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return { showBackToTop }
}
