const CACHE_VERSION = 'v2'
const CACHE_NAME = `miru-index-${CACHE_VERSION}`

// 需要预缓存的核心资源
const PRECACHE_ASSETS = [
  '/miru-index/',
  '/miru-index/index.html',
  '/miru-index/manifest.json',
  '/miru-index/favicon.svg'
]

// 缓存策略配置
const CACHE_STRATEGIES = {
  // 构建产物：缓存优先，带版本号
  assets: {
    match: /\/assets\/.*\.(js|css|woff2?|ttf|eot)$/,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1年
    maxEntries: 50
  },
  // 图片资源：缓存优先
  images: {
    match: /\.(png|jpg|jpeg|gif|svg|webp|ico)$/,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30天
    maxEntries: 100
  },
  // HTML 文档：网络优先
  documents: {
    match: /\.html$/,
    maxAge: 24 * 60 * 60 * 1000 // 1天
  }
}

// 安装时预缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching core assets')
        return cache.addAll(PRECACHE_ASSETS)
      })
      .then(() => {
        console.log('[SW] Install complete')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('[SW] Install failed:', error)
      })
  )
})

// 激活时清理旧版本缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('miru-index-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    }).then(() => {
      console.log('[SW] Activate complete')
      return self.clients.claim()
    })
  )
})

// 请求拦截：根据资源类型采用不同缓存策略
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  
  const url = new URL(event.request.url)
  
  // 只处理同源请求
  if (url.origin !== location.origin) return

  // 构建产物（JS/CSS/字体）：缓存优先，长期缓存
  if (CACHE_STRATEGIES.assets.match.test(url.pathname)) {
    event.respondWith(cacheFirstStrategy(event.request, CACHE_NAME))
    return
  }

  // 图片资源：缓存优先
  if (CACHE_STRATEGIES.images.match.test(url.pathname)) {
    event.respondWith(cacheFirstStrategy(event.request, CACHE_NAME))
    return
  }

  // HTML 文档：网络优先，失败时返回缓存
  if (CACHE_STRATEGIES.documents.match.test(url.pathname) || 
      event.request.destination === 'document') {
    event.respondWith(networkFirstStrategy(event.request, CACHE_NAME))
    return
  }

  // 其他资源：默认网络优先
  event.respondWith(networkFirstStrategy(event.request, CACHE_NAME))
})

// 缓存优先策略：先查缓存，失败时走网络并缓存
async function cacheFirstStrategy(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) {
    // 后台更新缓存（stale-while-revalidate）
    fetchAndCache(request, cacheName)
    return cached
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (!networkResponse || networkResponse.status !== 200) {
      return networkResponse
    }
    
    const responseToCache = networkResponse.clone()
    caches.open(cacheName)
      .then((cache) => {
        cache.put(request, responseToCache)
        // 检查缓存大小并清理
        cleanupCache(cache, CACHE_STRATEGIES.assets.maxEntries)
      })
      .catch((error) => {
        console.error('[SW] Cache put failed:', error)
      })
    
    return networkResponse
  } catch (error) {
    console.error('[SW] Fetch failed:', error)
    // 离线时返回空响应
    return new Response('Offline', { 
      status: 503, 
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

// 网络优先策略：先走网络，失败时返回缓存
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse && networkResponse.status === 200) {
      const responseToCache = networkResponse.clone()
      caches.open(cacheName)
        .then((cache) => cache.put(request, responseToCache))
        .catch((error) => {
          console.error('[SW] Cache put failed:', error)
        })
    }
    
    return networkResponse
  } catch (error) {
    console.error('[SW] Network request failed:', error)
    
    // 网络失败时尝试缓存
    const cached = await caches.match(request)
    if (cached) {
      console.log('[SW] Serving from cache:', request.url)
      return cached
    }
    
    // HTML 请求失败时返回 index.html（SPA 回退）
    if (request.destination === 'document') {
      const fallback = await caches.match('/miru-index/index.html')
      if (fallback) {
        console.log('[SW] Serving fallback index.html')
        return fallback
      }
    }
    
    return new Response('Offline', { 
      status: 503, 
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

// 后台更新缓存
async function fetchAndCache(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName)
      await cache.put(request, networkResponse)
    }
  } catch (error) {
    // 静默失败，不影响用户体验
  }
}

// 清理缓存，保持缓存大小在限制范围内
async function cleanupCache(cache, maxEntries) {
  try {
    const keys = await cache.keys()
    if (keys.length > maxEntries) {
      // 删除最旧的缓存项
      const toDelete = keys.slice(0, keys.length - maxEntries)
      await Promise.all(toDelete.map(key => cache.delete(key)))
      console.log(`[SW] Cleaned up ${toDelete.length} old cache entries`)
    }
  } catch (error) {
    console.error('[SW] Cache cleanup failed:', error)
  }
}
