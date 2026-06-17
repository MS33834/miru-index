<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useEventListener } from '../composables/useEventListener.js'

const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

const dialogRef = ref(null)
let lastFocus = null

useEventListener(typeof document !== 'undefined' ? document : null, 'keydown', (e) => {
  if (e.key === 'Escape' && props.open) {
    e.stopPropagation()
    emit('close')
  }
})

onMounted(() => {
  if (props.open) {
    lastFocus = document.activeElement
    requestAnimationFrame(() => dialogRef.value?.focus())
  }
})

onBeforeUnmount(() => {
  if (lastFocus?.focus) {
    lastFocus.focus()
  }
})

const shortcuts = [
  { keys: ['Ctrl', 'K'], desc: '聚焦搜索框' },
  { keys: ['Esc'], desc: '关闭弹窗 / 抽屉' },
  { keys: ['?'], desc: '显示/隐藏本帮助' },
  { keys: ['↑', '↓'], desc: '在卷册间跳转' },
  { keys: ['Enter'], desc: '打开卡片详情' },
  { keys: ['Space'], desc: '打开卡片详情' },
]

const onBackdrop = (e) => {
  if (e.target === e.currentTarget) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px);"
        role="dialog" aria-modal="true" aria-labelledby="kb-title"
        @click="onBackdrop"
      >
        <div
          ref="dialogRef"
          tabindex="-1"
          class="kb-panel"
        >
          <div class="flex items-center justify-between mb-5">
            <h2 id="kb-title" class="font-serif-cn text-xl font-black text-[#1a1410]">
              <span class="text-[#a8161a]">⌨</span> 键 · 盤 · 速
            </h2>
            <button
              type="button"
              @click="emit('close')"
              class="w-9 h-9 rounded-full flex items-center justify-center transition"
              style="background: rgba(184, 35, 31, 0.08); border: 1px solid rgba(184, 35, 31, 0.3); color: #a8161a;"
              aria-label="关闭"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>

          <ul class="kb-list">
            <li v-for="s in shortcuts" :key="s.desc" class="kb-item">
              <div class="kb-keys">
                <kbd v-for="k in s.keys" :key="k" class="kb-key">{{ k }}</kbd>
              </div>
              <span class="kb-desc">{{ s.desc }}</span>
            </li>
          </ul>

          <p class="mt-5 pt-4 text-center font-kai-cn text-[#5a4a3a] text-xs" style="border-top: 1px solid rgba(168, 22, 26, 0.15);">
            按 <kbd class="kb-key">?</kbd> 再次唤出 · 按 <kbd class="kb-key">Esc</kbd> 关闭
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.kb-panel {
  max-width: 460px;
  width: 100%;
  background: linear-gradient(180deg, #f3ece0 0%, #e6dcc8 100%);
  border-radius: 4px;
  padding: 1.5rem 1.75rem;
  box-shadow:
    inset 0 0 0 1px rgba(243, 236, 224, 0.5),
    0 30px 80px rgba(0, 0, 0, 0.6);
  outline: none;
}
.kb-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.kb-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  background: rgba(243, 236, 224, 0.5);
  border: 1px solid rgba(168, 22, 26, 0.1);
  border-radius: 2px;
}
.kb-keys {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}
.kb-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 26px;
  padding: 0 0.5rem;
  background: #fff;
  border: 1px solid #1a1410;
  border-bottom-width: 2px;
  border-radius: 3px;
  font-family: var(--mono);
  font-size: 0.7rem;
  font-weight: 600;
  color: #1a1410;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
}
.kb-desc {
  font-family: var(--kai);
  font-size: 0.9rem;
  color: #3a2e22;
}
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .modal-fade-enter-active, .modal-fade-leave-active { transition: none; }
}
</style>
