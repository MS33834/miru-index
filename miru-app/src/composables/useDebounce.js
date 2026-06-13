import { ref, onUnmounted } from 'vue'

/**
 * 防抖 composable
 * @param {number} delay - 防抖延迟（ms）
 * @returns {{ debouncedValue: Ref<string>, setDebouncedValue: (val: string) => void }}
 */
export function useDebounce(delay = 300) {
  const debouncedValue = ref('')
  let timer = null

  function setDebouncedValue(value) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedValue.value = value
    }, delay)
  }

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  return { debouncedValue, setDebouncedValue }
}
