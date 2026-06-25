<script setup>
import { ref, computed, watch, inject } from 'vue'
import { categories } from '../data/nav.js'
import { useDebounce } from '../composables/useDebounce.js'
import { useRecentSearches } from '../composables/useRecentSearches.js'
import { useAppState } from '../composables/useAppState.js'
import { APP_CONFIG } from '../config/constants.js'

// I18n — injected from App.vue
const i18n = inject('i18n', null)
const t = (path, ...args) => i18n?.t(path, args) ?? path
const tc = (catId, fallback) => i18n?.tc(catId, fallback) ?? (fallback || catId)

const props = defineProps({
  activeCategory: { type: String, required: true },
  searchQuery: { type: String, default: '' },
  collapsed: { type: Boolean, default: false },
  selectedTags: { type: Set, default: () => new Set() },
  proxyFilter: { type: String, default: 'all' },
  showFavoritesOnly: { type: Boolean, default: false },
  favoritesCount: { type: Number, default: 0 },
})
const emit = defineEmits([
  'select',
  'search',
  'toggle',
  'search-focus',
  'toggle-tag',
  'set-proxy-filter',
  'toggle-favorites-only',
])

const allCount = computed(() => categories.reduce((a, c) => a + c.items.length, 0))
const showFilters = ref(true)
const showTags = ref(false)

const { recentSearches, add: addRecent, clear: clearRecent } = useRecentSearches()

// 复用 useAppState 模块级单例的 allTags，避免重复遍历全部 items
const { allTags } = useAppState()
const topTags = computed(() => allTags.value.slice(0, APP_CONFIG.UI.TOP_TAGS_COUNT))

// 使用防抖 composable
const { debouncedValue, setDebouncedValue } = useDebounce(APP_CONFIG.UI.SEARCH_DEBOUNCE_DELAY)
const localSearchQuery = ref(props.searchQuery)

function commitSearch(value) {
  addRecent(value)
  emit('search', value)
}

function handleSearchInput(e) {
  const value = e.target.value
  localSearchQuery.value = value
  setDebouncedValue(value)
}

function handleSearchKeydown(e) {
  if (e.key === 'Enter') {
    commitSearch(localSearchQuery.value)
  }
}

// 监听防抖后的值并触发搜索（不重复记录）
watch(debouncedValue, (newVal) => {
  emit('search', newVal)
})

watch(
  () => props.searchQuery,
  (newVal) => {
    localSearchQuery.value = newVal
    // 外部清空/同步搜索词时立即同步防抖值，避免旧定时器在清空后再次触发搜索
    setDebouncedValue(newVal, true)
  }
)
</script>

<template>
  <aside data-testid="sidebar-nav" class="sidebar h-full flex flex-col" :class="collapsed ? 'sidebar--collapsed' : ''">
    <!-- 头部：标题 + 折叠 -->
    <div class="px-4 pt-5 pb-4 border-b border-[#ff4d4f]/15">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2.5">
          <div class="hanko h-8 w-8 text-[13px] shrink-0">藏</div>
          <div v-if="!collapsed" class="min-w-0">
            <div class="font-serif-cn text-sm font-bold text-[#f3ece0] tracking-wider leading-none">MIRU</div>
            <div class="font-mono text-[9px] text-[#8a7a68] tracking-[0.25em] mt-0.5">INDEX</div>
          </div>
        </div>
        <button
          v-if="collapsed"
          type="button"
          @click="emit('search-focus')"
          class="w-8 h-8 rounded-sm flex items-center justify-center text-[#8a7a68] hover:text-[#ff4d4f] hover:bg-[#ff4d4f]/10 transition shrink-0"
          :aria-label="t('sidebar.toggleSearch')"
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
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
        <button
          type="button"
          @click="emit('toggle')"
          class="w-8 h-8 rounded-sm flex items-center justify-center text-[#8a7a68] hover:text-[#ff4d4f] hover:bg-[#ff4d4f]/10 transition shrink-0"
          :aria-label="collapsed ? t('sidebar.toggleCollapse', [true]) : t('sidebar.toggleCollapse', [false])"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <polyline :points="collapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6'" />
          </svg>
        </button>
      </div>

      <!-- 语言切换 -->
      <div v-if="!collapsed && i18n" class="mt-2 flex items-center gap-1">
        <button
          v-for="loc in i18n.availableLocales"
          :key="loc"
          type="button"
          class="locale-btn"
          :class="{ 'is-active': i18n.locale.value === loc }"
          @click="i18n.locale.value = loc"
          :aria-label="`Switch to ${loc}`"
        >
          {{ i18n.localeLabel.value && i18n.locale.value === loc ? i18n.localeLabel.value : loc }}
        </button>
      </div>

      <!-- 搜索框 -->
      <div v-if="!collapsed" class="relative">
        <div class="flex items-center">
          <div class="hanko h-8 w-8 shrink-0 text-[10px]" style="border-radius: 2px 0 0 2px">搜</div>
          <input
            :value="localSearchQuery"
            @input="handleSearchInput"
            @keydown="handleSearchKeydown"
            type="search"
            :placeholder="t('search.placeholder')"
            class="scroll-input flex-1 px-3 py-1.5 text-[13px]"
            style="border-radius: 0 2px 2px 0"
            :aria-label="t('search.label')"
            data-testid="sidebar-search"
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
            spellcheck="false"
            inputmode="search"
            enterkeyhint="search"
          />
        </div>
      </div>

      <!-- 最近搜索 -->
      <div v-if="!collapsed && recentSearches.length > 0" class="mt-3">
        <div class="flex items-center justify-between mb-1.5">
          <span class="sidebar-section-title">{{ t('search.recentTitle') }}</span>
          <button type="button" class="sidebar-text-btn" @click="clearRecent">{{ t('search.clearRecent') }}</button>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="q in recentSearches"
            :key="q"
            type="button"
            class="recent-tag"
            @click="commitSearch(q)"
            :title="`搜索 ${q}`"
          >
            {{ q }}
          </button>
        </div>
      </div>
    </div>

    <!-- 目录树 -->
    <nav class="flex-1 overflow-y-auto py-2 scrollbar-thin">
      <!-- 全部 -->
      <button
        type="button"
        @click="emit('select', 'all')"
        :class="['sidebar-item', activeCategory === 'all' ? 'is-active' : '']"
        :title="collapsed ? t('sidebar.all') : ''"
        :aria-label="collapsed ? t('sidebar.all') : undefined"
        :aria-current="activeCategory === 'all' ? 'page' : undefined"
      >
        <div class="sidebar-item__lead">
          <span class="sidebar-item__icon" aria-hidden="true">⌘</span>
          <span v-if="!collapsed" class="sidebar-item__name">{{ t('sidebar.all') }}</span>
        </div>
        <div v-if="!collapsed" class="sidebar-item__trail">
          <span class="sidebar-item__count">{{ allCount }}</span>
        </div>
        <span v-if="activeCategory === 'all'" class="sidebar-item__indicator"></span>
      </button>

      <div v-if="!collapsed" class="sidebar-divider">
        <span class="ornament">· {{ t('sidebar.volumes') }} ·</span>
      </div>

      <!-- 快速过滤 -->
      <div v-if="!collapsed" class="filter-section">
        <button
          type="button"
          class="filter-section__title"
          @click="showFilters = !showFilters"
          :aria-expanded="showFilters"
          aria-controls="filter-panel-quick"
        >
          <span>{{ t('sidebar.quickFilter') }}</span>
          <span class="filter-section__chevron" :class="{ 'is-open': showFilters }" aria-hidden="true">▾</span>
        </button>
        <div v-if="showFilters" id="filter-panel-quick" class="filter-section__body">
          <button
            type="button"
            class="filter-section__chip"
            :class="{ 'is-active': showFavoritesOnly }"
            @click="emit('toggle-favorites-only')"
            :aria-pressed="showFavoritesOnly"
            data-testid="filter-favorites"
          >
            <span>{{ t('sidebar.favorites') }}</span>
            <span v-if="favoritesCount > 0" class="filter-section__count">{{ favoritesCount }}</span>
          </button>
          <button
            type="button"
            class="filter-section__chip"
            :class="{ 'is-active': proxyFilter === 'direct' }"
            @click="emit('set-proxy-filter', proxyFilter === 'direct' ? 'all' : 'direct')"
            :aria-pressed="proxyFilter === 'direct'"
            :aria-label="t('filter.direct')"
            data-testid="filter-direct"
          >
            <span>{{ t('sidebar.directOnly') }}</span>
          </button>
          <button
            type="button"
            class="filter-section__chip"
            :class="{ 'is-active': proxyFilter === 'proxy' }"
            @click="emit('set-proxy-filter', proxyFilter === 'proxy' ? 'all' : 'proxy')"
            :aria-pressed="proxyFilter === 'proxy'"
            :aria-label="t('filter.proxy')"
            data-testid="filter-proxy"
          >
            <span>{{ t('sidebar.proxyOnly') }}</span>
          </button>
        </div>
      </div>

      <!-- 标签云 -->
      <div v-if="!collapsed" class="filter-section">
        <button
          type="button"
          class="filter-section__title"
          @click="showTags = !showTags"
          :aria-expanded="showTags"
          aria-controls="filter-panel-tags"
          data-testid="tags-toggle"
        >
          <span>{{ t('sidebar.tagCloud') }}</span>
          <span class="filter-section__chevron" :class="{ 'is-open': showTags }" aria-hidden="true">▾</span>
        </button>
        <div v-if="showTags" id="filter-panel-tags" class="filter-section__body filter-section__body--tags">
          <button
            v-for="t in topTags"
            :key="t.name"
            type="button"
            class="filter-section__chip filter-section__chip--tag"
            :class="{ 'is-active': selectedTags.has(t.name) }"
            @click="emit('toggle-tag', t.name)"
            :aria-pressed="selectedTags.has(t.name)"
            :aria-label="`标签 ${t.name}，出现 ${t.count} 次`"
            data-testid="tag-chip"
          >
            <span>#{{ t.name }}</span>
            <span class="filter-section__count">{{ t.count }}</span>
          </button>
        </div>
      </div>

      <!-- 各分类：点击即切换分类，不再展开混淆的手风琴资源列表 -->
      <template v-for="c in categories" :key="c.id">
        <button
          v-if="c.items.length > 0"
          type="button"
          @click="emit('select', c.id)"
          :class="['sidebar-item', activeCategory === c.id ? 'is-active' : '']"
          :title="collapsed ? c.name : ''"
          :aria-label="collapsed ? c.name : undefined"
          :aria-current="activeCategory === c.id ? 'page' : undefined"
        >
          <div class="sidebar-item__lead">
            <span class="sidebar-item__icon" aria-hidden="true">{{ c.icon }}</span>
            <span v-if="!collapsed" class="sidebar-item__name">{{ c.name }}</span>
          </div>
          <div v-if="!collapsed" class="sidebar-item__trail">
            <span class="sidebar-item__count">{{ c.items.length }}</span>
          </div>
          <span v-if="activeCategory === c.id" class="sidebar-item__indicator"></span>
        </button>
      </template>
    </nav>

    <!-- 底部：统计 + 印章 -->
    <div v-if="!collapsed" class="px-4 py-4 border-t border-[#ff4d4f]/15">
      <div class="flex items-center gap-2 mb-2">
        <div class="ink-bar flex-1"></div>
      </div>
      <div class="font-mono text-[10px] text-[#8a7a68] tracking-[0.25em] mb-2">
        {{ t('sidebar.stats', [categories.length, allCount]) }}
      </div>
      <div class="flex items-center gap-2">
        <div class="hanko text-[10px] px-2 py-0.5">{{ t('sidebar.sealLeft') }}</div>
        <div
          class="hanko text-[10px] px-2 py-0.5"
          style="background: #1a1410; color: #c9a55c; box-shadow: inset 0 0 0 1px rgba(201, 165, 92, 0.4)"
        >
          {{ t('sidebar.sealRight') }}
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* === 侧边栏骨架 === */
.sidebar {
  background: linear-gradient(180deg, #0a0a0a 0%, #100806 100%);
  color: #f3ece0;
  position: relative;
  isolation: isolate;
}
.sidebar::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 0%, rgba(255, 77, 79, 0.03) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
}
.sidebar--collapsed {
  width: 64px;
}

/* === 目录项 === */
.sidebar-item {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.9rem;
  font-family: var(--serif);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #c4bba8;
  background: transparent;
  border: 0;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  text-align: left;
  border-left: 2px solid transparent;
}
.sidebar-item:hover {
  color: #f3ece0;
  background: rgba(201, 165, 92, 0.06);
  border-left-color: rgba(201, 165, 92, 0.3);
}
.sidebar-item.is-active {
  color: #f3ece0;
  background: linear-gradient(90deg, rgba(255, 77, 79, 0.18) 0%, rgba(255, 77, 79, 0.04) 100%);
  border-left-color: #ff4d4f;
}
.sidebar-item.is-active .sidebar-item__name {
  font-weight: 700;
  letter-spacing: 0.06em;
}
.sidebar-item__lead {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
  flex: 1;
}
.sidebar-item__icon {
  font-size: 16px;
  line-height: 1;
  width: 1.2em;
  text-align: center;
  flex-shrink: 0;
  filter: saturate(0.85);
}
.sidebar-item__name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sidebar-item__trail {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.sidebar-item__count {
  font-family: var(--mono);
  font-size: 10px;
  color: #c4bba8;
  background: rgba(243, 236, 224, 0.08);
  padding: 1px 5px;
  border-radius: 2px;
  min-width: 18px;
  text-align: center;
}
.sidebar-item.is-active .sidebar-item__count {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.15);
}
.sidebar-item__indicator {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 14px;
  background: #ff4d4f;
  border-radius: 1px;
  box-shadow: 0 0 8px rgba(255, 77, 79, 0.5);
}

/* 禁用态防御 */
.sidebar-item.is-disabled {
  opacity: 0.35;
  cursor: not-allowed;
  pointer-events: none;
}

/* 折叠态 */
.sidebar--collapsed .sidebar-item {
  padding: 0.55rem 0.6rem;
  justify-content: center;
}
.sidebar--collapsed .sidebar-item__trail,
.sidebar--collapsed .sidebar-item__indicator {
  display: none;
}

/* 分隔 */
.sidebar-divider {
  padding: 0.65rem 0.9rem 0.4rem;
  font-family: var(--mono);
  font-size: 10px;
  color: #8a7a68;
  letter-spacing: 0.25em;
  text-align: center;
}
.sidebar-divider .ornament {
  color: #c4bba8;
}

/* 滚动条 */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #2a1e16;
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #ff4d4f;
}
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #2a1e16 transparent;
}

/* 语言切换按钮 */
.locale-btn {
  font-family: var(--mono);
  font-size: 9px;
  padding: 3px 8px;
  border-radius: 2px;
  color: #8a7a68;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.1em;
}
.locale-btn:hover {
  color: #c4bba8;
  border-color: rgba(255, 77, 79, 0.2);
  background: rgba(255, 77, 79, 0.05);
}
.locale-btn.is-active {
  color: #ff4d4f;
  border-color: rgba(255, 77, 79, 0.4);
  background: rgba(255, 77, 79, 0.08);
}

/* 最近搜索 */
.sidebar-section-title {
  font-family: var(--mono);
  font-size: 9px;
  color: #8a7a68;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.sidebar-text-btn {
  font-family: var(--mono);
  font-size: 9px;
  color: #c9a55c;
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 0.1rem 0.3rem;
}
.sidebar-text-btn:hover {
  color: #ff4d4f;
}
.recent-tag {
  font-family: var(--kai);
  font-size: 11px;
  color: #c4bba8;
  background: rgba(243, 236, 224, 0.05);
  border: 1px solid rgba(201, 165, 92, 0.2);
  border-radius: 2px;
  padding: 0.15rem 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.recent-tag:hover {
  background: rgba(201, 165, 92, 0.1);
  border-color: rgba(201, 165, 92, 0.4);
  color: #f3ece0;
}

/* 过滤区 */
.filter-section {
  padding: 0.5rem 0.9rem;
  border-bottom: 1px solid rgba(255, 77, 79, 0.08);
}
.filter-section__title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--mono);
  font-size: 10px;
  color: #8a7a68;
  letter-spacing: 0.2em;
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 0.35rem 0;
}
.filter-section__chevron {
  transition: transform 0.2s;
  font-size: 9px;
}
.filter-section__chevron.is-open {
  transform: rotate(180deg);
}
.filter-section__body {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.35rem 0 0.5rem;
}
.filter-section__body--tags {
  max-height: 160px;
  overflow-y: auto;
}
.filter-section__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.55rem;
  font-family: var(--serif);
  font-size: 11px;
  color: #c4bba8;
  background: rgba(243, 236, 224, 0.04);
  border: 1px solid rgba(255, 77, 79, 0.12);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-section__chip:hover {
  background: rgba(255, 77, 79, 0.08);
  border-color: rgba(255, 77, 79, 0.3);
}
.filter-section__chip.is-active {
  color: #f3ece0;
  background: rgba(255, 77, 79, 0.18);
  border-color: #ff4d4f;
}
.filter-section__chip--tag {
  font-family: var(--kai);
}
.filter-section__count {
  font-family: var(--mono);
  font-size: 9px;
  color: #8a7a68;
  background: rgba(0, 0, 0, 0.2);
  padding: 0 0.25rem;
  border-radius: 2px;
}
.filter-section__chip.is-active .filter-section__count {
  color: #f3ece0;
}
</style>
