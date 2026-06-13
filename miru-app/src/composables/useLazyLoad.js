import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useLazyLoad(options = {}) {
  const target = ref(null)
  const isVisible = ref(false)

  let observer = null

  onMounted(() => {
    // 延迟到下一帧确保 DOM 已渲染
    requestAnimationFrame(() => {
      if (!target.value) return

      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isVisible.value = true
            observer.unobserve(entry.target)
          }
        })
      }, {
        rootMargin: options.rootMargin || '100px',
        threshold: options.threshold || 0.1
      })

      observer.observe(target.value)
    })
  })

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    target,
    isVisible
  }
}
