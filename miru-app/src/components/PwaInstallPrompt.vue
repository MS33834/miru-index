<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const show = ref(false)
const installed = ref(false)
let deferredPrompt = null

function onBeforeInstallPrompt(e) {
  e.preventDefault()
  deferredPrompt = e
  // 延迟显示（避免首屏干扰）
  setTimeout(() => { show.value = true }, 3000)
}

function onAppInstalled() {
  installed.value = true
  show.value = false
}

onMounted(() => {
  // 检查是否已安装
  if (window.matchMedia('(display-mode: standalone)').matches) {
    installed.value = true
    return
  }

  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.addEventListener('appinstalled', onAppInstalled)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.removeEventListener('appinstalled', onAppInstalled)
})

async function install() {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  if (outcome === 'accepted') {
    show.value = false
  }
  deferredPrompt = null
}

function dismiss() {
  show.value = false
  // 24 小时内不再提示
  try { localStorage.setItem('miru-pwa-dismissed', Date.now().toString()) } catch {}
}
</script>

<template>
  <Transition name="pwa-slide">
    <div
      v-if="show && !installed"
      class="pwa-prompt"
      role="status"
      aria-live="polite"
    >
      <div class="pwa-prompt__icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2 L14.39 8.36 L21 9.27 L16 13.97 L17.18 20.55 L12 17.27 L6.82 20.55 L8 13.97 L3 9.27 L9.61 8.36 Z"/>
        </svg>
      </div>
      <div class="pwa-prompt__content">
        <div class="pwa-prompt__title">将漫藏阁安装到桌面</div>
        <div class="pwa-prompt__desc">离线可用 · 快速访问 · 完整体验</div>
      </div>
      <div class="pwa-prompt__actions">
        <button type="button" @click="install" class="pwa-prompt__install">安装</button>
        <button type="button" @click="dismiss" class="pwa-prompt__dismiss" aria-label="关闭">×</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.pwa-prompt {
  position: fixed;
  bottom: calc(5.5rem + env(safe-area-inset-bottom));
  left: 1rem;
  right: 1rem;
  max-width: 380px;
  margin: 0 auto;
  z-index: 45;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: linear-gradient(180deg, #1a1410 0%, #0a0a0a 100%);
  border: 1px solid rgba(255, 77, 79, 0.4);
  border-radius: 4px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 77, 79, 0.15);
  color: #f3ece0;
}
.pwa-prompt__icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff4d4f;
  color: #f3ece0;
  border-radius: 4px;
  flex-shrink: 0;
}
.pwa-prompt__content {
  flex: 1;
  min-width: 0;
}
.pwa-prompt__title {
  font-family: var(--serif);
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 2px;
}
.pwa-prompt__desc {
  font-family: var(--kai);
  font-size: 0.75rem;
  color: #c4bba8;
}
.pwa-prompt__actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}
.pwa-prompt__install {
  font-family: var(--serif);
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  background: #ff4d4f;
  color: #f3ece0;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.2s;
  min-height: 36px;
}
.pwa-prompt__install:hover { background: #a8161a; }
.pwa-prompt__install:focus-visible {
  outline: 2px solid #c9a55c;
  outline-offset: 2px;
}
.pwa-prompt__dismiss {
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: #8a7a68;
  cursor: pointer;
  border-radius: 50%;
  font-size: 1.25rem;
  line-height: 1;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.pwa-prompt__dismiss:hover { color: #f3ece0; background: rgba(255, 77, 79, 0.15); }

.pwa-slide-enter-active, .pwa-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease;
}
.pwa-slide-enter-from, .pwa-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
@media (prefers-reduced-motion: reduce) {
  .pwa-slide-enter-active, .pwa-slide-leave-active { transition: none; }
}
</style>
