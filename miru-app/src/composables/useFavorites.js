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

// 缓存：收藏 URL 的 Set，state 变化时重建
let favoriteUrlSet = new Set(state.value.map((f) => f.url))

watch(
  state,
  (newVal) => {
    favoriteUrlSet = new Set(newVal.map((f) => f.url))
  },
  { deep: true }
)

function isFavorite(item) {
  if (!item?.url) return false
  return favoriteUrlSet.has(item.url)
}

function toggleFavorite(item) {
  if (!item?.url) return
  const index = state.value.findIndex((f) => f.url === item.url)
  if (index >= 0) {
    state.value.splice(index, 1)
  } else {
    state.value.push({ ...item })
  }
}

function clearFavorites() {
  state.value = []
}

export function useFavorites() {
  return {
    favorites: readonly(state),
    isFavorite,
    toggleFavorite,
    clearFavorites,
  }
}
