export const categories = [
  {
    id: 'proxy',
    name: '网络代理',
    icon: '🛡️',
    items: [
      { name: '起飞VPN', url: 'https://goflyvpn.com/', desc: '多国节点商业VPN', proxy: false },
      { name: 'Clash', url: 'https://clashxhub.com/', desc: '需自己配置', proxy: false },
      { name: '绿茶VPN', url: 'https://www.lcvpn.qpon?id=177002747', desc: '连接最快', proxy: false },
    ]
  },
  {
    id: 'downloader',
    name: '下载器',
    icon: '⬇️',
    items: [
      { name: '1DM', url: 'https://play.google.com/store/apps/details?id=idm.internet.download.manager', desc: '加速直链下载', proxy: true },
    ]
  },
  {
    id: 'archive',
    name: '解压工具',
    icon: '📦',
    items: [
      { name: 'MT管理器', url: 'https://mt2.cn/', desc: '文件管理+解压+编辑', proxy: false },
      { name: '解压专家', url: 'http://www.unisapps.com/', desc: '查找密码', proxy: false },
      { name: 'ZArchiver Pro', url: 'https://zdevs.ru/en/', desc: '可解压lz4文件', proxy: false },
    ]
  },
  {
    id: 'imagesearch',
    name: '搜图',
    icon: '🔍',
    items: [
      { name: '谷歌搜图', url: 'https://www.google.com/imghp', desc: '综合反向图片搜索', proxy: true },
      { name: 'SauceNAO', url: 'https://saucenao.com/', desc: '二次元反向搜图', proxy: true },
      { name: '搜图bot', url: 'https://soutubot.moe/', desc: 'Telegram搜图机器人', proxy: false },
      { name: 'ascii2d', url: 'https://ascii2d.net/', desc: '二次元画像详细检索', proxy: true },
      { name: 'iqdb', url: 'http://www.iqdb.org/', desc: '识图搜索', proxy: true },
    ]
  },
  {
    id: 'nav',
    name: '导航站',
    icon: '🧭',
    items: [
      { name: 'ACG喵导航', url: 'https://www.miaoaaa.com/', desc: 'ACG资源综合导航', proxy: false },
      { name: 'YOUFAV', url: 'https://www.youfav.com/', desc: '网站集合', proxy: false },
      { name: 'Qingse', url: 'https://qingse.one/', desc: '网站集合', proxy: false },
    ]
  },
  {
    id: 'galgame',
    name: 'GalGame',
    icon: '🎮',
    items: [
      { name: '青桔网', url: 'https://www.qingju.org/', desc: '网盘资源', proxy: false },
      { name: 'Touchgal', url: 'https://www.touchgal.io/', desc: 'GalGame综合站', proxy: false },
      { name: '失落小站', url: 'https://www.shinnku.com/', desc: '老牌资源站', proxy: false },
      { name: '晴空咖啡馆', url: 'http://aosoracafe.com/', desc: '资讯评测攻略', proxy: false },
      { name: '量子ACG', url: 'https://lzacg.org/', desc: 'ACG资源', proxy: false },
      { name: '稻荷ACG', url: 'https://inarigal.com/', desc: 'GalGame资源', proxy: false },
      { name: 'NekoGAL', url: 'https://www.nekogal.com/', desc: 'GalGame资源', proxy: false },
      { name: '绮梦ACG', url: 'https://game.acgs.one/', desc: 'GalGame资源', proxy: false },
      { name: '05小站', url: 'https://05fx.022016.xyz/', desc: 'GalGame资源', proxy: false },
      { name: '岛屿ACG', url: 'https://www.acgwfb.com/', desc: '资源+论坛', proxy: false },
      { name: '次元小屋', url: 'http://cyxw.xyz/', desc: '二次元资源', proxy: false },
      { name: 'MikiACG', url: 'https://www.mikiacg.org/', desc: 'GalGame资源', proxy: false },
      { name: '御爱同萌', url: 'https://www.ai2.moe/', desc: 'GalGame资源', proxy: false },
    ]
  },
  {
    id: 'manga',
    name: '漫画/插画',
    icon: '🎨',
    items: [
      { name: 'Pixiv', url: 'https://www.pixiv.net/artworks/', desc: '日本最大插画平台，pid加后面直接搜图', proxy: true },
      { name: 'DLsite', url: 'https://www.dlsite.com/maniax-touch/', desc: '同人数字市场', proxy: true },
      { name: 'Melonbooks', url: 'https://www.melonbooks.co.jp/', desc: '同人志商店', proxy: true },
      { name: 'E-Hentai', url: 'https://e-hentai.org', desc: '英文漫画档案库', proxy: true },
      { name: 'cmoa', url: 'https://www.cmoa.jp', desc: '無料漫画', proxy: true },
      { name: 'ebookjapan', url: 'https://ebookjapan.yahoo.co.jp', desc: '無料漫画', proxy: true },
      { name: 'Bookwalker', url: 'https://bookwalker.jp', desc: '数字书店', proxy: true },
    ]
  },
  {
    id: 'anime',
    name: '番剧',
    icon: '📺',
    items: [
      { name: 'Kazumi', url: 'https://github.com/Predidit/Kazumi/releases/tag/1.7.3', desc: '跨平台番剧App', proxy: false },
      { name: 'Animeko', url: 'https://myani.org/', desc: 'Compose Multiplatform番剧App', proxy: false },
      { name: '琉璃神社', url: 'https://www.llss.icu/wp/', desc: '下载', proxy: false },
      { name: 'ACG漫音社', url: 'https://www.acgjc.com/', desc: '下载', proxy: false },
      { name: 'MX动漫', url: 'https://www.mxdm.xyz/', desc: '在线番剧', proxy: false },
      { name: '大千视界', url: 'https://www.dalvdm.cc/', desc: '在线番剧', proxy: false },
      { name: '第一动漫', url: 'https://1anime2024.com/', desc: '在线番剧', proxy: true },
      { name: 'H次元', url: 'https://h-ciyuan.com/', desc: '在线番剧', proxy: true },
    ]
  },
  {
    id: 'software',
    name: '漫画软件',
    icon: '📱',
    items: [
      { name: 'PicACG', url: 'https://www.picacomic.com/', desc: '哔咔哔咔客户端', proxy: false },
      { name: 'JMComic', url: 'https://jm365.work/AwNzE2', desc: 'JM漫画客户端', proxy: false },
      { name: 'EhViewer', url: 'https://github.com/xiaojieonly/Ehviewer_CN_SXJ/releases', desc: 'E-Hentai Android客户端', proxy: false },
    ]
  },
  {
    id: 'game',
    name: '游戏',
    icon: '🕹️',
    items: [
      { name: 'Switch520', url: 'https://www.gamer520.com/', desc: 'Switch资源', proxy: false },
      { name: '游戏分享社', url: 'https://www.gameshare.cc/', desc: '多平台资源', proxy: false },
      { name: 'Steam', url: 'https://store.steampowered.com/', desc: 'PC数字游戏平台', proxy: true },
    ]
  },
  {
    id: 'book',
    name: '书籍',
    icon: '📚',
    items: [
      { name: '鸠摩搜索', url: 'https://www.jiumodiary.com/', desc: '电子书聚合搜索', proxy: false },
      { name: '80电子书', url: 'https://m.txt80.cc/', desc: 'TXT电子书', proxy: false },
      { name: '奇书网', url: 'https://m.qishu99.cc/', desc: '网络小说', proxy: false },
      { name: '全本同人小说', url: 'https://www.qbtr.cc/', desc: '同人小说', proxy: false },
      { name: '幻梦轻小说', url: 'https://www.huanmengacg.com/', desc: '轻小说', proxy: false },
      { name: '轻小说文库', url: 'https://www.wenku8.cc/', desc: '日文轻小说中文翻译', proxy: false },
      { name: '党政数据库', url: 'https://www.kdocs.cn/l/ci7Hy0AMoyBD', desc: '政经资料', proxy: false },
      { name: '毛泽东著作', url: 'http://www.mzdbl.cn/maoxuan/index.html', desc: '毛选全文', proxy: false },
      { name: 'Library Digital', url: 'https://library.ucsd.edu/dc/', desc: 'UCSD数字馆藏', proxy: true },
    ]
  },
  {
    id: 'github',
    name: 'GitHub开源项目',
    icon: '💻',
    items: [
      { name: 'JMComic-Crawler-Python', url: 'https://github.com/hect0x7/JMComic-Crawler-Python', desc: 'Python API+GitHub Actions下载器', proxy: false },
      { name: 'jmcomic-downloader', url: 'https://github.com/lanyeeee/jmcomic-downloader', desc: 'Tauri桌面GUI下载器', proxy: false },
      { name: 'JMComic-qt', url: 'https://github.com/tonquer/JMComic-qt', desc: 'Qt桌面客户端', proxy: false },
      { name: 'PicaComic', url: 'https://github.com/wgh136/PicaComic', desc: 'Flutter多源漫画App', proxy: false },
      { name: 'picacomic-downloader', url: 'https://github.com/lanyeeee/picacomic-downloader', desc: 'Tauri哔咔下载器', proxy: false },
      { name: 'pica-go', url: 'https://github.com/niuhuan/pica-go', desc: 'Go版哔咔API', proxy: false },
      { name: 'Mihon', url: 'https://github.com/mihonapp/mihon', desc: 'Tachiyomi官方继任者', proxy: false },
      { name: 'Komikku', url: 'https://github.com/komikku-app/komikku', desc: 'Mihon+GNOME桌面阅读器', proxy: false },
      { name: 'TachiyomiSY', url: 'https://github.com/jobobby04/TachiyomiSY', desc: 'Tachiyomi稳定分支', proxy: false },
      { name: 'Suwayomi-Server', url: 'https://github.com/Suwayomi/Suwayomi-Server', desc: '自托管漫画服务器', proxy: false },
      { name: 'Aniyomi', url: 'https://github.com/aniyomiorg/aniyomi', desc: '漫画+番剧一站式', proxy: false },
      { name: 'JHenTai', url: 'https://github.com/jiangtian616/JHenTai', desc: 'Flutter E-Hentai客户端', proxy: false },
      { name: 'EhViewer CN_SXJ', url: 'https://github.com/xiaojieonly/ehviewer_cn_sxj', desc: 'Android E-Hentai客户端', proxy: false },
      { name: 'nhentai-helper', url: 'https://github.com/Tsuk1ko/nhentai-helper', desc: 'nhentai下载脚本', proxy: false },
      { name: 'HakuNeko', url: 'https://github.com/hakuneko/HakuNeko', desc: '1200+源桌面下载器', proxy: false },
      { name: 'copymanga-downloader', url: 'https://github.com/lanyeeee/copymanga-downloader', desc: '拷贝漫画下载器', proxy: false },
      { name: 'manga-image-translator', url: 'https://github.com/zyddnys/manga-image-translator', desc: 'AI漫画图片翻译', proxy: false },
      { name: 'Kavita', url: 'https://github.com/Kareadita/Kavita', desc: '自托管阅读服务器', proxy: false },
      { name: 'Komga', url: 'https://github.com/Komga-org/Komga', desc: '漫画库管理+OPDS', proxy: false },
    ]
  },
]
