import { createApp, ref } from 'vue'
import App from './App.vue'
import './style.css'

// 异步加载霞鹜文楷屏幕阅读版字体（避开 CSP 对内联事件处理器的限制）
function loadFont(href, fallbackHref) {
  if (typeof document === 'undefined') return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  link.crossOrigin = 'anonymous'
  if (fallbackHref) {
    link.onerror = () => {
      const fallback = document.createElement('link')
      fallback.rel = 'stylesheet'
      fallback.href = fallbackHref
      fallback.crossOrigin = 'anonymous'
      document.head.appendChild(fallback)
    }
  }
  document.head.appendChild(link)
}

loadFont(
  'https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.css',
  'https://unpkg.com/lxgw-wenkai-screen-webfont@1.7.0/style.css'
)

// 全局网络状态（SSR 安全）
export const isOffline = ref(typeof navigator !== 'undefined' ? !navigator.onLine : false)

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOffline.value = false
  })

  window.addEventListener('offline', () => {
    isOffline.value = true
  })
}

createApp(App).mount('#app')

// 注册 Service Worker（使用 BASE_URL 确保路径正确）
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = import.meta.env.BASE_URL + 'sw.js'
    navigator.serviceWorker.register(swUrl).catch(() => {
      // 静默失败，不影响应用功能
    })
  })
}
