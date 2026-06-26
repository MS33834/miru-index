#!/usr/bin/env node
/**
 * 用 Playwright Chromium 从 SVG 生成 PWA PNG 图标
 */
import { chromium } from '@playwright/test'
import path from 'path'

const PUBLIC_DIR = path.resolve(process.cwd(), 'public')

// 印章风图标 SVG（与 favicon 一致的"漫藏"红印）
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0a0a0a"/>
  <rect x="48" y="48" width="416" height="416" fill="none" stroke="#ff4d4f" stroke-width="16" rx="8"/>
  <text x="256" y="220" text-anchor="middle" fill="#ff4d4f" font-family="serif" font-size="160" font-weight="900">漫</text>
  <text x="256" y="400" text-anchor="middle" fill="#ff4d4f" font-family="serif" font-size="160" font-weight="900">藏</text>
</svg>`

// maskable 图标：内容区域需缩放到安全区（80%）
const MASKABLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0a0a0a"/>
  <rect x="102" y="102" width="308" height="308" fill="none" stroke="#ff4d4f" stroke-width="12" rx="6"/>
  <text x="256" y="210" text-anchor="middle" fill="#ff4d4f" font-family="serif" font-size="110" font-weight="900">漫</text>
  <text x="256" y="340" text-anchor="middle" fill="#ff4d4f" font-family="serif" font-size="110" font-weight="900">藏</text>
</svg>`

async function generateIcon(svgContent, size, outputPath) {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;">${svgContent}</body></html>`)
  await page.screenshot({
    path: outputPath,
    type: 'png',
    omitBackground: false,
    clip: { x: 0, y: 0, width: size, height: size },
  })
  await browser.close()
  console.log(`✓ ${path.relative(process.cwd(), outputPath)} (${size}x${size})`)
}

async function main() {
  await generateIcon(ICON_SVG, 192, path.join(PUBLIC_DIR, 'icon-192.png'))
  await generateIcon(ICON_SVG, 512, path.join(PUBLIC_DIR, 'icon-512.png'))
  await generateIcon(MASKABLE_SVG, 512, path.join(PUBLIC_DIR, 'icon-maskable-512.png'))
  console.log('\n所有 PWA 图标已生成')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
