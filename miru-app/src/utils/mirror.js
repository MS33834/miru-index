// 镜像工具函数
// 为海外站点 / GitHub 资源提供国内可达的镜像链接

/**
 * GitHub 加速镜像源
 */
export const GH_MIRRORS = [
  { id: 'ghproxy',  name: 'GhProxy',       fmt: 'prefix' },
  { id: 'ghps',     name: 'GhProxy.net',   fmt: 'prefix' },
  { id: 'mirror',   name: 'GhProxy Mirror', fmt: 'prefix' },
  { id: 'jsdelivr', name: 'jsDelivr CDN',  fmt: 'repo'   },
  { id: 'fastgit',  name: 'FastGit',       fmt: 'prefix' },
]

const GH_MIRROR_BASE = {
  ghproxy: 'https://gh-proxy.com/',
  ghps:    'https://ghps.cc/',
  mirror:  'https://mirror.ghproxy.com/',
  jsdelivr:'https://cdn.jsdelivr.net/gh/',
  fastgit: 'https://raw.fastgit.org/',
}

/**
 * 判断 URL 是否为 GitHub 仓库主页（无 /blob/ /tree/ /releases/ /raw/ 等路径）
 */
function isRepoHome(url) {
  // 形如 https://github.com/owner/repo 或 https://github.com/owner/repo/
  return /^https:\/\/github\.com\/[^/]+\/[^/]+\/?(\?.*)?$/.test(url)
}

/**
 * 把 GitHub URL 转为镜像 URL
 *  - 仓库主页（isRepoHome）→ 仓库页镜像（jsDelivr 风格）
 *  - 其他（blob / tree / raw / releases）→ raw 资源镜像（prefix 风格）
 */
export function ghMirror(url, mirrorId = 'ghproxy') {
  if (!url || !url.includes('github.com')) return url
  const base = GH_MIRROR_BASE[mirrorId] || GH_MIRROR_BASE.ghproxy

  if (isRepoHome(url)) {
    // https://github.com/owner/repo  →  base + owner/repo
    const path = url.replace('https://github.com/', '').replace(/\/+$/, '')
    return base + path
  }

  // raw 资源：把 https://github.com/owner/repo/blob/branch/path → raw.githubusercontent.com
  let rawUrl = url
    .replace('https://github.com/', 'https://raw.githubusercontent.com/')
    .replace('/blob/', '/')

  // prefix 镜像直接拼接
  return base + rawUrl
}

/**
 * 健康状态 -> 颜色 + 中文标签 + 图标
 */
export const HEALTH_MAP = {
  ok:       { color: '#3a8a3a', bg: 'rgba(58, 138, 58, 0.12)',  label: '在线',     icon: '●' },
  mirror:   { color: '#c9a55c', bg: 'rgba(201, 165, 92, 0.15)', label: '需镜像',   icon: '◇' },
  crawl:    { color: '#a4853e', bg: 'rgba(164, 133, 62, 0.15)', label: '反爬',     icon: '◐' },
  unstable: { color: '#a8161a', bg: 'rgba(168, 22, 26, 0.12)',  label: '不稳定',   icon: '○' },
}

export function healthOf(item) {
  return HEALTH_MAP[item?.health || 'ok'] || HEALTH_MAP.ok
}
