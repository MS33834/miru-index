// 全局常量配置
export const APP_CONFIG = {
  NAME: '漫藏阁',
  SUBTITLE: 'MIRU INDEX',
  DESCRIPTION: 'ACGN 资源导航站',
  VERSION: '2026',
  
  // 卷册配置
  VOLUMES: [
    { id: 'v1', name: '卷壹', title: '網絡工具', sub: 'Network · Tools', catIds: ['proxy', 'downloader', 'archive', 'imagesearch'] },
    { id: 'v2', name: '卷贰', title: 'AI 工坊', sub: 'AI · Workshop', catIds: ['ai', 'imgai'] },
    { id: 'v3', name: '卷叁', title: 'ACG 主场', sub: 'ACGN · Main', catIds: ['manga', 'manga_app', 'anime_site', 'anime_app', 'galgame_res', 'novel', 'library'] },
    { id: 'v4', name: '卷肆', title: '社区 · 资讯', sub: 'Community · News', catIds: ['news', 'community', 'galgame_news'] },
    { id: 'v5', name: '卷伍', title: '视听娱乐', sub: 'Audio · Visual', catIds: ['music', 'draw', 'video', 'sticker'] },
    { id: 'v6', name: '卷陆', title: '周边 · 聚合', sub: 'Figure · Aggregator', catIds: ['figure', 'agg', 'github'] },
    { id: 'v7', name: '卷柒', title: '资源 · 工具', sub: 'Resources · Tools', catIds: ['font', 'wallpaper', 'imghost', 'illust', 'subgroup', 'game', 'nav'] },
  ],
  
  // 中文数字映射
  CHINESE_NUMS: ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌'],
  
  // UI 配置
  UI: {
    BACK_TO_TOP_THRESHOLD: 300,
    SEARCH_DEBOUNCE_DELAY: 300,
    LAZY_LOAD_MARGIN: 100,
    ANIMATION_DELAY_STEP: 0.04,
    MAX_ANIMATION_DELAY: 24,
  },
  
  // 缓存配置（与 public/sw.js 保持一致）
  CACHE: {
    VERSION: 'v3',
    NAME_PREFIX: 'miru-index-',
    PRECACHE_ASSETS: [
      '/miru-index/',
      '/miru-index/index.html',
      '/miru-index/manifest.json',
      '/miru-index/robots.txt',
      '/miru-index/sitemap.xml',
      '/miru-index/favicon.svg',
      '/miru-index/og-image.png'
    ]
  }
}
