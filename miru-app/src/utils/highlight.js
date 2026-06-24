/**
 * 高亮搜索关键词 - 返回分段数组用于安全渲染（XSS 防护）
 * 支持多关键词（按空白拆分，每个关键词独立高亮），与 searchIndex 的多关键词 AND 查询一致。
 * 使用缓存避免重复扫描。
 */
const highlightCache = new Map()
// 24 卡片 × 2 字段 × 多次搜索查询，需较大缓存上限保证连续搜索命中率
const MAX_CACHE = 2000

export function getHighlightedParts(text, query) {
  if (!text) return [{ text: '', highlight: false }]
  if (!query) return [{ text, highlight: false }]

  // 缓存 key：使用不可打印分隔符，避免 text 含 || 时冲突
  const cacheKey = `${text}\0${query}`
  const cached = highlightCache.get(cacheKey)
  if (cached) {
    // 真 LRU：访问时 delete-then-set 将其移到最后
    highlightCache.delete(cacheKey)
    highlightCache.set(cacheKey, cached)
    return cached
  }

  // 按空白拆分多个关键词，过滤空串，统一小写
  const needles = query
    .split(/\s+/)
    .map((s) => s.toLowerCase())
    .filter(Boolean)
  if (needles.length === 0) return [{ text, highlight: false }]

  const lowerText = text.toLowerCase()
  const len = text.length

  // 收集所有命中区间 [start, end)
  const ranges = []
  for (const needle of needles) {
    let from = 0
    let idx = lowerText.indexOf(needle, from)
    while (idx !== -1) {
      ranges.push([idx, idx + needle.length])
      from = idx + needle.length
      idx = lowerText.indexOf(needle, from)
    }
  }

  const result = [{ text, highlight: false }]
  if (ranges.length === 0) {
    // 无命中，直接返回（缓存仍记录避免重复扫描）
    if (highlightCache.size >= MAX_CACHE) {
      const firstKey = highlightCache.keys().next().value
      highlightCache.delete(firstKey)
    }
    highlightCache.set(cacheKey, result)
    return result
  }

  // 合并重叠/相邻区间
  ranges.sort((a, b) => a[0] - b[0])
  const merged = [ranges[0]]
  for (let i = 1; i < ranges.length; i++) {
    const last = merged[merged.length - 1]
    if (ranges[i][0] <= last[1]) {
      last[1] = Math.max(last[1], ranges[i][1])
    } else {
      merged.push(ranges[i])
    }
  }

  // 按区间切分文本
  const parts = []
  let cursor = 0
  for (const [start, end] of merged) {
    if (start > cursor) parts.push({ text: text.slice(cursor, start), highlight: false })
    parts.push({ text: text.slice(start, end), highlight: true })
    cursor = end
  }
  if (cursor < len) parts.push({ text: text.slice(cursor), highlight: false })

  // 限制缓存大小，防止内存泄漏
  if (highlightCache.size >= MAX_CACHE) {
    const firstKey = highlightCache.keys().next().value
    highlightCache.delete(firstKey)
  }
  highlightCache.set(cacheKey, parts)

  return parts
}

/**
 * 清空缓存（仅在需要强制回收时调用）。
 * 注意：搜索词变化时无需调用——缓存 key 已含 query，LRU 自然淘汰旧查询结果，
 * 连续相似查询（如 "漫画" → "漫画下载"）可复用部分高亮分段。
 */
export function clearHighlightCache() {
  highlightCache.clear()
}
