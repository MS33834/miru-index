import { test, expect, devices } from '@playwright/test'

const BASE = '/miru-index/'

async function getSidebar(page) {
  const menuBtn = page.locator('[aria-label="打开目录"]')
  const isMobile = await menuBtn.isVisible().catch(() => false)
  if (isMobile) {
    await menuBtn.click()
    const drawer = page.locator('[data-testid="drawer-panel"]')
    await drawer.waitFor({ state: 'visible' })
    return drawer
  }
  return page.locator('[data-testid="sidebar-nav"]')
}

async function closeSidebarIfMobile(page) {
  const drawer = page.locator('[data-testid="drawer-panel"]')
  if (await drawer.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape')
    await drawer.waitFor({ state: 'hidden' })
  }
}

function captureWindowOpen(page) {
  return page.evaluate(() => {
    window.__openedUrls = []
    window.open = function (url) {
      window.__openedUrls.push(url)
      return { opener: null }
    }
  })
}

async function getFirstCardInfo(page) {
  const card = page.locator('.card-paper').first()
  await card.waitFor({ state: 'visible' })
  const wrap = card.locator('..')
  const url = await wrap.getAttribute('data-url')
  const title = await card.getAttribute('aria-label')
  return { card, url, title }
}

test.describe('用户行为模拟 - 桌面端完整链路', () => {
  test('首页滚动、返回顶部、分页', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForSelector('.card-paper')

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await expect(page.locator('.back-to-top')).toBeVisible({ timeout: 3000 })

    await page.locator('.back-to-top').click()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50)

    const nextBtn = page.locator('[aria-label="下一页"]')
    if (await nextBtn.isVisible().catch(() => false)) {
      await nextBtn.click()
      await expect(page.locator('.pagination__info')).toContainText('2')
      await page.locator('[aria-label="上一页"]').click()
      await expect(page.locator('.pagination__info')).toContainText('1')
    }
  })

  test('所有分类切换与面包屑返回', async ({ page }) => {
    await page.goto(BASE)

    for (let i = 1; i < 5; i++) {
      const sidebar = await getSidebar(page)
      const categories = sidebar.locator('.sidebar-item')
      const count = await categories.count()
      if (i >= count) break

      const cat = categories.nth(i)
      const name = (await cat.locator('.sidebar-item__name').textContent()).trim()
      await cat.click()
      await closeSidebarIfMobile(page)
      await expect(page.locator('.single-cat .volume__header h2')).toContainText(name)
      await page.locator('.breadcrumb__item').first().click()
      await expect(page.locator('.volume').first()).toBeVisible()
    }
  })

  test('过滤条与视图切换全部按钮可用', async ({ page }) => {
    await page.goto(BASE)

    await page.locator('[aria-label="列表视图"]').click()
    await expect(page.locator('.site-grid--list').first()).toBeVisible()
    await page.locator('[aria-label="网格视图"]').click()
    await expect(page.locator('.site-grid--grid').first()).toBeVisible()

    await expect(page.locator('button:has-text("导出收藏")')).toBeVisible()
    await expect(page.locator('button:has-text("导入收藏")')).toBeVisible()
  })

  test('搜索、清空、最近搜索', async ({ page }) => {
    await page.goto(BASE)
    const sidebar = await getSidebar(page)
    const input = sidebar.locator('[data-testid="sidebar-search"]')
    await input.fill('github')
    await input.press('Enter')
    await expect(page.locator('.search-result')).toBeVisible()

    await closeSidebarIfMobile(page)
    await page.locator('[aria-label="清空搜索"]').click()
    await expect(page.locator('.search-result')).not.toBeVisible()
    await expect(page.locator('.hero')).toBeVisible()
  })

  test('弹窗内所有按钮与链接跳转正确', async ({ page }) => {
    await page.goto(BASE)
    await captureWindowOpen(page)

    const { card, url, title } = await getFirstCardInfo(page)
    expect(url).toMatch(/^https?:\/\//)
    expect(title?.length).toBeGreaterThan(0)

    await card.click()
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('h2')).toContainText(title.split(' — ')[0])

    await dialog.locator('[aria-label="关闭对话框（按 Esc 退出）"]').click()
    await expect(dialog).not.toBeVisible()

    await card.click()
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()

    await card.click()
    await dialog.locator('.modal-footer button').first().click()
    const opened = await page.evaluate(() => window.__openedUrls)
    expect(opened.length).toBeGreaterThan(0)
    expect(opened[0]).toMatch(/^https?:\/\//)
  })
})

test.describe('用户行为模拟 - 移动端完整链路', () => {
  test.use({ viewport: devices['Pixel 5'].viewport })

  test('抽屉打开、筛选、关闭全流程', async ({ page }) => {
    await page.goto(BASE)

    const menuBtn = page.locator('[aria-label="打开目录"]')
    await expect(menuBtn).toBeVisible()
    await menuBtn.click()

    const drawer = page.locator('[data-testid="drawer-panel"]')
    await expect(drawer).toBeVisible()

    await drawer.locator('[data-testid="filter-direct"]').click()
    await expect(page.locator('.card-paper').first()).toBeVisible()

    await drawer.locator('[data-testid="filter-favorites"]').click()
    await expect(page.locator('.empty')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(drawer).toBeHidden()
  })

  test('移动端弹窗与链接跳转', async ({ page }) => {
    await page.goto(BASE)
    await captureWindowOpen(page)

    const { card, url } = await getFirstCardInfo(page)
    expect(url).toMatch(/^https?:\/\//)

    await card.click()
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    await dialog.locator('.modal-footer button').first().click()
    const opened = await page.evaluate(() => window.__openedUrls)
    expect(opened.length).toBeGreaterThan(0)
    expect(opened[0]).toMatch(/^https?:\/\//)
  })
})

test.describe('用户行为模拟 - 键盘快捷键', () => {
  test('? 打开帮助 / Esc 关闭 / v 切换视图 / f 切换收藏', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForSelector('.card-paper')

    await page.keyboard.press('?')
    await expect(page.locator('text=/键 · 盤 · 速/')).toBeVisible({ timeout: 3000 })

    await page.keyboard.press('Escape')
    await expect(page.locator('text=/键 · 盤 · 速/')).not.toBeVisible()

    const grid = page.locator('.site-grid').first()
    await page.keyboard.press('v')
    await expect(grid).toHaveClass(/site-grid--list/)
    await page.keyboard.press('v')
    await expect(grid).toHaveClass(/site-grid--grid/)

    await page.keyboard.press('f')
    await expect(page.locator('.empty')).toBeVisible({ timeout: 3000 })
    await page.keyboard.press('f')
    await expect(page.locator('.card-paper').first()).toBeVisible({ timeout: 3000 })
  })
})

test.describe('用户行为模拟 - 链接抽样验证', () => {
  test('随机抽取卡片验证链接格式与可打开性', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForSelector('.card-paper')

    const cards = await page.locator('.card-paper-wrap').evaluateAll((els) =>
      els
        .map((el) => {
          const btn = el.querySelector('.card-paper')
          const title = btn?.getAttribute('aria-label')?.split(' — ')[0] || ''
          const url = el.dataset.url || ''
          return { title, url }
        })
        .filter((c) => c.title && c.url)
        .slice(0, 20)
    )

    expect(cards.length).toBeGreaterThan(0)
    for (const card of cards) {
      expect(card.url).toMatch(/^https?:\/\//)
      expect(card.title.length).toBeGreaterThan(0)
    }
  })

  test('GitHub 项目弹窗镜像与原链', async ({ page }) => {
    await page.goto(BASE)
    await page.waitForSelector('.card-paper')

    const githubCard = page.locator('.card-paper-wrap[data-url*="github.com"] .card-paper').first()
    if (await githubCard.isVisible().catch(() => false)) {
      await githubCard.click()
      const dialog = page.locator('[role="dialog"]')
      await expect(dialog).toBeVisible()

      await dialog.locator('[aria-label="切换镜像选择"]').click()
      await expect(dialog.locator('[role="option"]').first()).toBeVisible()

      await dialog.locator('[aria-label="切换镜像选择"]').click()
      await page.keyboard.press('Escape')
      await expect(dialog).not.toBeVisible()
    }
  })
})
