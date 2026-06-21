import { watch } from 'vue'
import { categories } from '../data/nav.js'

const VALID_PROXY = ['all', 'direct', 'proxy']
const categoryIdSet = new Set(categories.map((c) => c.id))

/**
 * 将应用状态与 URL query 双向同步，支持分享链接。
 * 支持的参数：
 *   q     - 搜索关键词
 *   cat   - 当前分类 id
 *   tags  - 已选标签，逗号分隔
 *   proxy - direct | proxy | all
 *   fav   - 1 表示仅收藏
 *   page  - 当前页码
 *   view  - grid | list
 */
export function useUrlSync(state) {
  const { searchQuery, activeCategory, selectedTags, proxyFilter, showFavoritesOnly, currentPage, viewMode } = state

  let isInitializing = true

  function read() {
    if (typeof location === 'undefined') {
      isInitializing = false
      return
    }

    const params = new URLSearchParams(location.search)

    const q = params.get('q') || ''
    const cat = params.get('cat') || 'all'
    const tags = (params.get('tags') || '').split(',').filter(Boolean)
    const proxy = params.get('proxy') || 'all'
    const fav = params.get('fav') === '1'
    const page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1)
    const view = params.get('view') || 'grid'

    searchQuery.value = q
    activeCategory.value = categoryIdSet.has(cat) ? cat : 'all'
    selectedTags.value = new Set(tags)
    proxyFilter.value = VALID_PROXY.includes(proxy) ? proxy : 'all'
    showFavoritesOnly.value = fav
    currentPage.value = page
    viewMode.value = view === 'list' ? 'list' : 'grid'

    isInitializing = false
  }

  function write() {
    if (isInitializing || typeof location === 'undefined') return

    const params = new URLSearchParams()

    const q = searchQuery.value.trim()
    if (q) params.set('q', q)
    if (activeCategory.value !== 'all') params.set('cat', activeCategory.value)
    if (selectedTags.value.size > 0) {
      params.set('tags', [...selectedTags.value].join(','))
    }
    if (proxyFilter.value !== 'all') params.set('proxy', proxyFilter.value)
    if (showFavoritesOnly.value) params.set('fav', '1')
    if (currentPage.value > 1) params.set('page', String(currentPage.value))
    if (viewMode.value === 'list') params.set('view', 'list')

    const qs = params.toString()
    const url = qs ? `${location.pathname}?${qs}` : location.pathname
    history.replaceState(null, '', url)
  }

  // 初始化：从 URL 读取一次
  read()

  // 状态变化时同步回 URL
  watch(
    [
      () => searchQuery.value,
      () => activeCategory.value,
      () => [...selectedTags.value].sort().join(','),
      () => proxyFilter.value,
      () => showFavoritesOnly.value,
      () => currentPage.value,
      () => viewMode.value,
    ],
    write,
    { flush: 'post' }
  )

  // 浏览器前进/后退时重新读取
  function onPopState() {
    isInitializing = true
    read()
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', onPopState)
  }

  return {
    read,
    write,
    cleanup() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', onPopState)
      }
    },
  }
}
