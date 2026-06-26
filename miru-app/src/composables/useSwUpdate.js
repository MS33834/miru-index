import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * 监听 Service Worker 更新事件，提示用户刷新。
 * 事件由 src/main.js 在检测到新的 SW 安装完成时派发。
 *
 * refresh() 实现安全闭环：
 *   1. 监听 controllerchange（新 SW 接管时触发）
 *   2. 向 waiting SW postMessage SKIP_WAITING 触发激活
 *   3. controllerchange 触发后自动 reload，确保页面与 SW 版本一致
 * 避免"新 SW 激活但旧页面仍引用旧 hash 资产"的版本错位白屏。
 */
export function useSwUpdate() {
  const updateAvailable = ref(false)
  let reloading = false
  let fallbackTimer = null

  function onUpdateAvailable() {
    updateAvailable.value = true
  }

  function onControllerChange() {
    // 新 SW 已接管，确保只 reload 一次
    if (reloading) return
    reloading = true
    if (fallbackTimer) {
      clearTimeout(fallbackTimer)
      fallbackTimer = null
    }
    if (typeof location !== 'undefined') {
      location.reload()
    }
  }

  function refresh() {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      if (typeof location !== 'undefined') location.reload()
      return
    }
    const reg = navigator.serviceWorker
    // 先注册 controllerchange 监听，再触发 skipWaiting，避免竞态
    reg.addEventListener('controllerchange', onControllerChange, { once: true })
    if (reg.waiting) {
      // 兜底：5 秒内 controllerchange 未触发（SW 激活失败/卡死）则强制 reload，避免页面卡死
      fallbackTimer = setTimeout(() => {
        if (reloading) return
        reloading = true
        fallbackTimer = null
        reg.removeEventListener('controllerchange', onControllerChange)
        if (typeof location !== 'undefined') location.reload()
      }, 5000)
      reg.waiting.postMessage({ type: 'SKIP_WAITING' })
    } else {
      // 无 waiting worker（如用户手动触发），直接 reload
      reg.removeEventListener('controllerchange', onControllerChange)
      if (typeof location !== 'undefined') location.reload()
    }
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('sw-update-available', onUpdateAvailable)
    }
  })

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('sw-update-available', onUpdateAvailable)
    }
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
    }
    if (fallbackTimer) {
      clearTimeout(fallbackTimer)
      fallbackTimer = null
    }
  })

  return {
    updateAvailable,
    refresh,
  }
}
