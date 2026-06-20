// 智能预缓存清单 - install 时预缓存关键资源
// Vite 构建产物通过 content hash，部署后由运行时缓存填充
const CACHE_VERSION = 'v3'
const CACHE_NAME = `miru-index-${CACHE_VERSION}`

const PRECACHE_ASSETS = [
  '/miru-index/',
  '/miru-index/index.html',
  '/miru-index/manifest.json',
  '/miru-index/robots.txt',
  '/miru-index/sitemap.xml',
  '/miru-index/favicon.svg'
]
// og-image.png 等大资源走运行时缓存，避免 install 阶段阻塞

// 缓存策略配置
const CACHE_STRATEGIES = {
  // 构建产物：缓存优先
  assets: {
    match: /\/assets\/.*\.(js|css|woff2?|ttf|eot)$/,
    cacheName: `${CACHE_NAME}-assets`
  },
  // 图片：缓存优先
  images: {
    match: /\.(png|jpg|jpeg|gif|svg|webp|ico)$/,
    cacheName: `${CACHE_NAME}-images`
  },
  // HTML：网络优先
  documents: {
    match: /\.html$/,
    cacheName: `${CACHE_NAME}-docs`
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// 清理旧版本
self.addEventListener('activate', (event) => {
  const keepSet = new Set([CACHE_NAME, ...Object.values(CACHE_STRATEGIES).map(s => s.cacheName)])
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('miru-index-') && !keepSet.has(name))
          .map((name) => caches.delete(name))
      )
    }).then(() => self.clients.claim())
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
          ? networkFirstStrategy(event.request, strategy.cacheName)
          : cacheFirstStrategy(event.request, strategy.cacheName)
      )
      return
    }
  }

  // 其他资源：网络优先
  event.respondWith(networkFirstStrategy(event.request, CACHE_NAME))
})

// 缓存优先策略 - stale-while-revalidate
async function cacheFirstStrategy(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) {
    // 后台异步更新
    fetchAndCache(request, cacheName)
    return cached
  }

  try {
    const response = await fetch(request)
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

// 网络优先策略 - 失败回退缓存 + SPA 路由 fallback
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached

    // SPA 路由 fallback
    if (request.destination === 'document') {
      const fallback = await caches.match('/miru-index/index.html')
      if (fallback) return fallback
    }

    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

async function fetchAndCache(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName)
      await cache.put(request, response)
    }
  } catch {
    // 静默失败
  }
}
