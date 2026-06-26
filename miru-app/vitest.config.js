import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig,
  defineConfig({
    // 测试环境保留全部 console 输出，覆盖 vite.config.js 中生产用的 drop/pure
    esbuild: {
      drop: [],
      pure: [],
    },
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.js'],
    },
  })
)
