import { describe, it, expect } from 'vitest'
// 直接导入真实的 mergeCategories，避免「复制逻辑」与实现脱节。
// mergeCategories 是纯函数：入参为 base / extensionCats / extensionItemsMap，
// 返回 { categories, drops }，drops 为合并过程中被丢弃条目的权威清单。
import { mergeCategories } from '../data/nav.js'

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
    const { categories } = mergeCategories(base, [], {})
    expect(categories[0].items).toHaveLength(1)
    expect(categories[0].items[0].name).toBe('x')
  })

  it('跨分类保留：不同分类中相同URL各保留', () => {
    const base = [
      { id: 'a', name: 'A', items: [{ name: 'x', url: 'https://x.com' }] },
      { id: 'b', name: 'B', items: [{ name: 'y', url: 'https://x.com' }] },
    ]
    const { categories } = mergeCategories(base, [], {})
    expect(categories[0].items).toHaveLength(1)
    expect(categories[1].items).toHaveLength(1)
  })

  it('过滤无URL条目', () => {
    const base = [
      {
        id: 'a',
        name: 'A',
        items: [{ name: 'no-url' }, { name: 'has-url', url: 'https://x.com' }],
      },
    ]
    const { categories } = mergeCategories(base, [], {})
    expect(categories[0].items).toHaveLength(1)
    expect(categories[0].items[0].name).toBe('has-url')
  })

  it('默认 health 填充', () => {
    const base = [{ id: 'a', name: 'A', items: [{ name: 'x', url: 'https://x.com' }] }]
    const { categories } = mergeCategories(base, [], {})
    expect(categories[0].items[0].health).toBe('ok')
  })

  it('扩展分类合并', () => {
    const base = [{ id: 'a', name: 'A', items: [] }]
    const extCats = [{ id: 'b', name: 'B', items: [{ name: 'z', url: 'https://z.com' }] }]
    const { categories } = mergeCategories(base, extCats, {})
    expect(categories).toHaveLength(2)
    expect(categories[1].name).toBe('B')
    expect(categories[1].items).toHaveLength(1)
  })

  it('扩展条目追加到基础分类', () => {
    const base = [{ id: 'a', name: 'A', items: [{ name: 'x', url: 'https://x.com' }] }]
    const extItems = { a: [{ name: 'y', url: 'https://y.com' }] }
    const { categories } = mergeCategories(base, [], extItems)
    expect(categories[0].items).toHaveLength(2)
  })

  it('drops：同分类内 URL 重复会记录一条 intra_cat_dup', () => {
    const base = [
      {
        id: 'a',
        name: 'A',
        items: [
          { name: 'keep', url: 'https://x.com' },
          { name: 'dup', url: 'https://x.com' },
        ],
      },
    ]
    const { drops } = mergeCategories(base, [], {})
    expect(drops).toHaveLength(1)
    expect(drops[0].reason).toBe('intra_cat_dup')
    expect(drops[0].cat).toBe('a')
    expect(drops[0].name).toBe('dup')
    expect(drops[0].url).toBe('https://x.com')
  })

  it('drops：缺少 URL 会记录一条 no_url', () => {
    const base = [{ id: 'a', name: 'A', items: [{ name: 'ghost' }] }]
    const { drops } = mergeCategories(base, [], {})
    expect(drops).toHaveLength(1)
    expect(drops[0].reason).toBe('no_url')
    expect(drops[0].name).toBe('ghost')
  })

  it('drops：跨分类同 URL 不应产生 drop', () => {
    const base = [
      { id: 'a', name: 'A', items: [{ name: 'x', url: 'https://x.com' }] },
      { id: 'b', name: 'B', items: [{ name: 'y', url: 'https://x.com' }] },
    ]
    const { drops } = mergeCategories(base, [], {})
    expect(drops).toHaveLength(0)
  })

  it('drops：扩展条目与基础分类内重复也会被记录', () => {
    const base = [{ id: 'a', name: 'A', items: [{ name: 'x', url: 'https://x.com' }] }]
    const extItems = { a: [{ name: 'x-again', url: 'https://x.com' }] }
    const { categories, drops } = mergeCategories(base, [], extItems)
    expect(categories[0].items).toHaveLength(1)
    expect(drops).toHaveLength(1)
    expect(drops[0].name).toBe('x-again')
  })
})
