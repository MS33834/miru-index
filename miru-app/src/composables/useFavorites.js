import { ref, watch } from 'vue'

const STORAGE_KEY = 'miru-favorites'

// 从 localStorage 加载收藏夹
function loadFavorites() {
  if (typeof localStorage === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// 保存到 localStorage
function saveFavorites(favorites) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch (error) {
    // 静默失败（隐私模式或配额超限）
  }
}

// 全局收藏夹状态（单例）
const favorites = ref(loadFavorites())

// 监听变化并自动保存
watch(favorites, (newVal) => {
  saveFavorites(newVal)
}, { deep: true })

export function useFavorites() {
  function isFavorite(item) {
    if (!item?.url) return false
    return favorites.value.some(f => f.url === item.url)
  }

  function toggleFavorite(item) {
    if (!item?.url) return
    const index = favorites.value.findIndex(f => f.url === item.url)
    if (index >= 0) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push({ ...item })
    }
  }

  function clearFavorites() {
    favorites.value = []
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    clearFavorites
  }
}
