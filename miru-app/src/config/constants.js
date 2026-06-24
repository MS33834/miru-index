// 全局常量配置
export const SITE_BASE = 'https://MS33834.github.io/miru-index/'

// localStorage key 集中管理，避免散落各处
export const STORAGE_KEYS = {
  FAVORITES: 'miru-favorites',
  RECENT_SEARCHES: 'miru-recent-searches',
  VIEW_MODE: 'miru-view-mode',
  SIDEBAR_COLLAPSED: 'miru-sidebar-collapsed',
  PWA_DISMISSED: 'miru-pwa-dismissed',
  SHORTCUTS_ENABLED: 'miru-shortcuts-enabled',
}

// 收藏夹安全约束
export const FAVORITES_LIMITS = {
  MAX_ITEMS: 1000,
  MAX_IMPORT_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FIELD_LEN: { name: 120, url: 2048, desc: 500, fullDesc: 2000 },
  MAX_TAGS: 20,
  MAX_TAG_LEN: 30,
  ALLOWED_FIELDS: ['name', 'url', 'desc', 'fullDesc', 'tags', 'features', 'proxy', 'health', 'mirrors'],
}

export const APP_CONFIG = {
  NAME: '漫藏阁',
  SUBTITLE: 'MIRU INDEX',
  DESCRIPTION: 'ACGN 资源导航站',
  VERSION: '2026',

  // 卷册配置
  VOLUMES: [
    {
      id: 'v1',
      name: '卷壹',
      title: '網絡工具',
      sub: 'Network · Tools',
      catIds: ['proxy', 'downloader', 'archive', 'imagesearch'],
    },
    { id: 'v2', name: '卷贰', title: '工坊 · 研习', sub: 'Workshop · Study', catIds: ['ai', 'imgai', 'tutorials'] },
    {
      id: 'v3',
      name: '卷叁',
      title: 'ACG 主场',
      sub: 'ACGN · Main',
      catIds: ['manga', 'manga_app', 'anime_site', 'anime_app', 'galgame_res', 'novel', 'library'],
    },
    {
      id: 'v4',
      name: '卷肆',
      title: '社区 · 资讯',
      sub: 'Community · News',
      catIds: ['news', 'community', 'galgame_news'],
    },
    {
      id: 'v5',
      name: '卷伍',
      title: '视听 · 演出',
      sub: 'Audio · Visual · Performance',
      catIds: ['music', 'draw', 'video', 'sticker', 'vtuber', 'seiyu', 'doujin_music', 'podcast'],
    },
    {
      id: 'v6',
      name: '卷陆',
      title: '周边 · 次元',
      sub: 'Figure · Cosplay · Events',
      catIds: ['figure', 'agg', 'github', 'cosplay', 'events'],
    },
    {
      id: 'v7',
      name: '卷柒',
      title: '资源 · 工具',
      sub: 'Resources · Tools',
      catIds: ['font', 'wallpaper', 'imghost', 'illust', 'subgroup', 'game', 'game_dev', 'nav', 'mmd', 'lore'],
    },
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
    PAGE_SIZE: 24,
    TOP_TAGS_COUNT: 24,
    QUICK_TAGS_COUNT: 7,
    MAX_RECENT_SEARCHES: 8,
    COPY_FEEDBACK_DURATION: 1500,
    PWA_PROMPT_DELAY: 3000,
    PWA_DISMISS_TTL: 24 * 60 * 60 * 1000,
    VOLUME_SCROLL_OFFSET: 100,
    FAVORITE_ANIM_DURATION: 400,
    // Toast 反馈持续时间
    TOAST_DURATION: 5000,
    // 收藏配额上限提示
    FAVORITES_QUOTA_MSG: '收藏已满（上限 1000 条），请先导出或清理后再试',
  },

  // 缓存配置（与 public/sw.js 保持一致）
  CACHE: {
    VERSION: 'v8',
    NAME_PREFIX: 'miru-index-',
    PRECACHE_ASSETS: [
      '/miru-index/',
      '/miru-index/index.html',
      '/miru-index/manifest.json',
      '/miru-index/robots.txt',
      '/miru-index/sitemap.xml',
      '/miru-index/favicon.svg',
      '/miru-index/offline.html',
      '/miru-index/frame-buster.js',
      '/miru-index/og-image.png',
    ],
  },
}
