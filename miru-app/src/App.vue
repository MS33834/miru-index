<script setup>
import { ref, shallowRef, computed, onMounted, onUnmounted, watch } from 'vue'
import { categories } from './data/nav.js'
import SiteModal from './components/SiteModal.vue'
import SidebarNav from './components/SidebarNav.vue'
import SiteCard from './components/SiteCard.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import { isOffline } from './main.js'
import { APP_CONFIG } from './config/constants.js'
import { useScrollPosition } from './composables/useScrollPosition.js'
import { paginate, totalPages } from './utils/paginate.js'
import { clearHighlightCache } from './utils/highlight.js'

const PAGE_SIZE = 24 // 每页 24 项，避免一次性渲染过多 DOM

const searchQuery = ref('')
const activeCategory = ref('all')
const modalItem = ref(null)
const modalCategory = ref(null)
const drawerOpen = ref(false)
const currentPage = ref(1)

// 侧边栏折叠状态持久化到 localStorage
const SIDEBAR_KEY = 'miru-sidebar-collapsed'
const sidebarCollapsed = ref(localStorage.getItem(SIDEBAR_KEY) === 'true')
const loaded = ref(false)

// shallowRef 避免大数据量深度响应式化
const allItems = shallowRef(
  categories.flatMap(c => c.items.map(i => ({ ...i, _category: c })))
)

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const list = activeCategory.value === 'all'
    ? allItems.value
    : allItems.value.filter(i => i._category.id === activeCategory.value)
  if (!q) return list
  return list.filter(i =>
    i.name.toLowerCase().includes(q) ||
    (i.desc || '').toLowerCase().includes(q) ||
    (i._category.name || '').toLowerCase().includes(q) ||
    (i.tags || []).some(t => t.toLowerCase().includes(q))
  )
})

const totalCount = computed(() => allItems.value.length)
const filteredCount = computed(() => filteredItems.value.length)
const totalPageCount = computed(() => totalPages(filteredItems.value.length, PAGE_SIZE))

// 当前页数据（分页）
const paginatedItems = computed(() => {
  if (activeCategory.value !== 'all') return filteredItems.value // 单分类不分页
  return paginate(filteredItems.value, currentPage.value, PAGE_SIZE)
})

const currentCategory = computed(() => {
  if (activeCategory.value === 'all') return null
  return categories.find(c => c.id === activeCategory.value)
})

// 从配置导入
const { VOLUMES, CHINESE_NUMS, UI } = APP_CONFIG

// 使用滚动位置 composable
const { showBackToTop } = useScrollPosition({ threshold: UI.BACK_TO_TOP_THRESHOLD })

// 监听侧边栏折叠状态变化并持久化
watch(sidebarCollapsed, (val) => {
  try { localStorage.setItem(SIDEBAR_KEY, String(val)) } catch {}
})

// 切换搜索/分类时重置分页 + 清理高亮缓存
watch([searchQuery, activeCategory], () => {
  currentPage.value = 1
  clearHighlightCache()
})

// "全部"模式时按卷分组 - 性能优化：避免重复 filter
const groupedByVolume = computed(() => {
  if (activeCategory.value !== 'all') return null
  const items = paginatedItems.value
  if (activeCategory.value !== 'all' || !items.length) return []

  return VOLUMES.map((v, vi) => {
    // 预处理: 把卷内 catIds 解析为分类引用 + 仅保留有可见项的分类
    const visibleCats = v.catIds
      .map(id => categories.find(c => c.id === id))
      .filter(c => c && c.items.length)

    // 按 catId 分组 items
    const groupsByCatId = new Map()
    for (const item of items) {
      if (v.catIds.includes(item._category.id)) {
        if (!groupsByCatId.has(item._category.id)) {
          groupsByCatId.set(item._category.id, [])
        }
        groupsByCatId.get(item._category.id).push(item)
      }
    }

    const cats = visibleCats
      .map(c => ({ ...c, items: groupsByCatId.get(c.id) || [] }))
      .filter(c => c.items.length)

    return {
      ...v,
      cats,
      chapterNum: CHINESE_NUMS[vi + 1] || String(vi + 1),
      items: cats.flatMap(c => c.items)
    }
  }).filter(g => g.items.length > 0)
})

// 单个分类模式：扁平
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
function selectCategory(id) {
  activeCategory.value = id
  drawerOpen.value = false
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
function onSearch(q) {
  searchQuery.value = q
}
function clearSearch() {
  searchQuery.value = ''
  clearHighlightCache()
}
function nextPage() {
  if (currentPage.value < totalPageCount.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 返回顶部
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 抽屉焦点陷阱 + Escape 关闭
const drawerPanelRef = ref(null)

function handleDrawerKeydown(e) {
  if (e.key === 'Escape') {
    drawerOpen.value = false
    return
  }
  if (e.key !== 'Tab' || !drawerPanelRef.value) return
  const focusable = drawerPanelRef.value.querySelectorAll(
    'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
  )
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus()
  }
}

// 键盘快捷键
function handleKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    const searchInput = document.querySelector('.scroll-input')
    if (searchInput) searchInput.focus()
  }
  if (e.key === 'Escape' && modalItem.value) {
    closeModal()
  }
}

onMounted(() => {
  setTimeout(() => (loaded.value = true), 80)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// 动态更新页面标题
watch([activeCategory, searchQuery], () => {
  if (searchQuery.value) {
    document.title = `搜索: ${searchQuery.value} - 漫藏阁`
  } else if (activeCategory.value !== 'all') {
    const cat = categories.find(c => c.id === activeCategory.value)
    document.title = `${cat?.name || ''} - 漫藏阁`
  } else {
    document.title = '漫藏阁 - ACGN 资源导航'
  }
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
        @select="selectCategory"
        @search="onSearch"
        @toggle="sidebarCollapsed = !sidebarCollapsed"
      />
    </div>

    <!-- =================== 顶栏（平板/手机） =================== -->
    <header class="mobile-topbar lg:hidden">
      <div class="flex items-center gap-2">
        <button
          @click="drawerOpen = true"
          class="w-10 h-10 flex items-center justify-center text-[#f3ece0] hover:bg-[#d92020]/10 rounded-sm"
          aria-label="打开目录"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div class="hanko h-7 w-7 text-[11px]">漫</div>
        <div class="font-serif-cn font-bold text-[#f3ece0] text-sm tracking-wider">MIRU INDEX</div>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="hanko text-[9px] px-1.5 py-0.5">第{{ VOLUMES.length }}卷</div>
        <div class="hanko text-[9px] px-1.5 py-0.5" style="background: #1a1410; color: #c9a55c; box-shadow: inset 0 0 0 1px rgba(201, 165, 92, 0.4);">{{ totalCount }}</div>
      </div>
    </header>

    <!-- =================== 抽屉（平板/手机） =================== -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="drawerOpen" class="drawer-mask" @click="drawerOpen = false" @keydown="handleDrawerKeydown">
          <div ref="drawerPanelRef" class="drawer-panel" @click.stop role="dialog" aria-modal="true" aria-label="导航目录">
            <SidebarNav
              :active-category="activeCategory"
              :search-query="searchQuery"
              :collapsed="false"
              @select="selectCategory"
              @search="onSearch"
              @toggle="drawerOpen = false"
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
              一座属于 <span class="text-[#f3ece0] font-bold">ACGN</span> 的<span class="text-[#d92020] font-bold">印经阁</span>。
              精选 <span class="text-[#c9a55c] font-serif-cn text-lg mx-1">{{ totalCount }}</span> 站 · 分 <span class="text-[#c9a55c] font-serif-cn text-lg mx-1">{{ categories.length }}</span> 卷 · 涵盖漫画 · 番剧 · GalGame · 轻小说 · AI · GitHub 开源 · 网络工具……
            </p>

            <!-- 简化的标签 -->
            <div class="flex flex-wrap gap-2">
              <div class="hanko px-3 py-1.5 text-sm">朱泥 · ACGN</div>
              <div class="hanko px-3 py-1.5 text-sm" style="background: #1a1410; color: #c9a55c;">御金 · {{ totalCount }}</div>
              <div class="hanko px-3 py-1.5 text-sm" style="background: #0a0a0a; color: #f3ece0;">墨 · {{ VOLUMES.length }}卷</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 面包屑 -->
      <div v-if="!searchQuery" class="breadcrumb">
        <button @click="selectCategory('all')" class="breadcrumb__item" :class="{ 'is-current': activeCategory === 'all' }">
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
            <div class="font-kai-cn text-[#c4bba8] text-sm mt-1">得 <span class="text-[#c9a55c] font-serif-cn text-lg mx-1">{{ filteredCount }}</span> 条结果</div>
          </div>
          <button
            type="button"
            @click="clearSearch"
            class="search-clear-btn"
            aria-label="清空搜索"
          >
            <span>清空</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 主体：分卷 OR 单一分类 -->
      <div v-if="groupedByVolume" class="volumes">
        <article
          v-for="(vol, vi) in groupedByVolume"
          :key="vol.id"
          class="volume content-auto"
        >
          <!-- 卷首 -->
          <header class="volume__header">
            <div class="flex items-end gap-4 sm:gap-6 mb-3 sm:mb-4">
              <div class="volume-num font-serif-cn">{{ vol.chapterNum }}</div>
              <div class="flex-1 pb-1">
                <div class="chapter-num text-[#8a7a68] mb-1">CHAPTER · {{ String(vi + 1).padStart(2, '0') }} / {{ String(groupedByVolume.length).padStart(2, '0') }}</div>
                <h2 class="font-serif-cn text-2xl sm:text-3xl text-[#f3ece0] font-bold tracking-wide">
                  <span class="text-[#d92020] mr-2">卷</span>{{ vol.name.replace('卷', '') }} · {{ vol.title }}
                </h2>
                <div class="mt-1.5 text-[#c9a55c] font-mono text-[10px] tracking-[0.2em]">{{ vol.sub }} · {{ vol.items.length }} 帖</div>
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
                <h3 class="font-serif-cn text-base sm:text-lg font-bold text-[#f3ece0] tracking-wider">{{ cat.name }}</h3>
                <span class="ink-bar flex-1 min-w-[40px]"></span>
                <button @click="selectCategory(cat.id)" class="subgroup__more">全卷 →</button>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                <SiteCard
                  v-for="(item, idx) in cat.items"
                  :key="item.name + (item.url || '')"
                  :item="item"
                  :category="cat"
                  :index="idx"
                  :compact="true"
                  :search-query="searchQuery"
                  @open="openModal"
                />
              </div>
            </div>
          </div>
        </article>
      </div>

      <div v-else-if="singleCategory" class="single-cat">
        <article
          v-for="(group, gi) in singleCategory"
          :key="group.id"
          class="content-auto"
        >
          <header class="volume__header">
            <div class="flex items-end gap-4 sm:gap-6 mb-3 sm:mb-4">
              <div class="volume-num font-serif-cn">{{ CHINESE_NUMS[gi + 1] || '壹' }}</div>
              <div class="flex-1 pb-1">
                <div class="chapter-num text-[#8a7a68] mb-1">CHAPTER · {{ String(gi + 1).padStart(2, '0') }}</div>
                <h2 class="font-serif-cn text-2xl sm:text-3xl text-[#f3ece0] font-bold tracking-wide">
                  <span class="text-[#d92020] mr-2">{{ group.icon }}</span>{{ group.name }}
                </h2>
                <div class="mt-1.5 text-[#8a7a68] font-mono text-[10px] tracking-[0.2em]">{{ group.items.length }} 帖 · 共 {{ group.items.length }} 卷</div>
              </div>
              <div class="hidden sm:flex items-center gap-2 pb-1">
                <div class="hanko text-xs px-2.5 py-1 stamp-anim">全卷</div>
              </div>
            </div>
            <div class="scroll-divider">
              <span class="ornament">❀</span>
            </div>
          </header>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                <SiteCard
                  v-for="(item, idx) in group.items"
                  :key="item.name + (item.url || '')"
                  :item="item"
                  :category="group"
                  :index="idx"
                  :search-query="searchQuery"
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
          @click="prevPage"
          :disabled="currentPage === 1"
          class="pagination__btn"
          aria-label="上一页"
        >
          ← 前一页
        </button>
        <div class="pagination__info">
          <span class="font-serif-cn text-[#c9a55c]">{{ currentPage }}</span>
          <span class="text-[#5a4a3a]">/</span>
          <span>{{ totalPageCount }}</span>
        </div>
        <button
          type="button"
          @click="nextPage"
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
          凡收录之站，皆经编者亲手验证<br>
          然网络无常，若有失效，请以宽容待之
        </p>
        <div class="mt-6 font-mono text-[10px] text-[#5a4a3a] tracking-[0.3em]">
          © 2026 · MIRU INDEX · CC BY-SA 4.0
        </div>
      </div>
    </footer>

    <SiteModal
      v-if="modalItem"
      :item="modalItem"
      :category="modalCategory"
      @close="closeModal"
    />

    <!-- =================== 返回顶部按钮 =================== -->
    <Transition name="fade">
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="back-to-top"
        aria-label="返回顶部"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </Transition>

    <!-- =================== 离线状态提示 =================== -->
    <Transition name="fade">
      <div v-if="isOffline" class="offline-banner" role="alert" aria-live="polite">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
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
  .sidebar-shell { grid-row: 1 / 3; grid-column: 1; }
  .mobile-topbar { display: none !important; }
  .main { grid-row: 1; grid-column: 2; }
  .site-footer { grid-row: 2; grid-column: 2; }
}

/* ============== 侧边栏外壳 ============== */
.sidebar-shell {
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 30;
  border-right: 1px solid rgba(217, 32, 32, 0.15);
  transition: all 0.3s;
  width: 280px;
}
.sidebar-shell.is-collapsed { width: 64px; }

/* ============== 顶栏（移动/平板） ============== */
.mobile-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(10, 10, 10, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(217, 32, 32, 0.15);
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
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.3s; }
.drawer-enter-active .drawer-panel, .drawer-leave-active .drawer-panel { transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
.drawer-enter-from { opacity: 0; }
.drawer-enter-from .drawer-panel { transform: translateX(-100%); }
.drawer-leave-to { opacity: 0; }
.drawer-leave-to .drawer-panel { transform: translateX(-100%); }

/* ============== 主区 ============== */
.main {
  position: relative;
  padding: 1.5rem 1rem 3rem;
  min-width: 0;
}
@media (min-width: 640px) { .main { padding: 2rem 2rem 4rem; } }
@media (min-width: 1024px) { .main { padding: 3rem 3rem 5rem; } }

/* ============== Hero ============== */
.hero {
  padding: 4rem 1.5rem 3rem;
  position: relative;
}
@media (min-width: 640px) { .hero { padding: 6rem 2rem 4rem; } }
@media (min-width: 1024px) { .hero { padding: 8rem 3rem 5rem; } }

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

/* ============== 卷册标题 ============== */
.volume__header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(217, 32, 32, 0.15);
}

.volume__title {
  font-family: var(--serif);
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--washi);
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.volume__subtitle {
  font-family: var(--mono);
  font-size: 0.75rem;
  color: #8a7a68;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

/* ============== 分类标题 ============== */
.subgroup__head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(201, 165, 92, 0.2);
}

.subgroup__title {
  font-family: var(--serif);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--washi);
  letter-spacing: 0.02em;
}

.subgroup__count {
  font-family: var(--mono);
  font-size: 0.75rem;
  color: #8a7a68;
  letter-spacing: 0.1em;
}

/* ============== 面包屑 ============== */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0 1.25rem;
  border-bottom: 1px dashed rgba(217, 32, 32, 0.15);
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
.breadcrumb__item:not(.is-current):hover { color: #f3ece0; background: rgba(201, 165, 92, 0.1); }
.breadcrumb__item.is-current { color: #d92020; font-weight: 700; }
.breadcrumb__sep { color: #5a4a3a; font-family: var(--mono); font-size: 0.85rem; }
.breadcrumb__count {
  margin-left: auto;
  font-family: var(--kai);
  font-size: 0.8rem;
  color: #8a7a68;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.breadcrumb__count .font-mono { color: #c9a55c; font-weight: 700; }

/* ============== 搜索结果条 ============== */
.search-result {
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  background: rgba(217, 32, 32, 0.05);
  border-left: 3px solid #d92020;
  border-radius: 0 4px 4px 0;
}

/* ============== 卷 ============== */
.volumes { display: flex; flex-direction: column; gap: 4rem; }
.volume__header { margin-bottom: 1.5rem; }
.subgroup { margin-top: 2rem; }
.subgroup__head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(217, 32, 32, 0.1);
}
.subgroup__icon { font-size: 1.1rem; }
.subgroup__more {
  font-family: var(--serif);
  font-size: 0.75rem;
  color: #c9a55c;
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  transition: all 0.2s;
  white-space: nowrap;
}
.subgroup__more:hover { color: #d92020; background: rgba(217, 32, 32, 0.1); padding-left: 0.7rem; }

.empty { text-align: center; padding: 4rem 0; }

/* ============== Footer ============== */
.site-footer {
  position: relative;
  margin-top: 4rem;
  padding: 3rem 1rem;
  border-top: 1px solid rgba(217, 32, 32, 0.2);
  text-align: center;
}
@media (min-width: 1024px) { .site-footer { padding: 3rem 2rem; } }
.site-footer__inner { max-width: 800px; margin: 0 auto; }

/* ============== 返回顶部按钮 ============== */
.back-to-top {
  position: fixed;
  bottom: calc(2rem + env(safe-area-inset-bottom));
  right: 2rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--seal);
  color: var(--washi);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(217, 32, 32, 0.3);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 40;
}
.back-to-top:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(217, 32, 32, 0.4);
  background: var(--seal-deep);
}
.back-to-top:active {
  transform: translateY(-2px);
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
  border: 1px solid rgba(217, 32, 32, 0.3);
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
</style>
