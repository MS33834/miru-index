import { ref, computed, shallowRef, watch } from 'vue'
import { categories } from '../data/nav.js'
import { APP_CONFIG } from '../config/constants.js'
import { clearHighlightCache } from '../utils/highlight.js'
import SearchIndex from '../utils/searchIndex.js'
import { paginate, totalPages } from '../utils/paginate.js'
import { useFavorites } from './useFavorites.js'

const PAGE_SIZE = APP_CONFIG.UI.PAGE_SIZE || 24

// 预构建一次，避免重复 flatMap
const allItems = categories.flatMap((c) => c.items.map((i) => ({ ...i, _category: c })))
const categoryIdSet = new Set(categories.map((c) => c.id))
const searchIndex = new SearchIndex(allItems)

// 提取所有标签并计数
const allTags = computed(() => {
  const map = new Map()
  for (const item of allItems) {
    for (const tag of item.tags || []) {
      map.set(tag, (map.get(tag) || 0) + 1)
    }
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }))
})

export function useAppState() {
  const { isFavorite } = useFavorites()

  const searchQuery = ref('')
  const activeCategory = ref('all')
  const selectedTags = ref(new Set())
  const proxyFilter = ref('all') // 'all' | 'direct' | 'proxy'
  const showFavoritesOnly = ref(false)
  const currentPage = ref(1)

  const filteredItems = computed(() => {
    let list = allItems

    // 分类过滤
    if (activeCategory.value !== 'all' && categoryIdSet.has(activeCategory.value)) {
      list = list.filter((i) => i._category.id === activeCategory.value)
    }

    // 搜索（多关键词 AND）
    const q = searchQuery.value.trim()
    if (q) {
      const keywords = q.split(/\s+/).filter(Boolean)
      list = keywords.length > 1 ? searchIndex.queryAll(keywords) : searchIndex.query(q)
      // 搜索时仍要保留分类过滤
      if (activeCategory.value !== 'all' && categoryIdSet.has(activeCategory.value)) {
        list = list.filter((i) => i._category.id === activeCategory.value)
      }
    }

    // 标签过滤
    if (selectedTags.value.size > 0) {
      list = list.filter((i) => (i.tags || []).some((t) => selectedTags.value.has(t)))
    }

    // 代理过滤
    if (proxyFilter.value === 'direct') {
      list = list.filter((i) => !i.proxy)
    } else if (proxyFilter.value === 'proxy') {
      list = list.filter((i) => i.proxy)
    }

    // 仅收藏
    if (showFavoritesOnly.value) {
      list = list.filter((i) => isFavorite(i))
    }

    return list
  })

  const filteredCount = computed(() => filteredItems.value.length)
  const totalPageCount = computed(() => totalPages(filteredItems.value.length, PAGE_SIZE))

  const paginatedItems = computed(() => {
    if (activeCategory.value !== 'all') return filteredItems.value
    return paginate(filteredItems.value, currentPage.value, PAGE_SIZE)
  })

  const currentCategory = computed(() => {
    if (activeCategory.value === 'all') return null
    return categories.find((c) => c.id === activeCategory.value)
  })

  function resetPage() {
    currentPage.value = 1
  }

  function setSearch(q) {
    searchQuery.value = q
  }

  function clearSearch() {
    searchQuery.value = ''
    clearHighlightCache()
  }

  function selectCategory(id) {
    activeCategory.value = id
    resetPage()
  }

  function toggleTag(tag) {
    const s = new Set(selectedTags.value)
    if (s.has(tag)) s.delete(tag)
    else s.add(tag)
    selectedTags.value = s
    resetPage()
  }

  function clearTags() {
    selectedTags.value = new Set()
    resetPage()
  }

  function setProxyFilter(v) {
    proxyFilter.value = v
    resetPage()
  }

  function toggleFavoritesOnly() {
    showFavoritesOnly.value = !showFavoritesOnly.value
    resetPage()
  }

  function nextPage() {
    if (currentPage.value < totalPageCount.value) {
      currentPage.value++
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  // 任一过滤条件变化都重置页码并清高亮缓存
  watch([searchQuery, activeCategory, selectedTags, proxyFilter], () => {
    resetPage()
    clearHighlightCache()
  })

  return {
    // 只读数据
    allItems: shallowRef(allItems),
    allTags,
    // 状态
    searchQuery,
    activeCategory,
    selectedTags,
    proxyFilter,
    showFavoritesOnly,
    currentPage,
    // 计算
    filteredItems,
    filteredCount,
    totalPageCount,
    paginatedItems,
    currentCategory,
    // 方法
    setSearch,
    clearSearch,
    selectCategory,
    toggleTag,
    clearTags,
    setProxyFilter,
    toggleFavoritesOnly,
    nextPage,
    prevPage,
    resetPage,
  }
}
