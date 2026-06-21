<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { categories } from './data/nav.js'
import SiteModal from './components/SiteModal.vue'
import SidebarNav from './components/SidebarNav.vue'
import SiteCard from './components/SiteCard.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import KeyboardHelp from './components/KeyboardHelp.vue'
import PwaInstallPrompt from './components/PwaInstallPrompt.vue'
import { isOffline } from './main.js'
import { APP_CONFIG } from './config/constants.js'
import { useScrollPosition } from './composables/useScrollPosition.js'
import { useAppState } from './composables/useAppState.js'
import { useRecentSearches } from './composables/useRecentSearches.js'
import { useViewMode } from './composables/useViewMode.js'
import { useFavorites } from './composables/useFavorites.js'
import { useUrlSync } from './composables/useUrlSync.js'
import { useSwUpdate } from './composables/useSwUpdate.js'

const modalItem = ref(null)
const modalCategory = ref(null)
const drawerOpen = ref(false)
const helpOpen = ref(false)
const loaded = ref(false)

const SIDEBAR_KEY = 'miru-sidebar-collapsed'
const sidebarCollapsed = ref(localStorage.getItem(SIDEBAR_KEY) === 'true')

const appState = useAppState()
const recent = useRecentSearches()
const { viewMode, setMode, toggle: toggleViewMode } = useViewMode()
const { favorites, exportFavorites, importFavorites } = useFavorites()

const importStatus = ref('')
const importInputRef = ref(null)

function onExportFavorites() {
  exportFavorites()
}

async function onImportFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    const count = await importFavorites(file)
    importStatus.value = `已导入 ${count} 条收藏`
  } catch (err) {
    importStatus.value = `导入失败：${err.message}`
  }
  event.target.value = ''
  setTimeout(() => {
    importStatus.value = ''
  }, 3000)
}

const {
  searchQuery,
  activeCategory,
  selectedTags,
  proxyFilter,
  showFavoritesOnly,
  currentPage,
  filteredCount,
  totalPageCount,
  paginatedItems,
  currentCategory,
  allItems,
  setSearch,
  clearSearch,
  selectCategory,
  toggleTag,
  clearTags,
  setProxyFilter,
  toggleFavoritesOnly,
  nextPage,
  prevPage,
} = appState

const totalCount = computed(() => allItems.value.length)
const favoritesCount = computed(() => favorites.value.length)

useUrlSync({
  searchQuery,
  activeCategory,
  selectedTags,
  proxyFilter,
  showFavoritesOnly,
  currentPage,
  viewMode,
})

const { updateAvailable, refresh: refreshApp } = useSwUpdate()

const { VOLUMES, CHINESE_NUMS, UI } = APP_CONFIG
const { showBackToTop } = useScrollPosition({ threshold: UI.BACK_TO_TOP_THRESHOLD })

watch(sidebarCollapsed, (val) => {
  try {
    localStorage.setItem(SIDEBAR_KEY, String(val))
  } catch {
    /* 忽略存储错误 */
  }
})

// 弹窗 / 抽屉 / 帮助打开时统一锁定 body 滚动
watch(
  [() => modalItem.value, helpOpen, drawerOpen],
  ([modal, help, drawer]) => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = modal || help || drawer ? 'hidden' : ''
    }
  },
  { flush: 'post' }
)

// 搜索提交时记录到最近搜索
function onSearchCommit(q) {
  setSearch(q)
  recent.add(q)
}

// 切换时重置 + 清缓存 + 更新页面标题
watch([searchQuery, activeCategory], () => {
  if (searchQuery.value) {
    document.title = `搜索: ${searchQuery.value} - 漫藏阁`
  } else if (activeCategory.value !== 'all') {
    const cat = categories.find((c) => c.id === activeCategory.value)
    document.title = `${cat?.name || ''} - 漫藏阁`
  } else {
    document.title = '漫藏阁 - ACGN 资源导航'
  }
})

// 卷册分组（仅"全部"模式）
const groupedByVolume = computed(() => {
  if (activeCategory.value !== 'all') return null
  const items = paginatedItems.value
  if (!items.length) return []

  // 预构建分类 ID -> 分类引用
  const catMap = new Map(categories.map((c) => [c.id, c]))

  return VOLUMES.map((v, vi) => {
    // 该卷包含的分类 ID 集合
    const volCatIds = new Set(v.catIds)

    // 按分类分组 items
    const groupsByCatId = new Map()
    for (const item of items) {
      if (volCatIds.has(item._category.id)) {
        if (!groupsByCatId.has(item._category.id)) {
          groupsByCatId.set(item._category.id, [])
        }
        groupsByCatId.get(item._category.id).push(item)
      }
    }

    // 保留原顺序：使用 v.catIds 顺序遍历
    const cats = v.catIds
      .map((id) => catMap.get(id))
      .filter(Boolean)
      .map((c) => ({ ...c, items: groupsByCatId.get(c.id) || [] }))
      .filter((c) => c.items.length)

    return {
      ...v,
      cats,
      chapterNum: CHINESE_NUMS[vi + 1] || String(vi + 1),
      items: cats.flatMap((c) => c.items),
    }
  }).filter((g) => g.items.length > 0)
})

const singleCategory = computed(() => {
  if (activeCategory.value === 'all') return null
  const cat = currentCategory.value
  if (!cat) return null
  return [{ ...cat, items: paginatedItems.value }]
})

function openModal(item, category) {
  modalItem.value = item
  modalCategory.value = category
}
function closeModal() {
  modalItem.value = null
  modalCategory.value = null
}
function onSelectCategory(id) {
  selectCategory(id)
  drawerOpen.value = false
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
function onClearSearch() {
  clearSearch()
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
function onNextPage() {
  nextPage()
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
function onPrevPage() {
  prevPage()
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function focusSearch() {
  sidebarCollapsed.value = false
  nextTick(() => {
    setTimeout(() => {
      const searchInput = document.querySelector('.scroll-input')
      if (searchInput) searchInput.focus()
    }, 350)
  })
}

const drawerPanelRef = ref(null)
function handleDrawerKeydown(e) {
  if (e.key === 'Escape') {
    drawerOpen.value = false
    return
  }
  if (e.key !== 'Tab' || !drawerPanelRef.value) return
  const focusable = Array.from(
    drawerPanelRef.value.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.disabled && el.offsetParent !== null)
  if (focusable.length < 2) {
    e.preventDefault()
    return
  }
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

function focusDrawerPanel() {
  nextTick(() => {
    const panel = drawerPanelRef.value
    if (!panel) return
    const focusable = panel.querySelector(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
    ;(focusable || panel).focus()
  })
}

watch(
  () => drawerOpen.value,
  (open) => {
    if (open) focusDrawerPanel()
  }
)

function handleKeydown(e) {
  // 忽略在输入框中的快捷键（除 Esc）
  const target = e.target
  const inInput = target?.matches?.('input, textarea, [contenteditable]')

  if (e.key === 'Escape') {
    if (modalItem.value) {
      closeModal()
      return
    }
    if (helpOpen.value) {
      helpOpen.value = false
      return
    }
    if (drawerOpen.value) {
      drawerOpen.value = false
      return
    }
  }

  // 当弹窗/抽屉/帮助打开时，禁用全局导航快捷键，避免冲突
  if (modalItem.value || helpOpen.value || drawerOpen.value) return

  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    const searchInput = document.querySelector('.scroll-input')
    if (searchInput) searchInput.focus()
    return
  }

  // 按 ? 打开帮助
  if (e.key === '?' && !inInput) {
    e.preventDefault()
    helpOpen.value = !helpOpen.value
    return
  }

  // v 切换视图
  if ((e.key === 'v' || e.key === 'V') && !inInput) {
    e.preventDefault()
    toggleViewMode()
    return
  }

  // f 切换仅收藏
  if ((e.key === 'f' || e.key === 'F') && !inInput) {
    e.preventDefault()
    toggleFavoritesOnly()
    return
  }

  // 上下方向键在分类间切换
  if (e.key === 'ArrowDown' && !inInput && activeCategory.value === 'all') {
    // 滚到下一卷
    e.preventDefault()
    const volumes = document.querySelectorAll('.volume')
    const scrollY = window.scrollY
    for (const v of volumes) {
      if (v.offsetTop > scrollY + 100) {
        v.scrollIntoView({ behavior: 'smooth', block: 'start' })
        break
      }
    }
  }
  if (e.key === 'ArrowUp' && !inInput && activeCategory.value === 'all') {
    e.preventDefault()
    const volumes = Array.from(document.querySelectorAll('.volume'))
    const scrollY = window.scrollY
    for (let i = volumes.length - 1; i >= 0; i--) {
      if (volumes[i].offsetTop < scrollY - 100) {
        volumes[i].scrollIntoView({ behavior: 'smooth', block: 'start' })
        break
      }
    }
  }
}

onMounted(() => {
  setTimeout(() => (loaded.value = true), 80)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <ErrorBoundary>
    <div class="layout">
      <!-- =================== Skip Navigation 链接 =================== -->
      <a href="#main-content" class="skip-nav">跳转到主要内容</a>

      <!-- =================== 桌面端侧边栏 =================== -->
      <div class="hidden lg:block sidebar-shell" :class="{ 'is-collapsed': sidebarCollapsed }">
        <SidebarNav
          :active-category="activeCategory"
          :search-query="searchQuery"
          :collapsed="sidebarCollapsed"
          :selected-tags="selectedTags"
          :proxy-filter="proxyFilter"
          :show-favorites-only="showFavoritesOnly"
          :favorites-count="favoritesCount"
          @select="onSelectCategory"
          @search="onSearchCommit"
          @toggle="sidebarCollapsed = !sidebarCollapsed"
          @search-focus="focusSearch"
          @toggle-tag="toggleTag"
          @set-proxy-filter="setProxyFilter"
          @toggle-favorites-only="toggleFavoritesOnly"
        />
      </div>

      <!-- =================== 顶栏（平板/手机） =================== -->
      <header class="mobile-topbar lg:hidden">
        <div class="flex items-center gap-2">
          <button
            @click="drawerOpen = true"
            class="w-11 h-11 flex items-center justify-center text-[#f3ece0] hover:bg-[#ff4d4f]/10 rounded-sm"
            aria-label="打开目录"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div class="hanko h-7 w-7 text-[11px]">漫</div>
          <div class="font-serif-cn text-base font-bold text-[#f3ece0] tracking-wider">MIRU INDEX</div>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="hanko text-[10px] px-2 py-1">第{{ VOLUMES.length }}卷</div>
          <div
            class="hanko text-[10px] px-2 py-1"
            style="background: #1a1410; color: #c9a55c; box-shadow: inset 0 0 0 1px rgba(201, 165, 92, 0.4)"
          >
            {{ totalCount }}
          </div>
        </div>
      </header>

      <!-- =================== 抽屉（平板/手机） =================== -->
      <Teleport to="body">
        <Transition name="drawer">
          <div
            v-if="drawerOpen"
            class="drawer-mask"
            @click="drawerOpen = false"
            role="dialog"
            aria-modal="true"
            aria-label="导航目录"
          >
            <div ref="drawerPanelRef" class="drawer-panel" tabindex="-1" @click.stop @keydown="handleDrawerKeydown">
              <SidebarNav
                :active-category="activeCategory"
                :search-query="searchQuery"
                :collapsed="false"
                :selected-tags="selectedTags"
                :proxy-filter="proxyFilter"
                :show-favorites-only="showFavoritesOnly"
                :favorites-count="favoritesCount"
                @select="onSelectCategory"
                @search="onSearchCommit"
                @toggle="drawerOpen = false"
                @toggle-tag="toggleTag"
                @set-proxy-filter="setProxyFilter"
                @toggle-favorites-only="toggleFavoritesOnly"
              />
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- =================== 主区 =================== -->
      <main id="main-content" class="main">
        <!-- Hero（首次进入且无搜索） -->
        <section v-if="loaded && !searchQuery && activeCategory === 'all'" class="hero">
          <div class="hero__inner">
            <!-- 简化的顶部标识 -->
            <div class="flex items-center gap-3 mb-12">
              <div class="hanko h-10 w-10 text-base">漫</div>
              <div>
                <div class="font-serif-cn text-[#f3ece0] text-lg font-bold tracking-wider">MIRU INDEX</div>
                <div class="font-mono text-[#8a7a68] text-[10px] tracking-[0.3em] mt-1">ACGN · 2026</div>
              </div>
            </div>

            <!-- 主标题区域 - 更简洁 -->
            <div class="relative">
              <h1 class="relative mb-6">
                <span class="hero-title ink-spread inline-block">漫藏</span>
                <span class="hero-title-sub ink-spread inline-block ml-4">藏經閣</span>
              </h1>

              <p class="max-w-2xl text-[#c4bba8] text-base leading-[2] font-kai-cn mb-8">
                一座属于 <span class="text-[#f3ece0] font-bold">ACGN</span> 的<span class="text-[#ff4d4f] font-bold"
                  >印经阁</span
                >。 精选 <span class="text-[#c9a55c] font-serif-cn text-lg mx-1">{{ totalCount }}</span> 站 · 分
                <span class="text-[#c9a55c] font-serif-cn text-lg mx-1">{{ categories.length }}</span> 卷 · 涵盖漫画 ·
                番剧 · GalGame · 轻小说 · 绘图 · GitHub 开源 · 网络工具……
              </p>

              <!-- 简化的标签 -->
              <div class="flex flex-wrap gap-2">
                <div class="hanko px-3 py-1.5 text-sm">朱泥 · ACGN</div>
                <div class="hanko px-3 py-1.5 text-sm" style="background: #1a1410; color: #c9a55c">
                  御金 · {{ totalCount }}
                </div>
                <div class="hanko px-3 py-1.5 text-sm" style="background: #0a0a0a; color: #f3ece0">
                  墨 · {{ VOLUMES.length }}卷
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 面包屑 -->
        <div v-if="!searchQuery" class="breadcrumb">
          <button
            type="button"
            @click="onSelectCategory('all')"
            class="breadcrumb__item"
            :class="{ 'is-current': activeCategory === 'all' }"
          >
            <span>⌘</span> 總藏
          </button>
          <template v-if="currentCategory">
            <span class="breadcrumb__sep">/</span>
            <span class="breadcrumb__item is-current">
              <span>{{ currentCategory.icon }}</span> {{ currentCategory.name }}
            </span>
          </template>
          <span class="breadcrumb__count">
            <span class="font-mono">{{ filteredCount }}</span> 帖
          </span>
        </div>

        <!-- 搜索结果条 -->
        <div v-if="searchQuery" class="search-result">
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div class="font-mono text-[10px] tracking-[0.3em] text-[#c9a55c]">▎索 · 寻 「{{ searchQuery }}」</div>
              <div class="font-kai-cn text-[#c4bba8] text-sm mt-1">
                得 <span class="text-[#c9a55c] font-serif-cn text-lg mx-1">{{ filteredCount }}</span> 条结果
              </div>
            </div>
            <button type="button" @click="onClearSearch" class="search-clear-btn" aria-label="清空搜索">
              <span>清空</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 过滤与视图工具条 -->
        <div class="filter-bar">
          <div class="filter-bar__group">
            <button
              type="button"
              class="filter-chip"
              :class="{ 'is-active': showFavoritesOnly }"
              @click="toggleFavoritesOnly"
              :aria-pressed="showFavoritesOnly"
              title="仅显示收藏（快捷键 F）"
            >
              <span>★</span>
              <span>收藏</span>
              <span v-if="favoritesCount > 0" class="filter-chip__count">{{ favoritesCount }}</span>
            </button>

            <button
              type="button"
              class="filter-chip"
              :class="{ 'is-active': proxyFilter === 'direct' }"
              @click="setProxyFilter(proxyFilter === 'direct' ? 'all' : 'direct')"
              :aria-pressed="proxyFilter === 'direct'"
              title="仅显示直连"
            >
              <span>◯</span>
              <span>直连</span>
            </button>

            <button
              type="button"
              class="filter-chip"
              :class="{ 'is-active': proxyFilter === 'proxy' }"
              @click="setProxyFilter(proxyFilter === 'proxy' ? 'all' : 'proxy')"
              :aria-pressed="proxyFilter === 'proxy'"
              title="仅显示需梯子"
            >
              <span>◎</span>
              <span>需梯</span>
            </button>

            <button
              v-if="selectedTags.size > 0"
              type="button"
              class="filter-chip filter-chip--action"
              @click="clearTags"
              title="清除标签筛选"
            >
              <span>清除标签</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>

          <div class="filter-bar__group">
            <button
              type="button"
              class="view-toggle"
              :class="{ 'is-active': viewMode === 'grid' }"
              @click="setMode('grid')"
              aria-label="网格视图"
              title="网格视图"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              type="button"
              class="view-toggle"
              :class="{ 'is-active': viewMode === 'list' }"
              @click="setMode('list')"
              aria-label="列表视图"
              title="列表视图"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          <div class="filter-bar__group">
            <button
              type="button"
              class="filter-chip filter-chip--action"
              @click="onExportFavorites"
              title="导出收藏为 JSON"
            >
              导出收藏
            </button>
            <button
              type="button"
              class="filter-chip filter-chip--action"
              @click="importInputRef?.click()"
              title="从 JSON 文件导入收藏"
            >
              导入收藏
            </button>
            <input ref="importInputRef" type="file" accept="application/json" class="hidden" @change="onImportFile" />
            <span v-if="importStatus" class="filter-chip__status">{{ importStatus }}</span>
          </div>
        </div>

        <!-- 已选标签 -->
        <div v-if="selectedTags.size > 0" class="selected-tags">
          <span class="selected-tags__label">已选标签</span>
          <button
            v-for="tag in selectedTags"
            :key="tag"
            type="button"
            class="selected-tags__item"
            @click="toggleTag(tag)"
            :aria-label="`移除标签 ${tag}`"
          >
            <span>#{{ tag }}</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        <!-- 主体：分卷 OR 单一分类 -->
        <div v-if="groupedByVolume" class="volumes">
          <article v-for="(vol, vi) in groupedByVolume" :key="vol.id" class="volume content-auto">
            <!-- 卷首 -->
            <header class="volume__header">
              <div class="flex items-end gap-4 sm:gap-6 mb-3 sm:mb-4">
                <div class="volume-num font-serif-cn">{{ vol.chapterNum }}</div>
                <div class="flex-1 pb-1">
                  <div class="chapter-num text-[#8a7a68] mb-1">
                    CHAPTER · {{ String(vi + 1).padStart(2, '0') }} /
                    {{ String(groupedByVolume.length).padStart(2, '0') }}
                  </div>
                  <h2 class="font-serif-cn text-2xl sm:text-3xl text-[#f3ece0] font-bold tracking-wide">
                    <span class="text-[#ff4d4f] mr-2">卷</span>{{ vol.name.replace('卷', '') }} · {{ vol.title }}
                  </h2>
                  <div class="mt-1.5 text-[#c9a55c] font-mono text-[11px] tracking-[0.2em]">
                    {{ vol.sub }} · {{ vol.items.length }} 帖
                  </div>
                </div>
                <div class="hidden sm:flex items-center gap-2 pb-1">
                  <div class="hanko text-xs px-2.5 py-1 stamp-anim">第{{ vol.chapterNum }}卷</div>
                </div>
              </div>
              <div class="scroll-divider">
                <span class="ornament">❀</span>
              </div>
            </header>

            <!-- 卷内分组 -->
            <div class="space-y-10">
              <div v-for="cat in vol.cats" :key="cat.id" class="subgroup">
                <div class="subgroup__head">
                  <span class="subgroup__icon">{{ cat.icon }}</span>
                  <h3 class="font-serif-cn text-base sm:text-lg font-bold text-[#f3ece0] tracking-wider">
                    {{ cat.name }}
                  </h3>
                  <span class="ink-bar flex-1 min-w-[40px]"></span>
                  <button type="button" @click="onSelectCategory(cat.id)" class="subgroup__more">全卷 →</button>
                </div>
                <div class="site-grid" :class="viewMode === 'list' ? 'site-grid--list' : 'site-grid--grid'">
                  <SiteCard
                    v-for="(item, idx) in cat.items"
                    :key="item.name + (item.url || '')"
                    :item="item"
                    :category="cat"
                    :index="idx"
                    :compact="true"
                    :search-query="searchQuery"
                    :view-mode="viewMode"
                    @open="openModal"
                  />
                </div>
              </div>
            </div>
          </article>
        </div>

        <div v-else-if="singleCategory" class="single-cat">
          <article v-for="(group, gi) in singleCategory" :key="group.id" class="content-auto">
            <header class="volume__header">
              <div class="flex items-end gap-4 sm:gap-6 mb-3 sm:mb-4">
                <div class="volume-num font-serif-cn">{{ CHINESE_NUMS[gi + 1] || '壹' }}</div>
                <div class="flex-1 pb-1">
                  <div class="chapter-num text-[#8a7a68] mb-1">CHAPTER · {{ String(gi + 1).padStart(2, '0') }}</div>
                  <h2 class="font-serif-cn text-2xl sm:text-3xl text-[#f3ece0] font-bold tracking-wide">
                    <span class="text-[#ff4d4f] mr-2">{{ group.icon }}</span
                    >{{ group.name }}
                  </h2>
                  <div class="mt-1.5 text-[#8a7a68] font-mono text-[10px] tracking-[0.2em]">
                    {{ group.items.length }} 帖 · 共 {{ group.items.length }} 卷
                  </div>
                </div>
                <div class="hidden sm:flex items-center gap-2 pb-1">
                  <div class="hanko text-xs px-2.5 py-1 stamp-anim">全卷</div>
                </div>
              </div>
              <div class="scroll-divider">
                <span class="ornament">❀</span>
              </div>
            </header>

            <div class="site-grid" :class="viewMode === 'list' ? 'site-grid--list' : 'site-grid--grid'">
              <SiteCard
                v-for="(item, idx) in group.items"
                :key="item.name + (item.url || '')"
                :item="item"
                :category="group"
                :index="idx"
                :search-query="searchQuery"
                :view-mode="viewMode"
                @open="openModal"
              />
            </div>
          </article>
        </div>

        <div v-if="!groupedByVolume && !singleCategory" class="empty">
          <div class="hanko-circle w-20 h-20 mx-auto mb-6 text-2xl">空</div>
          <p class="font-kai-cn text-[#8a7a68] text-lg">卷帙浩繁，未寻得所求之物……</p>
        </div>

        <!-- 分页控件 -->
        <nav v-if="activeCategory === 'all' && totalPageCount > 1" class="pagination" aria-label="分页导航">
          <button
            type="button"
            @click="onPrevPage"
            :disabled="currentPage === 1"
            class="pagination__btn"
            aria-label="上一页"
          >
            ← 前一页
          </button>
          <div class="pagination__info">
            <span class="font-serif-cn text-[#c9a55c]">{{ currentPage }}</span>
            <span class="text-[#8a7a68]">/</span>
            <span>{{ totalPageCount }}</span>
          </div>
          <button
            type="button"
            @click="onNextPage"
            :disabled="currentPage === totalPageCount"
            class="pagination__btn"
            aria-label="下一页"
          >
            后一页 →
          </button>
        </nav>
      </main>

      <!-- =================== FOOTER =================== -->
      <footer class="site-footer">
        <div class="site-footer__inner">
          <div class="scroll-divider mb-8">
            <span class="ornament">❀ ❀ ❀</span>
          </div>
          <div class="flex justify-center mb-6">
            <div class="hanko h-16 w-16 text-2xl stamp-anim" style="animation-delay: 0.3s">藏</div>
          </div>
          <p class="font-kai-cn text-[#8a7a68] text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            凡收录之站，皆经编者亲手验证<br />
            然网络无常，若有失效，请以宽容待之
          </p>
          <div class="mt-6 font-mono text-[10px] text-[#8a7a68] tracking-[0.3em]">
            © 2026 · MIRU INDEX · CC BY-SA 4.0
          </div>
        </div>
      </footer>

      <SiteModal v-if="modalItem" :item="modalItem" :category="modalCategory" @close="closeModal" />

      <!-- =================== 返回顶部按钮 =================== -->
      <Transition name="fade">
        <button v-if="showBackToTop" @click="scrollToTop" class="back-to-top" aria-label="返回顶部">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </Transition>

      <!-- 离线状态提示 -->
      <Transition name="fade">
        <div v-if="isOffline" class="offline-banner" role="alert" aria-live="polite">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
          </svg>
          <span>离线模式 - 部分功能可能受限</span>
        </div>
      </Transition>

      <!-- PWA 更新提示 -->
      <Transition name="fade">
        <div v-if="updateAvailable" class="update-banner" role="status" aria-live="polite">
          <span>新版本已就绪，刷新即可体验</span>
          <button type="button" class="update-banner__btn" @click="refreshApp">立即刷新</button>
        </div>
      </Transition>

      <!-- 快捷键帮助 -->
      <KeyboardHelp :open="helpOpen" @close="helpOpen = false" />

      <!-- PWA 安装提示 -->
      <PwaInstallPrompt />
    </div>
  </ErrorBoundary>
</template>

<style scoped>
/* ============== 布局 ============== */
.layout {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  position: relative;
}
@media (min-width: 1024px) {
  .layout {
    grid-template-columns: 280px 1fr;
    grid-template-rows: 1fr auto;
  }
  .sidebar-shell {
    grid-row: 1 / 3;
    grid-column: 1;
  }
  .mobile-topbar {
    display: none !important;
  }
  .main {
    grid-row: 1;
    grid-column: 2;
  }
  .site-footer {
    grid-row: 2;
    grid-column: 2;
  }
}

/* ============== 侧边栏外壳 ============== */
.sidebar-shell {
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 30;
  border-right: 1px solid rgba(255, 77, 79, 0.15);
  transition: all 0.3s;
  width: 280px;
}
.sidebar-shell.is-collapsed {
  width: 64px;
}

/* ============== 顶栏（移动/平板） ============== */
.mobile-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(10, 10, 10, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 77, 79, 0.15);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ============== 抽屉 ============== */
.drawer-mask {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
}
.drawer-panel {
  width: 86%;
  max-width: 320px;
  height: 100%;
  box-shadow: 8px 0 32px rgba(0, 0, 0, 0.6);
}
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s;
}
.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.drawer-enter-from {
  opacity: 0;
}
.drawer-enter-from .drawer-panel {
  transform: translateX(-100%);
}
.drawer-leave-to {
  opacity: 0;
}
.drawer-leave-to .drawer-panel {
  transform: translateX(-100%);
}

.drawer-panel .sidebar {
  border-right: none;
  box-shadow: none;
}

/* ============== 主区 ============== */
.main {
  position: relative;
  padding: 1.5rem 1rem 3rem;
  min-width: 0;
}
@media (min-width: 640px) {
  .main {
    padding: 2rem 2rem 4rem;
  }
}
@media (min-width: 1024px) {
  .main {
    padding: 3rem 3rem 5rem;
  }
}

/* ============== Hero ============== */
.hero {
  padding: 4rem 1.5rem 3rem;
  position: relative;
}
@media (min-width: 640px) {
  .hero {
    padding: 6rem 2rem 4rem;
  }
}
@media (min-width: 1024px) {
  .hero {
    padding: 8rem 3rem 5rem;
  }
}

.hero__inner {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-family: var(--serif);
  font-size: clamp(3.5rem, 12vw, 6rem);
  font-weight: 900;
  color: var(--washi);
  letter-spacing: 0.05em;
  line-height: 1.1;
}

.hero-title-sub {
  font-family: var(--serif);
  font-size: clamp(3rem, 10vw, 5rem);
  font-weight: 900;
  color: var(--seal);
  letter-spacing: 0.05em;
  line-height: 1.1;
  opacity: 0.9;
}

/* ============== 面包屑 ============== */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0 1.25rem;
  border-bottom: 1px dashed rgba(255, 77, 79, 0.15);
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.breadcrumb__item {
  font-family: var(--serif);
  font-size: 0.85rem;
  color: #8a7a68;
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.breadcrumb__item:not(.is-current):hover {
  color: #f3ece0;
  background: rgba(201, 165, 92, 0.1);
}
.breadcrumb__item.is-current {
  color: #ff4d4f;
  font-weight: 700;
}
.breadcrumb__sep {
  color: #8a7a68;
  font-family: var(--mono);
  font-size: 0.85rem;
}
.breadcrumb__count {
  margin-left: auto;
  font-family: var(--kai);
  font-size: 0.8rem;
  color: #8a7a68;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.breadcrumb__count .font-mono {
  color: #c9a55c;
  font-weight: 700;
}

/* ============== 搜索结果条 ============== */
.search-result {
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  background: rgba(255, 77, 79, 0.05);
  border-left: 3px solid #ff4d4f;
  border-radius: 0 4px 4px 0;
}

/* ============== 卷 ============== */
.volumes {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}
.subgroup {
  margin-top: 2rem;
}
.subgroup__icon {
  font-size: 1.1rem;
}
.subgroup__more {
  font-family: var(--serif);
  font-size: 0.8rem;
  color: #c9a55c;
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 0.45rem 0.75rem;
  border-radius: 2px;
  transition: all 0.2s;
  white-space: nowrap;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
}
.subgroup__more:hover {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
  padding-left: 0.95rem;
}

.empty {
  text-align: center;
  padding: 4rem 0;
}

/* ============== 移动端微调 ============== */
@media (max-width: 640px) {
  .breadcrumb__item {
    font-size: 0.9rem;
    padding: 0.35rem 0.6rem;
  }
  .subgroup__head {
    gap: 0.6rem;
  }
}

/* ============== 过滤与视图工具条 ============== */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.75rem 0;
  margin-bottom: 0.5rem;
  border-bottom: 1px dashed rgba(255, 77, 79, 0.12);
}
.filter-bar__group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  font-family: var(--serif);
  font-size: 0.8rem;
  color: #c4bba8;
  background: rgba(243, 236, 224, 0.04);
  border: 1px solid rgba(255, 77, 79, 0.15);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-chip:hover {
  background: rgba(255, 77, 79, 0.08);
  border-color: rgba(255, 77, 79, 0.35);
}
.filter-chip.is-active {
  color: #f3ece0;
  background: rgba(255, 77, 79, 0.18);
  border-color: #ff4d4f;
}
.filter-chip__count {
  font-family: var(--mono);
  font-size: 0.65rem;
  padding: 0 0.35rem;
  background: rgba(255, 77, 79, 0.2);
  color: #f3ece0;
  border-radius: 2px;
}
.filter-chip--action {
  border-style: dashed;
  color: #c9a55c;
  border-color: rgba(201, 165, 92, 0.35);
}
.filter-chip--action:hover {
  background: rgba(201, 165, 92, 0.1);
  border-color: #c9a55c;
}
.filter-chip__status {
  font-family: var(--mono);
  font-size: 0.7rem;
  color: #c9a55c;
}

.view-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #8a7a68;
  background: rgba(243, 236, 224, 0.04);
  border: 1px solid rgba(255, 77, 79, 0.15);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}
.view-toggle:hover {
  color: #f3ece0;
  background: rgba(255, 77, 79, 0.08);
}
.view-toggle.is-active {
  color: #f3ece0;
  background: rgba(255, 77, 79, 0.18);
  border-color: #ff4d4f;
}

.selected-tags {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  padding: 0.25rem 0;
}
.selected-tags__label {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: #8a7a68;
  letter-spacing: 0.15em;
}
.selected-tags__item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.55rem;
  font-family: var(--kai);
  font-size: 0.78rem;
  color: #f3ece0;
  background: rgba(201, 165, 92, 0.18);
  border: 1px solid rgba(201, 165, 92, 0.4);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}
.selected-tags__item:hover {
  background: rgba(201, 165, 92, 0.28);
}

/* ============== 站点网格 / 列表 ============== */
.site-grid {
  display: grid;
  gap: 0.75rem;
}
.site-grid--grid {
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .site-grid--grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .site-grid--grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 1280px) {
  .site-grid--grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.site-grid--list {
  grid-template-columns: 1fr;
}

/* ============== Footer ============== */
.site-footer {
  position: relative;
  margin-top: 4rem;
  padding: 3rem 1rem;
  border-top: 1px solid rgba(255, 77, 79, 0.2);
  text-align: center;
}
@media (min-width: 1024px) {
  .site-footer {
    padding: 3rem 2rem;
  }
}
.site-footer__inner {
  max-width: 800px;
  margin: 0 auto;
}

/* ============== 返回顶部按钮 ============== */
.back-to-top {
  position: fixed;
  bottom: calc(2rem + env(safe-area-inset-bottom));
  right: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--seal);
  color: var(--washi);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 40;
}
.back-to-top:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(255, 77, 79, 0.4);
  background: var(--seal-deep);
}
.back-to-top:active {
  transform: translateY(-2px);
}
@media (max-width: 640px) {
  .back-to-top {
    bottom: calc(5.5rem + env(safe-area-inset-bottom));
    right: 1rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ============== 离线状态提示 ============== */
.offline-banner {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(26, 20, 16, 0.95);
  color: var(--washi);
  border: 1px solid rgba(255, 77, 79, 0.3);
  border-radius: 4px;
  font-family: var(--kai);
  font-size: 0.875rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  z-index: 50;
  backdrop-filter: blur(8px);
}
.offline-banner svg {
  color: var(--seal);
  flex-shrink: 0;
}

/* ============== PWA 更新提示 ============== */
.update-banner {
  position: fixed;
  bottom: calc(5.5rem + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: rgba(26, 20, 16, 0.95);
  color: var(--washi);
  border: 1px solid rgba(201, 165, 92, 0.4);
  border-radius: 4px;
  font-family: var(--kai);
  font-size: 0.875rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  z-index: 50;
  backdrop-filter: blur(8px);
}
.update-banner__btn {
  font-family: var(--serif);
  font-size: 0.8rem;
  padding: 0.35rem 0.75rem;
  background: #c9a55c;
  color: #1a1410;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.2s;
}
.update-banner__btn:hover {
  background: #ff4d4f;
  color: #f3ece0;
}
</style>
