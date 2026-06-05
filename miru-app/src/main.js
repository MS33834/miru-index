import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// CSP 友好的字体异步加载: 替代 index.html 的 onload 内联事件
// 1) 预加载 link
const preload = document.createElement('link')
preload.rel = 'preload'
preload.as = 'style'
preload.href = 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.css'
document.head.appendChild(preload)

// 2) 异步加载真实样式
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.css'
link.crossOrigin = 'anonymous'
document.head.appendChild(link)

createApp(App).mount('#app')
