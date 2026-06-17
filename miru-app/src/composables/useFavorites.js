import { ref, watch, readonly } from 'vue'

const STORAGE_KEY = 'miru-favorites'

function loadFavorites() {
  if (typeof localStorage === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveFavorites(favorites) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch {
    // 静默失败（隐私模式或配额超限）
  }
}

// 模块级单例 - 整个应用共享同一份 ref
const state = ref(loadFavorites())
watch(state, (newVal) => saveFavorites(newVal), { deep: true })

// 缓存函数引用（避免每次 useFavorites() 都创建新函数）
const isFavoriteCache = new WeakMap()

function isFavorite(item) {
  if (!item?.url) return false
  // 性能优化：使用 Set 查找
  const set = isFavoriteCache.get(item)
  if (set !== undefined) return set.has(item.url)
  return state.value.some(f => f.url === item.url)
}

function toggleFavorite(item) {
  if (!item?.url) return
  const index = state.value.findIndex(f => f.url === item.url)
  if (index >= 0) {
    state.value.splice(index, 1)
  } else {
    state.value.push({ ...item })
  }
  // 失效缓存
  isFavoriteCache.clear()
}

function clearFavorites() {
  state.value = []
  isFavoriteCache.clear()
}

export function useFavorites() {
  return {
    favorites: readonly(state),
    isFavorite,
    toggleFavorite,
    clearFavorites
  }
}
