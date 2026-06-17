<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { GH_MIRRORS, ghMirror, healthOf } from '../utils/mirror.js'
import { useEventListener } from '../composables/useEventListener.js'

const props = defineProps({
  item: { type: Object, required: true },
  category: { type: Object, default: null }
})
const emit = defineEmits(['close'])

const dialogRef = ref(null)
const enterBtnRef = ref(null)
const copied = ref(false)
const copiedMirror = ref(false)
const mirrorOpen = ref(false)
const selectedMirror = ref(GH_MIRRORS[0] || null)

// 焦点恢复：保存打开前的活动元素
let lastFocusedElement = null

const health = computed(() => healthOf(props.item))
const isGitHub = computed(() => Boolean(props.item.url?.includes('github.com')))
const mirrorUrl = computed(() => {
  if (!isGitHub.value || !selectedMirror.value) return null
  return ghMirror(props.item.url, selectedMirror.value.id)
})

function onBackdropClick(e) {
  if (e.target === e.currentTarget) emit('close')
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    if (mirrorOpen.value) { mirrorOpen.value = false; return }
    emit('close')
  }
  if (e.key === 'Tab') trapFocus(e)
}

function trapFocus(e) {
  if (!dialogRef.value) return
  const focusable = dialogRef.value.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  if (focusable.length <= 1) return
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

async function doCopy(text, flagRef) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    flagRef.value = true
    setTimeout(() => { flagRef.value = false }, 1500)
  } catch {
    // 降级方案
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    ta.setAttribute('readonly', '')
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
      flagRef.value = true
      setTimeout(() => { flagRef.value = false }, 1500)
    } catch {
      // 静默
    }
    document.body.removeChild(ta)
  }
}

async function copyUrl() { await doCopy(props.item.url, copied) }
async function copyMirror() { await doCopy(mirrorUrl.value, copiedMirror) }

function isValidUrl(url) {
  if (!url) return false
  return /^https?:\/\//.test(url)
}

function openInNewTab() {
  const target = isGitHub.value ? mirrorUrl.value : props.item.url
  if (!isValidUrl(target)) return
  const w = window.open(target, '_blank')
  if (w) w.opener = null
  else window.location.href = target
}

function openOriginal() {
  if (!isValidUrl(props.item.url)) return
  const w = window.open(props.item.url, '_blank')
  if (w) w.opener = null
  else window.location.href = props.item.url
}

function selectMirror(m) {
  selectedMirror.value = m
  mirrorOpen.value = false
}

onMounted(() => {
  // 保存当前焦点以便关闭时恢复
  lastFocusedElement = document.activeElement
  document.body.style.overflow = 'hidden'
  nextTick(() => enterBtnRef.value?.focus())
})

// 改用 useEventListener 避免手动 cleanup
useEventListener(typeof document !== 'undefined' ? document : null, 'keydown', onKeydown)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  // 恢复焦点
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus()
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 modal-backdrop"
      style="background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(12px);"
      role="dialog" aria-modal="true" :aria-labelledby="`modal-title-${item.name}`"
      @click="onBackdropClick"
    >
      <div
        ref="dialogRef"
        class="modal-screen relative w-full sm:max-w-2xl max-h-[94vh] overflow-y-auto modal-panel"
        style="
          background: linear-gradient(180deg, #f3ece0 0%, #e6dcc8 100%);
          color: #1a1410;
          border-radius: 4px;
          box-shadow:
            inset 0 0 0 1px rgba(243, 236, 224, 0.5),
            0 30px 80px rgba(0, 0, 0, 0.7),
            0 0 0 1px rgba(217, 32, 32, 0.3);
        "
      >
        <div aria-hidden="true" class="absolute inset-0 pointer-events-none rounded-[4px] washi"></div>
        <div aria-hidden="true" class="absolute top-0 left-0 right-0 h-[3px] z-10" style="
          background: linear-gradient(90deg, #d92020 0%, #d92020 30%, transparent 30%, transparent 36%, #d92020 36%, #d92020 44%, transparent 44%);
          background-size: 12px 3px;
        "></div>

        <div class="relative">
          <button
            type="button"
            @click="emit('close')"
            aria-label="关闭对话框（按 Esc 退出）"
            class="modal-close absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition z-20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>

          <header class="px-6 sm:px-10 pt-10 sm:pt-12 pb-5 border-b border-[#1a1410]/10">
            <div class="flex items-center gap-2 mb-5 flex-wrap">
              <div class="hanko text-xs px-2.5 py-1 stamp-anim" v-if="category">
                <span class="mr-1">{{ category.icon }}</span>{{ category.name }}
              </div>
              <div
                class="font-serif-cn text-xs px-2.5 py-1 rounded-sm inline-flex items-center gap-1.5"
                :style="{
                  background: health.bg,
                  color: health.color,
                  border: '1px solid ' + health.color + '66',
                }"
                :title="`健康状态: ${health.label}`"
              >
                <span :style="{ color: health.color, fontSize: '10px' }" aria-hidden="true">{{ health.icon }}</span>
                <span>{{ health.label }}</span>
              </div>
              <div
                v-if="item.proxy"
                class="font-serif-cn text-xs px-2.5 py-1 rounded-sm"
                style="background: rgba(201, 165, 92, 0.2); color: #a4853e; border: 1px solid rgba(201, 165, 92, 0.4);"
              >
                需梯子
              </div>
            </div>

            <h2 :id="`modal-title-${item.name}`" class="font-serif-cn text-3xl sm:text-4xl font-black text-[#1a1410] leading-tight pr-10 tracking-tight">
              {{ item.name }}
            </h2>
            <p v-if="item.desc" class="mt-3 font-kai-cn text-[#3a2e22] text-base sm:text-lg leading-relaxed">
              {{ item.desc }}
            </p>
          </header>

          <div class="px-6 sm:px-10 py-6 sm:py-8 space-y-7">
            <section v-if="item.tags?.length">
              <div class="flex items-center gap-2 mb-3">
                <div class="font-mono text-[10px] tracking-[0.3em] text-[#a8161a]">▎印 · TAGS</div>
                <div class="flex-1 h-px" style="background: linear-gradient(90deg, rgba(168, 22, 26, 0.3), transparent);"></div>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="t in item.tags" :key="t"
                  class="tag-stamp"
                  style="background: rgba(168, 22, 26, 0.1); border-color: rgba(168, 22, 26, 0.4); color: #a8161a; font-size: 0.78rem; padding: 0.3rem 0.65rem;"
                >#{{ t }}</span>
              </div>
            </section>

            <section v-if="item.fullDesc">
              <div class="flex items-center gap-2 mb-3">
                <div class="font-mono text-[10px] tracking-[0.3em] text-[#a8161a]">▎叙 · INTRO</div>
                <div class="flex-1 h-px" style="background: linear-gradient(90deg, rgba(168, 22, 26, 0.3), transparent);"></div>
              </div>
              <p class="font-kai-cn text-[#1a1410] leading-[1.95] text-[15px] sm:text-[16px]">
                {{ item.fullDesc }}
              </p>
            </section>

            <section v-if="item.features?.length">
              <div class="flex items-center gap-2 mb-3">
                <div class="font-mono text-[10px] tracking-[0.3em] text-[#a8161a]">▎特 · FEATURES</div>
                <div class="flex-1 h-px" style="background: linear-gradient(90deg, rgba(168, 22, 26, 0.3), transparent);"></div>
              </div>
              <ul class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <li
                  v-for="(f, i) in item.features" :key="i"
                  class="font-kai-cn text-[#1a1410] text-sm flex items-center gap-2 px-3 py-2 rounded-sm"
                  style="background: rgba(201, 165, 92, 0.08); border: 1px solid rgba(201, 165, 92, 0.25);"
                >
                  <span class="text-[#a8161a] font-serif-cn font-bold" aria-hidden="true">·</span>
                  <span>{{ f }}</span>
                </li>
              </ul>
            </section>

            <section>
              <div class="flex items-center gap-2 mb-3">
                <div class="font-mono text-[10px] tracking-[0.3em] text-[#a8161a]">▎址 · URL</div>
                <div class="flex-1 h-px" style="background: linear-gradient(90deg, rgba(168, 22, 26, 0.3), transparent);"></div>
              </div>

              <code class="block bg-[#0a0a0a] border border-[#1a1410] rounded-sm px-4 py-3 text-[#c9a55c] text-xs sm:text-sm break-all font-mono">
                {{ item.url }}
              </code>

              <div v-if="isGitHub" class="mt-4 rounded-sm overflow-hidden" style="border: 1px solid rgba(201, 165, 92, 0.3); background: rgba(201, 165, 92, 0.05);">
                <button
                  type="button"
                  @click="mirrorOpen = !mirrorOpen"
                  class="mirror-toggle w-full flex items-center justify-between gap-2 px-4 py-2.5 font-serif-cn text-sm transition"
                  :aria-expanded="mirrorOpen"
                  aria-label="切换镜像选择"
                >
                  <span class="flex items-center gap-2">
                    <span class="font-mono text-[10px] tracking-[0.2em] text-[#a8161a]">▎镜 · MIRROR</span>
                    <span>{{ selectedMirror?.name || '选择镜像' }}</span>
                  </span>
                  <span class="text-[10px] transition" :class="{ 'rotate-180': mirrorOpen }" aria-hidden="true">▾</span>
                </button>

                <div v-if="mirrorOpen" class="border-t" style="border-color: rgba(201, 165, 92, 0.2);" role="listbox">
                  <div
                    v-for="m in GH_MIRRORS"
                    :key="m.id"
                    @click="selectMirror(m)"
                    class="mirror-option px-4 py-2 text-xs font-mono cursor-pointer transition flex items-center gap-2"
                    :class="{ 'is-active': selectedMirror?.id === m.id }"
                    role="option"
                    :aria-selected="selectedMirror?.id === m.id"
                    tabindex="0"
                    @keydown.enter="selectMirror(m)"
                    @keydown.space.prevent="selectMirror(m)"
                  >
                    <span :class="selectedMirror?.id === m.id ? 'text-[#a8161a]' : 'opacity-30'" aria-hidden="true">●</span>
                    <span class="flex-1">{{ m.name }}</span>
                    <span class="opacity-50 text-[10px]">{{ m.id }}</span>
                  </div>
                  <code class="block px-4 py-2 text-[10px] sm:text-[11px] break-all font-mono" style="background: rgba(0,0,0,0.05); color: #5a4a3a; border-top: 1px dashed rgba(201, 165, 92, 0.3);">
                    {{ mirrorUrl }}
                  </code>
                </div>
              </div>
            </section>
          </div>

          <footer class="px-6 sm:px-10 py-6 sm:py-8 border-t border-[#1a1410]/10 flex flex-col sm:flex-row gap-3">
            <button
              ref="enterBtnRef"
              type="button"
              @click="openInNewTab"
              class="flex-1 text-center px-6 py-3.5 font-serif-cn font-bold text-base transition stamp-anim flex items-center justify-center gap-2"
              style="
                background: linear-gradient(180deg, #d92020 0%, #a8161a 100%);
                color: #f3ece0;
                border: 1px solid #a8161a;
                box-shadow: 0 4px 14px rgba(217, 32, 32, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15);
                border-radius: 2px;
                letter-spacing: 0.1em;
                cursor: pointer;
              "
            >
              <span>入</span>
              <span class="text-sm opacity-80" aria-hidden="true">→</span>
              <span>{{ isGitHub ? '覌镜像' : '覌' }}</span>
            </button>
            <button
              v-if="isGitHub"
              type="button"
              @click="openOriginal"
              class="btn-mute px-5 py-3.5 font-serif-cn font-bold text-sm transition flex items-center justify-center gap-2"
              title="打开 GitHub 原始链接（需梯子）"
            >
              <span class="text-[10px]">原</span>
            </button>
            <button
              v-if="isGitHub"
              type="button"
              @click="copyMirror"
              class="btn-gold px-5 py-3.5 font-serif-cn font-bold text-sm transition flex items-center justify-center gap-2"
              :title="`复制 ${selectedMirror?.name || '镜像'} URL`"
            >
              <span v-if="!copiedMirror">抄 · 镜</span>
              <span v-else class="text-[#a8161a]">已抄 ✓</span>
            </button>
            <button
              type="button"
              @click="copyUrl"
              class="btn-dark px-6 py-3.5 font-serif-cn font-bold text-base transition flex items-center justify-center gap-2"
            >
              <span v-if="!copied">抄 · 录</span>
              <span v-else class="text-[#a8161a]">已抄 ✓</span>
            </button>
            <button
              type="button"
              @click="emit('close')"
              class="btn-text px-6 py-3.5 font-kai-cn text-base transition"
            >
              闭
            </button>
          </footer>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.washi {
  background:
    radial-gradient(circle at 20% 30%, rgba(168, 22, 26, 0.025) 0, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(168, 22, 26, 0.02) 0, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.03) 0, transparent 70%);
  mix-blend-mode: multiply;
  opacity: 0.85;
}
.modal-close {
  background: rgba(184, 35, 31, 0.08);
  border: 1px solid rgba(184, 35, 31, 0.3);
  color: #a8161a;
}
.modal-close:hover { background: rgba(184, 35, 31, 0.18); }
.mirror-toggle {
  color: #a4853e;
  background: transparent;
}
.mirror-toggle:hover { background: rgba(201, 165, 92, 0.1); }
.mirror-option {
  background: transparent;
  color: #5a4a3a;
}
.mirror-option:not(.is-active):hover { background: rgba(201, 165, 92, 0.08); }
.mirror-option.is-active {
  background: rgba(201, 165, 92, 0.18);
  color: #a8161a;
}
.btn-mute {
  background: transparent;
  color: #5a4a3a;
  border: 1px solid rgba(90, 74, 58, 0.33);
  border-radius: 2px;
  letter-spacing: 0.05em;
}
.btn-mute:hover { background: rgba(0, 0, 0, 0.05); color: #1a1410; }
.btn-gold {
  background: transparent;
  color: #a4853e;
  border: 1px solid rgba(164, 133, 62, 0.33);
  border-radius: 2px;
  letter-spacing: 0.05em;
}
.btn-gold:hover { background: rgba(201, 165, 92, 0.1); color: #1a1410; }
.btn-dark {
  background: transparent;
  color: #1a1410;
  border: 1px solid #1a1410;
  border-radius: 2px;
  letter-spacing: 0.1em;
}
.btn-dark:hover { background: rgba(0, 0, 0, 0.05); }
.btn-text {
  background: transparent;
  color: #5a4a3a;
  letter-spacing: 0.1em;
}
.btn-text:hover { color: #1a1410; }
</style>
