import { ref, computed, shallowRef } from 'vue'
import { categories } from '../data/nav.js'
import { APP_CONFIG } from '../config/constants.js'
import SearchIndex from '../utils/searchIndex.js'
import { paginate, totalPages } from '../utils/paginate.js'
import { useFavorites } from './useFavorites.js'
import healthMap from '../data/health.json' with { type: 'json' }

const PAGE_SIZE = APP_CONFIG.UI.PAGE_SIZE || 24
// 单分类页大小：限制首屏 DOM 数量，避免大分类（如 github 40+ 条）全量渲染卡顿
const SINGLE_CAT_PAGE_SIZE = PAGE_SIZE * 2

// 预构建一次，避免重复 flatMap；用 health.json 的自动检测结果覆盖手动标注
// 注意：health.json 中值为 "skip" 表示自动检测跳过，应回退到手动标注，避免误显示为在线
const allItems = categories.flatMap((c) =>
  c.items.map((i) => {
    const h = healthMap[i.url]
    return {
      ...i,
      _category: c,
      health: h && h !== 'skip' ? h : (i.health ?? 'ok'),
    }
  })
)
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

// 模块级单例状态 - 整个应用共享同一份 ref，避免多组件调用时状态分裂
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
// 单分类也分页（页大小翻倍），避免大分类全量渲染导致 INP 退化
const currentPageSize = computed(() => (activeCategory.value === 'all' ? PAGE_SIZE : SINGLE_CAT_PAGE_SIZE))
const totalPageCount = computed(() => totalPages(filteredItems.value.length, currentPageSize.value))

const paginatedItems = computed(() => paginate(filteredItems.value, currentPage.value, currentPageSize.value))

const currentCategory = computed(() => {
  if (activeCategory.value === 'all') return null
  return categories.find((c) => c.id === activeCategory.value)
})

function resetPage() {
  currentPage.value = 1
}

function setSearch(q) {
  searchQuery.value = q
  resetPage()
  // 不再 clearHighlightCache：缓存 key 含 query，LRU 自然淘汰旧查询，连续相似查询可复用分段
}

function clearSearch() {
  searchQuery.value = ''
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

const sharedState = {
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
  currentPageSize,
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

export function useAppState() {
  return sharedState
}
