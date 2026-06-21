import { ref, watch } from 'vue'

const STORAGE_KEY = 'miru-recent-searches'
const MAX_RECENT = 8

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
    // 静默失败
  }
}

const state = ref(load())

watch(state, (newVal) => save(newVal), { deep: true })

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
