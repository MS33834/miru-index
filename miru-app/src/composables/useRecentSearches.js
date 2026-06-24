import { ref, watch } from 'vue'
import { STORAGE_KEYS, APP_CONFIG } from '../config/constants.js'

const STORAGE_KEY = STORAGE_KEYS.RECENT_SEARCHES
const MAX_RECENT = APP_CONFIG.UI.MAX_RECENT_SEARCHES

function load() {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : []
  } catch {
    return []
  }
}

function save(list) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_RECENT)))
  } catch {
    // 静默失败（隐私模式 / 配额满）
  }
}

const state = ref(load())

// add/remove/clear 都用新引用赋值，无需 deep 监听
watch(state, (newVal) => save(newVal))

// 跨标签页同步：其它标签页修改 localStorage 时重载本地状态
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue != null) {
      try {
        const parsed = JSON.parse(e.newValue)
        if (Array.isArray(parsed)) state.value = parsed.slice(0, MAX_RECENT)
      } catch {
        /* 忽略损坏数据 */
      }
    }
  })
}

export function useRecentSearches() {
  function add(query) {
    const q = query.trim()
    if (!q) return
    const next = [q, ...state.value.filter((x) => x !== q)].slice(0, MAX_RECENT)
    state.value = next
  }

  function remove(query) {
    state.value = state.value.filter((x) => x !== query)
  }

  function clear() {
    state.value = []
  }

  return {
    recentSearches: state,
    add,
    remove,
    clear,
  }
}
