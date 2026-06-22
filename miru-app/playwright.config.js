import { defineConfig, devices } from '@playwright/test'
import fs from 'fs'
import { execSync } from 'child_process'

/**
 * 查找可用的系统 Chromium 可执行文件。
 * 在 CI / 容器环境中 Playwright 浏览器下载经常失败，
 * 优先复用系统已安装的 google-chrome / chromium。
 * 同时校验该可执行文件能真正启动（避免选中 snap 包装脚本）。
 */
function findSystemChrome() {
  const candidates = [
    process.env.PLAYWRIGHT_CHROME_EXECUTABLE,
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean)

  for (const p of candidates) {
    try {
      if (!fs.existsSync(p)) continue
      // 排除 snap 包装脚本：执行 --version 必须成功且返回版本号
      const out = execSync(`"${p}" --version`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] })
      if (/\d+\.\d+\.\d+/.test(out)) return p
    } catch {
      /* ignore */
    }
  }
  return undefined
}

const chromeExecutable = findSystemChrome()

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // 关闭动画以减少点击命中测试的抖动，同时保留真实用户端的动效
    reducedMotion: 'reduce',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          executablePath: chromeExecutable,
        },
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        launchOptions: {
          executablePath: chromeExecutable,
        },
      },
    },
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173/miru-index/',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
