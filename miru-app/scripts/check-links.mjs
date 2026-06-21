#!/usr/bin/env node
import { categories } from '../src/data/nav.js'
import fs from 'fs/promises'
import path from 'path'

const HEALTH_JSON_PATH = path.resolve(process.cwd(), 'src', 'data', 'health.json')
const CONCURRENCY = 5
const TIMEOUT_MS = 15000

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'

function collectUrls() {
  const list = []
  for (const cat of categories) {
    for (const item of cat.items) {
      if (item.url) {
        list.push({ category: cat.id, name: item.name, url: item.url })
      }
    }
  }
  return list
}

async function checkUrl(url) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
    })
    clearTimeout(timer)
    if (res.ok || (res.status >= 300 && res.status < 400)) return 'ok'
    // 405 Method Not Allowed 时尝试 GET
    if (res.status === 405) {
      return await checkUrlGet(url)
    }
    return 'dead'
  } catch {
    return 'dead'
  }
}

async function checkUrlGet(url) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
    })
    clearTimeout(timer)
    if (res.ok || (res.status >= 300 && res.status < 400)) return 'ok'
    return 'dead'
  } catch {
    return 'dead'
  }
}

async function runBatch(items, onResult) {
  const queue = [...items]
  const workers = Array(CONCURRENCY)
    .fill(null)
    .map(async () => {
      while (queue.length) {
        const item = queue.shift()
        const health = await checkUrl(item.url)
        onResult(item, health)
      }
    })
  await Promise.all(workers)
}

async function main() {
  const writeMode = process.argv.includes('--write')
  const items = collectUrls()
  const results = { ok: [], dead: [] }
  const healthMap = {}

  console.log(`开始检测 ${items.length} 个链接...`)

  await runBatch(items, (item, health) => {
    healthMap[item.url] = health
    results[health].push(item)
    const icon = health === 'ok' ? '✓' : '✗'
    console.log(`  ${icon} [${health}] ${item.name}: ${item.url}`)
  })

  console.log('\n检测结果汇总')
  console.log(`  正常: ${results.ok.length}`)
  console.log(`  失效: ${results.dead.length}`)

  if (writeMode) {
    const output = {
      __generated: new Date().toISOString(),
      __total: items.length,
      __ok: results.ok.length,
      __dead: results.dead.length,
      ...healthMap,
    }
    await fs.writeFile(HEALTH_JSON_PATH, JSON.stringify(output, null, 2) + '\n')
    console.log(`\n已写入 ${path.relative(process.cwd(), HEALTH_JSON_PATH)}`)
  } else {
    console.log('\n使用 --write 参数可将结果写入 health.json')
  }

  if (results.dead.length) {
    console.log('\n失效链接：')
    for (const item of results.dead) {
      console.log(`  - ${item.name}: ${item.url}`)
    }
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
