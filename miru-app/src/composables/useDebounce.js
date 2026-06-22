import { ref, onBeforeUnmount } from 'vue'

/**
 * 防抖 composable
 * @param {number} delay - 防抖延迟（ms）
 * @returns {{ debouncedValue: Ref<string>, setDebouncedValue: (val: string) => void }}
 */
export function useDebounce(delay = 300) {
  const debouncedValue = ref('')
  let timer = null

  function setDebouncedValue(value, immediate = false) {
    if (timer) clearTimeout(timer)
    if (immediate) {
      debouncedValue.value = value
      timer = null
      return
    }
    timer = setTimeout(() => {
      debouncedValue.value = value
      timer = null
    }, delay)
  }

  onBeforeUnmount(() => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  })

  return { debouncedValue, setDebouncedValue }
}
