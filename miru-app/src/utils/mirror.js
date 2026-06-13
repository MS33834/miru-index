// 镜像工具函数
// 为海外站点 / GitHub 资源提供国内可达的镜像链接

/**
 * GitHub 加速镜像源
 * fmt='repo'  → 仓库主页镜像（jsDelivr 风格）：https://cdn.jsdelivr.net/gh/owner/repo
 * fmt='proxy' → 任意 GitHub URL 代理（gh-proxy 风格）：base + 原 URL
 */
export const GH_MIRRORS = [
  { id: 'jsdelivr', name: 'jsDelivr CDN',  fmt: 'repo'  },
  { id: 'ghproxy',  name: 'GhProxy',        fmt: 'proxy' },
  { id: 'ghps',     name: 'GhProxy.net',    fmt: 'proxy' },
  { id: 'mirror',   name: 'GhProxy Mirror', fmt: 'proxy' },
  { id: 'fastgit',  name: 'FastGit',        fmt: 'proxy' },
]

const GH_PROXY_BASES = {
  ghproxy: 'https://gh-proxy.com/',
  ghps:    'https://ghps.cc/',
  mirror:  'https://mirror.ghproxy.com/',
  fastgit: 'https://raw.fastgit.org/',
}

const JSDELIVR_BASE = 'https://cdn.jsdelivr.net/gh/'

/**
 * 判断 URL 是否为 GitHub 仓库主页（无 /blob/ /tree/ /releases/ /raw/ 等路径）
 */
function isRepoHome(url) {
  // 更严格的正则：匹配 github.com/owner/repo 且后面没有路径（除了可选的 / 或查询参数）
  return /^https:\/\/github\.com\/[^/]+\/[^/]+\/?(\?.*)?$/.test(url)
}

/**
 * 把 GitHub URL 转为镜像 URL
 *  - fmt=repo (jsDelivr): 仓库主页 / 任意 URL 走 cdn.jsdelivr.net/gh/owner/repo
 *  - fmt=proxy: 把 GitHub URL 当成代理前缀拼接
 */
export function ghMirror(url, mirrorId = 'jsdelivr') {
  if (!url || !url.includes('github.com')) return url

  const m = GH_MIRRORS.find(x => x.id === mirrorId) || GH_MIRRORS[0]

  if (m.fmt === 'repo') {
    // jsDelivr 仓库页：owner/repo
    const path = url.replace('https://github.com/', '').split('/').slice(0, 2).join('/')
    return JSDELIVR_BASE + path
  }

  // proxy 镜像：base + 原 URL（gh-proxy 风格）
  const base = GH_PROXY_BASES[mirrorId] || GH_PROXY_BASES.ghproxy

  // 仓库主页 → 直接代理 GitHub 仓库主页
  if (isRepoHome(url)) {
    return base + url
  }

  // raw/blob/tree: 转成 raw.githubusercontent.com 然后代理
  const rawUrl = url
    .replace('https://github.com/', 'https://raw.githubusercontent.com/')
    .replace('/blob/', '/')

  return base + rawUrl
}

/**
 * 健康状态 -> 颜色 + 中文标签 + 图标
 */
export const HEALTH_MAP = {
  ok:       { color: '#3a8a3a', bg: 'rgba(58, 138, 58, 0.12)',  label: '在线',   icon: '●' },
  mirror:   { color: '#c9a55c', bg: 'rgba(201, 165, 92, 0.15)', label: '需镜像', icon: '◇' },
  crawl:    { color: '#a4853e', bg: 'rgba(164, 133, 62, 0.15)', label: '反爬',   icon: '◐' },
  unstable: { color: '#a8161a', bg: 'rgba(168, 22, 26, 0.12)',  label: '不稳定', icon: '○' },
}

export function healthOf(item) {
  return HEALTH_MAP[item?.health || 'ok'] || HEALTH_MAP.ok
}
