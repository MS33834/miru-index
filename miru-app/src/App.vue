<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { categories } from './data/nav.js'
import SiteModal from './components/SiteModal.vue'
import SidebarNav from './components/SidebarNav.vue'

const searchQuery = ref('')
const activeCategory = ref('all')
const modalItem = ref(null)
const modalCategory = ref(null)
const drawerOpen = ref(false)
const sidebarCollapsed = ref(false)
const loaded = ref(false)

const CHINESE_NUMS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾', '拾壹', '拾贰', '拾叁', '拾肆', '拾伍', '拾陆', '拾柒', '拾捌', '拾玖', '贰拾', '贰拾壹', '贰拾贰', '贰拾叁', '贰拾肆', '贰拾伍', '贰拾陆']

// 把 26 个分类按主题分成 6 卷
const VOLUMES = [
  { id: 'v1', name: '卷壹', title: '網絡工具', sub: 'Network · Tools', catIds: ['proxy', 'downloader', 'archive', 'imagesearch'] },
  { id: 'v2', name: '卷贰', title: 'AI 工坊', sub: 'AI · Workshop', catIds: ['ai', 'imgai'] },
  { id: 'v3', name: '卷叁', title: 'ACG 主场', sub: 'ACGN · Main', catIds: ['manga', 'manga_app', 'anime_site', 'anime_app', 'galgame_res', 'novel', 'library'] },
  { id: 'v4', name: '卷肆', title: '社区 · 资讯', sub: 'Community · News', catIds: ['news', 'community', 'galgame_news'] },
  { id: 'v5', name: '卷伍', title: '视听娱乐', sub: 'Audio · Visual', catIds: ['music', 'draw', 'video', 'sticker'] },
  { id: 'v6', name: '卷陆', title: '周边 · 聚合', sub: 'Figure · Aggregator', catIds: ['figure', 'agg', 'github'] },
  { id: 'v7', name: '卷柒', title: '资源 · 工具', sub: 'Resources · Tools', catIds: ['font', 'wallpaper', 'imghost', 'illust', 'subgroup', 'game', 'nav'] },
]

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
    const items = filteredItems.value.filter(i => v.catIds.includes(i._category.id))
    return { ...v, chapterNum: CHINESE_NUMS[vi + 1] || String(vi + 1), items }
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
function onCardKeydown(e, item, category) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    openModal(item, category)
  }
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

onMounted(() => {
  setTimeout(() => (loaded.value = true), 80)
})
</script>

<template>
  <div class="layout">
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
    <main class="main">
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
            <div
              v-for="catId in vol.catIds"
              :key="catId"
              v-show="categories.find(c => c.id === catId)?.items.some(i => filteredItems.some(fi => fi.url === i.url))"
            >
              <template v-if="categories.find(c => c.id === catId)">
                <div
                  v-for="cat in [categories.find(c => c.id === catId)]"
                  :key="cat.id"
                >
                  <div
                    v-if="filteredItems.some(i => i._category.id === cat.id)"
                    class="subgroup"
                  >
                    <div class="subgroup__head">
                      <span class="subgroup__icon">{{ cat.icon }}</span>
                      <h3 class="font-serif-cn text-base sm:text-lg font-bold text-[#f3ece0] tracking-wider">{{ cat.name }}</h3>
                      <span class="ink-bar flex-1 min-w-[40px]"></span>
                      <button @click="selectCategory(cat.id)" class="subgroup__more">全卷 →</button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                      <button
                        v-for="(item, idx) in filteredItems.filter(i => i._category.id === cat.id)"
                        :key="item.name + (item.url || '')"
                        @click="openModal(item, cat)"
                        @keydown="onCardKeydown($event, item, cat)"
                        class="card-paper text-left p-3.5 sm:p-4 card-rise focus:outline-none focus:ring-2 focus:ring-[#d92020] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                        :style="{ animationDelay: (0.04 * idx) + 's' }"
                        :aria-label="`${item.name} — ${item.desc || ''}`"
                      >
                        <div class="flex items-start justify-between gap-2 mb-2">
                          <h4 class="font-serif-cn text-base sm:text-lg font-bold text-[#1a1410] leading-tight line-clamp-1 flex-1">
                            {{ item.name }}
                          </h4>
                          <div class="hanko-circle w-7 h-7 text-[10px] shrink-0 stamp-anim" :style="{ animationDelay: (0.05 * idx) + 's' }">藏</div>
                        </div>
                        <p v-if="item.desc" class="font-kai-cn text-[#3a2e22] text-[12.5px] sm:text-[13px] leading-relaxed line-clamp-2 mb-2">
                          {{ item.desc }}
                        </p>
                        <div v-if="item.tags?.length" class="flex flex-wrap gap-1 mb-2">
                          <span
                            v-for="t in item.tags.slice(0, 2)"
                            :key="t"
                            class="tag-stamp"
                            style="background: rgba(168, 22, 26, 0.08); border-color: rgba(168, 22, 26, 0.3); color: #a8161a; font-size: 0.65rem; padding: 0.1rem 0.4rem;"
                          >#{{ t }}</span>
                          <span
                            v-if="item.tags.length > 2"
                            class="tag-stamp"
                            style="background: rgba(201, 165, 92, 0.1); border-color: rgba(201, 165, 92, 0.3); color: #a4853e; font-size: 0.65rem; padding: 0.1rem 0.4rem;"
                          >+{{ item.tags.length - 2 }}</span>
                        </div>
                        <div class="flex items-center justify-between pt-1.5 border-t border-[#1a1410]/10">
                          <div class="font-mono text-[9px] text-[#5a4a3a] tracking-wider line-clamp-1 flex-1">
                            {{ item.proxy ? '◯ 需梯子' : '◯ 直连' }}
                          </div>
                          <div class="text-[#a8161a] text-[11px] font-serif-cn tracking-wider">覌 →</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </template>
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
            <button
              v-for="(item, idx) in group.items"
              :key="item.name + (item.url || '')"
              @click="openModal(item, group)"
              @keydown="onCardKeydown($event, item, group)"
              class="card-paper text-left p-4 sm:p-5 card-rise focus:outline-none focus:ring-2 focus:ring-[#d92020] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
              :style="{ animationDelay: (0.04 * idx) + 's' }"
              :aria-label="`${item.name} — ${item.desc || ''}`"
            >
              <div class="flex items-start justify-between gap-2 mb-3">
                <h3 class="font-serif-cn text-lg sm:text-xl font-bold text-[#1a1410] leading-tight line-clamp-1 flex-1">
                  {{ item.name }}
                </h3>
                <div class="hanko-circle w-9 h-9 text-xs shrink-0 stamp-anim" :style="{ animationDelay: (0.05 * idx) + 's' }">藏</div>
              </div>
              <p v-if="item.desc" class="font-kai-cn text-[#3a2e22] text-[13px] sm:text-sm leading-relaxed line-clamp-2 mb-3">
                {{ item.desc }}
              </p>
              <div v-if="item.tags?.length" class="flex flex-wrap gap-1.5 mb-3">
                <span
                  v-for="t in item.tags.slice(0, 3)"
                  :key="t"
                  class="tag-stamp"
                  style="background: rgba(168, 22, 26, 0.08); border-color: rgba(168, 22, 26, 0.3); color: #a8161a;"
                >#{{ t }}</span>
                <span
                  v-if="item.tags.length > 3"
                  class="tag-stamp"
                  style="background: rgba(201, 165, 92, 0.1); border-color: rgba(201, 165, 92, 0.3); color: #a4853e;"
                >+{{ item.tags.length - 3 }}</span>
              </div>
              <div class="flex items-center justify-between pt-2 border-t border-[#1a1410]/10">
                <div class="font-mono text-[10px] text-[#5a4a3a] tracking-wider line-clamp-1 flex-1">
                  {{ item.proxy ? '◯ 需梯子' : '◯ 直连' }}
                </div>
                <div class="text-[#a8161a] text-xs font-serif-cn tracking-wider">覌 →</div>
              </div>
            </button>
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
</style>
