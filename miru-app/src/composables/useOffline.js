import { ref } from 'vue'

/**
 * 全局网络状态（SSR 安全）
 * 从 main.js 抽离，避免 App.vue 与入口文件之间的循环依赖
 */
export const isOffline = ref(typeof navigator !== 'undefined' ? !navigator.onLine : false)

// 模块级只注册一次，避免多次调用 useOffline() 累积 listener
let _initialized = false
function initListeners() {
  if (_initialized || typeof window === 'undefined') return
  _initialized = true
  window.addEventListener('online', () => {
    isOffline.value = false
  })
  window.addEventListener('offline', () => {
    isOffline.value = true
  })
}

export function useOffline() {
  initListeners()
  return { isOffline }
}
