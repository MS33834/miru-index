#!/usr/bin/env node
/**
 * 链接健康检查脚本
 *  - 区分 ok / restricted（401/403/407）/ blocked（网络层阻断）/ dead（站点彻底失效）
 *  - 支持 KNOWN_BLOCKED 名单：在 CI 出口环境下被墙的国际站，标记为 blocked 而非 dead
 *  - 支持 SKIP_DOMAINS 名单：完全不检测（已知永远连不上的）
 *  - 优先用 HEAD，405/网络错误时回退 GET；不读 body，加快速度
 */
import { categories } from '../src/data/nav.js'
import fs from 'fs/promises'
import path from 'path'

const HEALTH_JSON_PATH = path.resolve(process.cwd(), 'src', 'data', 'health.json')
const CONCURRENCY = 6
const TIMEOUT_MS = 12000

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'

// 已知在 CI 出口被墙的国际站，标记为 blocked（用户侧可能正常）
const KNOWN_BLOCKED = [
  'pixiv.net',
  'deviantart.com',
  'pinterest.com',
  'twitter.com',
  'x.com',
  'nicovideo.jp',
  'youtube.com',
  'twitch.tv',
  'discord.com',
  'discord.gg',
  'reddit.com',
  'bsky.app',
  'threads.net',
  'spotify.com',
  'kkbox.com',
  'deezer.com',
  'tidal.com',
  'himalaya.com',
  'bandcamp.com',
  'soundcloud.com',
  'touhou-music.jp',
  'tokyocomiccon.jp',
  'kyomaf.net',
  'c3afatokyo.com',
  'comiket.co.jp',
  'wikipedia.org',
  'overcast.fm',
  'castbox.fm',
  'podbean.com',
  'itch.io',
  'rpgmakerweb.com',
  'monogame.net',
  'dlsite.com',
  'melonbooks.co.jp',
  'booth.pm',
  'danbooru.donmai.us',
  'dic.pixiv.net',
  'gamefaqs.gamespot.com',
  'tvtropes.org',
  'fandom.com',
  'archive.org',
  'z-lib.help',
  'z-lib.org',
  'store.playstation.com',
  'store.epicgames.com',
  'bgm.tv',
  'anime.eiga.com',
  'artstation.com',
  'saraba1st.com',
  'gamer.com.tw',
  'v2ex.com',
  'zerochan.net',
  'wallhaven.cc',
  'steamcommunity.com',
  'imgur.com',
  'fonts.google.com',
  'googleapis.com',
  'myanimelist.net',
  'anilist.co',
  'vndb.org',
  'anidb.net',
  'anikore.jp',
  'animenewsnetwork.com',
  'crunchyroll.com',
  'gematsu.com',
  'oricon.co.jp',
  'thwiki.cc',
  'seiga.nicovideo.jp',
  '3d.nicovideo.jp',
  'sites.google.com',
  'hello.vrchat.com',
  'vrchat.com',
  'wikipedia.org',
  'commons.wikimedia.org',
  'en.wikipedia.org',
  'ja.wikipedia.org',
  'zh.wikipedia.org',
  'translate.google.com',
  'fonts.googleapis.com',
  'docs.qq.com',
]

// 完全跳过：本地不检测
const SKIP_DOMAINS = new Set()

function isBlockedHost(url) {
  try {
    const host = new URL(url).hostname.toLowerCase()
    if (SKIP_DOMAINS.has(host)) return 'skip'
    if (KNOWN_BLOCKED.some((d) => host === d || host.endsWith('.' + d))) return 'blocked'
  } catch {}
  return null
}

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

const COMMON_HEADERS = {
  'User-Agent': USER_AGENT,
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7',
  'Accept-Encoding': 'identity',
  Connection: 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
}

async function fetchOnce(url, method = 'HEAD') {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method,
      redirect: 'follow',
      signal: controller.signal,
      headers: COMMON_HEADERS,
    })
    return { ok: true, status: res.status, url: res.url }
  } catch (err) {
    return { ok: false, error: err.name || err.message }
  } finally {
    clearTimeout(timer)
  }
}

async function checkUrl(url) {
  let result = await fetchOnce(url, 'HEAD')
  if (result.ok && result.status >= 200 && result.status < 400) return 'ok'
  if (!result.ok || result.status === 405) {
    result = await fetchOnce(url, 'GET')
  }
  if (result.ok && result.status >= 200 && result.status < 400) return 'ok'
  // 401/403/407 站点活着但拒爬
  if (result.ok && (result.status === 401 || result.status === 403 || result.status === 407)) {
    return 'restricted'
  }
  // 网络层错误（被墙 / 解析失败 / 超时）
  if (!result.ok && /ECONNRESET|ETIMEDOUT|ENOTFOUND|ECONNREFUSED|AbortError|timeout/i.test(result.error || '')) {
    return 'blocked'
  }
  return 'dead'
}

async function runBatch(items, onResult) {
  const queue = [...items]
  const workers = Array(CONCURRENCY)
    .fill(null)
    .map(async () => {
      while (queue.length) {
        const item = queue.shift()
        const pre = isBlockedHost(item.url)
        if (pre === 'skip') {
          onResult(item, 'skip')
          continue
        }
        if (pre === 'blocked') {
          onResult(item, 'blocked')
          continue
        }
        const health = await checkUrl(item.url)
        onResult(item, health)
      }
    })
  await Promise.all(workers)
}

async function main() {
  const writeMode = process.argv.includes('--write')
  const items = collectUrls()
  const results = { ok: [], restricted: [], blocked: [], dead: [], skip: [] }
  const healthMap = {}

  console.log(`开始检测 ${items.length} 个链接...`)

  await runBatch(items, (item, health) => {
    healthMap[item.url] = health
    results[health].push(item)
    const icon = { ok: '✓', restricted: '!', blocked: '~', dead: '✗', skip: '-' }[health]
    console.log(`  ${icon} [${health}] ${item.name}: ${item.url}`)
  })

  console.log('\n检测结果汇总')
  console.log(`  正常:    ${results.ok.length}`)
  console.log(`  受限:    ${results.restricted.length}`)
  console.log(`  网络阻断:${results.blocked.length}`)
  console.log(`  失效:    ${results.dead.length}`)
  console.log(`  跳过:    ${results.skip.length}`)

  if (writeMode) {
    const output = {
      __generated: new Date().toISOString(),
      __total: items.length,
      __ok: results.ok.length,
      __restricted: results.restricted.length,
      __blocked: results.blocked.length,
      __dead: results.dead.length,
      __skip: results.skip.length,
      ...healthMap,
    }
    await fs.writeFile(HEALTH_JSON_PATH, JSON.stringify(output, null, 2) + '\n')
    console.log(`\n已写入 ${path.relative(process.cwd(), HEALTH_JSON_PATH)}`)
  } else {
    console.log('\n使用 --write 参数可将结果写入 health.json')
  }

  if (results.dead.length) {
    console.log('\n失效链接（建议修复）：')
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
