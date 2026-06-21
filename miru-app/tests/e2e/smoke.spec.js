import { test, expect } from '@playwright/test'

const BASE = '/miru-index/'

async function isMobile(page) {
  const menuBtn = page.locator('[aria-label="打开目录"]')
  return menuBtn.isVisible().catch(() => false)
}

test.describe('首页与基础渲染', () => {
  test('页面标题与加载器正常', async ({ page }) => {
    await page.goto(BASE)
    await expect(page).toHaveTitle(/MIRU INDEX/)
    await expect(page.locator('.app-loader')).not.toBeVisible()
  })

  test('侧边栏核心元素存在', async ({ page }) => {
    await page.goto(BASE)
    if (await isMobile(page)) {
      await page.locator('[aria-label="打开目录"]').click()
      const drawer = page.locator('[data-testid="drawer-panel"]')
      await expect(drawer).toBeVisible()
      await expect(drawer.locator('text=全部 · 總藏')).toBeVisible()
      await expect(drawer.locator('text=快速过滤')).toBeVisible()
      await expect(drawer.locator('text=标签云')).toBeVisible()
    } else {
      const sidebar = page.locator('[data-testid="sidebar-nav"]')
      await expect(sidebar).toBeVisible()
      await expect(sidebar.locator('text=全部 · 總藏')).toBeVisible()
      await expect(sidebar.locator('text=快速过滤')).toBeVisible()
      await expect(sidebar.locator('text=标签云')).toBeVisible()
    }
  })

  test('主内容区站点卡片渲染', async ({ page }) => {
    await page.goto(BASE)
    const cards = page.locator('.card-paper')
    await expect(cards.first()).toBeVisible()
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('底部统计与页脚存在', async ({ page }) => {
    await page.goto(BASE)
    if (await isMobile(page)) {
      await expect(page.locator('.mobile-topbar')).toBeVisible()
      await expect(page.locator('.site-footer')).toBeVisible()
    } else {
      const sidebar = page.locator('[data-testid="sidebar-nav"]')
      await expect(sidebar.locator('text=/共 \\d+ 卷/')).toBeVisible()
      await expect(page.locator('.site-footer')).toBeVisible()
    }
  })
})
