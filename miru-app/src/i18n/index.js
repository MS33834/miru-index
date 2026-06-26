/**
 * 漫藏阁 · MIRU INDEX — I18n
 *
 * Lightweight reactive translation layer. No dependencies.
 * Falls back to zh (Chinese) if a key is missing in the current locale.
 *
 * Usage in templates:
 *   {{ t('search.placeholder') }}
 *   {{ tc('categories', catId) }}
 *
 * Usage in script:
 *   import { useI18n } from '@/i18n'
 *   const { t, locale } = useI18n()
 */

import { ref, computed, shallowRef } from 'vue'

// ── Available locales ────────────────────────────────────────────────
const LOCALES = ['zh', 'en', 'ja']
const LOCALE_LABELS = {
  zh: '中',
  en: 'EN',
  ja: '日',
}
const LOCALE_NAMES = {
  zh: '简体中文',
  en: 'English',
  ja: '日本語',
}

// ── CSS :lang() direction hint ───────────────────────────────────────
const RTL_LOCALES = new Set([]) // none of our locales are RTL

// ── Translations ─────────────────────────────────────────────────────
// Key naming: category.component.element — e.g. 'search.placeholder'
const messages = {
  zh: {
    site: { title: '漫藏阁', subtitle: 'ACGN 资源导航' },
    search: {
      placeholder: '以名索物…',
      label: '搜索',
      recentTitle: '最近搜索',
      clearRecent: '清空',
      clear: '清空',
      results: (q, n) => `▎索 · 寻 「${q}」 得 ${n} 条结果`,
      srHeading: (q) => `搜索：${q} - 漫藏阁`,
      notFound: (q) => `未找到与「${q}」相关的结果`,
      tryOther: '试试其它关键词，或从标签云挑选热门标签',
    },
    sidebar: {
      toggleSearch: '展开搜索',
      toggleCollapse: (c) => (c ? '展开目录' : '折叠目录'),
      all: '全部 · 總藏',
      volumes: '分卷目录',
      quickFilter: '快速过滤',
      favorites: '★ 收藏',
      directOnly: '直连',
      proxyOnly: '需梯',
      tagCloud: '标签云',
      stats: (cats, items) => `共 ${cats} 卷 · ${items} 帖`,
      sealLeft: '朱泥',
      sealRight: '御金',
    },
    filter: {
      direct: '仅显示国内可直接访问的站点',
      proxy: '仅显示需要代理/梯子访问的站点',
    },
    view: {
      grid: '网格视图',
      list: '列表视图',
    },
    favorites: {
      export: '导出收藏',
      import: '导入收藏',
      exportTitle: '导出收藏为 JSON',
      importTitle: '从 JSON 文件导入收藏',
      imported: (n) => `已导入 ${n} 条收藏`,
      importError: (msg) => `导入失败：${msg}`,
      toggle: '收藏',
      hide: '取消仅收藏',
    },
    status: {
      all: (n, extra) => `当前：全部，共 ${n} 条${extra ? `，${extra}` : ''}`,
      onlyDirect: '仅直连',
      onlyProxy: '仅需梯',
      onlyFav: '仅收藏',
      onlyTags: (tags) => `标签 ${tags}`,
      selectedTags: '已选标签',
      clearTags: '清除标签',
      clearTagAria: (tag) => `移除标签 ${tag}`,
    },
    card: {
      directLink: (name) => `直达 ${name}`,
      directLabel: '直连',
      proxyLabel: '需梯',
      addFav: (name) => `收藏 ${name}`,
      detailAria: (name, desc) => `${name}，${desc || ''}，点击查看详情`,
    },
    modal: {
      close: '关闭对话框（按 Esc 退出）',
      gfwBlocked: '⚠ 国内无法直接访问',
      gfwRestricted: '⚠ 国内访问受限',
      gfwProxy: '⚠ 需要代理/梯子',
      gfwBlockedDesc: '此站点在大陆被屏蔽，需使用代理/梯子才能访问。',
      gfwRestrictedDesc: '此站点在大陆访问受限，部分内容可能不可用，建议使用代理获得完整体验。',
      gfwProxyDesc: '此站点需要代理或梯子才能访问，国内直连可能无法打开。',
      tags: '▎印 · TAGS',
      intro: '▎叙 · INTRO',
      features: '▎特 · FEATURES',
      url: '▎址 · URL',
      mirrorLabel: '▎镜 · MIRROR',
      selectMirror: '选择镜像',
      selectMirrorAria: '切换镜像选择',
      mirrorAccess: '镜像访问',
      mirrorAccessTitle: '通过当前选中镜像访问（国内友好）',
      githubMirror: 'GitHub 镜像源',
      visit: '入 覌',
      copy: '抄 · 录',
      copyUrl: '复制站点 URL',
      copyMirror: '复制当前镜像 URL',
      tagsIntact: '▎印 INACT',
      introIntact: '▎叙 INTRO',
      featuresIntact: '▎特 FEATURES',
      urlIntact: '▎址 URL',
      collapsed: '收起详情',
      expanded: '展开详情',
      proxyNeeded: '需梯子',
      healthOk: '国内可直接访问',
      healthMirror: '建议使用镜像站访问',
      healthUnstable: '站点可能间歇性不可用',
      healthBlocked: '国内无法直接访问，需代理/梯子',
      healthRestricted: '国内访问受限，部分内容不可用',
    },
    empty: {
      default: '选择一个分类或标签开始探索',
      filter: '当前过滤条件下无结果',
      resetProxy: '重置代理过滤',
      hideFav: '取消仅收藏',
      backToAll: '返回总藏',
    },
    general: {
      skipNav: '跳转到主要内容',
      backToTop: '返回顶部',
      scrollDown: '向下卷阅',
      heroTitle: '漫藏 藏經閣',
      heroDesc: '一座属于 ACGN 的印经阁',
      breadcrumbAll: '總藏',
      loading: '组件加载失败，请检查网络后重试',
      error: '页面加载失败',
      retry: '重试',
      pwaInstall: '将漫藏阁安装到桌面',
      pwaDesc: '离线可用 · 快速访问 · 完整体验',
      pwaClose: '关闭',
      kbHelp: '键盘快捷键',
      kbToggleHover: '按 ? 切换',
      kbToggleAlt: '显示/隐藏键盘快捷键',
      kbFooter: '按 ? 再次唤出 · 按 Esc 关闭',
      kbClose: '关闭',
      kbToggleLabel: '显示/隐藏本帮助',
      kbToggleHint: '关闭后仅保留 Ctrl+K 与 Esc 等修饰键快捷键，避免与屏幕阅读器冲突',
    },
  },

  en: {
    site: { title: 'MIRU INDEX', subtitle: 'ACGN Bookmarks' },
    search: {
      placeholder: 'Search by name…',
      label: 'Search',
      recentTitle: 'Recent',
      clearRecent: 'Clear',
      clear: 'Clear',
      results: (q, n) => `▎Found ${n} results for "${q}"`,
      srHeading: (q) => `Search: ${q} — MIRU INDEX`,
      notFound: (q) => `No results for "${q}"`,
      tryOther: 'Try different keywords, or pick from the tag cloud.',
    },
    sidebar: {
      toggleSearch: 'Open search',
      toggleCollapse: (c) => (c ? 'Expand sidebar' : 'Collapse sidebar'),
      all: 'All · Collection',
      volumes: 'Categories',
      quickFilter: 'Quick Filter',
      favorites: '★ Favorites',
      directOnly: 'Direct',
      proxyOnly: 'Proxy',
      tagCloud: 'Tag Cloud',
      stats: (cats, items) => `${cats} volumes · ${items} entries`,
      sealLeft: 'Vermilion',
      sealRight: 'Gold',
    },
    filter: {
      direct: 'Show only sites accessible from mainland China',
      proxy: 'Show only sites that need a proxy/VPN',
    },
    view: {
      grid: 'Grid view',
      list: 'List view',
    },
    favorites: {
      export: 'Export Favorites',
      import: 'Import Favorites',
      exportTitle: 'Export favorites as JSON',
      importTitle: 'Import favorites from JSON file',
      imported: (n) => `Imported ${n} favorites`,
      importError: (msg) => `Import failed: ${msg}`,
      toggle: 'Favorite',
      hide: 'Hide favorites filter',
    },
    status: {
      all: (n, extra) => `Showing all ${n} entries${extra ? `, ${extra}` : ''}`,
      onlyDirect: 'direct only',
      onlyProxy: 'proxy only',
      onlyFav: 'favorites only',
      onlyTags: (tags) => `tags: ${tags}`,
      selectedTags: 'Selected',
      clearTags: 'Clear tags',
      clearTagAria: (tag) => `Remove tag ${tag}`,
    },
    card: {
      directLink: (name) => `Go to ${name}`,
      directLabel: 'Direct',
      proxyLabel: 'Proxy',
      addFav: (name) => `Favorite ${name}`,
      detailAria: (name, desc) => `${name} — ${desc || ''}. Click for details.`,
    },
    modal: {
      close: 'Close dialog (Esc)',
      gfwBlocked: '⚠ Blocked in mainland China',
      gfwRestricted: '⚠ Restricted in mainland China',
      gfwProxy: '⚠ Proxy needed',
      gfwBlockedDesc: 'This site is blocked in mainland China. A VPN or proxy is required.',
      gfwRestrictedDesc:
        'This site has restricted access in mainland China. Some content may be unavailable without a proxy.',
      gfwProxyDesc: 'This site requires a proxy or VPN. Direct access from mainland China may fail.',
      tags: '▎TAGS',
      intro: '▎INTRO',
      features: '▎FEATURES',
      url: '▎URL',
      mirrorLabel: '▎MIRROR',
      selectMirror: 'Select mirror',
      selectMirrorAria: 'Switch mirror',
      mirrorAccess: 'Via mirror',
      mirrorAccessTitle: 'Open via selected mirror (China-friendly)',
      githubMirror: 'GitHub mirror',
      visit: 'Visit →',
      copy: 'Copy URL',
      copyUrl: 'Copy site URL',
      copyMirror: 'Copy mirror URL',
      tagsIntact: '▎TAGS',
      introIntact: '▎INTRO',
      featuresIntact: '▎FEATURES',
      urlIntact: '▎URL',
      collapsed: 'Collapse',
      expanded: 'Expand',
      proxyNeeded: 'VPN needed',
      healthOk: 'Accessible from China',
      healthMirror: 'May need mirror site',
      healthUnstable: 'May be intermittently unavailable',
      healthBlocked: 'Blocked in China, VPN required',
      healthRestricted: 'Restricted in China, partial access',
    },
    empty: {
      default: 'Pick a category or tag to start exploring.',
      filter: 'No results under current filters.',
      resetProxy: 'Reset proxy filter',
      hideFav: 'Hide favorites',
      backToAll: 'Back to all',
    },
    general: {
      skipNav: 'Skip to main content',
      backToTop: 'Back to top',
      scrollDown: 'Scroll down',
      heroTitle: 'MIRU INDEX',
      heroDesc: 'An ACGN library of hand-picked bookmarks',
      breadcrumbAll: 'Collection',
      loading: 'Component failed to load. Check your network and try again.',
      error: 'Page failed to load',
      retry: 'Retry',
      pwaInstall: 'Install MIRU INDEX to desktop',
      pwaDesc: 'Offline · Fast · Full experience',
      pwaClose: 'Close',
      kbHelp: 'Keyboard Shortcuts',
      kbToggleHover: 'Press ? to toggle',
      kbToggleAlt: 'Toggle keyboard shortcuts',
      kbFooter: 'Press ? to show · Esc to close',
      kbClose: 'Close',
      kbToggleLabel: 'Toggle keyboard help',
      kbToggleHint:
        'When turned off, only modifier-key shortcuts like Ctrl+K and Esc remain active, avoiding conflicts with screen readers.',
    },
  },

  ja: {
    site: { title: '漫蔵閣', subtitle: 'ACGN ブックマーク' },
    search: {
      placeholder: '名称で検索…',
      label: '検索',
      recentTitle: '最近',
      clearRecent: '消去',
      clear: '消去',
      results: (q, n) => `▎「${q}」 ${n} 件`,
      srHeading: (q) => `検索: ${q} — 漫蔵閣`,
      notFound: (q) => `「${q}」に一致する結果はありません`,
      tryOther: '別のキーワードを試すか、タグクラウドから選択してください。',
    },
    sidebar: {
      toggleSearch: '検索を開く',
      toggleCollapse: (c) => (c ? 'サイドバーを開く' : 'サイドバーを閉じる'),
      all: '全巻 · コレクション',
      volumes: '分巻目録',
      quickFilter: 'クイックフィルター',
      favorites: '★ お気に入り',
      directOnly: '直結',
      proxyOnly: '要VPN',
      tagCloud: 'タグクラウド',
      stats: (cats, items) => `${cats} 巻 · ${items} 件`,
      sealLeft: '朱泥',
      sealRight: '御金',
    },
    filter: {
      direct: '中国本土から直接アクセス可能なサイトのみ表示',
      proxy: 'プロキシ/VPNが必要なサイトのみ表示',
    },
    view: {
      grid: 'グリッド表示',
      list: 'リスト表示',
    },
    favorites: {
      export: 'お気に入りエクスポート',
      import: 'お気に入りインポート',
      exportTitle: 'お気に入りをJSONでエクスポート',
      importTitle: 'JSONからお気に入りをインポート',
      imported: (n) => `${n} 件のお気に入りをインポートしました`,
      importError: (msg) => `インポート失敗: ${msg}`,
      toggle: 'お気に入り',
      hide: 'お気に入りフィルターを解除',
    },
    status: {
      all: (n, extra) => `全 ${n} 件を表示${extra ? `、${extra}` : ''}`,
      onlyDirect: '直結のみ',
      onlyProxy: 'VPNのみ',
      onlyFav: 'お気に入りのみ',
      onlyTags: (tags) => `タグ: ${tags}`,
      selectedTags: '選択中',
      clearTags: 'タグ解除',
      clearTagAria: (tag) => `タグ「${tag}」を解除`,
    },
    card: {
      directLink: (name) => `${name} へ`,
      directLabel: '直結',
      proxyLabel: 'VPN',
      addFav: (name) => `${name} をお気に入り`,
      detailAria: (name, desc) => `${name} — ${desc || ''}。クリックで詳細。`,
    },
    modal: {
      close: '閉じる (Esc)',
      gfwBlocked: '⚠ 中国本土からアクセス不可',
      gfwRestricted: '⚠ 中国本土から制限あり',
      gfwProxy: '⚠ VPN必要',
      gfwBlockedDesc: 'このサイトは中国本土でブロックされています。VPNまたはプロキシが必要です。',
      gfwRestrictedDesc:
        'このサイトは中国本土で制限されています。一部のコンテンツはプロキシなしでは利用できない場合があります。',
      gfwProxyDesc: 'このサイトにはプロキシまたはVPNが必要です。中国本土からの直接アクセスは失敗する可能性があります。',
      tags: '▎TAGS',
      intro: '▎INTRO',
      features: '▎FEATURES',
      url: '▎URL',
      mirrorLabel: '▎MIRROR',
      selectMirror: 'ミラーを選択',
      selectMirrorAria: 'ミラー切替',
      mirrorAccess: 'ミラー経由',
      mirrorAccessTitle: '選択したミラーで開く（中国対応）',
      githubMirror: 'GitHub ミラー',
      visit: '開く →',
      copy: 'URLコピー',
      copyUrl: 'サイトURLをコピー',
      copyMirror: 'ミラーURLをコピー',
      tagsIntact: '▎TAGS',
      introIntact: '▎INTRO',
      featuresIntact: '▎FEATURES',
      urlIntact: '▎URL',
      collapsed: '折りたたむ',
      expanded: '展開',
      proxyNeeded: 'VPN必須',
      healthOk: '中国からアクセス可',
      healthMirror: 'ミラーサイト推奨',
      healthUnstable: '断続的にアクセス不可の可能性',
      healthBlocked: '中国でブロック、VPN必須',
      healthRestricted: '中国で制限あり、一部アクセス不可',
    },
    empty: {
      default: 'カテゴリかタグを選んで探索を始めましょう。',
      filter: '現在のフィルター条件では結果がありません。',
      resetProxy: 'プロキシフィルターを解除',
      hideFav: 'お気に入りフィルターを解除',
      backToAll: '全巻に戻る',
    },
    general: {
      skipNav: 'メインコンテンツへスキップ',
      backToTop: 'トップに戻る',
      scrollDown: 'スクロール',
      heroTitle: '漫蔵閣',
      heroDesc: 'ACGN の印経閣 — 手作業で集めたブックマーク集',
      breadcrumbAll: 'コレクション',
      loading: 'コンポーネントの読み込みに失敗しました。ネットワークを確認してください。',
      error: 'ページ読み込みエラー',
      retry: '再試行',
      pwaInstall: '漫蔵閣をデスクトップにインストール',
      pwaDesc: 'オフライン · 高速 · フル機能',
      pwaClose: '閉じる',
      kbHelp: 'キーボードショートカット',
      kbToggleHover: '? で切替',
      kbToggleAlt: 'キーボードショートカットを切替',
      kbFooter: '? で表示 · Esc で閉じる',
      kbClose: '閉じる',
      kbToggleLabel: 'キーボードヘルプを切替',
      kbToggleHint:
        'オフにすると、Ctrl+K と Esc などの修飾キーショートカットのみが残り、スクリーンリーダーとの競合を回避します。',
    },
  },
}

// ── Reactive state ────────────────────────────────────────────────────
const localeRef = ref(_loadSavedLocale())

// Per-locale category name translations (populated at runtime from data)
const categoryNames = shallowRef({})

// ── Helpers ───────────────────────────────────────────────────────────
function _loadSavedLocale() {
  try {
    const saved = localStorage.getItem('miru-locale')
    if (saved && LOCALES.includes(saved)) return saved
  } catch {
    /* localStorage blocked */
  }
  // Detect browser language
  try {
    const nav = (navigator.language || '').toLowerCase()
    if (nav.startsWith('zh')) return 'zh'
    if (nav.startsWith('ja')) return 'ja'
  } catch {
    /* SSR guard */
  }
  return 'zh'
}

function _saveLocale(locale) {
  try {
    localStorage.setItem('miru-locale', locale)
  } catch {
    /* noop */
  }
  try {
    document.documentElement.lang = locale
  } catch {
    /* noop */
  }
}

/**
 * Fallback resolver: look up key in current locale, then zh, then return key itself.
 */
function _resolve(locale, path) {
  const keys = path.split('.')
  // Try current locale
  let node = messages[locale]
  if (!node) node = messages.zh
  for (const k of keys) {
    if (node == null || typeof node !== 'object') break
    node = node[k]
  }
  if (node !== undefined) return node
  // Try zh fallback
  node = messages.zh
  for (const k of keys) {
    if (node == null || typeof node !== 'object') break
    node = node[k]
  }
  return node !== undefined ? node : path
}

// ── Composable ────────────────────────────────────────────────────────
let _instance = null

export function useI18n() {
  if (_instance) return _instance

  const locale = computed({
    get: () => localeRef.value,
    set: (v) => {
      if (!LOCALES.includes(v)) return
      localeRef.value = v
      _saveLocale(v)
    },
  })

  const availableLocales = LOCALES
  const localeLabel = computed(() => LOCALE_LABELS[locale.value] || locale.value)
  const localeName = computed(() => LOCALE_NAMES[locale.value] || locale.value)
  const isRtl = computed(() => RTL_LOCALES.has(locale.value))

  // 按 locale 查询其短标签（供语言切换按钮每个按钮显示自身标签，而非当前 locale 的标签）
  function getLocaleLabel(loc) {
    return LOCALE_LABELS[loc] || loc
  }

  /**
   * Translate a dotted-path key. If the value is a function, call it with args.
   * Usage: t('search.placeholder') or t('search.results', [q, n])
   */
  function t(path, args) {
    const val = _resolve(locale.value, path)
    if (typeof val === 'function') {
      // 无参调用（args 为空数组或未传）时，调用函数不传参；函数自行处理默认值
      return Array.isArray(args) && args.length > 0 ? val(...args) : val()
    }
    return val
  }

  /**
   * Get translated category name. Falls back to original Chinese name (id = zh name).
   */
  function tc(catId, fallbackName) {
    const map = categoryNames.value
    if (map && map[locale.value] && map[locale.value][catId]) {
      return map[locale.value][catId]
    }
    return fallbackName || catId
  }

  /**
   * Set per-locale category name translations.
   * Called once during data init with the merged category list.
   */
  function setCategoryNames(names) {
    categoryNames.value = names
  }

  _instance = {
    locale,
    availableLocales,
    localeLabel,
    localeName,
    isRtl,
    getLocaleLabel,
    t,
    tc,
    setCategoryNames,
  }

  // 首次构造即同步 <html lang>，否则用户保存的非默认语言在首屏会被 SR 按错误语言朗读
  try {
    document.documentElement.lang = localeRef.value
  } catch {
    /* SSR guard */
  }

  return _instance
}
