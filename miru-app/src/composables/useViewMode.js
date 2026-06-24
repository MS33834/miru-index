import { ref, watch } from 'vue'
import { STORAGE_KEYS } from '../config/constants.js'

const STORAGE_KEY = STORAGE_KEYS.VIEW_MODE
const VALID_MODES = ['grid', 'list']

function load() {
  if (typeof localStorage === 'undefined') return 'grid'
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return VALID_MODES.includes(raw) ? raw : 'grid'
  } catch {
    return 'grid'
  }
}

function save(mode) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // 静默失败
  }
}

const state = ref(load())

watch(state, (newVal) => save(newVal))

export function useViewMode() {
  function setMode(mode) {
    if (VALID_MODES.includes(mode)) {
      state.value = mode
    }
  }

  function toggle() {
    state.value = state.value === 'grid' ? 'list' : 'grid'
  }

  return {
    viewMode: state,
    setMode,
    toggle,
    isGrid: () => state.value === 'grid',
    isList: () => state.value === 'list',
  }
}
