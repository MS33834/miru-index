/**
 * 简单的分页工具
 */
export function paginate(array, page, pageSize) {
  const start = (page - 1) * pageSize
  return array.slice(start, start + pageSize)
}

export function totalPages(arrayLength, pageSize) {
  return Math.max(1, Math.ceil(arrayLength / pageSize))
}
