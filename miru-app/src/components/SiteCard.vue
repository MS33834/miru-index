<script setup>
import { computed, ref } from 'vue'
import { healthOf } from '../utils/mirror.js'
import { useFavorites } from '../composables/useFavorites.js'
import { useLazyLoad } from '../composables/useLazyLoad.js'

const props = defineProps({
  item: { type: Object, required: true },
  category: { type: Object, required: true },
  index: { type: Number, default: 0 },
  compact: { type: Boolean, default: false },
  searchQuery: { type: String, default: '' }
})

const emit = defineEmits(['open'])

const { isFavorite, toggleFavorite } = useFavorites()
const { target, isVisible } = useLazyLoad()
const favoriteAnimating = ref(false)

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
  toggleFavorite(props.item)
  
  // 触发收藏动画
  favoriteAnimating.value = true
  setTimeout(() => {
    favoriteAnimating.value = false
  }, 400)
}

// 高亮搜索关键词 - 返回分段数组用于安全渲染
function getHighlightedParts(text, query) {
  if (!query || !text) return [{ text, highlight: false }]
  
  const parts = []
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  let lastIndex = 0
  
  let index = lowerText.indexOf(lowerQuery)
  while (index !== -1) {
    if (index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, index), highlight: false })
    }
    parts.push({ text: text.slice(index, index + query.length), highlight: true })
    lastIndex = index + query.length
    index = lowerText.indexOf(lowerQuery, lastIndex)
  }
  
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false })
  }
  
  return parts.length > 0 ? parts : [{ text, highlight: false }]
}

const nameParts = computed(() => getHighlightedParts(props.item.name, props.searchQuery))
const descParts = computed(() => getHighlightedParts(props.item.desc, props.searchQuery))
</script>

<template>
  <button
    ref="target"
    @click="handleClick"
    @keydown="handleKeydown"
    class="card-paper text-left card-rise focus:outline-none focus:ring-2 focus:ring-[#d92020] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] relative"
    :class="compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6'"
    :style="{ animationDelay: (Math.min(index, 24) * 0.04) + 's' }"
    :aria-label="item.desc ? `${item.name} — ${item.desc}` : item.name"
  >
    <div v-if="isVisible" class="flex flex-col gap-3">
      <!-- 标题行 -->
      <div class="flex items-start justify-between gap-3">
        <h4 class="font-serif-cn text-lg sm:text-xl font-bold text-[#1a1410] leading-tight line-clamp-1 flex-1">
          <template v-for="(part, idx) in nameParts" :key="idx">
            <mark v-if="part.highlight" class="search-highlight">{{ part.text }}</mark>
            <template v-else>{{ part.text }}</template>
          </template>
        </h4>
        <div class="flex items-center gap-2 shrink-0">
          <button
            @click="handleFavoriteClick"
            class="favorite-btn"
            :class="{ 'is-favorite': isFavorite(item), 'is-animating': favoriteAnimating }"
            :aria-label="isFavorite(item) ? '取消收藏' : '收藏'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" :fill="isFavorite(item) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
          <span
            v-if="item.health && item.health !== 'ok'"
            :title="`健康: ${healthOf(item).label}`"
            class="rounded-full w-2.5 h-2.5"
            :style="{ background: healthOf(item).color, boxShadow: `0 0 8px ${healthOf(item).color}88` }"
          ></span>
        </div>
      </div>

      <!-- 描述 -->
      <p v-if="item.desc" class="font-kai-cn text-[#3a2e22] leading-relaxed line-clamp-2 text-sm"
         :class="compact ? 'text-[13px] sm:text-sm' : 'text-sm sm:text-base'">
        <template v-for="(part, idx) in descParts" :key="idx">
          <mark v-if="part.highlight" class="search-highlight">{{ part.text }}</mark>
          <template v-else>{{ part.text }}</template>
        </template>
      </p>

      <!-- 标签 -->
      <div v-if="item.tags?.length" class="flex flex-wrap gap-1.5 sm:gap-2">
        <span
          v-for="t in item.tags.slice(0, compact ? 2 : 3)"
          :key="t"
          class="tag-stamp"
          :class="compact ? 'tag-sm' : 'tag-normal'"
        >#{{ t }}</span>
        <span
          v-if="item.tags.length > (compact ? 2 : 3)"
          class="tag-stamp tag-extra"
          :class="compact ? 'tag-sm' : 'tag-normal'"
        >+{{ item.tags.length - (compact ? 2 : 3) }}</span>
      </div>

      <!-- 底部信息 -->
      <div class="flex items-center justify-between pt-3 border-t border-[#1a1410]/10">
        <div class="font-mono text-[#5a4a3a] tracking-wider line-clamp-1 flex-1 text-xs">
          {{ item.proxy ? '◯ 需梯子' : '◯ 直连' }}
        </div>
        <div class="text-[#a8161a] font-serif-cn tracking-wider text-sm font-bold">覌 →</div>
      </div>
    </div>
    <div v-else class="card-placeholder">
      <div class="hanko-circle w-10 h-10 text-xs opacity-30">藏</div>
    </div>
  </button>
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
  background: rgba(201, 165, 92, 0.1);
  border-color: rgba(201, 165, 92, 0.3);
  color: #a4853e;
}
.favorite-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #8a7a68;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;
}
.favorite-btn:hover {
  background: rgba(201, 165, 92, 0.1);
  color: #c9a55c;
}
.favorite-btn.is-favorite {
  color: #c9a55c;
}
.favorite-btn.is-animating {
  animation: favorite-bounce 0.4s ease;
}
@keyframes favorite-bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}
.card-content {
  animation: fadeIn 0.3s ease-in;
}
.card-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.search-highlight {
  background: rgba(217, 32, 32, 0.2);
  color: #a8161a;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 700;
}
</style>
