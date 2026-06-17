<script setup>
import { ref, onErrorCaptured } from 'vue'

const error = ref(null)

onErrorCaptured((err) => {
  console.error('[ErrorBoundary] 捕获错误:', err)
  error.value = err
  // 阻止错误继续向上传播
  return false
})

function reset() {
  error.value = null
}

function reload() {
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}
</script>

<template>
  <div v-if="error" class="error-boundary" role="alert">
    <div class="error-boundary__inner">
      <div class="error-boundary__hanko">崩</div>
      <h2 class="error-boundary__title">页面出现错误</h2>
      <p class="error-boundary__desc">很抱歉，应用遇到了一个未预期的错误。</p>
      <pre class="error-boundary__message">{{ String(error.message || error) }}</pre>
      <div class="error-boundary__actions">
        <button type="button" @click="reset" class="error-boundary__btn">重试</button>
        <button type="button" @click="reload" class="error-boundary__btn error-boundary__btn--secondary">刷新页面</button>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<style scoped>
.error-boundary {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a0808 100%);
  padding: 2rem;
}
.error-boundary__inner {
  max-width: 480px;
  text-align: center;
  background: linear-gradient(180deg, #f3ece0 0%, #e6dcc8 100%);
  padding: 3rem 2rem;
  border-radius: 4px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}
.error-boundary__hanko {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d92020;
  color: #f3ece0;
  font-family: var(--serif);
  font-weight: 900;
  font-size: 2rem;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(217, 32, 32, 0.3);
}
.error-boundary__title {
  font-family: var(--serif);
  font-size: 1.75rem;
  font-weight: 900;
  color: #1a1410;
  margin-bottom: 0.5rem;
}
.error-boundary__desc {
  font-family: var(--kai);
  color: #5a4a3a;
  margin-bottom: 1.5rem;
}
.error-boundary__message {
  font-family: var(--mono);
  font-size: 0.75rem;
  text-align: left;
  background: #0a0a0a;
  color: #c9a55c;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}
.error-boundary__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}
.error-boundary__btn {
  font-family: var(--serif);
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  background: #d92020;
  color: #f3ece0;
  transition: all 0.2s;
}
.error-boundary__btn:hover {
  background: #a8161a;
}
.error-boundary__btn--secondary {
  background: transparent;
  color: #5a4a3a;
  border: 1px solid #5a4a3a;
}
.error-boundary__btn--secondary:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1a1410;
}
</style>
