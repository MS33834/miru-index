import { ref, onMounted, onBeforeUnmount } from 'vue'

// 按配置缓存共享的 IntersectionObserver，避免每个卡片都创建独立 observer
const observerCache = new Map()
const targetMap = new WeakMap()

function getKey(options) {
  return `${options.rootMargin || '100px'}|${options.threshold || 0.1}`
}

function getObserver(options) {
  const key = getKey(options)
  if (!observerCache.has(key)) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const state = targetMap.get(entry.target)
            if (state) {
              state.isVisible.value = true
              observer.unobserve(entry.target)
              targetMap.delete(entry.target)
            }
          }
        })
      },
      {
        rootMargin: options.rootMargin || '100px',
        threshold: options.threshold || 0.1,
      }
    )
    observerCache.set(key, observer)
  }
  return observerCache.get(key)
}

export function useLazyLoad(options = {}) {
  const target = ref(null)
  const isVisible = ref(false)
  let fallbackTimer = null

  onMounted(() => {
    // 延迟到下一帧确保 DOM 已渲染
    const el = target.value
    if (!el) return
    targetMap.set(el, { isVisible })
    getObserver(options).observe(el)

    // 兜底：若 observer 因某些环境未触发，2s 后自动显示内容
    fallbackTimer = setTimeout(() => {
      if (!isVisible.value) {
        isVisible.value = true
        getObserver(options).unobserve(el)
        targetMap.delete(el)
      }
    }, 2000)
  })

  onBeforeUnmount(() => {
    if (fallbackTimer) {
      clearTimeout(fallbackTimer)
      fallbackTimer = null
    }
    const el = target.value
    if (!el) return
    const observer = getObserver(options)
    observer.unobserve(el)
    targetMap.delete(el)
  })

  return {
    target,
    isVisible,
  }
}
