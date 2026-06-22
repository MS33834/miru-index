<script setup>
defineProps({
  rows: { type: Number, default: 3 },
})
</script>

<template>
  <div class="app-skeleton" aria-hidden="true">
    <div class="app-skeleton__hero">
      <div class="app-skeleton__title"></div>
      <div class="app-skeleton__subtitle"></div>
      <div class="app-skeleton__stats">
        <div class="app-skeleton__stat"></div>
        <div class="app-skeleton__stat"></div>
        <div class="app-skeleton__stat"></div>
      </div>
    </div>
    <div class="app-skeleton__grid">
      <div v-for="i in rows * 4" :key="i" class="app-skeleton__card">
        <div class="app-skeleton__header">
          <div class="app-skeleton__line app-skeleton__line--title"></div>
          <div class="app-skeleton__line app-skeleton__line--badge"></div>
        </div>
        <div class="app-skeleton__line app-skeleton__line--text"></div>
        <div class="app-skeleton__line app-skeleton__line--text-short"></div>
        <div class="app-skeleton__features">
          <div class="app-skeleton__feature"></div>
          <div class="app-skeleton__feature app-skeleton__feature--short"></div>
        </div>
        <div class="app-skeleton__footer">
          <div class="app-skeleton__line app-skeleton__line--tag"></div>
          <div class="app-skeleton__line app-skeleton__line--arrow"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-skeleton {
  padding: 1rem;
}
.app-skeleton__hero {
  max-width: 860px;
  margin: 2rem auto 3rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}
.app-skeleton__title {
  height: 3.5rem;
  width: 70%;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    rgba(255, 77, 79, 0.06) 0%,
    rgba(255, 77, 79, 0.12) 50%,
    rgba(255, 77, 79, 0.06) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-flow 1.6s infinite;
}
.app-skeleton__subtitle {
  height: 1.25rem;
  width: 45%;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    rgba(201, 165, 92, 0.06) 0%,
    rgba(201, 165, 92, 0.12) 50%,
    rgba(201, 165, 92, 0.06) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-flow 1.6s infinite;
}
.app-skeleton__stats {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
.app-skeleton__stat {
  width: 5.5rem;
  height: 2rem;
  border-radius: 4px;
  background: rgba(243, 236, 224, 0.06);
}
.app-skeleton__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.75rem;
}
@media (min-width: 640px) {
  .app-skeleton__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .app-skeleton__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 1280px) {
  .app-skeleton__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
.app-skeleton__card {
  background: rgba(243, 236, 224, 0.04);
  border: 1px solid rgba(168, 22, 26, 0.08);
  border-radius: 4px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.app-skeleton__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.app-skeleton__line {
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    rgba(168, 22, 26, 0.04) 0%,
    rgba(168, 22, 26, 0.1) 50%,
    rgba(168, 22, 26, 0.04) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-flow 1.6s infinite;
}
.app-skeleton__line--title {
  height: 1.25rem;
  width: 65%;
}
.app-skeleton__line--badge {
  width: 3rem;
  height: 1rem;
  border-radius: 999px;
}
.app-skeleton__line--text {
  height: 0.75rem;
  width: 100%;
}
.app-skeleton__line--text-short {
  height: 0.75rem;
  width: 80%;
}
.app-skeleton__features {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.1rem;
}
.app-skeleton__feature {
  width: 3.25rem;
  height: 1.15rem;
  border-radius: 2px;
  background: rgba(201, 165, 92, 0.07);
}
.app-skeleton__feature--short {
  width: 2.25rem;
}
.app-skeleton__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  margin-top: auto;
  border-top: 1px solid rgba(26, 20, 16, 0.06);
}
.app-skeleton__line--tag {
  width: 3.5rem;
  height: 1rem;
  border-radius: 2px;
}
.app-skeleton__line--arrow {
  width: 2rem;
  height: 0.85rem;
}
@keyframes skeleton-flow {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .app-skeleton__title,
  .app-skeleton__subtitle,
  .app-skeleton__line {
    animation: none;
  }
}
</style>
