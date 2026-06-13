import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: '/miru-index/',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 启用源码映射（生产环境可关闭）
    sourcemap: false,
    // 资源内联阈值（小于 4kb 的资源内联为 base64）
    assetsInlineLimit: 4096,
    // 目标浏览器兼容性
    target: 'es2015',
    rollupOptions: {
      output: {
        // 代码分割配置
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Vue 相关依赖单独打包
            if (id.includes('/vue/') || id.includes('/@vue/')) {
              return 'vue-vendor'
            }
            // Tailwind CSS 相关单独打包
            if (id.includes('tailwindcss')) {
              return 'tailwind-vendor'
            }
          }
        },
        // 输出文件名格式
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // 报告打包体积
    reportCompressedSize: true,
    // 限制 chunk 大小警告
    chunkSizeWarningLimit: 1000
  },
  // 开发服务器配置
  server: {
    port: 5173,
    host: true,
    // 自动打开浏览器
    open: false
  },
  // 预览服务器配置
  preview: {
    port: 4173,
    host: true
  }
})
