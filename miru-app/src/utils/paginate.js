/**
 * 简单的分页工具
 */
export function paginate(array, page, pageSize) {
  // 防御：page < 1 或 pageSize <= 0 时返回空切片，避免 NaN/负索引导致全量返回
  if (!Array.isArray(array) || page < 1 || pageSize <= 0) return []
  const start = (page - 1) * pageSize
  return array.slice(start, start + pageSize)
}

export function totalPages(arrayLength, pageSize) {
  if (pageSize <= 0) return 1
  return Math.max(1, Math.ceil(arrayLength / pageSize))
}
