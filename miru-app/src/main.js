import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { useOffline } from './composables/useOffline.js'

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

// 初始化全局网络状态监听
useOffline()

createApp(App).mount('#app')

// 注册 Service Worker（使用 BASE_URL 确保路径正确）
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = import.meta.env.BASE_URL + 'sw.js'
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              window.dispatchEvent(new CustomEvent('sw-update-available'))
            }
          })
        })
      })
      .catch(() => {
        // 静默失败，不影响应用功能
      })
  })
}
