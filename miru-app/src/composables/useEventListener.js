import { onMounted, onBeforeUnmount } from 'vue'

/**
 * 简化事件监听器注册（自动清理）
 * @param {string|Window|Document} target
 * @param {string} event
 * @param {Function} handler
 * @param {AddEventListenerOptions|boolean} options
 */
export function useEventListener(target, event, handler, options) {
  if (!target) return
  
  // 支持字符串事件名（keydown 等）
  onMounted(() => add(target, event, handler, options))
  onBeforeUnmount(() => remove(target, event, handler, options))
}

function add(target, event, handler, options) {
  if (typeof target === 'string') {
    // 字符串目标 = window.xxx
    const el = window[target]
    if (el) el.addEventListener(event, handler, options)
  } else if (target?.addEventListener) {
    target.addEventListener(event, handler, options)
  }
}

function remove(target, event, handler, options) {
  if (typeof target === 'string') {
    const el = window[target]
    if (el) el.removeEventListener(event, handler, options)
  } else if (target?.removeEventListener) {
    target.removeEventListener(event, handler, options)
  }
}
