import { describe, it, expect } from 'vitest'

// 内联 mergeCategories 函数进行纯函数测试
// 复制自 src/data/nav.js 的合并逻辑
function mergeCategories(base, extensionCats, extensionItemsMap) {
  const normalize = (items) => {
    const seen = new Set()
    return items
      .filter((item) => {
        if (!item.url || seen.has(item.url)) return false
        seen.add(item.url)
        return true
      })
      .map((item) => ({ health: 'ok', ...item }))
  }

  const merged = base.map((cat) => {
    const extra = extensionItemsMap[cat.id] || []
    return { ...cat, items: normalize([...cat.items, ...extra]) }
  })

  for (const cat of extensionCats) {
    const existing = merged.find((c) => c.id === cat.id)
    if (existing) {
      existing.items = normalize([...existing.items, ...cat.items])
    } else {
      merged.push({ ...cat, items: normalize([...cat.items]) })
    }
  }
  return merged
}

describe('mergeCategories', () => {
  it('分类内去重：同URL只保留第一个', () => {
    const base = [
      {
        id: 'a',
        name: 'A',
        items: [
          { name: 'x', url: 'https://x.com' },
          { name: 'x2', url: 'https://x.com' }, // duplicate URL
        ],
      },
    ]
    const result = mergeCategories(base, [], {})
    expect(result[0].items).toHaveLength(1)
    expect(result[0].items[0].name).toBe('x')
  })

  it('跨分类保留：不同分类中相同URL各保留', () => {
    const base = [
      { id: 'a', name: 'A', items: [{ name: 'x', url: 'https://x.com' }] },
      { id: 'b', name: 'B', items: [{ name: 'y', url: 'https://x.com' }] },
    ]
    const result = mergeCategories(base, [], {})
    expect(result[0].items).toHaveLength(1)
    expect(result[1].items).toHaveLength(1)
  })

  it('过滤无URL条目', () => {
    const base = [
      {
        id: 'a',
        name: 'A',
        items: [{ name: 'no-url' }, { name: 'has-url', url: 'https://x.com' }],
      },
    ]
    const result = mergeCategories(base, [], {})
    expect(result[0].items).toHaveLength(1)
    expect(result[0].items[0].name).toBe('has-url')
  })

  it('默认 health 填充', () => {
    const base = [{ id: 'a', name: 'A', items: [{ name: 'x', url: 'https://x.com' }] }]
    const result = mergeCategories(base, [], {})
    expect(result[0].items[0].health).toBe('ok')
  })

  it('扩展分类合并', () => {
    const base = [{ id: 'a', name: 'A', items: [] }]
    const extCats = [{ id: 'b', name: 'B', items: [{ name: 'z', url: 'https://z.com' }] }]
    const result = mergeCategories(base, extCats, {})
    expect(result).toHaveLength(2)
    expect(result[1].name).toBe('B')
    expect(result[1].items).toHaveLength(1)
  })

  it('扩展条目追加到基础分类', () => {
    const base = [{ id: 'a', name: 'A', items: [{ name: 'x', url: 'https://x.com' }] }]
    const extItems = { a: [{ name: 'y', url: 'https://y.com' }] }
    const result = mergeCategories(base, [], extItems)
    expect(result[0].items).toHaveLength(2)
  })
})
