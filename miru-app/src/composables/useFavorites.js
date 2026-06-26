import { ref, computed, watch, readonly } from 'vue'
import { STORAGE_KEYS, FAVORITES_LIMITS } from '../config/constants.js'

const STORAGE_KEY = STORAGE_KEYS.FAVORITES
const BACKUP_KEY = STORAGE_KEY + '.bak'
const { MAX_ITEMS, MAX_IMPORT_SIZE, MAX_FIELD_LEN, MAX_TAGS, MAX_TAG_LEN, ALLOWED_FIELDS } = FAVORITES_LIMITS

// 危险键：防止原型链污染
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

// URL 协议白名单：只允许 http/https，拒绝 javascript:/data:/vbscript: 等
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:'])

function isSafeUrl(str) {
  if (typeof str !== 'string' || !str) return false
  try {
    const u = new URL(str)
    return ALLOWED_PROTOCOLS.has(u.protocol)
  } catch {
    return false
  }
}

// 字段白名单提取 + 长度裁剪 + 危险键剔除，确保入库数据干净
function sanitizeItem(raw) {
  if (!raw || typeof raw !== 'object') return null
  const clean = {}
  for (const key of ALLOWED_FIELDS) {
    if (raw[key] === undefined || DANGEROUS_KEYS.has(key)) continue
    const val = raw[key]
    if (key === 'name' || key === 'url' || key === 'desc' || key === 'fullDesc') {
      if (typeof val === 'string') clean[key] = val.slice(0, MAX_FIELD_LEN[key] || 2000)
    } else if (key === 'tags' || key === 'features') {
      if (Array.isArray(val)) {
        clean[key] = val
          .slice(0, MAX_TAGS)
          .filter((t) => typeof t === 'string')
          .map((t) => t.slice(0, MAX_TAG_LEN))
      }
    } else if (key === 'proxy') {
      if (typeof val === 'boolean') clean[key] = val
    } else if (key === 'health' || key === 'mirrors') {
      clean[key] = val
    }
  }
  // 必须有合法 url 和 name 才保留
  if (!isSafeUrl(clean.url) || typeof clean.name !== 'string' || !clean.name) return null
  return clean
}

// 对外的统一校验流水线：用于 load 和 import
function sanitizeList(arr) {
  if (!Array.isArray(arr)) return []
  const seen = new Set()
  const result = []
  for (const raw of arr) {
    const clean = sanitizeItem(raw)
    if (!clean) continue
    if (seen.has(clean.url)) continue // 按 URL 去重
    seen.add(clean.url)
    result.push(clean)
    if (result.length >= MAX_ITEMS) break // 配额上限
  }
  return result
}

function loadFavorites() {
  if (typeof localStorage === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return sanitizeList(parsed)
  } catch {
    return []
  }
}

function saveFavorites(favorites) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch (err) {
    // 配额超限时通知 UI，避免静默丢数据
    if (err?.name === 'QuotaExceededError' && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('favorites-quota-exceeded'))
    }
    // 其它（隐私模式）仍静默
  }
}

// 模块级单例 - 整个应用共享同一份 ref
const state = ref(loadFavorites())

// 响应式缓存：收藏 URL 的 Set，state 变化时自动重建，确保依赖 isFavorite 的 computed 正确追踪
const favoriteUrlSet = computed(() => new Set(state.value.map((f) => f.url)))

// 持久化批量化：连续收藏切换时合并为单次 microtask 写入，避免同步 stringify 阻塞主线程
let saveScheduled = false
function scheduleSave(newVal) {
  if (saveScheduled) return
  saveScheduled = true
  queueMicrotask(() => {
    saveFavorites(newVal)
    saveScheduled = false
  })
}

// 浅监听即可：所有变更都通过不可变更新产生新引用，无需 deep 遍历（省 O(n×字段)）
watch(state, (newVal) => {
  scheduleSave(newVal)
})

// 跨标签页同步：其它标签页修改 localStorage 时重载本地状态
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue != null) {
      try {
        const parsed = JSON.parse(e.newValue)
        const clean = sanitizeList(parsed)
        // 直接赋值新引用，触发本地 watch（但 scheduleSave 会再写一次，无害）
        state.value = clean
      } catch {
        /* 忽略损坏数据 */
      }
    }
  })
}

function isFavorite(item) {
  if (!item?.url) return false
  return favoriteUrlSet.value.has(item.url)
}

function toggleFavorite(item) {
  if (!item?.url) return true // 返回 true 表示"已存在/已处理"，不触发配额提示
  const index = state.value.findIndex((f) => f.url === item.url)
  if (index >= 0) {
    // 不可变更新：产生新引用，浅 watch 即可捕获
    state.value = state.value.filter((_, i) => i !== index)
    return true
  }
  // 配额检查
  if (state.value.length >= MAX_ITEMS) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('favorites-quota-exceeded'))
    }
    return false
  }
  const clean = sanitizeItem(item)
  if (!clean) return false
  state.value = [...state.value, clean]
  return true
}

function clearFavorites() {
  state.value = []
}

function exportFavorites() {
  if (typeof document === 'undefined') return
  const data = JSON.stringify(state.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `miru-favorites-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // 延迟撤销：部分浏览器下载流建立有延迟，立即 revoke 可能导致下载失败
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function importFavorites(file) {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_IMPORT_SIZE) {
      return reject(new Error(`文件过大（限制 ${MAX_IMPORT_SIZE / 1024 / 1024}MB）`))
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const arr = JSON.parse(e.target.result)
        if (!Array.isArray(arr)) throw new Error('收藏夹格式错误：应为数组')
        const valid = sanitizeList(arr)
        // 覆盖前自动备份当前收藏，防止误导入丢失数据
        if (typeof localStorage !== 'undefined') {
          try {
            localStorage.setItem(BACKUP_KEY, JSON.stringify(state.value))
          } catch {
            /* 备份失败不阻塞导入 */
          }
        }
        state.value = valid
        resolve(valid.length)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}

export function useFavorites() {
  return {
    favorites: readonly(state),
    isFavorite,
    toggleFavorite,
    clearFavorites,
    exportFavorites,
    importFavorites,
  }
}
