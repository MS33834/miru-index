import { createApp, ref } from 'vue'
import App from './App.vue'
import './style.css'

// 全局网络状态
export const isOffline = ref(!navigator.onLine)

window.addEventListener('online', () => {
  isOffline.value = false
})

window.addEventListener('offline', () => {
  isOffline.value = true
})

// CSP 友好的字体异步加载: 替代 index.html 的 onload 内联事件
// 仅追加 <link rel="stylesheet">, 不使用 preload (避免 crossorigin 不匹配警告)
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.css'
document.head.appendChild(link)

createApp(App).mount('#app')

// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/miru-index/sw.js')
      .catch((error) => {
        // 静默失败，不影响应用功能
      })
  })
}
