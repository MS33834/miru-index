#!/usr/bin/env node
/**
 * 链接修复脚本（仅替换/追加，不删除任何条目）
 *  - URL 替换：失效域名 → 可用域名
 *  - 镜像追加：为 github.com 上的开源工具补 mirrors 字段
 *  - 标记国际站：把已知被墙的国际站强制 proxy=true
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const FILES = [
  path.resolve(ROOT, 'src/data/nav.js'),
  path.resolve(ROOT, 'src/data/site-extensions.js'),
]

// URL 替换：把失效域名换成可用的官方/镜像地址
const URL_REPLACEMENTS = {
  'https://www.mangacopy.com/': 'https://www.copymanga.site/',
  'https://motrix.app/': 'https://github.com/agalwood/Motrix/releases',
  'https://www.alibabagroup.com/': 'https://www.alibabafonts.com/',
  'https://www.agedm.org/': 'https://www.agedm.tv/',
  'https://www.mxdm.xyz/': 'https://www.mxdm999.com/',
}

// GitHub 仓库镜像表（国内友好）：name → mirrors
const GH_MIRRORS = {
  'Motrix': [
    'https://gh-proxy.com/https://github.com/agalwood/Motrix/releases',
    'https://mirror.ghproxy.com/https://github.com/agalwood/Motrix/releases',
  ],
  'qBittorrent': [
    'https://gh-proxy.com/https://github.com/qbittorrent/qBittorrent/releases',
  ],
  'Tachiyomi': [
    'https://gh-proxy.com/https://github.com/tachiyomiorg/tachiyomi/releases',
  ],
  'Anikki': [
    'https://gh-proxy.com/https://github.com/KomodoStack/Anikki/releases',
  ],
  'mpv': [
    'https://gh-proxy.com/https://github.com/mpv-player/mpv/releases',
  ],
  'mpv.net': [
    'https://gh-proxy.com/https://github.com/stax76/mpv.net/releases',
  ],
  'FFmpeg': [
    'https://gh-proxy.com/https://github.com/BtbN/FFmpeg-Builds/releases',
  ],
  'mpvKt': [
    'https://gh-proxy.com/https://github.com/abdallahmehiz/mpvKt/releases',
  ],
  'Stash': [
    'https://gh-proxy.com/https://github.com/stashapp/stash/releases',
  ],
  'HandBrake': [
    'https://gh-proxy.com/https://github.com/HandBrake/HandBrake/releases',
  ],
  'Peerflix': [
    'https://gh-proxy.com/https://github.com/mafintosh/peerflix',
  ],
  'Popcorn-Time': [
    'https://gh-proxy.com/https://github.com/popcorn-official/popcorn-desktop/releases',
  ],
  'yt-dlp': [
    'https://gh-proxy.com/https://github.com/yt-dlp/yt-dlp/releases',
  ],
  'Annie': [
    'https://gh-proxy.com/https://github.com/iawia002/lux/releases',
  ],
  'You-Get': [
    'https://gh-proxy.com/https://github.com/soimort/you-get/releases',
  ],
  'Pillager': [
    'https://gh-proxy.com/https://github.com/valkjsaaa/Pillager',
  ],
  'Eagle': [
    'https://gh-proxy.com/https://github.com/eagle-app/eagle/releases',
  ],
  'Honeyview': [
    'https://www.bandisoft.com/honeyview/',
  ],
  'Billfish': [
    'https://www.billfish.cn/',
  ],
  'Pixcall': [
    'https://pixcall.com/',
  ],
}

// 把已知被墙的国际站自动加 proxy=true（不删除任何条目）
const FORCE_PROXY_HOSTS = [
  'pixiv.net',
  'deviantart.com',
  'pinterest.com',
  'twitter.com',
  'x.com',
  'youtube.com',
  'twitch.tv',
  'discord.com',
  'discord.gg',
  'reddit.com',
  'bsky.app',
  'threads.net',
  'spotify.com',
  'bandcamp.com',
  'soundcloud.com',
  'itch.io',
  'artstation.com',
  'crunchyroll.com',
  'gematsu.com',
  'fandom.com',
  'wikipedia.org',
  'myanimelist.net',
  'anilist.co',
  'vndb.org',
  'anidb.net',
  'archive.org',
  'twitter.com',
  'civitai.com',
  'huggingface.co',
  'replicate.com',
  'openai.com',
  'anthropic.com',
  'claude.ai',
  'gemini.google.com',
  'poe.com',
  'perplexity.ai',
  'midjourney.com',
  'leonardo.ai',
  'runwayml.com',
  'pika.art',
  'suno.ai',
  'udio.com',
  'elevenlabs.io',
  'descript.com',
  'notion.so',
  'obsidian.md',
  'logseq.com',
  'figma.com',
  'sketch.com',
  'behance.net',
  'dribbble.com',
  'stackoverflow.com',
  'developer.mozilla.org',
  'caniuse.com',
  'regex101.com',
  'devdocs.io',
  'codepen.io',
  'excalidraw.com',
  'fonts.bunny.net',
  'fontsquirrel.com',
  'ascii2d.net',
  'saucenao.com',
  'iqdb.org',
  'trace.moe',
  'google.com',
  'kakuyomu.jp',
  'syosetu.com',
  'royalroad.com',
  'archiveofourown.org',
  'ani.gamer.com.tw',
  'disneyplus.com',
  'funimation.com',
  'hidive.com',
  'abema.tv',
  'netflix.com',
  'apple.com',
  'onedrive.live.com',
  'drive.google.com',
  'dropbox.com',
  'mega.nz',
  '500px.com',
  'store.steampowered.com',
  'steamdb.info',
  'store.epicgames.com',
  'gog.com',
  'ign.com',
  'khanacademy.org',
  'coursera.org',
  'edx.org',
  'crashcourse.com',
  'thecrashcourse.com',
  'trello.com',
  'apps.ankiweb.net',
  'pocketcasts.com',
  'open.spotify.com',
  'podcasts.apple.com',
  '3d.iqdb.org',
]

function replaceUrls(text) {
  for (const [oldUrl, newUrl] of Object.entries(URL_REPLACEMENTS)) {
    text = text.split(oldUrl).join(newUrl)
  }
  return text
}

// 为 GitHub 开源工具追加 mirrors 字段
function addMirrors(text) {
  for (const [name, mirrors] of Object.entries(GH_MIRRORS)) {
    // 匹配包含 name: 'Name' 的对象块
    const re = new RegExp(
      `(name: '${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',\\s*url: 'https://github\\.com/[^']+',[\\s\\S]*?)(proxy: \\w+,?\\s*\\n)`,
      'g'
    )
    text = text.replace(re, (m, head, tail) => {
      if (head.includes('mirrors:')) return m
      return head.replace('proxy: ', 'mirrors: ' + JSON.stringify(mirrors) + ',\n      proxy: ') + tail
    })
  }
  return text
}

function shouldForceProxy(url) {
  try {
    const host = new URL(url).hostname.toLowerCase()
    return FORCE_PROXY_HOSTS.some((d) => host === d || host.endsWith('.' + d))
  } catch {
    return false
  }
}

// 把缺 proxy 字段的国际站补为 proxy: true（不删任何条目）
function ensureProxyFlag(text) {
  // 匹配 url: '...' 紧跟后面直到下一个 6 空格闭合的对象
  return text.replace(
    /(\{\s*\n\s*name: '[^']+',\s*\n\s*url: '(https?:\/\/[^']+)',[\s\S]*?)\n(\s{6}\},)/g,
    (m, body, url, end) => {
      if (!shouldForceProxy(url)) return m
      if (/proxy:\s*\w+/.test(body)) return m
      return body.replace(/(\s+)(tags: )/, '$1proxy: true,\n$1$2') + '\n' + end
    }
  )
}

async function main() {
  for (const file of FILES) {
    let text = await fs.readFile(file, 'utf8')
    const before = text
    text = replaceUrls(text)
    text = addMirrors(text)
    text = ensureProxyFlag(text)
    if (text !== before) {
      await fs.writeFile(file, text)
      console.log(`✓ 已修复 ${path.relative(ROOT, file)}`)
    } else {
      console.log(`- 无需修改 ${path.relative(ROOT, file)}`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
