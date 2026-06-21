import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const BASE = '/miru-index/'

test.describe('可访问性扫描', () => {
  test('首页无严重可访问性问题', async ({ page }) => {
    test.setTimeout(60000)
    await page.goto(BASE)
    await page.waitForSelector('.card-paper')
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('弹窗可访问性', async ({ page }) => {
    test.setTimeout(60000)
    await page.goto(BASE)
    await page.locator('.card-paper').first().click()
    await page.waitForSelector('[role="dialog"]')
    const accessibilityScanResults = await new AxeBuilder({ page }).include('[role="dialog"]').analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })
})
