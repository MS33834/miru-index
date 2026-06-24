/**
 * 高性能搜索索引
 * 预构建小写全文 + 多字段匹配，避免每次按键扫描所有字段
 * 支持相关性排序：name 全等 > name 包含 > desc 包含 > tags/features 包含
 */
class SearchIndex {
  constructor(items) {
    this.items = items
    this.index = this.build(items)
  }

  build(items) {
    // 预归一化所有文本字段，O(n) 一次构建
    return items.map((item, i) => {
      const cat = item._category || {}
      const tags = (item.tags || []).join(' ')
      const features = (item.features || []).join(' ')
      const name = (item.name || '').toLowerCase()
      const haystack = [item.name, item.desc || '', item.fullDesc || '', cat.name || '', tags, features]
        .join(' ')
        .toLowerCase()
      return { i, haystack, name }
    })
  }

  query(q) {
    const needle = q.trim().toLowerCase()
    if (!needle) return this.items
    // O(n) 字符串包含扫描，带相关性评分排序
    const results = []
    for (let k = 0; k < this.index.length; k++) {
      const entry = this.index[k]
      if (entry.haystack.includes(needle)) {
        // 评分：name 全等(100) > name 开头(80) > name 包含(60) > desc 包含(40) > 其他(20)
        let score = 20
        if (entry.name === needle) score = 100
        else if (entry.name.startsWith(needle)) score = 80
        else if (entry.name.includes(needle)) score = 60
        else if ((this.items[entry.i].desc || '').toLowerCase().includes(needle)) score = 40
        results.push({ item: this.items[entry.i], score })
      }
    }
    results.sort((a, b) => b.score - a.score)
    return results.map((r) => r.item)
  }

  // 多关键词 AND 搜索
  queryAll(keywords) {
    if (!keywords.length) return this.items
    const needles = keywords.map((k) => k.toLowerCase())
    const results = []
    for (let k = 0; k < this.index.length; k++) {
      const hay = this.index[k].haystack
      let all = true
      for (const n of needles) {
        if (!hay.includes(n)) {
          all = false
          break
        }
      }
      if (all) {
        // 评分：name 包含第一个关键词加分
        const entry = this.index[k]
        let score = 20
        if (entry.name.includes(needles[0])) score = 60
        results.push({ item: this.items[entry.i], score })
      }
    }
    results.sort((a, b) => b.score - a.score)
    return results.map((r) => r.item)
  }
}

export default SearchIndex
