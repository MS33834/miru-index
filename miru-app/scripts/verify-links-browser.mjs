#!/usr/bin/env node
/**
 * 浏览器级链接验证脚本
 * 用 Playwright 模拟真实用户访问，检查页面标题与 URL，识别真正的失效页面。
 * 不依赖 HTTP 状态码，避免反爬 / 云盾 / 证书拦截导致的误判。
 */
import { chromium } from '@playwright/test'
import fs from 'fs/promises'
import path from 'path'

const HEALTH_JSON_PATH = path.resolve(process.cwd(), 'src', 'data', 'health.json')
const CONCURRENCY = 4
const TIMEOUT_MS = 20000

const ERROR_KEYWORDS = [
  '404', 'not found', 'error', 'access denied', 'forbidden',
  '无法访问', '找不到', '未找到', '拒绝访问', '禁止访问',
  '域名出售', 'domain for sale', 'website is for sale',
  'nginx', 'bad gateway', 'service unavailable', '503',
  'this site can’t be reached', 'err_', 'dns_probe',
  'unsupported protocol', 'invalid url', 'timed out',
]

function isErrorResult(title, url, error) {
  const text = `${title || ''} ${url || ''} ${error || ''}`.toLowerCase()
  return ERROR_KEYWORDS.some((k) => text.includes(k.toLowerCase()))
}

async function loadDeadItems() {
  const raw = await fs.readFile(HEALTH_JSON_PATH, 'utf8')
  const health = JSON.parse(raw)
  const items = []
  for (const [url, status] of Object.entries(health)) {
    if (status === 'dead' && url.startsWith('http')) {
      items.push({ url, status })
    }
  }
  return items
}

async function verify(browser, item) {
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  })
  const page = await context.newPage()
  try {
    const res = await page.goto(item.url, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT_MS,
    })
    const title = await page.title().catch(() => '')
    const finalUrl = page.url()
    const ok = res && res.ok() && !isErrorResult(title, finalUrl)
    return {
      ...item,
      browserStatus: ok ? 'ok' : 'dead',
      title: title.slice(0, 100),
      finalUrl,
    }
  } catch (err) {
    return {
      ...item,
      browserStatus: 'dead',
      error: err.name || err.message,
    }
  } finally {
    await context.close()
  }
}

async function runBatch(items, browser, onResult) {
  const queue = [...items]
  const workers = Array(CONCURRENCY)
    .fill(null)
    .map(async () => {
      while (queue.length) {
        const item = queue.shift()
        const result = await verify(browser, item)
        onResult(result)
      }
    })
  await Promise.all(workers)
}

async function main() {
  const items = await loadDeadItems()
  if (!items.length) {
    console.log('没有需要浏览器验证的死链。')
    return
  }

  console.log(`启动浏览器验证 ${items.length} 条死链...\n`)
  const executablePath =
    process.env.PLAYWRIGHT_CHROME_EXECUTABLE || '/usr/bin/google-chrome-stable'
  const browser = await chromium.launch({ headless: true, executablePath })
  const results = { ok: [], dead: [] }

  await runBatch(items, browser, (r) => {
    results[r.browserStatus].push(r)
    const icon = r.browserStatus === 'ok' ? '✓' : '✗'
    console.log(
      `  ${icon} [${r.browserStatus}] ${r.url}${r.title ? ` -> "${r.title}"` : ''}${
        r.finalUrl && r.finalUrl !== r.url ? ` (${r.finalUrl})` : ''
      }${r.error ? ` (${r.error})` : ''}`
    )
  })

  await browser.close()

  console.log(`\n浏览器验证结果：正常 ${results.ok.length}，确实失效 ${results.dead.length}`)
  if (results.dead.length) {
    console.log('\n真实失效链接（需要修复）：')
    for (const r of results.dead) {
      console.log(`  - ${r.url}${r.title ? ` -> "${r.title}"` : ''}${r.error ? ` (${r.error})` : ''}`)
    }
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
