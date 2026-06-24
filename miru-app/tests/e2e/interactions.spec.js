import { test, expect } from '@playwright/test'

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

test.describe('交互与过滤功能', () => {
  test('搜索功能', async ({ page }) => {
    await page.goto(BASE)
    const sidebar = await getSidebar(page)
    const input = sidebar.locator('[data-testid="sidebar-search"]')
    await input.fill('github')
    await input.press('Enter')
    await expect(page.locator('.card-paper').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('.search-result')).toBeVisible()
  })

  test('分类切换', async ({ page }) => {
    await page.goto(BASE)
    const sidebar = await getSidebar(page)
    const firstCategory = sidebar.locator('.sidebar-item').nth(1)
    const categoryName = await firstCategory.locator('.sidebar-item__name').textContent()
    await firstCategory.click()
    await expect(page.locator('.single-cat .volume__header h1')).toContainText(categoryName)
  })

  test('收藏过滤开关', async ({ page }) => {
    await page.goto(BASE)
    const sidebar = await getSidebar(page)
    const favBtn = sidebar.locator('[data-testid="filter-favorites"]')
    await favBtn.click()
    await expect(page.locator('.empty')).toBeVisible({ timeout: 3000 })
    await favBtn.click()
    await expect(page.locator('.card-paper').first()).toBeVisible({ timeout: 3000 })
  })

  test('直连/需梯过滤', async ({ page }) => {
    await page.goto(BASE)
    const sidebar = await getSidebar(page)
    const directBtn = sidebar.locator('[data-testid="filter-direct"]')
    const proxyBtn = sidebar.locator('[data-testid="filter-proxy"]')
    await directBtn.click()
    await expect(page.locator('.card-paper').first()).toBeVisible({ timeout: 3000 })
    await proxyBtn.click()
    await expect(page.locator('.card-paper').first()).toBeVisible({ timeout: 3000 })
    await proxyBtn.click()
  })

  test('标签云过滤', async ({ page }) => {
    await page.goto(BASE)
    const sidebar = await getSidebar(page)
    await sidebar.locator('[data-testid="tags-toggle"]').click()
    const firstTag = sidebar.locator('[data-testid="tag-chip"]').first()
    await expect(firstTag).toBeVisible()
    await firstTag.click()
    await expect(page.locator('.selected-tags')).toBeVisible({ timeout: 3000 })
  })

  test('网格/列表视图切换', async ({ page }) => {
    await page.goto(BASE)
    const grid = page.locator('.site-grid').first()
    await page.locator('[aria-label="列表视图"]').click()
    await expect(grid).toHaveClass(/site-grid--list/)
    await page.locator('[aria-label="网格视图"]').click()
    await expect(grid).toHaveClass(/site-grid--grid/)
  })

  test('打开卡片详情弹窗', async ({ page }) => {
    await page.goto(BASE)
    const firstCard = page.locator('.card-paper').first()
    await firstCard.click()
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('.modal-footer button')).toHaveCount(2)
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
  })

  test('收藏与取消收藏', async ({ page }) => {
    await page.goto(BASE)
    const firstCard = page.locator('.card-paper-wrap').first()
    const star = firstCard.locator('[title="收藏"]')
    await star.click()
    await expect(star).toHaveAttribute('aria-pressed', 'true')
    await star.click()
    await expect(star).toHaveAttribute('aria-pressed', 'false')
  })
})
