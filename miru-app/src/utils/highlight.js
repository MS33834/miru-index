/**
 * 高亮搜索关键词 - 返回分段数组用于安全渲染（XSS 防护）
 * 使用缓存避免重复扫描，166 卡片 × 2 文本块 = 332 次扫描优化为 ~2 次
 */
const highlightCache = new Map()
const MAX_CACHE = 500

export function getHighlightedParts(text, query) {
  if (!text) return [{ text: '', highlight: false }]
  if (!query) return [{ text, highlight: false }]

  // 缓存 key：使用不可打印分隔符，避免 text 含 || 时冲突
  const cacheKey = `${text}\0${query}`
  const cached = highlightCache.get(cacheKey)
  if (cached) return cached

  const parts = []
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  let lastIndex = 0
  let index = lowerText.indexOf(lowerQuery)

  while (index !== -1) {
    if (index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, index), highlight: false })
    }
    parts.push({ text: text.slice(index, index + query.length), highlight: true })
    lastIndex = index + query.length
    index = lowerText.indexOf(lowerQuery, lastIndex)
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false })
  }

  const result = parts.length > 0 ? parts : [{ text, highlight: false }]

  // 限制缓存大小，防止内存泄漏
  if (highlightCache.size >= MAX_CACHE) {
    const firstKey = highlightCache.keys().next().value
    highlightCache.delete(firstKey)
  }
  highlightCache.set(cacheKey, result)

  return result
}

/**
 * 清空缓存（搜索词变化时调用）
 */
export function clearHighlightCache() {
  highlightCache.clear()
}
