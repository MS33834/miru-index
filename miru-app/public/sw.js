// 智能预缓存清单 - install 时预缓存关键资源
// Vite 构建产物通过 content hash，部署后由运行时缓存填充
const CACHE_VERSION = 'v8'
const CACHE_NAME = `miru-index-${CACHE_VERSION}`

// 用 SW scope 动态拼接路径，避免硬编码 /miru-index/ 前缀（部署路径变更时自动适配）
const BASE = self.registration.scope

const PRECACHE_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'robots.txt',
  BASE + 'sitemap.xml',
  BASE + 'favicon.svg',
  BASE + 'offline.html',
  BASE + 'frame-buster.js',
  // og-image.png 是社交分享必需资源，预缓存避免离线时分享卡片无图
  BASE + 'og-image.png',
]

// 缓存策略配置
const CACHE_STRATEGIES = {
  // 构建产物：缓存优先
  assets: {
    match: /\/assets\/.*\.(js|css|woff2?|ttf|eot)$/,
    cacheName: `${CACHE_NAME}-assets`,
    maxEntries: 80,
  },
  // 图片：缓存优先
  images: {
    match: /\.(png|jpg|jpeg|gif|svg|webp|ico)$/,
    cacheName: `${CACHE_NAME}-images`,
    maxEntries: 60,
  },
  // HTML：网络优先
  documents: {
    match: /\.html$/,
    cacheName: `${CACHE_NAME}-docs`,
    maxEntries: 20,
  },
}

// 缓存条目上限清理（近似 LRU：Cache API 无时间戳，按 keys 顺序删除最早条目）
async function trimCache(cacheName, maxEntries) {
  if (!maxEntries) return
  try {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    if (keys.length > maxEntries) {
      const removeCount = keys.length - maxEntries
      await Promise.all(keys.slice(0, removeCount).map((k) => cache.delete(k)))
    }
  } catch {
    // 静默失败
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // allSettled 逐个缓存：单个资源失败不阻塞整个 install，提升弱网可靠性
        return Promise.allSettled(PRECACHE_ASSETS.map((url) => cache.add(url)))
      })
    // 不再 install 时 skipWaiting：改为用户确认后通过 message 触发，避免版本错位白屏
  )
})

// 用户确认更新后，主线程 postMessage({type:'SKIP_WAITING'}) 触发激活
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// 清理旧版本
self.addEventListener('activate', (event) => {
  const keepSet = new Set([CACHE_NAME, ...Object.values(CACHE_STRATEGIES).map((s) => s.cacheName)])
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('miru-index-') && !keepSet.has(name))
            .map((name) => caches.delete(name))
        )
      })
      .then(() => self.clients.claim())
  )
})

// 请求拦截 - 根据资源类型智能路由
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // 跨源请求默认走网络（字体等由浏览器 HTTP 缓存处理）
  if (url.origin !== location.origin) return

  // 路由到对应策略
  for (const [key, strategy] of Object.entries(CACHE_STRATEGIES)) {
    if (strategy.match.test(url.pathname)) {
      event.respondWith(
        key === 'documents'
          ? networkFirstStrategy(event.request, strategy.cacheName, strategy.maxEntries)
          : cacheFirstStrategy(event.request, strategy.cacheName, strategy.maxEntries)
      )
      return
    }
  }

  // 其他资源：网络优先
  event.respondWith(networkFirstStrategy(event.request, CACHE_NAME, 0))
})

// 缓存优先策略 - stale-while-revalidate
async function cacheFirstStrategy(request, cacheName, maxEntries) {
  const cached = await caches.match(request)
  if (cached) {
    // 后台异步更新
    fetchAndCache(request, cacheName, maxEntries)
    return cached
  }

  try {
    const response = await fetch(request)
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
      if (maxEntries) trimCache(cacheName, maxEntries)
    }
    return response
  } catch {
    // assets/images 离线直接返回 503（document 离线 fallback 由 networkFirstStrategy 统一处理）
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}

// 网络优先策略 - 失败回退缓存 + SPA 路由 fallback
async function networkFirstStrategy(request, cacheName, maxEntries) {
  try {
    const response = await fetch(request)
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
      if (maxEntries) trimCache(cacheName, maxEntries)
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached

    // SPA 路由 fallback：优先返回 index.html 让 Vue 接管，再降级 offline.html
    if (request.destination === 'document') {
      const fallback = await caches.match(BASE + 'index.html')
      if (fallback) return fallback
      const offline = await caches.match(BASE + 'offline.html')
      if (offline) return offline
    }

    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}

async function fetchAndCache(request, cacheName, maxEntries) {
  try {
    const response = await fetch(request)
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName)
      await cache.put(request, response)
      if (maxEntries) trimCache(cacheName, maxEntries)
    }
  } catch {
    // 静默失败
  }
}
