<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  shortcutsEnabled: { type: Boolean, default: true },
})
const emit = defineEmits(['close', 'toggle-shortcuts'])

const dialogRef = ref(null)

function onBackdrop(e) {
  if (e.target === dialogRef.value) emit('close')
}

function onDialogClose() {
  emit('close')
}

watch(
  () => props.open,
  async (val) => {
    if (val) {
      await nextTick()
      try {
        dialogRef.value?.showModal()
      } catch (e) {
        // showModal 可能因状态异常抛错（如已打开），降级处理避免未捕获异常
        console.warn('[KeyboardHelp] showModal 失败:', e)
      }
    } else {
      dialogRef.value?.close()
    }
  }
)

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
</script>

<template>
  <dialog
    v-if="open"
    ref="dialogRef"
    class="kb-dialog"
    aria-labelledby="kb-title"
    @click="onBackdrop"
    @close="onDialogClose"
  >
    <div class="kb-panel">
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
        <li
          v-for="s in shortcuts"
          :key="s.desc"
          class="kb-item"
          :class="{ 'kb-item--disabled': s.single && !shortcutsEnabled }"
        >
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
        <input type="checkbox" :checked="shortcutsEnabled" @change="emit('toggle-shortcuts', $event.target.checked)" />
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
  </dialog>
</template>

<style>
/* ::backdrop 需要在非 scoped 块中定义 */
.kb-dialog::backdrop {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  animation: backdrop-fade 0.2s ease;
}

/* 不支持 backdrop-filter 时的深度不透明降级 */
@supports not (backdrop-filter: blur(1px)) {
  .kb-dialog::backdrop {
    background: rgba(0, 0, 0, 0.85);
  }
}

/* 用户偏好减少动画时移除模糊 */
@media (prefers-reduced-motion: reduce) {
  .kb-dialog::backdrop {
    backdrop-filter: none;
    animation: none;
  }
}

@keyframes backdrop-fade {
  from {
    opacity: 0;
  }
}

@keyframes kb-open {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>

<style scoped>
.kb-dialog {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  border: none;
  background: transparent;
  overflow: hidden;
  max-width: none;
  max-height: none;
  margin: 0;
}

.kb-dialog[open] {
  animation: kb-open 0.2s ease;
}

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

@media (prefers-reduced-motion: reduce) {
  .kb-dialog[open] {
    animation: none;
  }
}
</style>
