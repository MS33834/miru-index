<script setup>
import { ref, computed, onMounted } from 'vue'
import { categories } from './data/nav.js'
import SiteModal from './components/SiteModal.vue'

const searchQuery = ref('')
const activeCategory = ref('all')
const modalItem = ref(null)
const modalCategory = ref(null)
const loaded = ref(false)

const CHINESE_NUMS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾', '拾壹', '拾贰', '拾叁', '拾肆', '拾伍', '拾陆', '拾柒', '拾捌', '拾玖', '贰拾', '贰拾壹', '贰拾贰', '贰拾叁', '贰拾肆', '贰拾伍', '贰拾陆']

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

const groupedByCategory = computed(() => {
  if (activeCategory.value !== 'all') {
    const cat = categories.find(c => c.id === activeCategory.value)
    if (!cat) return []
    const items = filteredItems.value
    return [{ ...cat, items }]
  }
  return categories.map((c, idx) => ({
    ...c,
    chapterNum: CHINESE_NUMS[idx + 1] || String(idx + 1),
    items: filteredItems.value.filter(i => i._category.id === c.id)
  })).filter(g => g.items.length > 0)
})

const totalCount = computed(() => allItems.value.length)
const filteredCount = computed(() => filteredItems.value.length)

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

onMounted(() => {
  setTimeout(() => (loaded.value = true), 80)
})
</script>

<template>
  <div class="min-h-screen">
    <!-- ============ HERO 卷首 ============ -->
    <header class="relative pt-8 sm:pt-12 pb-6 px-4 sm:px-8 max-w-7xl mx-auto">
      <!-- 顶栏 -->
      <div class="flex items-center justify-between mb-10 sm:mb-16">
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

      <!-- 主标题 -->
      <div class="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- 左侧标题 -->
        <div class="lg:col-span-8 relative">
          <!-- 装饰：背景巨字 -->
          <div aria-hidden="true" class="absolute -top-6 -left-2 sm:-left-4 kanji-num font-serif-cn select-none pointer-events-none" data-num="藏">藏</div>

          <h1 class="relative">
            <span class="hero-kanji ink-spread inline-block" style="animation-delay: 0.1s">漫藏</span>
            <span class="hero-kanji ink-spread inline-block ml-2 sm:ml-4 text-[#d92020]/80" style="animation-delay: 0.25s; -webkit-text-fill-color: rgba(217, 32, 32, 0.85); background: none;">藏經閣</span>
          </h1>

          <!-- 副标题 -->
          <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6">
            <div class="chapter-num">— MIRU · INDEX · 漫 — 藏 — 阁 —</div>
          </div>

          <p class="mt-5 sm:mt-7 max-w-2xl text-[#c4bba8] text-[15px] sm:text-base leading-[1.9] font-kai-cn">
            一座属于 <span class="text-[#f3ece0]">ACGN</span> 的<span class="text-[#d92020]">印经阁</span>。
            精选 <span class="text-[#c9a55c] font-serif-cn text-lg mx-1">{{ totalCount }}</span> 站 · 分 <span class="text-[#c9a55c] font-serif-cn text-lg mx-1">{{ categories.length }}</span> 卷 · 涵盖漫画 · 番剧 · GalGame · 轻小说 · AI · GitHub 开源 · 网络工具……凡诸次元之美，尽藏于此。
          </p>

          <!-- 印章排 -->
          <div class="mt-7 flex flex-wrap gap-3">
            <div class="hanko px-3 py-1.5 text-sm">朱泥 · ACGN</div>
            <div class="hanko px-3 py-1.5 text-sm" style="background: #1a1410; color: #c9a55c; box-shadow: inset 0 0 0 1px rgba(201, 165, 92, 0.4);">御金 · 拾陆陆</div>
            <div class="hanko px-3 py-1.5 text-sm" style="background: #0a0a0a; color: #f3ece0; box-shadow: inset 0 0 0 1px rgba(243, 236, 224, 0.3);">墨 · 拾贰</div>
          </div>
        </div>

        <!-- 右侧：巨大印章装饰 -->
        <div class="lg:col-span-4 flex justify-center lg:justify-end">
          <div class="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
            <div class="hanko-circle absolute inset-0 flex-col stamp-anim" style="animation-delay: 0.5s; transform: rotate(-6deg);">
              <span class="text-3xl sm:text-4xl font-serif-cn leading-none">漫</span>
              <span class="text-3xl sm:text-4xl font-serif-cn leading-none mt-1">藏</span>
            </div>
            <!-- 角落小印章 -->
            <div class="hanko absolute -bottom-2 -right-2 w-12 h-12 text-[10px] stamp-anim" style="animation-delay: 0.8s; transform: rotate(8deg);">壹</div>
            <div class="hanko absolute -top-2 -left-2 w-10 h-10 text-[10px] stamp-anim" style="animation-delay: 0.9s; background: #1a1410; color: #c9a55c; box-shadow: inset 0 0 0 1px rgba(201, 165, 92, 0.4);">藏</div>
          </div>
        </div>
      </div>

      <!-- 装饰：毛笔笔触 SVG -->
      <svg class="absolute top-32 right-8 w-24 h-24 opacity-30 hidden lg:block" viewBox="0 0 100 100" fill="none">
        <path d="M10 50 Q 30 10, 50 50 T 90 50" stroke="#d92020" stroke-width="3" stroke-linecap="round" class="brush-stroke" fill="none"/>
        <circle cx="85" cy="20" r="3" fill="#c9a55c"/>
      </svg>
    </header>

    <!-- ============ 搜索 + 分类 ============ -->
    <section class="sticky top-0 z-30 backdrop-blur-md bg-[#0a0a0a]/85 border-y border-[#d92020]/15">
      <div class="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4">
        <!-- 搜索 -->
        <div class="relative mb-3">
          <div class="flex items-stretch">
            <div class="hanko h-11 w-11 shrink-0 text-sm">搜</div>
            <input
              v-model="searchQuery"
              type="search"
              class="scroll-input flex-1 px-4 py-2.5 text-sm sm:text-base"
              :placeholder="`以名索物 · 寻 ${totalCount} 卷…`"
              aria-label="搜索"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="px-3 text-[#8a7a68] hover:text-[#d92020] transition"
              aria-label="清空"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
            </button>
            <div class="hanko h-11 w-11 shrink-0 text-sm" style="background: #1a1410; color: #c9a55c; box-shadow: inset 0 0 0 1px rgba(201, 165, 92, 0.4);">卷</div>
          </div>
          <div v-if="searchQuery" class="mt-2 font-mono text-[11px] text-[#8a7a68] tracking-wider">
            寻得 <span class="text-[#c9a55c]">{{ filteredCount }}</span> 条结果
          </div>
        </div>

        <!-- 分类 tabs -->
        <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          <button
            @click="activeCategory = 'all'"
            :class="['tab-seal shrink-0', activeCategory === 'all' ? 'is-active' : '']"
            role="tab"
            :aria-selected="activeCategory === 'all'"
          >
            <span>⌘</span> 全部
          </button>
          <button
            v-for="c in categories"
            :key="c.id"
            @click="activeCategory = c.id"
            :class="['tab-seal shrink-0', activeCategory === c.id ? 'is-active' : '']"
            role="tab"
            :aria-selected="activeCategory === c.id"
          >
            <span>{{ c.icon }}</span> {{ c.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- ============ 主内容 ============ -->
    <main class="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <div v-if="groupedByCategory.length === 0" class="text-center py-20">
        <div class="hanko-circle w-20 h-20 mx-auto mb-6 text-2xl">空</div>
        <p class="font-kai-cn text-[#8a7a68] text-lg">卷帙浩繁，未寻得所求之物……</p>
      </div>

      <div
        v-for="(group, gi) in groupedByCategory"
        :key="group.id"
        class="mb-14 sm:mb-20 content-auto"
      >
        <!-- 章节标题 -->
        <div class="flex items-end gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div class="relative">
            <div class="kanji-num font-serif-cn" data-num="壹">{{ group.chapterNum || '壹' }}</div>
          </div>
          <div class="flex-1 pb-1">
            <div class="chapter-num text-[#8a7a68] mb-1">CHAPTER · {{ String(gi + 1).padStart(2, '0') }} / {{ String(groupedByCategory.length).padStart(2, '0') }}</div>
            <h2 class="font-serif-cn text-2xl sm:text-3xl text-[#f3ece0] font-bold tracking-wide">
              <span class="text-[#d92020] mr-2">{{ group.icon }}</span>{{ group.name }}
            </h2>
            <div class="mt-2 text-[#8a7a68] font-mono text-[10px] tracking-[0.2em]">
              {{ group.items.length }} 帖 · 共 {{ group.items.length }} 卷
            </div>
          </div>
          <div class="hidden sm:flex items-center gap-2 pb-1">
            <div class="hanko text-xs px-2.5 py-1 stamp-anim" :style="{ animationDelay: (0.1 * gi) + 's' }">第{{ group.chapterNum || '壹' }}卷</div>
          </div>
        </div>

        <!-- 卷尾花分隔 -->
        <div class="scroll-divider mb-6 sm:mb-8">
          <span class="ornament">❀</span>
        </div>

        <!-- 卡片网格 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          <button
            v-for="(item, idx) in group.items"
            :key="item.name + (item.url || '')"
            @click="openModal(item, group)"
            @keydown="onCardKeydown($event, item, group)"
            class="card-paper text-left p-4 sm:p-5 card-rise focus:outline-none focus:ring-2 focus:ring-[#d92020] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
            :style="{ animationDelay: (0.04 * idx) + 's' }"
            :aria-label="`${item.name} — ${item.desc || ''}`"
          >
            <!-- 顶部条 + 印章 -->
            <div class="flex items-start justify-between gap-2 mb-3">
              <h3 class="font-serif-cn text-lg sm:text-xl font-bold text-[#1a1410] leading-tight line-clamp-1 flex-1">
                {{ item.name }}
              </h3>
              <div class="hanko-circle w-9 h-9 text-xs shrink-0 stamp-anim" :style="{ animationDelay: (0.05 * idx) + 's' }">藏</div>
            </div>

            <p v-if="item.desc" class="font-kai-cn text-[#3a2e22] text-[13px] sm:text-sm leading-relaxed line-clamp-2 mb-3">
              {{ item.desc }}
            </p>

            <!-- 标签 -->
            <div v-if="item.tags?.length" class="flex flex-wrap gap-1.5 mb-3">
              <span
                v-for="t in item.tags.slice(0, 3)"
                :key="t"
                class="tag-stamp"
                style="background: rgba(168, 22, 26, 0.08); border-color: rgba(168, 22, 26, 0.3); color: #a8161a;"
              >
                #{{ t }}
              </span>
              <span
                v-if="item.tags.length > 3"
                class="tag-stamp"
                style="background: rgba(201, 165, 92, 0.1); border-color: rgba(201, 165, 92, 0.3); color: #a4853e;"
              >
                +{{ item.tags.length - 3 }}
              </span>
            </div>

            <!-- 底部：proxy + 提示 -->
            <div class="flex items-center justify-between pt-2 border-t border-[#1a1410]/10">
              <div class="font-mono text-[10px] text-[#5a4a3a] tracking-wider line-clamp-1 flex-1">
                {{ item.proxy ? '◯ 需梯子' : '◯ 直连' }}
              </div>
              <div class="text-[#a8161a] text-xs font-serif-cn tracking-wider">覌 →</div>
            </div>
          </button>
        </div>
      </div>
    </main>

    <!-- ============ FOOTER ============ -->
    <footer class="relative mt-12 sm:mt-20 py-12 sm:py-16 border-t border-[#d92020]/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-8 text-center">
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

    <!-- ============ MODAL ============ -->
    <SiteModal
      v-if="modalItem"
      :item="modalItem"
      :category="modalCategory"
      @close="closeModal"
    />
  </div>
</template>
