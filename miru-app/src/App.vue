<script setup>
import { ref, computed } from 'vue'
import { categories } from './data/nav.js'

const searchQuery = ref('')
const activeCategory = ref('all')

const filteredCategories = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()

  return categories
    .filter(cat => activeCategory.value === 'all' || cat.id === activeCategory.value)
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item => {
        if (!q) return true
        return (
          item.name.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          cat.name.toLowerCase().includes(q)
        )
      })
    }))
    .filter(cat => cat.items.length > 0)
})

const totalItems = computed(() => {
  return filteredCategories.value.reduce((sum, cat) => sum + cat.items.length, 0)
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="py-8 px-4 text-center">
      <div class="flex items-center justify-center gap-4 mb-2">
        <!-- 红色印章 Logo -->
        <div class="w-14 h-14 bg-[#d92020] rounded-lg flex flex-col items-center justify-center shrink-0">
          <span class="text-white font-bold text-lg leading-tight">漫</span>
          <span class="text-white font-bold text-lg leading-tight">藏</span>
        </div>
        <div class="text-left">
          <h1 class="text-3xl sm:text-4xl font-bold tracking-wider text-[#f3ece0]">MIRU INDEX</h1>
          <p class="text-[#c9a55c] text-sm tracking-widest mt-1">ACGN 资源导航</p>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 pb-12">
      <!-- Search Bar -->
      <div class="mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索资源名称、描述或分类..."
          class="w-full bg-[#181818] border border-[#2a2520] rounded-lg px-4 py-3 text-[#f3ece0] placeholder-[#6b6560] focus:border-[#d92020] focus:outline-none transition"
        />
      </div>

      <!-- Category Chips -->
      <div class="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        <button
          @click="activeCategory = 'all'"
          class="px-4 py-2 rounded-full border transition whitespace-nowrap text-sm"
          :class="activeCategory === 'all'
            ? 'bg-[#d92020] border-[#d92020] text-white'
            : 'bg-transparent border-[#2a2520] text-[#9a9590] hover:border-[#d92020] hover:text-[#f3ece0]'"
        >
          全部
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          class="px-4 py-2 rounded-full border transition whitespace-nowrap text-sm"
          :class="activeCategory === cat.id
            ? 'bg-[#d92020] border-[#d92020] text-white'
            : 'bg-transparent border-[#2a2520] text-[#9a9590] hover:border-[#d92020] hover:text-[#f3ece0]'"
        >
          {{ cat.icon }} {{ cat.name }}
        </button>
      </div>

      <!-- Results Count -->
      <p class="text-[#6b6560] text-sm mb-4">共 {{ totalItems }} 个资源</p>

      <!-- Category Sections -->
      <section v-for="cat in filteredCategories" :key="cat.id" class="mb-8">
        <h2 class="text-xl font-bold text-[#c9a55c] mb-4 flex items-center gap-2">
          <span>{{ cat.icon }}</span>
          <span>{{ cat.name }}</span>
          <span class="text-xs text-[#6b6560] font-normal">({{ cat.items.length }})</span>
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <a
            v-for="item in cat.items"
            :key="item.name"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="block p-5 bg-[#181818] border border-[#2a2520] rounded-lg hover:border-[#d92020] hover:-translate-y-1 transition-all duration-300 group"
          >
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="text-lg font-bold text-[#f3ece0] group-hover:text-[#d92020] transition-colors">{{ item.name }}</h3>
              <span v-if="item.proxy" class="text-xs px-2 py-0.5 rounded bg-[#d92020]/10 text-[#d92020] border border-[#d92020]/30 whitespace-nowrap">需梯子</span>
            </div>
            <p class="text-sm text-[#9a9590] leading-relaxed">{{ item.desc }}</p>
          </a>
        </div>
      </section>

      <!-- Empty State -->
      <div v-if="filteredCategories.length === 0" class="text-center py-20">
        <p class="text-[#6b6560] text-lg">没有找到匹配的资源</p>
        <button
          @click="searchQuery = ''; activeCategory = 'all'"
          class="mt-4 text-[#d92020] hover:underline"
        >
          清除搜索
        </button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-6 px-4 text-center border-t border-[#2a2520]">
      <p class="text-[#6b6560] text-sm">漫藏 · MIRU INDEX — ACGN 资源导航</p>
    </footer>
  </div>
</template>
