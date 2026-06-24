import { ref } from 'vue'

/**
 * 全局网络状态（SSR 安全）
 * 从 main.js 抽离，避免 App.vue 与入口文件之间的循环依赖
 */
export const isOffline = ref(typeof navigator !== 'undefined' ? !navigator.onLine : false)

export function useOffline() {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      isOffline.value = false
    })

    window.addEventListener('offline', () => {
      isOffline.value = true
    })
  }

  return { isOffline }
}
