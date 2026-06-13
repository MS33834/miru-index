import { ref, onMounted, onUnmounted } from 'vue'

export function useLazyLoad(options = {}) {
  const target = ref(null)
  const isVisible = ref(false)

  let observer = null

  onMounted(() => {
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

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    target,
    isVisible
  }
}
