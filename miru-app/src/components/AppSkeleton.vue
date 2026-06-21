<script setup>
defineProps({
  rows: { type: Number, default: 2 },
})
</script>

<template>
  <div class="app-skeleton" aria-hidden="true">
    <div class="app-skeleton__hero">
      <div class="app-skeleton__title"></div>
      <div class="app-skeleton__subtitle"></div>
      <div class="app-skeleton__desc"></div>
    </div>
    <div class="app-skeleton__grid">
      <div v-for="i in rows * 4" :key="i" class="app-skeleton__card">
        <div class="app-skeleton__line app-skeleton__line--title"></div>
        <div class="app-skeleton__line app-skeleton__line--text"></div>
        <div class="app-skeleton__line app-skeleton__line--text-short"></div>
        <div class="app-skeleton__tags">
          <div class="app-skeleton__tag"></div>
          <div class="app-skeleton__tag app-skeleton__tag--short"></div>
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
  max-width: 42rem;
  margin: 2rem auto 3rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.app-skeleton__title {
  height: 2.5rem;
  width: 60%;
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
  width: 40%;
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
.app-skeleton__desc {
  height: 0.875rem;
  width: 80%;
  border-radius: 2px;
  background: rgba(243, 236, 224, 0.06);
}
.app-skeleton__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
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
  width: 70%;
}
.app-skeleton__line--text {
  height: 0.75rem;
  width: 100%;
}
.app-skeleton__line--text-short {
  height: 0.75rem;
  width: 75%;
}
.app-skeleton__tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}
.app-skeleton__tag {
  width: 2.75rem;
  height: 1.1rem;
  border-radius: 2px;
  background: rgba(168, 22, 26, 0.08);
}
.app-skeleton__tag--short {
  width: 1.75rem;
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
