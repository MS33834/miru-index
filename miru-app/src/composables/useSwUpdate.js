import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * 监听 Service Worker 更新事件，提示用户刷新。
 * 事件由 src/main.js 在检测到新的 SW 安装完成时派发。
 */
export function useSwUpdate() {
  const updateAvailable = ref(false)

  function onUpdateAvailable() {
    updateAvailable.value = true
  }

  function refresh() {
    if (typeof location !== 'undefined') {
      location.reload()
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
  })

  return {
    updateAvailable,
    refresh,
  }
}
