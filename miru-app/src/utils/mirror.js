// 镜像工具函数
// 为海外站点 / GitHub 资源提供国内可达的镜像链接

/**
 * GitHub 加速镜像源
 */
export const GH_MIRRORS = [
  { id: 'ghproxy', name: 'GhProxy', url: 'https://gh-proxy.com/' },
  { id: 'ghps', name: 'GhProxy.net', url: 'https://ghps.cc/' },
  { id: 'mirror', name: 'GhProxy Mirror', url: 'https://mirror.ghproxy.com/' },
  { id: 'jsdelivr', name: 'jsDelivr CDN', url: 'https://cdn.jsdelivr.net/' },
  { id: 'fastgit', name: 'FastGit', url: 'https://raw.fastgit.org/' },
]

/**
 * 给 GitHub URL 加镜像前缀
 *  /xx/yy -> https://gh-proxy.com/https://raw.githubusercontent.com/xx/yy
 */
export function ghMirror(url, mirror = 'ghproxy') {
  if (!url || !url.includes('github.com')) return url
  const m = GH_MIRRORS.find(x => x.id === mirror) || GH_MIRRORS[0]
  // 把 https://github.com/owner/repo 替换为镜像 raw URL
  if (url.includes('github.com/') && !url.includes('/blob/') && !url.includes('/tree/') && !url.includes('/releases') && !url.includes('/raw/')) {
    // 仓库主页: 走 jsdelivr 镜像仓库页
    const jm = GH_MIRRORS.find(x => x.id === 'jsdelivr')
    const path = url.replace('https://github.com/', '')
    return `https://cdn.jsdelivr.net/gh/${path.replace(/\/$/, '')}`
  }
  // raw 资源
  const rawUrl = url
    .replace('https://github.com/', 'https://raw.githubusercontent.com/')
    .replace('/blob/', '/')
  return m.url + rawUrl
}

/**
 * 健康状态 -> 颜色 + 中文标签 + 图标
 */
export const HEALTH_MAP = {
  ok:       { color: '#3a8a3a', bg: 'rgba(58, 138, 58, 0.12)',  label: '在线',      icon: '●' },
  mirror:   { color: '#c9a55c', bg: 'rgba(201, 165, 92, 0.15)',  label: '需镜像',    icon: '◇' },
  crawl:    { color: '#a4853e', bg: 'rgba(164, 133, 62, 0.15)',  label: '反爬',      icon: '◐' },
  unstable: { color: '#a8161a', bg: 'rgba(168, 22, 26, 0.12)',   label: '不稳定',    icon: '○' },
}

export function healthOf(item) {
  return HEALTH_MAP[item?.health || 'ok'] || HEALTH_MAP.ok
}
