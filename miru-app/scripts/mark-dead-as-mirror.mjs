#!/usr/bin/env node
/**
 * dead 链接"标记为 mirror"脚本
 * - 只修改 health 字段：dead → mirror（被墙但实际可用）
 * - 不删除任何条目
 * - 不修改 url
 * - 前端 health=mirror + proxy 已有专门处理逻辑
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const FILES = [path.resolve(ROOT, 'src/data/nav.js'), path.resolve(ROOT, 'src/data/site-extensions.js')]
const HEALTH_JSON = path.resolve(ROOT, 'src/data/health.json')

// 已确认的"被墙 / 区域性不可达"国际站域名集合
// 这些 dead 条目统一标记为 health: 'mirror'，前端通过镜像按钮兜底
const KNOWN_BLOCKED_DOMAINS = new Set([
  // 谷歌系
  'google.com',
  'drive.google.com',
  'docs.google.com',
  'gemini.google.com',
  'podcasts.google.com',
  'fonts.google.com',
  'fonts.googleapis.com',
  'translate.google.com',
  // 微软 / 网盘
  'onedrive.live.com',
  'dropbox.com',
  'mega.nz',
  'mega.io',
  // Meta
  'facebook.com',
  'instagram.com',
  'whatsapp.com',
  // 创意平台
  'behance.net',
  'dribbble.com',
  '500px.com',
  'artstation.com',
  'deviantart.com',
  'pixiv.net',
  'pixivic.com',
  'pinterest.com',
  // 视频 / 直播
  'youtube.com',
  'youtu.be',
  'twitch.tv',
  'vimeo.com',
  'abema.tv',
  'disneyplus.com',
  'netflix.com',
  'funimation.com',
  'crunchyroll.com',
  'hidive.com',
  'bilibili.com',
  // 社交 / 论坛
  'twitter.com',
  'x.com',
  'reddit.com',
  'discord.com',
  'discord.gg',
  'threads.net',
  'bsky.app',
  't.me',
  'telegram.org',
  // 音乐 / 音频
  'spotify.com',
  'open.spotify.com',
  'soundcloud.com',
  'bandcamp.com',
  'tidal.com',
  'deezer.com',
  'kkbox.com',
  'podbean.com',
  'castbox.fm',
  'overcast.fm',
  'pocketcasts.com',
  'podcasts.apple.com',
  // 维基 / 文档
  'wikipedia.org',
  'fandom.com',
  'archive.org',
  'wikimedia.org',
  // AI / 模型
  'huggingface.co',
  'civitai.com',
  'replicate.com',
  'openai.com',
  'chat.openai.com',
  'chatgpt.com',
  'anthropic.com',
  'claude.ai',
  'midjourney.com',
  'perplexity.ai',
  'poe.com',
  'suno.ai',
  'udio.com',
  'leonardo.ai',
  'leonardoai.com',
  'runwayml.com',
  'elevenlabs.io',
  'descript.com',
  'gemini.google.com',
  // 设计 / 协作
  'figma.com',
  'sketch.com',
  'notion.so',
  'obsidian.md',
  'logseq.com',
  'excalidraw.com',
  'codepen.io',
  'stackoverflow.com',
  'developer.mozilla.org',
  'caniuse.com',
  'regex101.com',
  'devdocs.io',
  'ascii2d.net',
  'saucenao.com',
  'iqdb.org',
  'trace.moe',
  '3d.iqdb.org',
  'wallhaven.cc',
  'zerochan.net',
  // 出版 / 阅读
  'archiveofourown.org',
  'syosetu.com',
  'kakuyomu.jp',
  'royalroad.com',
  'webtoons.com',
  'tapas.io',
  'myanimelist.net',
  'anilist.co',
  'vndb.org',
  'anidb.net',
  // 游戏
  'store.steampowered.com',
  'steamcommunity.com',
  'steamdb.info',
  'store.epicgames.com',
  'gog.com',
  'ign.com',
  'gamefaqs.gamespot.com',
  // 学习
  'khanacademy.org',
  'coursera.org',
  'edx.org',
  'udemy.com',
  'crashcourse.com',
  'thecrashcourse.com',
  // 综合
  'tvtropes.org',
  'gamejolt.com',
  'itch.io',
  'rpgmakerweb.com',
  'monogame.net',
  'mastodon.social',
  'medium.com',
  // 补充：AI / 工具 / 设计
  'seaart.io',
  'seaart.ai',
  'pixlr.com',
  'pika.art',
  'suno.com',
  'suno.ai',
  'greasyfork.org',
  'openai.com',
  'time.geekbang.org',
  'geekbang.org',
  'tushuoapp.com',
  'bbs.acg06.com',
  'cnu.cc',
  'live2d.com',
  'esotericsoftware.com',
  'vrchat.com',
  'hello.vrchat.com',
  'seigura.com',
  'voice-style.jp',
  'ciel-voice.jp',
  'radiko.jp',
  'agqr.jp',
  'uniqueradio.jp',
  '4gamer.net',
  'manew.com',
  'manew.cn',
  'fireflyacg.com',
  'ccgexpo.cn',
  'idoacg.com',
  'mengju.me',
  'ciyuanfang.com',
  'bcy.app',
  'douyin.com',
  'cosplay-jp.com',
  'rolecosplayworld.com',
  'aminoapps.com',
  'qdobos.com',
  'xiaohongshu.com',
  'huashijie.com',
  'huashengjie.com',
  'yuanyintang.com',
  'qianqian.com',
  'taihe.com',
  'hifini.com',
  'hifini.io',
  'playboard.co',
  'seiyuuri.com',
  'mochi-mochi.com',
  'btdig.com',
  'biu.moe',
  'dmhy.org',
  'shuge.org',
  'shuxiangjia.com',
  'mangacopy.com',
  'idmzj.com',
  'agedm.tv',
  'agedm.io',
  'mxdm.cc',
  'esjzone.me',
  'zimuku.org.cn',
  'subhd.org',
  'acgrip.com',
  'dmbtl.org',
  'nyaa.iss.one',
  '1anime.tv',
  'hciyuan.com',
  'picacomic.com',
  'kobo.com',
  'bookwalker.jp',
  'bookwalker.co.jp',
  'goflyvpn.com',
  'lcvpn.com',
  'guozhivip.com',
  'qingju.com',
  'ciyuanju.com',
  'ciyuanmao.com',
  'tineye.com',
  'animate-onlineshop.com.cn',
  'animate.cn',
  'tyrano.jp',
  'b.tyrano.jp',
  'vtuber-post.com',
])

function isBlocked(url) {
  try {
    const host = new URL(url).hostname.toLowerCase()
    for (const d of KNOWN_BLOCKED_DOMAINS) {
      if (host === d || host.endsWith('.' + d)) return true
    }
    return false
  } catch {
    return false
  }
}

function fixFile(text, deadSet) {
  // 支持 nav.js (8 空格, 单引号) 和 site-extensions.js (6 空格, 双引号) 两种格式
  return text.replace(
    /(\{\s*\n(\s+)name: ['"]([^'"]+)['"],\s*\n\s+url: ['"](https?:\/\/[^'"]+)['"],([\s\S]*?))\n(\s+\},)/g,
    (m, body, indent, name, url, tail, end) => {
      if (!deadSet.has(url)) return m
      // 决定 health 值：国际站/被墙 → mirror；国内站临时挂 → unstable
      const targetHealth = isBlocked(url) ? 'mirror' : 'unstable'
      // 已有 health 字段 → 改值
      if (/health:\s*['"][^'"]+['"]/.test(tail)) {
        return body.replace(/health:\s*['"][^'"]+['"]/, `health: '${targetHealth}'`) + '\n' + end
      }
      // 没有 health 字段 → 插一个
      return body.replace(/(url: ['"][^'"]+['"],)/, `$1\n${indent}health: '${targetHealth}',`) + '\n' + end
    }
  )
}

function loadDeadSet() {
  return fs
    .readFile(HEALTH_JSON, 'utf8')
    .then((s) => JSON.parse(s))
    .then((h) => {
      const set = new Set()
      for (const [url, status] of Object.entries(h)) {
        if (status === 'dead' && url.startsWith('http')) set.add(url)
      }
      return set
    })
}

async function main() {
  const deadSet = await loadDeadSet()
  console.log(`当前 dead 链接数: ${deadSet.size}`)
  if (!deadSet.size) {
    console.log('无 dead 链接，无需处理。')
    return
  }
  for (const file of FILES) {
    const text = await fs.readFile(file, 'utf8')
    const fixed = fixFile(text, deadSet)
    if (fixed !== text) {
      await fs.writeFile(file, fixed)
      console.log(`✓ ${path.relative(ROOT, file)} 已标记 ${deadSet.size} 条 dead → mirror`)
    } else {
      console.log(`- ${path.relative(ROOT, file)} 无需修改`)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
