<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { categories } from './data/nav.js'
import SiteModal from './components/SiteModal.vue'
import SidebarNav from './components/SidebarNav.vue'
import SiteCard from './components/SiteCard.vue'
import { isOffline } from './main.js'
import { APP_CONFIG } from './config/constants.js'
import { useScrollPosition } from './composables/useScrollPosition.js'

const searchQuery = ref('')
const activeCategory = ref('all')
const modalItem = ref(null)
const modalCategory = ref(null)
const drawerOpen = ref(false)
const sidebarCollapsed = ref(false)
const loaded = ref(false)

// 从配置导入
const { VOLUMES, CHINESE_NUMS, UI } = APP_CONFIG

// 使用滚动位置 composable
const { showBackToTop } = useScrollPosition({ threshold: UI.BACK_TO_TOP_THRESHOLD })

const allItems = computed(() =>
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

const currentCategory = computed(() => {
  if (activeCategory.value === 'all') return null
  return categories.find(c => c.id === activeCategory.value)
})

// "全部"模式时按卷分组
const groupedByVolume = computed(() => {
  if (activeCategory.value !== 'all') return null
  return VOLUMES.map((v, vi) => {
    // 预处理: 把卷内 catIds 解析为分类引用 + 仅保留有可见项的分类
    const cats = v.catIds
      .map(id => categories.find(c => c.id === id))
      .filter(Boolean)
    const visibleCatIds = new Set(cats.filter(c => c.items.length).map(c => c.id))
    const items = filteredItems.value.filter(i => visibleCatIds.has(i._category.id))
    return {
      ...v,
      cats: cats.filter(c => visibleCatIds.has(c.id)),
      chapterNum: CHINESE_NUMS[vi + 1] || String(vi + 1),
      items,
    }
  }).filter(g => g.items.length > 0)
})

// 单个分类模式：扁平
const singleCategory = computed(() => {
  if (activeCategory.value === 'all') return null
  const cat = currentCategory.value
  if (!cat) return null
  return [{ ...cat, items: filteredItems.value }]
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
  // 滚回主区顶部
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
function onSearch(q) {
  searchQuery.value = q
}

// 返回顶部
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 键盘快捷键
function handleKeydown(e) {
  // Ctrl/Cmd + K 聚焦搜索
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    const searchInput = document.querySelector('.scroll-input')
    if (searchInput) searchInput.focus()
  }
  // Escape 关闭模态框
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
        <div v-if="drawerOpen" class="drawer-mask" @click="drawerOpen = false">
          <div class="drawer-panel" @click.stop>
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
          <div class="flex items-center justify-between mb-10">
            <div class="flex items-center gap-3">
              <div class="hanko h-10 w-10 text-base stamp-anim">漫</div>
              <div>
                <div class="font-serif-cn text-[#f3ece0] text-lg font-bold leading-none tracking-wider">MIRU INDEX</div>
                <div class="font-mono text-[#8a7a68] text-[10px] tracking-[0.3em] mt-1">EST · 2026 · ACGN</div>
              </div>
            </div>
            <div class="hidden sm:flex items-center gap-2 font-mono text-[10px] text-[#8a7a68] tracking-[0.3em]">
              <span class="ink-bar w-12"></span>
              <span>VOL · 壹</span>
            </div>
          </div>

          <div class="relative">
            <div aria-hidden="true" class="absolute -top-6 -left-2 sm:-left-4 kanji-num font-serif-cn select-none pointer-events-none" data-num="藏">藏</div>

            <h1 class="relative">
              <span class="hero-kanji ink-spread inline-block" style="animation-delay: 0.1s">漫藏</span>
              <span class="hero-kanji ink-spread inline-block ml-2 sm:ml-4" style="animation-delay: 0.25s; -webkit-text-fill-color: rgba(217, 32, 32, 0.85); background: none;">藏經閣</span>
            </h1>

            <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6">
              <div class="chapter-num">— MIRU · INDEX · 漫 — 藏 — 阁 —</div>
            </div>

            <p class="mt-5 sm:mt-7 max-w-2xl text-[#c4bba8] text-[15px] sm:text-base leading-[1.9] font-kai-cn">
              一座属于 <span class="text-[#f3ece0]">ACGN</span> 的<span class="text-[#d92020]">印经阁</span>。
              精选 <span class="text-[#c9a55c] font-serif-cn text-lg mx-1">{{ totalCount }}</span> 站 · 分 <span class="text-[#c9a55c] font-serif-cn text-lg mx-1">{{ categories.length }}</span> 卷 · <span class="text-[#c9a55c] font-serif-cn text-lg mx-1">{{ VOLUMES.length }}</span> 册 · 涵盖漫画 · 番剧 · GalGame · 轻小说 · AI · GitHub 开源 · 网络工具……凡诸次元之美，尽藏于此。
            </p>

            <div class="mt-7 flex flex-wrap gap-3">
              <div class="hanko px-3 py-1.5 text-sm">朱泥 · ACGN</div>
              <div class="hanko px-3 py-1.5 text-sm" style="background: #1a1410; color: #c9a55c; box-shadow: inset 0 0 0 1px rgba(201, 165, 92, 0.4);">御金 · {{ totalCount }}</div>
              <div class="hanko px-3 py-1.5 text-sm" style="background: #0a0a0a; color: #f3ece0; box-shadow: inset 0 0 0 1px rgba(243, 236, 224, 0.3);">墨 · {{ VOLUMES.length }}卷</div>
            </div>
          </div>

          <svg class="absolute top-32 right-8 w-24 h-24 opacity-30 hidden xl:block" viewBox="0 0 100 100" fill="none">
            <path d="M10 50 Q 30 10, 50 50 T 90 50" stroke="#d92020" stroke-width="3" stroke-linecap="round" class="brush-stroke" fill="none"/>
            <circle cx="85" cy="20" r="3" fill="#c9a55c"/>
          </svg>
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
        <div class="font-mono text-[10px] tracking-[0.3em] text-[#c9a55c]">▎索 · 寻 「{{ searchQuery }}」</div>
        <div class="font-kai-cn text-[#c4bba8] text-sm mt-1">得 <span class="text-[#c9a55c] font-serif-cn text-lg mx-1">{{ filteredCount }}</span> 条结果</div>
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
              <div class="relative">
                <div class="kanji-num font-serif-cn" data-num="壹">{{ vol.chapterNum }}</div>
              </div>
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
              <div class="relative">
                <div class="kanji-num font-serif-cn" data-num="壹">{{ CHINESE_NUMS[gi + 1] || '壹' }}</div>
              </div>
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </Transition>

    <!-- =================== 离线状态提示 =================== -->
    <Transition name="fade">
      <div v-if="isOffline" class="offline-banner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
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
.hero { padding-bottom: 2rem; }
.hero__inner { position: relative; }

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
  bottom: 2rem;
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
