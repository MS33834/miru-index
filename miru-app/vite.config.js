import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: '/miru-index/',
  esbuild: {
    // 生产构建移除 console.debug/info，并用 pure 标记 console.log 为无副作用以一并删除，
    // 保留 console.error/warn 用于线上排查。测试环境在 vitest.config.js 中覆盖为空以保留日志。
    drop: ['debug', 'info'],
    pure: ['console.log'],
  },
  build: {
    outDir: '../docs',
    emptyOutDir: true,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 启用源码映射（生产环境可关闭）
    sourcemap: false,
    // 资源内联阈值（小于 4kb 的资源内联为 base64）
    assetsInlineLimit: 4096,
    // 目标浏览器：es2020 覆盖 async/await、可选链、空值合并，无需降级 polyfill
    target: 'es2020',
    rollupOptions: {
      output: {
        // 代码分割配置
        manualChunks(id) {
          // 站点数据独立成块：内容更新频繁时可单独缓存，主包更小
          if (id.includes('/src/data/')) {
            return 'site-data'
          }
          if (id.includes('node_modules')) {
            // Vue 相关依赖单独打包
            if (id.includes('/vue/') || id.includes('/@vue/')) {
              return 'vue-vendor'
            }
          }
        },
        // 输出文件名格式
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // 报告打包体积（生产构建关闭以加速，纯信息性、不影响产物）
    reportCompressedSize: false,
    // 限制 chunk 大小警告
    chunkSizeWarningLimit: 1000,
  },
  // 开发服务器配置
  server: {
    port: 5173,
    host: true,
    // 自动打开浏览器
    open: false,
  },
  // 预览服务器配置
  preview: {
    port: 4173,
    host: true,
  },
})
