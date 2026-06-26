<script setup>
import { computed, ref, onBeforeUnmount } from 'vue'
import { healthOf } from '../utils/mirror.js'
import { getHighlightedParts } from '../utils/highlight.js'
import { useFavorites } from '../composables/useFavorites.js'
import { APP_CONFIG } from '../config/constants.js'

const props = defineProps({
  item: { type: Object, required: true },
  category: { type: Object, required: true },
  index: { type: Number, default: 0 },
  compact: { type: Boolean, default: false },
  searchQuery: { type: String, default: '' },
  // 标题层级：全部视图用 4，单分类视图用 2（紧随 h1 分类标题）
  headingLevel: { type: Number, default: 4 },
})

const emit = defineEmits(['open'])

const { isFavorite, toggleFavorite } = useFavorites()
const favoriteAnimating = ref(false)
// 收藏状态变化的 sr-only 通告，供屏幕阅读器感知
const favoriteStatus = ref('')
let animTimer = null
let statusTimer = null

function handleClick() {
  emit('open', props.item, props.category)
}

function handleKeydown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('open', props.item, props.category)
  }
}

function handleFavoriteClick(e) {
  e.stopPropagation()
  e.preventDefault()
  const wasFavorite = isFavorite(props.item)
  const ok = toggleFavorite(props.item)
  if (!ok) {
    // 配额已满：通告提示（全局 toast 由 App.vue 监听事件处理，此处局部通告）
    favoriteStatus.value = '收藏已满，无法添加'
    if (statusTimer) clearTimeout(statusTimer)
    statusTimer = setTimeout(() => {
      favoriteStatus.value = ''
      statusTimer = null
    }, 2000)
    return
  }
  favoriteAnimating.value = true
  favoriteStatus.value = wasFavorite ? `已取消收藏 ${props.item.name}` : `已收藏 ${props.item.name}`
  if (animTimer) clearTimeout(animTimer)
  animTimer = setTimeout(() => {
    favoriteAnimating.value = false
    animTimer = null
  }, APP_CONFIG.UI.FAVORITE_ANIM_DURATION)
  if (statusTimer) clearTimeout(statusTimer)
  statusTimer = setTimeout(() => {
    favoriteStatus.value = ''
    statusTimer = null
  }, 2000)
}

function handleFavoriteKeydown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.stopPropagation()
    e.preventDefault()
    handleFavoriteClick(e)
  }
}

onBeforeUnmount(() => {
  if (animTimer) {
    clearTimeout(animTimer)
    animTimer = null
  }
  if (statusTimer) {
    clearTimeout(statusTimer)
    statusTimer = null
  }
})

const nameParts = computed(() => getHighlightedParts(props.item.name, props.searchQuery))
const descParts = computed(() => getHighlightedParts(props.item.desc, props.searchQuery))
// 缓存健康状态信息，避免模板中重复调用 healthOf
const healthInfo = computed(() => healthOf(props.item))
// 缓存收藏状态，避免模板中多次调用 isFavorite
const isFav = computed(() => isFavorite(props.item))
// 当前健康状态的简短 ID（用于条件样式）
const health = computed(() => props.item.health || 'ok')
// aria-label 精简：名称 + 截断描述，避免屏幕阅读器朗读过长文本
const ariaLabel = computed(() => {
  if (!props.item.desc) return `${props.item.name}，点击查看详情`
  const d = props.item.desc
  const desc = d.length > 40 ? `${d.slice(0, 40)}…` : d
  return `${props.item.name}，${desc}，点击查看详情`
})
</script>

<template>
  <div class="card-paper-wrap" :style="{ animationDelay: Math.min(index, 24) * 0.04 + 's' }">
    <!-- 收藏状态 sr-only 通告，供屏幕阅读器感知收藏/取消/配额满 -->
    <span class="sr-only" role="status" aria-live="polite">{{ favoriteStatus }}</span>
    <div
      role="button"
      tabindex="0"
      @click="handleClick"
      @keydown="handleKeydown"
      class="card-paper card-rise focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4d4f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] relative cursor-pointer"
      :class="compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6'"
      :aria-label="ariaLabel"
    >
      <div class="flex flex-col gap-3">
        <div class="flex items-start justify-between gap-3 pr-10">
          <span
            class="font-serif-cn text-lg sm:text-xl font-bold text-[#1a1410] leading-tight line-clamp-1 flex-1"
            role="heading"
            :aria-level="headingLevel"
          >
            <template v-for="(part, idx) in nameParts" :key="`${idx}-${part.highlight}`">
              <mark v-if="part.highlight" class="search-highlight">{{ part.text }}</mark>
              <template v-else>{{ part.text }}</template>
            </template>
          </span>
          <div class="flex items-center gap-1.5 shrink-0">
            <span v-if="category" class="cat-badge" :title="category.name">
              <span class="cat-badge__icon" aria-hidden="true">{{ category.icon }}</span>
              <span class="cat-badge__name">{{ category.name }}</span>
            </span>
            <span
              v-if="item.health"
              :title="`健康: ${healthInfo.label}`"
              class="health-badge"
              :style="{ color: healthInfo.color, background: healthInfo.bg }"
              :aria-label="`健康状态：${healthInfo.label}`"
            >
              <span class="health-badge__dot" :style="{ background: healthInfo.color }" aria-hidden="true"></span>
              {{ healthInfo.label }}
            </span>
          </div>
        </div>

        <p
          v-if="item.desc"
          class="font-kai-cn text-[#3a2e22] leading-relaxed line-clamp-2 text-sm"
          :class="compact ? 'text-[13px] sm:text-sm' : 'text-sm sm:text-base'"
        >
          <template v-for="(part, idx) in descParts" :key="`${idx}-${part.highlight}`">
            <mark v-if="part.highlight" class="search-highlight">{{ part.text }}</mark>
            <template v-else>{{ part.text }}</template>
          </template>
        </p>

        <div v-if="item.features?.length" class="card-features">
          <span v-for="f in item.features.slice(0, compact ? 2 : 3)" :key="f" class="card-features__item">
            {{ f }}
          </span>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-[#1a1410]/10">
          <div class="flex items-center gap-1.5 flex-1 min-w-0">
            <span v-if="item.tags?.length" class="tag-stamp" :class="compact ? 'tag-sm' : 'tag-normal'">
              #{{ item.tags[0] }}
            </span>
            <span v-if="item.tags?.length > 1" class="tag-stamp tag-extra" :class="compact ? 'tag-sm' : 'tag-normal'">
              +{{ item.tags.length - 1 }}
            </span>
            <span
              class="card-proxy"
              :class="{ 'is-proxy': item.proxy, 'is-blocked': health === 'blocked' || health === 'restricted' }"
            >
              {{ item.proxy ? '需梯' : '直连' }}
            </span>
            <span v-if="health === 'blocked' || health === 'restricted'" class="card-gfw-tip" :title="healthInfo.tip">
              {{ healthInfo.label }}
            </span>
          </div>
          <a
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="card-direct-link"
            :title="'直达 ' + item.name"
            :aria-label="'直达 ' + item.name + '（在新标签页打开）'"
            @click.stop
            @keydown.enter.stop
          >
            入 →
          </a>
        </div>
      </div>
    </div>

    <!-- 收藏按钮：移出卡片主 button，使用独立原生 button，避免嵌套 -->
    <button
      type="button"
      @click="handleFavoriteClick"
      @keydown="handleFavoriteKeydown"
      class="favorite-btn-floating"
      :class="{ 'is-favorite': isFav, 'is-animating': favoriteAnimating }"
      :aria-label="isFav ? `取消收藏 ${item.name}` : `收藏 ${item.name}`"
      :aria-pressed="isFav"
      title="收藏"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        :fill="isFav ? 'currentColor' : 'none'"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.tag-sm {
  font-size: 0.65rem;
  padding: 0.1rem 0.4rem;
}
.tag-normal {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
}
.tag-stamp {
  background: rgba(168, 22, 26, 0.08);
  border: 1px solid rgba(168, 22, 26, 0.3);
  color: #a8161a;
}
.tag-extra {
  background: rgba(122, 94, 32, 0.1);
  border-color: rgba(122, 94, 32, 0.3);
  color: #7a5e20;
}

.cat-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.1rem 0.45rem;
  background: rgba(26, 20, 16, 0.06);
  border: 1px solid rgba(26, 20, 16, 0.12);
  border-radius: 999px;
  color: #5a4a3a;
  font-family: var(--serif);
  font-size: 0.65rem;
  white-space: nowrap;
}
.cat-badge__icon {
  font-size: 0.75rem;
  line-height: 1;
}
.cat-badge__name {
  display: none;
}
@media (min-width: 640px) {
  .cat-badge__name {
    display: inline;
  }
}

.card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.card-features__item {
  font-family: var(--kai);
  font-size: 0.72rem;
  color: #5a4a3a;
  background: rgba(201, 165, 92, 0.08);
  border: 1px solid rgba(201, 165, 92, 0.2);
  border-radius: 2px;
  padding: 0.15rem 0.45rem;
  white-space: nowrap;
}

.card-proxy {
  font-family: var(--mono);
  font-size: 0.65rem;
  color: #5a4a3a;
  padding: 0.1rem 0.4rem;
  border-radius: 2px;
  background: rgba(26, 20, 16, 0.04);
  border: 1px solid rgba(26, 20, 16, 0.08);
  white-space: nowrap;
}
.card-proxy.is-proxy {
  color: #7a5e20;
  background: rgba(122, 94, 32, 0.08);
  border-color: rgba(122, 94, 32, 0.2);
}

/* 卡片包装器 - 支持悬浮收藏按钮。
 * 保持默认 pointer-events，避免 Firefox 等浏览器在 pointer-events: none 父元素下
 * 对子元素 hit-testing 出现误判，导致相邻卡片互相拦截点击。
 */
.card-paper-wrap {
  position: relative;
}

/* 悬浮收藏按钮 - 独立元素，避免 button 嵌套。
 * 触摸目标 ≥44px（WCAG 2.5.5），移除 backdrop-filter 避免滚动时每帧重算 GPU 合成。
 */
.favorite-btn-floating {
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(243, 236, 224, 0.95);
  border: 1px solid rgba(168, 22, 26, 0.15);
  color: #8a7a68;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;
  z-index: 2;
  user-select: none;
  padding: 0;
  appearance: none;
  -webkit-appearance: none;
}
.favorite-btn-floating:hover {
  background: rgba(243, 236, 224, 1);
  color: #8a6d20;
  transform: scale(1.1);
  border-color: rgba(138, 109, 32, 0.4);
}
.favorite-btn-floating:focus-visible {
  outline: 2px solid #ff4d4f;
  outline-offset: 2px;
}
.favorite-btn-floating.is-favorite {
  color: #8a6d20;
  background: rgba(243, 236, 224, 1);
}
.favorite-btn-floating.is-animating {
  animation: favorite-bounce 0.4s ease;
}
@media (max-width: 640px) {
  .favorite-btn-floating {
    top: 0.5rem;
    right: 0.5rem;
    width: 44px;
    height: 44px;
  }
}
@keyframes favorite-bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
}

.card-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-height: 120px;
}
.skeleton-line {
  background: linear-gradient(
    90deg,
    rgba(168, 22, 26, 0.04) 0%,
    rgba(168, 22, 26, 0.1) 50%,
    rgba(168, 22, 26, 0.04) 100%
  );
  background-size: 200% 100%;
  border-radius: 2px;
  animation: skeleton-shimmer 1.6s infinite;
}
.skeleton-title {
  height: 1.25rem;
  width: 70%;
  margin-top: 0.15rem;
}
.skeleton-badge {
  width: 3rem;
  height: 1rem;
  border-radius: 999px;
  background: rgba(168, 22, 26, 0.08);
}
.skeleton-desc {
  height: 0.75rem;
}
.skeleton-desc--1 {
  width: 100%;
}
.skeleton-desc--2 {
  width: 85%;
}
.skeleton-tag {
  width: 3rem;
  height: 1.25rem;
  border-radius: 2px;
  background: rgba(168, 22, 26, 0.07);
}
.skeleton-tag--short {
  width: 2rem;
}
.skeleton-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  margin-top: auto;
  border-top: 1px solid rgba(26, 20, 16, 0.06);
}
.skeleton-footer__text {
  width: 4rem;
  height: 0.65rem;
}
.skeleton-footer__arrow {
  width: 2rem;
  height: 0.8rem;
}
@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.search-highlight {
  background: rgba(255, 77, 79, 0.22);
  color: #a8161a;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 700;
}

.health-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  font-family: var(--mono);
  font-size: 0.65rem;
  line-height: 1;
  white-space: nowrap;
}
.health-badge__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

/* 直达链接 — 独立于卡片按钮，悬浮可见 */
.card-direct-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  font-family: var(--serif);
  font-size: 0.8rem;
  font-weight: 700;
  color: #a8161a;
  background: rgba(168, 22, 26, 0.06);
  border: 1px solid rgba(168, 22, 26, 0.18);
  border-radius: 50%;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  position: relative;
  z-index: 3;
}
.card-direct-link:hover {
  background: rgba(168, 22, 26, 0.15);
  color: #fff;
  border-color: #a8161a;
  transform: scale(1.1);
}
.card-direct-link:focus-visible {
  outline: 2px solid #ff4d4f;
  outline-offset: 2px;
}

/* 被墙/受限标记 — 文本色与 HEALTH_MAP.blocked 对齐（WCAG AA ≥ 4.5:1） */
.card-gfw-tip {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: #8a3a0e;
  background: rgba(184, 92, 26, 0.1);
  border: 1px solid rgba(184, 92, 26, 0.25);
  border-radius: 2px;
  padding: 0.1rem 0.35rem;
  white-space: nowrap;
  cursor: help;
}
.card-proxy.is-blocked {
  color: #8a3a0e;
  background: rgba(184, 92, 26, 0.12);
  border-color: rgba(184, 92, 26, 0.3);
}
</style>
