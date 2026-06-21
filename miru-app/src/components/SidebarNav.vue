<script setup>
import { ref, computed, watch } from 'vue'
import { categories } from '../data/nav.js'
import { useDebounce } from '../composables/useDebounce.js'
import { useRecentSearches } from '../composables/useRecentSearches.js'

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

const expanded = ref(new Set(['all'])) // 默认展开"全部"
const allCount = computed(() => categories.reduce((a, c) => a + c.items.length, 0))
const showFilters = ref(true)
const showTags = ref(false)

const { recentSearches, add: addRecent, clear: clearRecent } = useRecentSearches()

// 热门标签
const topTags = computed(() => {
  const map = new Map()
  for (const c of categories) {
    for (const item of c.items) {
      for (const tag of item.tags || []) {
        map.set(tag, (map.get(tag) || 0) + 1)
      }
    }
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 24)
    .map(([name, count]) => ({ name, count }))
})

// 使用防抖 composable
const { debouncedValue, setDebouncedValue } = useDebounce(300)
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
  }
)

function toggle(id) {
  const s = new Set(expanded.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  expanded.value = s
}
function isExpanded(id) {
  return expanded.value.has(id)
}

// 选中分类时自动展开
watch(
  () => props.activeCategory,
  (id) => {
    if (id && id !== 'all') {
      expanded.value = new Set([id])
    }
  },
  { immediate: true }
)
</script>

<template>
  <aside class="sidebar h-full flex flex-col" :class="collapsed ? 'sidebar--collapsed' : ''">
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
          aria-label="展开搜索"
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
          :aria-label="collapsed ? '展开目录' : '折叠目录'"
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

      <!-- 搜索框 -->
      <div v-if="!collapsed" class="relative">
        <div class="flex items-center">
          <div class="hanko h-8 w-8 shrink-0 text-[10px]" style="border-radius: 2px 0 0 2px">搜</div>
          <input
            :value="localSearchQuery"
            @input="handleSearchInput"
            @keydown="handleSearchKeydown"
            type="search"
            placeholder="以名索物…"
            class="scroll-input flex-1 px-3 py-1.5 text-[13px]"
            style="border-radius: 0 2px 2px 0"
            aria-label="搜索"
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
          <span class="sidebar-section-title">最近搜索</span>
          <button type="button" class="sidebar-text-btn" @click="clearRecent">清空</button>
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
        :title="collapsed ? '全部' : ''"
        :aria-current="activeCategory === 'all' ? 'page' : undefined"
      >
        <div class="sidebar-item__lead">
          <span class="sidebar-item__icon">⌘</span>
          <span v-if="!collapsed" class="sidebar-item__name">全部 · 總藏</span>
        </div>
        <div v-if="!collapsed" class="sidebar-item__trail">
          <span class="sidebar-item__count">{{ allCount }}</span>
        </div>
        <span v-if="activeCategory === 'all'" class="sidebar-item__indicator"></span>
      </button>

      <div v-if="!collapsed" class="sidebar-divider">
        <span class="ornament">· 分卷目录 ·</span>
      </div>

      <!-- 快速过滤 -->
      <div v-if="!collapsed" class="filter-section">
        <button type="button" class="filter-section__title" @click="showFilters = !showFilters">
          <span>快速过滤</span>
          <span class="filter-section__chevron" :class="{ 'is-open': showFilters }">▾</span>
        </button>
        <div v-if="showFilters" class="filter-section__body">
          <button
            type="button"
            class="filter-section__chip"
            :class="{ 'is-active': showFavoritesOnly }"
            @click="emit('toggle-favorites-only')"
            :aria-pressed="showFavoritesOnly"
          >
            <span>★ 收藏</span>
            <span v-if="favoritesCount > 0" class="filter-section__count">{{ favoritesCount }}</span>
          </button>
          <button
            type="button"
            class="filter-section__chip"
            :class="{ 'is-active': proxyFilter === 'direct' }"
            @click="emit('set-proxy-filter', proxyFilter === 'direct' ? 'all' : 'direct')"
            :aria-pressed="proxyFilter === 'direct'"
          >
            <span>◯ 直连</span>
          </button>
          <button
            type="button"
            class="filter-section__chip"
            :class="{ 'is-active': proxyFilter === 'proxy' }"
            @click="emit('set-proxy-filter', proxyFilter === 'proxy' ? 'all' : 'proxy')"
            :aria-pressed="proxyFilter === 'proxy'"
          >
            <span>◎ 需梯</span>
          </button>
        </div>
      </div>

      <!-- 标签云 -->
      <div v-if="!collapsed" class="filter-section">
        <button type="button" class="filter-section__title" @click="showTags = !showTags">
          <span>标签云</span>
          <span class="filter-section__chevron" :class="{ 'is-open': showTags }">▾</span>
        </button>
        <div v-if="showTags" class="filter-section__body filter-section__body--tags">
          <button
            v-for="t in topTags"
            :key="t.name"
            type="button"
            class="filter-section__chip filter-section__chip--tag"
            :class="{ 'is-active': selectedTags.has(t.name) }"
            @click="emit('toggle-tag', t.name)"
            :aria-pressed="selectedTags.has(t.name)"
            :title="`出现 ${t.count} 次`"
          >
            <span>#{{ t.name }}</span>
            <span class="filter-section__count">{{ t.count }}</span>
          </button>
        </div>
      </div>

      <!-- 各分类 -->
      <button
        v-for="c in categories"
        :key="c.id"
        type="button"
        @click="emit('select', c.id)"
        :class="['sidebar-item', activeCategory === c.id ? 'is-active' : '']"
        :title="collapsed ? c.name : ''"
        :aria-current="activeCategory === c.id ? 'page' : undefined"
      >
        <div class="sidebar-item__lead">
          <span class="sidebar-item__icon">{{ c.icon }}</span>
          <span v-if="!collapsed" class="sidebar-item__name">{{ c.name }}</span>
        </div>
        <div v-if="!collapsed" class="sidebar-item__trail">
          <span class="sidebar-item__count">{{ c.items.length }}</span>
          <span class="sidebar-item__chevron" :class="{ 'is-open': isExpanded(c.id) }" @click.stop="toggle(c.id)">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
        <span v-if="activeCategory === c.id" class="sidebar-item__indicator"></span>
      </button>

      <!-- 展开的资源列表（手风琴） -->
      <Transition name="expand">
        <div v-if="!collapsed && expanded.size > 0" class="sidebar-resources">
          <template v-for="c in categories" :key="`res-${c.id}`">
            <div v-if="isExpanded(c.id)" class="sidebar-resources__group">
              <div class="sidebar-resources__title"><span class="ornament">❀</span> {{ c.name }} · 条目</div>
              <a
                v-for="(item, i) in c.items"
                :key="item.url || i"
                @click.prevent="emit('select', c.id)"
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="sidebar-resources__item"
              >
                <span class="sidebar-resources__num">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="sidebar-resources__name">{{ item.name }}</span>
              </a>
            </div>
          </template>
        </div>
      </Transition>
    </nav>

    <!-- 底部：统计 + 印章 -->
    <div v-if="!collapsed" class="px-4 py-4 border-t border-[#ff4d4f]/15">
      <div class="flex items-center gap-2 mb-2">
        <div class="ink-bar flex-1"></div>
      </div>
      <div class="font-mono text-[10px] text-[#8a7a68] tracking-[0.25em] mb-2">
        共 {{ categories.length }} 卷 · {{ allCount }} 帖
      </div>
      <div class="flex items-center gap-2">
        <div class="hanko text-[10px] px-2 py-0.5">朱泥</div>
        <div
          class="hanko text-[10px] px-2 py-0.5"
          style="background: #1a1410; color: #c9a55c; box-shadow: inset 0 0 0 1px rgba(201, 165, 92, 0.4)"
        >
          御金
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
.sidebar-item__chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #8a7a68;
  border-radius: 2px;
  transition: all 0.2s;
}
.sidebar-item__chevron:hover {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}
.sidebar-item__chevron.is-open svg {
  transform: rotate(180deg);
}
.sidebar-item__chevron svg {
  transition: transform 0.2s;
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

/* 展开的资源列表（手风琴） */
.sidebar-resources {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 0 0.5rem;
  border-top: 1px solid rgba(255, 77, 79, 0.1);
  margin-top: 0.25rem;
}
.sidebar-resources__group {
  padding: 0.5rem 0.6rem 0.4rem;
}
.sidebar-resources__title {
  font-family: var(--serif);
  font-size: 10px;
  color: #c9a55c;
  padding: 0.3rem 0.4rem 0.4rem;
  letter-spacing: 0.08em;
}
.sidebar-resources__title .ornament {
  color: #ff4d4f;
  margin-right: 4px;
}
.sidebar-resources__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.4rem;
  font-family: var(--kai);
  font-size: 12px;
  color: #c4bba8;
  border-radius: 2px;
  text-decoration: none;
  transition: all 0.15s;
}
.sidebar-resources__item:hover {
  color: #f3ece0;
  background: rgba(201, 165, 92, 0.08);
  padding-left: 0.7rem;
}
.sidebar-resources__num {
  font-family: var(--mono);
  font-size: 10px;
  color: #8a7a68;
  width: 16px;
  flex-shrink: 0;
}
.sidebar-resources__name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sidebar-resources__more {
  padding: 0.2rem 0.4rem;
  font-family: var(--mono);
  font-size: 10px;
  color: #8a7a68;
  letter-spacing: 0.1em;
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

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition:
    max-height 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.25s;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 70vh;
  opacity: 1;
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

@media (prefers-reduced-motion: reduce) {
  .expand-enter-active,
  .expand-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>
