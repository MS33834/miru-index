#!/usr/bin/env node
import { chromium, devices } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import fs from 'fs/promises'
import path from 'path'

const BASE_URL = process.env.BASE_URL || 'http://localhost:4173/miru-index/'
const OUT_DIR = path.resolve(process.cwd(), 'scripts', 'audit-output')

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch {
    /* 忽略已存在 */
  }
}

async function runAudit() {
  await ensureDir(OUT_DIR)
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  const consoleErrors = []
  const consoleWarnings = []

  page.on('console', (msg) => {
    const text = msg.text()
    const type = msg.type()
    if (type === 'error') consoleErrors.push(text)
    if (type === 'warning') consoleWarnings.push(text)
  })

  page.on('pageerror', (err) => {
    consoleErrors.push(`PAGE_ERROR: ${err.message}`)
  })

  // 1. 首页加载
  console.log(`\n[1/6] 打开首页: ${BASE_URL}`)
  const start = Date.now()
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })
  const loadTime = Date.now() - start
  await page.screenshot({ path: path.join(OUT_DIR, 'home-desktop.png'), fullPage: true })
  console.log(`   加载耗时: ${loadTime}ms`)

  // 2. Axe 可访问性检测
  console.log('\n[2/6] 运行 axe-core 可访问性检测')
  try {
    const axeResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    const violations = axeResults.violations
    if (violations.length) {
      console.log(`   发现 ${violations.length} 类可访问性问题:`)
      for (const v of violations) {
        console.log(`   - ${v.id}: ${v.help} (${v.nodes.length} 个节点)`)
        for (const n of v.nodes.slice(0, 3)) {
          console.log(`     • ${n.target.join(' ')}`)
        }
      }
    } else {
      console.log('   未检测到严重可访问性问题')
    }
    await fs.writeFile(path.join(OUT_DIR, 'axe-results.json'), JSON.stringify(violations, null, 2))
  } catch (e) {
    console.log('   axe 检测失败:', e.message)
  }

  // 3. 搜索交互
  console.log('\n[3/6] 测试搜索交互')
  const searchInput = page.locator('.scroll-input').first()
  if (await searchInput.isVisible().catch(() => false)) {
    await searchInput.fill('Mihon')
    await page.waitForTimeout(500)
    await page.screenshot({ path: path.join(OUT_DIR, 'search-results.png'), fullPage: true })
    const resultCount = await page
      .locator('.search-result')
      .textContent()
      .catch(() => '')
    console.log(`   搜索 "Mihon" 结果: ${resultCount.trim().slice(0, 80)}`)
  } else {
    console.log('   未找到搜索框')
  }

  // 4. 打开卡片详情 Modal
  console.log('\n[4/6] 测试卡片详情 Modal')
  const firstCard = page.locator('.card-paper').first()
  if (await firstCard.isVisible().catch(() => false)) {
    await firstCard.click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: path.join(OUT_DIR, 'modal-open.png') })
    const modalTitle = await page
      .locator('[role="dialog"] h2')
      .first()
      .textContent()
      .catch(() => '')
    console.log(`   Modal 标题: ${modalTitle.trim()}`)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)
  } else {
    console.log('   未找到卡片')
  }

  // 5. 移动端视图
  console.log('\n[5/6] 移动端视图检测')
  const mobileContext = await browser.newContext({
    ...devices['iPhone 13'],
    isMobile: true,
  })
  const mobilePage = await mobileContext.newPage()
  await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' })
  await mobilePage.screenshot({ path: path.join(OUT_DIR, 'home-mobile.png'), fullPage: true })
  const hamburger = mobilePage.locator('button[aria-label="打开目录"]').first()
  if (await hamburger.isVisible().catch(() => false)) {
    await hamburger.click()
    await mobilePage.waitForTimeout(300)
    await mobilePage.screenshot({ path: path.join(OUT_DIR, 'mobile-drawer.png') })
    console.log('   移动端抽屉可打开')
  }
  await mobileContext.close()

  // 6. 性能指标（简化）
  console.log('\n[6/6] 收集性能指标')
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0]
    const paint = performance.getEntriesByType('paint')
    return {
      domContentLoaded: nav?.domContentLoadedEventEnd,
      loadComplete: nav?.loadEventEnd,
      firstPaint: paint.find((p) => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find((p) => p.name === 'first-contentful-paint')?.startTime,
    }
  })
  console.log('   性能指标:', metrics)

  // 控制台错误
  console.log('\n[汇总]')
  console.log(`   控制台错误: ${consoleErrors.length}`)
  consoleErrors.slice(0, 10).forEach((e) => console.log(`   - ${e}`))
  console.log(`   控制台警告: ${consoleWarnings.length}`)
  consoleWarnings.slice(0, 5).forEach((w) => console.log(`   - ${w}`))

  await browser.close()
  console.log(`\n截图与报告已保存到: ${OUT_DIR}`)
}

runAudit().catch((e) => {
  console.error(e)
  process.exit(1)
})
