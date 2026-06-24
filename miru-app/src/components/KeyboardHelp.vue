<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useEventListener } from '../composables/useEventListener.js'

const props = defineProps({
  open: { type: Boolean, default: false },
  shortcutsEnabled: { type: Boolean, default: true },
})
const emit = defineEmits(['close', 'toggle-shortcuts'])

const dialogRef = ref(null)
let lastFocus = null

useEventListener(typeof document !== 'undefined' ? document : null, 'keydown', (e) => {
  if (!props.open) return
  if (e.key === 'Escape') {
    e.stopPropagation()
    emit('close')
    return
  }
  // 焦点陷阱：Tab 在对话框内循环，避免跳出到背景
  if (e.key === 'Tab') {
    const panel = dialogRef.value
    if (!panel) return
    const focusable = Array.from(
      panel.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
})

function focusDialog() {
  if (props.open) {
    lastFocus = document.activeElement
    requestAnimationFrame(() => dialogRef.value?.focus())
  } else if (lastFocus?.focus) {
    lastFocus.focus()
    lastFocus = null
  }
}

watch(() => props.open, focusDialog, { flush: 'post' })

onMounted(() => {
  if (props.open) focusDialog()
})

onBeforeUnmount(() => {
  if (lastFocus?.focus) {
    lastFocus.focus()
  }
})

const shortcuts = [
  { keys: ['Ctrl', 'K'], desc: '聚焦搜索框', single: false },
  { keys: ['Esc'], desc: '关闭弹窗 / 抽屉', single: false },
  { keys: ['?'], desc: '显示/隐藏本帮助', single: true },
  { keys: ['v'], desc: '切换网格 / 列表视图', single: true },
  { keys: ['f'], desc: '切换仅看收藏', single: true },
  { keys: ['Alt', '↑'], desc: '跳到上一卷（仅"全部"视图）', single: false },
  { keys: ['Alt', '↓'], desc: '跳到下一卷（仅"全部"视图）', single: false },
  { keys: ['Enter'], desc: '打开卡片详情', single: false },
  { keys: ['Space'], desc: '打开卡片详情', single: false },
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
        style="background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px)"
        role="dialog"
        aria-modal="true"
        aria-labelledby="kb-title"
        @click="onBackdrop"
      >
        <div ref="dialogRef" tabindex="-1" class="kb-panel">
          <div class="flex items-center justify-between mb-5">
            <h2 id="kb-title" class="font-serif-cn text-xl font-black text-[#1a1410]">
              <span class="text-[#a8161a]">⌨</span> 键 · 盤 · 速
            </h2>
            <button
              type="button"
              @click="emit('close')"
              class="w-9 h-9 rounded-full flex items-center justify-center transition"
              style="background: rgba(184, 35, 31, 0.08); border: 1px solid rgba(184, 35, 31, 0.3); color: #a8161a"
              aria-label="关闭"
            >
              <svg
                width="14"
                height="14"
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

          <ul class="kb-list">
            <li v-for="s in shortcuts" :key="s.desc" class="kb-item" :class="{ 'kb-item--disabled': s.single && !shortcutsEnabled }">
              <div class="kb-keys">
                <kbd v-for="k in s.keys" :key="k" class="kb-key">{{ k }}</kbd>
              </div>
              <span class="kb-desc">{{ s.desc }}</span>
              <span v-if="s.single" class="kb-tag" :class="shortcutsEnabled ? 'kb-tag--on' : 'kb-tag--off'">
                {{ shortcutsEnabled ? '已启用' : '已停用' }}
              </span>
            </li>
          </ul>

          <label class="kb-toggle">
            <input
              type="checkbox"
              :checked="shortcutsEnabled"
              @change="emit('toggle-shortcuts', $event.target.checked)"
            />
            <span class="kb-toggle__label">启用单字符快捷键（? / v / f）</span>
          </label>
          <p class="kb-toggle__hint">关闭后仅保留 Ctrl+K 与 Esc 等修饰键快捷键，避免与屏幕阅读器冲突</p>

          <p
            class="mt-5 pt-4 text-center font-kai-cn text-[#5a4a3a] text-xs"
            style="border-top: 1px solid rgba(168, 22, 26, 0.15)"
          >
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
.kb-item--disabled .kb-keys,
.kb-item--disabled .kb-desc {
  opacity: 0.5;
}
.kb-tag {
  margin-left: auto;
  padding: 0.1rem 0.5rem;
  border-radius: 2px;
  font-size: 0.65rem;
  font-family: var(--mono);
  white-space: nowrap;
}
.kb-tag--on {
  background: rgba(45, 107, 45, 0.12);
  color: #2d6b2d;
  border: 1px solid rgba(45, 107, 45, 0.3);
}
.kb-tag--off {
  background: rgba(102, 102, 102, 0.12);
  color: #666;
  border: 1px solid rgba(102, 102, 102, 0.3);
}
.kb-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.6rem 0.75rem;
  background: rgba(168, 22, 26, 0.05);
  border: 1px solid rgba(168, 22, 26, 0.15);
  border-radius: 2px;
  cursor: pointer;
}
.kb-toggle input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #a8161a;
}
.kb-toggle__label {
  font-family: var(--kai);
  font-size: 0.85rem;
  color: #3a2e22;
}
.kb-toggle__hint {
  margin-top: 0.4rem;
  font-size: 0.7rem;
  color: #5a4a3a;
  text-align: center;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: none;
  }
}
</style>
