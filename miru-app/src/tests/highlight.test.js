import { describe, it, expect } from 'vitest'
import { getHighlightedParts } from '../utils/highlight.js'

describe('getHighlightedParts', () => {
  it('无搜索词时全文本不高亮', () => {
    const result = getHighlightedParts('hello world', '')
    expect(result).toHaveLength(1)
    expect(result[0].highlight).toBe(false)
    expect(result[0].text).toBe('hello world')
  })

  it('匹配词高亮', () => {
    const result = getHighlightedParts('hello world', 'hello')
    expect(result).toHaveLength(2)
    expect(result[0].highlight).toBe(true)
    expect(result[0].text).toBe('hello')
    expect(result[1].highlight).toBe(false)
  })

  it('重叠区间合并', () => {
    const result = getHighlightedParts('hellohello', 'hello')
    // 两个重叠的 hello 应该合并为一个
    const highlights = result.filter((p) => p.highlight)
    expect(highlights).toHaveLength(1)
  })
})
