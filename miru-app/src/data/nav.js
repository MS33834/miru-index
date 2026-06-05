// Miru Index 数据：22 个细分分类，约 145+ 条资源
// 字段：name, url, desc, fullDesc, tags, features, proxy
// proxy: true 表示需要科学上网

export const categories = [
  {
    id: 'proxy',
    name: '网络代理',
    icon: '🛡️',
    items: [
      {
        name: '起飞VPN', url: 'https://goflyvpn.com/', desc: '多国节点商业VPN',
        fullDesc: '国内老牌商业 VPN 之一，提供 Windows / macOS / Android / iOS 全平台客户端，主打稳定与多国节点。免费试用窗口短，长期使用建议付费套餐。',
        tags: ['VPN', '商业', '全平台'], features: ['多国节点', '全平台客户端', '客服支持'], proxy: false
      },
      {
        name: 'ClashX', url: 'https://clashxhub.com/', desc: '需自己配置',
        fullDesc: 'Clash 系列 Mac 客户端下载站与教程聚合。Clash 内核支持 SS / SSR / V2Ray / Trojan / hysteria2 等多种协议，需要自行准备节点订阅。',
        tags: ['Clash', '节点', 'Mac'], features: ['多协议', '规则分流', 'TUN 模式'], proxy: false
      },
      {
        name: '绿茶VPN', url: 'https://www.lcvpn.qpon?id=177002747', desc: '连接最快',
        fullDesc: '主打"低延迟 + 极速连接"的免费试用 VPN，按连接速度自动匹配最优节点，适合临时访问海外学术或开发资源。',
        tags: ['VPN', '免费试用', '低延迟'], features: ['智能节点匹配', '低延迟', '免注册试用'], proxy: false
      },
      {
        name: 'V2RayN', url: 'https://github.com/2dust/v2rayN', desc: 'Windows 经典代理',
        fullDesc: 'Windows 平台 V2Ray / Xray 图形客户端老牌项目，支持订阅链接批量导入、路由规则分流、流量统计，ACGN 圈几乎人手一份。',
        tags: ['V2Ray', 'Windows', '开源'], features: ['订阅导入', '路由分流', '流量统计'], proxy: false
      },
    ]
  },
  {
    id: 'downloader',
    name: '下载器',
    icon: '⬇️',
    items: [
      {
        name: '1DM', url: 'https://play.google.com/store/apps/details?id=idm.internet.download.manager', desc: '加速直链下载',
        fullDesc: 'Android 端最知名的多线程下载管理器，前身是 IDM 移动版。支持 HTTPS / 磁力 / 视频嗅探，最高 32 线程，UI 干净无广告。',
        tags: ['Android', '多线程', '嗅探'], features: ['32 线程', '磁力支持', '视频嗅探'], proxy: true
      },
      {
        name: 'IDM', url: 'https://www.internetdownloadmanager.com/', desc: 'Windows 经典下载器',
        fullDesc: 'Windows 平台老牌多线程下载加速器，浏览器集成度高，主流网盘与视频站均能嗅探直链。付费软件，30 天试用。',
        tags: ['Windows', '经典', '嗅探'], features: ['多线程加速', '浏览器集成', '视频嗅探'], proxy: true
      },
      {
        name: 'Motrix', url: 'https://motrix.app/', desc: '全平台开源',
        fullDesc: '基于 aria2 的开源全平台下载管理器，界面清新，支持 HTTP / FTP / BT / 磁力，可同时下载 10 个任务，免费无广告。',
        tags: ['开源', '全平台', 'aria2'], features: ['BT / 磁力', '多协议', '无广告'], proxy: false
      },
    ]
  },
  {
    id: 'archive',
    name: '解压工具',
    icon: '📦',
    items: [
      {
        name: 'MT管理器', url: 'https://mt2.cn/', desc: '文件管理+解压+编辑',
        fullDesc: 'Android 平台最强大的文件管理器之一，集成 ZIP / RAR / 7Z 解压、文本 / 二进制编辑、APK 逆向功能，是折腾党的瑞士军刀。',
        tags: ['Android', '文件管理', '逆向'], features: ['多格式解压', 'APK 逆向', '文本编辑'], proxy: false
      },
      {
        name: '解压专家', url: 'https://www.unisapps.com/', desc: '查找密码',
        fullDesc: 'iOS 端口碑最好的解压工具之一，支持 70+ 压缩格式，可挂载网盘直接预览压缩包内文件，提供解压密码暴力破解辅助。',
        tags: ['iOS', '70+ 格式', '预览'], features: ['多格式支持', '网盘挂载', '密码辅助'], proxy: false
      },
      {
        name: 'ZArchiver Pro', url: 'https://zdevs.ru/en/', desc: '可解压lz4文件',
        fullDesc: 'Android 平台老牌解压工具，支持 zip / 7z / rar / tar / lz4 / zstd 等几乎所有冷门格式，体积小、纯本地、无广告。',
        tags: ['Android', '冷门格式', '无广告'], features: ['多格式', '纯本地', '小体积'], proxy: false
      },
      {
        name: '7-Zip', url: 'https://7-zip.org/', desc: '开源免费',
        fullDesc: 'Windows 平台最经典的开源解压软件，支持 7z / zip / tar / gz / bz2 / xz 等几乎所有格式，7z 格式压缩比业界第一。',
        tags: ['Windows', '开源', '7z'], features: ['高压缩比', '开源免费', '命令行版'], proxy: false
      },
    ]
  },
  {
    id: 'imagesearch',
    name: '搜图',
    icon: '🔍',
    items: [
      {
        name: '谷歌搜图', url: 'https://www.google.com/imghp', desc: '综合反向图片搜索',
        fullDesc: 'Google 图片搜索反向识别功能，搜图覆盖面最广，识别准确率高，可按尺寸 / 颜色 / 时间过滤。需要科学上网。',
        tags: ['Google', '综合', '反向'], features: ['覆盖广', '多维过滤', '识别准'], proxy: true
      },
      {
        name: 'SauceNAO', url: 'https://saucenao.com/', desc: '二次元反向搜图',
        fullDesc: '二次元画师最常用的反向搜图引擎，索引了 Pixiv / Danbooru / Gelbooru / nHentai 等多个站点，匹配精度极高。',
        tags: ['二次元', 'Pixiv', '画师'], features: ['多站索引', '高匹配', '来源直达'], proxy: true
      },
      {
        name: 'ascii2d', url: 'https://ascii2d.net/', desc: '二次元画像详细检索',
        fullDesc: '日系二次元反向搜图引擎，对低饱和度 / 色调复杂画面识别能力强，常作为 SauceNAO 的辅助补充，避免漏图。',
        tags: ['二次元', '颜色', '辅助'], features: ['色环搜图', '低饱和高识别', 'Pixiv 直达'], proxy: true
      },
      {
        name: 'iqdb', url: 'https://www.iqdb.org/', desc: '识图搜索',
        fullDesc: '聚合多家二次元图站的反向搜图引擎（Danbooru / Gelbooru / yande.re / Konachan 等），多结果对比，常用于鉴定画师。',
        tags: ['聚合', '多站对比', '画师'], features: ['多站索引', '结果对比', '画师匹配'], proxy: true
      },
      {
        name: 'TinEye', url: 'https://tineye.com/', desc: '最早的反向搜图',
        fullDesc: '全球最早的反向图片搜索服务，主要用于识别图片来源、追踪图片在网络上的最早出现时间，识别"老图"特别准。',
        tags: ['老图', '溯源', '全球'], features: ['老图识别', '溯源追踪', '时间线'], proxy: true
      },
      {
        name: 'Yandex 图像', url: 'https://yandex.com/images/', desc: '俄系强识别',
        fullDesc: '俄罗斯 Yandex 出品的反向搜图，对欧亚人像、卡通形象识别率极高，常用于搜索 Cos / 街拍原图。',
        tags: ['Yandex', '人像', '卡通'], features: ['欧亚强', 'Cos 识别', '原图直链'], proxy: true
      },
      {
        name: '搜图bot', url: 'https://soutubot.moe/', desc: 'Telegram 机器人',
        fullDesc: 'Telegram 上的多源聚合搜图机器人，一次上传同时调用 SauceNAO / ascii2d / IqDB / Yandex 等十余个引擎，结果按相似度排序。',
        tags: ['Telegram', '聚合', 'Bot'], features: ['多引擎聚合', '一键调用', '相似度排序'], proxy: false
      },
    ]
  },
  {
    id: 'ai',
    name: 'AI 工具',
    icon: '🤖',
    items: [
      {
        name: '漫画图片翻译', url: 'https://github.com/zyddnys/manga-image-translator', desc: 'AI 漫画翻译',
        fullDesc: '开源的 AI 漫画图片翻译工具，支持中日英多语言，文字检测 + OCR + 擦除 + 重绘一体化，可本地部署或 Colab 运行。',
        tags: ['AI', '漫画', 'OCR'], features: ['多语言', '一键擦除', '可本地'], proxy: false
      },
      {
        name: 'BallonTranslator', url: 'https://github.com/dmMaze/BallonsTranslator', desc: '带 GUI 的漫画翻译',
        fullDesc: '基于 manga-image-translator 的 GUI 客户端，支持选区编辑、人工校对、批量翻译，对比漫画翻译的"PS 替代品"。',
        tags: ['AI', 'GUI', '校对'], features: ['可视化', '选区编辑', '批量'], proxy: false
      },
      {
        name: 'SillyTavern', url: 'https://github.com/SillyTavern/SillyTavern', desc: 'AI 角色扮演前端',
        fullDesc: '开源 AI 角色扮演 / 聊天前端，可接入 OpenAI / Claude / 本地 LLaMA 等多种 API，ACGN 角色卡社区生态庞大。',
        tags: ['AI', '角色扮演', '本地'], features: ['多 API', '角色卡', '社区生态'], proxy: false
      },
      {
        name: 'image-matting', url: 'https://github.com/peterwilli/sd-webui-image-matting', desc: 'AI 抠图',
        fullDesc: 'Stable Diffusion WebUI 的抠图插件，基于 RMBG-1.4 模型，识别发丝级边缘细节，二次元图抠图表现尤其好。',
        tags: ['AI', '抠图', 'SD'], features: ['发丝级', '二次元优化', 'SD 插件'], proxy: false
      },
      {
        name: 'comic-translate', url: 'https://github.com/ogkalu2/comic-translate', desc: 'AI 漫画批量翻译',
        fullDesc: 'Comic Translate 是支持多服务（Sugoi / DeepL / GPT-4 / Gemini）的开源漫画翻译工具，界面现代，批量处理友好。',
        tags: ['AI', '翻译', '批量'], features: ['多服务', '现代 UI', '批量'], proxy: false
      },
      {
        name: 'kohya_ss GUI', url: 'https://github.com/bmaltais/kohya_ss', desc: 'SD 训练 GUI',
        fullDesc: 'Kohya 的 Stable Diffusion 训练 WebUI 包装，支持 LoRA / DreamBooth / Textual Inversion 训练，是训练二次元模型的事实标准。',
        tags: ['SD', 'LoRA', '训练'], features: ['LoRA', 'DreamBooth', 'WebUI'], proxy: false
      },
    ]
  },
  {
    id: 'nav',
    name: '导航站',
    icon: '🧭',
    items: [
      {
        name: 'ACG喵导航', url: 'https://www.miaoaaa.com/', desc: 'ACG 资源综合导航',
        fullDesc: 'ACGN 圈最知名的资源导航站之一，覆盖番剧 / 漫画 / GalGame / 工具 / 社区，每天人工审核收录新站。',
        tags: ['ACG', '综合', '人工审核'], features: ['分类清晰', '日更', '新站收录'], proxy: false
      },
      {
        name: 'YOUFAV', url: 'https://www.youfav.com/', desc: '网站集合',
        fullDesc: '以"个人收藏夹"形式展示的导航站，强调发现式浏览，适合漫无目的闲逛找资源。',
        tags: ['收藏夹', '发现式', '个人向'], features: ['推荐流', '标签过滤', '社区打分'], proxy: false
      },
      {
        name: 'Qingse', url: 'https://qingse.one/', desc: '网站集合',
        fullDesc: '轻量化 ACGN 资源聚合站，分类细致，更新频率高，移动端适配做得好。',
        tags: ['ACG', '轻量', '移动端'], features: ['响应式', '分类细', '更新快'], proxy: false
      },
    ]
  },
  {
    id: 'galgame_res',
    name: 'GalGame 资源',
    icon: '🎮',
    items: [
      {
        name: '青桔网', url: 'https://www.qingju.org/', desc: '网盘资源',
        fullDesc: '老牌 GalGame 资源站，主要以网盘形式分发中日韩 GalGame 原版与汉化版，附带攻略 / CG 包。',
        tags: ['GalGame', '网盘', '汉化'], features: ['中日韩', '汉化版', 'CG 包'], proxy: false
      },
      {
        name: 'Touchgal', url: 'https://www.touchgal.io/', desc: 'GalGame 综合站',
        fullDesc: 'GalGame 资源 + 资讯 + 评测一站式平台，UI 现代，资源更新快，社区氛围活跃。',
        tags: ['GalGame', '综合', '现代 UI'], features: ['资源 + 资讯', '活跃社区', '新游速递'], proxy: false
      },
      {
        name: '失落小站', url: 'https://www.shinnku.com/', desc: '老牌资源站',
        fullDesc: '运行多年的老牌 GalGame 资源站，资源以网盘 / 磁力形式发布，分类细致到按厂商 / 年代，怀旧党必看。',
        tags: ['老牌', '网盘', '磁力'], features: ['老游戏全', '按厂商', '怀旧向'], proxy: false
      },
      {
        name: '稻荷ACG', url: 'https://inarigal.com/', desc: 'GalGame 资源',
        fullDesc: '较新的 GalGame 资源站，UI 清新，更新速度极快，新作基本能在 1-2 周内收录。',
        tags: ['GalGame', '新作', '快'], features: ['更新快', 'UI 清新', '新作速递'], proxy: false
      },
      {
        name: 'NekoGAL', url: 'https://www.nekogal.com/', desc: 'GalGame 资源',
        fullDesc: '以"猫咪"命名的 GalGame 综合站，主打精品资源推荐 + 高质量汉化补丁。',
        tags: ['GalGame', '汉化', '精品'], features: ['精品推荐', '汉化补丁', '评测'], proxy: false
      },
      {
        name: '绮梦ACG', url: 'https://game.acgs.one/', desc: 'GalGame 资源',
        fullDesc: '老牌 ACG 站点的 GalGame 分支，资源以 BT 种子为主，资源池庞大。',
        tags: ['GalGame', 'BT', '老牌'], features: ['BT 为主', '资源池大', '社区'], proxy: false
      },
      {
        name: '05小站', url: 'https://05fx.022016.xyz/', desc: 'GalGame 资源',
        fullDesc: '小型但精的 GalGame 资源站，主打冷门 / 旧作补全，适合补票党。',
        tags: ['GalGame', '冷门', '补全'], features: ['冷门多', '旧作补全', '小而美'], proxy: false
      },
      {
        name: '岛屿ACG', url: 'https://www.acgwfb.com/', desc: '资源+论坛',
        fullDesc: 'ACG 资源 + 论坛形式的综合站，GalGame / 漫画 / 番剧 / 音乐都有专属板块，社交属性强。',
        tags: ['ACG', '论坛', '综合'], features: ['社区强', '多板块', '社交'], proxy: false
      },
    ]
  },
  {
    id: 'galgame_news',
    name: 'GalGame 资讯',
    icon: '📰',
    items: [
      {
        name: '量子ACG', url: 'https://lzacg.org/', desc: 'ACG 资讯',
        fullDesc: 'ACG 行业资讯 / 评测 / 攻略站，每周更新多篇深度文章，覆盖 GalGame / 番剧 / 漫画。',
        tags: ['ACG', '资讯', '评测'], features: ['深度文', '周更', '全领域'], proxy: false
      },
      {
        name: '次元小屋', url: 'https://cyxw.xyz/', desc: '二次元资源',
        fullDesc: '二次元资讯 + 资源综合站，文章质量较高，常有作者专访和制作组访谈。',
        tags: ['二次元', '资讯', '专访'], features: ['原创多', '作者专访', '深内容'], proxy: false
      },
      {
        name: 'MikiACG', url: 'https://www.mikiacg.org/', desc: 'GalGame 资讯',
        fullDesc: 'GalGame 圈资讯 / 评测 / 攻略专业站，编辑团队稳定，文章质量在圈内有口皆碑。',
        tags: ['GalGame', '评测', '攻略'], features: ['专业编辑', '高质文章', '稳定更新'], proxy: false
      },
      {
        name: '触乐网', url: 'https://www.chuapp.com/', desc: '游戏深度媒体',
        fullDesc: '国内一线游戏 / ACG 深度媒体，专栏文章质量业内顶尖，常有制作组访谈与行业洞察。',
        tags: ['游戏', '媒体', '深度'], features: ['深度文', '访谈', '行业'], proxy: false
      },
      {
        name: '游民星空', url: 'https://www.gamersky.com/', desc: '游戏资讯门户',
        fullDesc: '老牌游戏综合门户，资讯 / 评测 / 攻略 / 视频全覆盖，AI / ACG / 主机 / 单机内容均有。',
        tags: ['游戏', '门户', '评测'], features: ['资讯全', '评测多', '视频'], proxy: false
      },
    ]
  },
  {
    id: 'manga',
    name: '在线漫画',
    icon: '📚',
    items: [
      {
        name: '拷贝漫画', url: 'https://www.mangacopy.com/', desc: '国漫在线',
        fullDesc: '国漫 / 日漫双语在线阅读站，UI 仿哔咔，资源更新快，移动端适配好。',
        tags: ['国漫', '日漫', '在线'], features: ['双语', '更新快', '移动端'], proxy: true
      },
      {
        name: '漫画柜', url: 'https://www.manhuagui.com/', desc: '日漫在线',
        fullDesc: '老牌日漫在线阅读站，资源池大（数万部），支持按作者 / 杂志 / 标签筛选。',
        tags: ['日漫', '老牌', '资源池'], features: ['数万部', '多维筛选', '阅读体验佳'], proxy: false
      },
      {
        name: '动漫之家', url: 'https://www.dmzj.com/', desc: '国漫日漫',
        fullDesc: '国内最老牌的动漫综合站之一，漫画 / 番剧 / 资讯 / 论坛一体化，资源池极大。',
        tags: ['国漫', '日漫', '综合'], features: ['老牌', '一站式', '社区'], proxy: false
      },
      {
        name: 'E-Hentai', url: 'https://e-hentai.org', desc: '英文漫画档案库',
        fullDesc: '全球最大的英文漫画档案库，俗称"E 站"，资源以画廊形式组织，原始画廊可打包下载。需要科学上网。',
        tags: ['英文', '档案库', '画廊'], features: ['画廊打包', '标签细', '原始资源'], proxy: true
      },
      {
        name: 'nhentai', url: 'https://nhentai.net/', desc: '同人志合集',
        fullDesc: '以"番号"索引的英文 / 日文同人志合集站，资源以画廊形式浏览，按标签分类极细。仅收录合规内容。',
        tags: ['同人志', '番号', '画廊'], features: ['标签细', '番号索引', '画廊浏览'], proxy: true
      },
      {
        name: 'hitomi.la', url: 'https://hitomi.la/', desc: '日漫同人',
        fullDesc: '日漫 / 同人 / 画廊类站点，资源以图集形式发布，画质普遍高，适合二次元高清党。',
        tags: ['日漫', '同人', '高画质'], features: ['图集形式', '高画质', '日漫全'], proxy: true
      },
    ]
  },
  {
    id: 'illust',
    name: '插画 / 同人',
    icon: '🎨',
    items: [
      {
        name: 'Pixiv', url: 'https://www.pixiv.net/artworks/', desc: '日本最大插画平台',
        fullDesc: '日本最大插画 / 漫画 / 同人志投稿平台，俗称 P 站。作品以 pid 编号索引，反向搜图结果直接对应原页面。',
        tags: ['Pixiv', '插画', '同人'], features: ['pid 索引', '画师关注', '排行榜'], proxy: true
      },
      {
        name: 'Pixiv 镜像', url: 'https://pixiv.re/', desc: '免代理 Pixiv',
        fullDesc: '通过反向代理的方式让国内用户直连 Pixiv 单图（原图），适合查看插画原图，速度快。',
        tags: ['Pixiv', '镜像', '直连'], features: ['国内直连', '原图直链', '单图查看'], proxy: false
      },
      {
        name: 'DLsite', url: 'https://www.dlsite.com/maniax-touch/', desc: '同人数字市场',
        fullDesc: '日本最大的同人数字市场，音声 / 漫画 / 游戏 / CG 一应俱全，按社团 / 标签筛选极细。',
        tags: ['同人', '数字市场', 'CG'], features: ['社团索引', '标签细', '数字版'], proxy: true
      },
      {
        name: 'Melonbooks', url: 'https://www.melonbooks.co.jp/', desc: '同人志商店',
        fullDesc: '日本三大同人志实体书店之一，线上商城同步售卖实体 / 数字同人志，资源以社团为单位组织。',
        tags: ['同人志', '实体', '数字'], features: ['实体同步', '社团组织', '日本最大'], proxy: true
      },
      {
        name: 'Booth', url: 'https://booth.pm/', desc: 'pixiv 旗下商店',
        fullDesc: 'Pixiv 旗下的 C2C 数字商店，画师 / 社团可自由上架素材、笔刷、MMD 模型、音声等数字商品。',
        tags: ['pixiv', '数字', '素材'], features: ['C2C', '素材丰富', '画师直营'], proxy: true
      },
    ]
  },
  {
    id: 'manga_app',
    name: '漫画软件',
    icon: '📱',
    items: [
      {
        name: 'PicACG', url: 'https://www.picacomic.com/', desc: '哔咔哔咔客户端',
        fullDesc: 'Bika Bika（哔咔哔咔）官方多平台客户端，覆盖 Android / iOS / Windows / macOS，资源以社区投稿 + 官方授权为主。',
        tags: ['哔咔', '多平台', '官方'], features: ['全平台', '社区', '官方授权'], proxy: false
      },
      {
        name: 'JMComic', url: 'https://jmcomicog.net/', desc: 'JM 漫画客户端',
        fullDesc: 'JM 漫画官方多平台客户端，资源以台湾 / 港 / 大陆同人志为主，App 端阅读体验好，浏览器适配也有。',
        tags: ['JM', '同人', '多平台'], features: ['多端同步', '阅读体验', '港台资源'], proxy: false
      },
      {
        name: 'EhViewer', url: 'https://github.com/xiaojieonly/Ehviewer_CN_SXJ/releases', desc: 'E-Hentai Android',
        fullDesc: 'Android 平台最有名的 E-Hentai 第三方客户端，作者基于原版 EhViewer 持续维护，UI 本土化做得好。',
        tags: ['E-Hentai', 'Android', '第三方'], features: ['本土化', '持续更新', '轻量'], proxy: false
      },
      {
        name: 'Mihon', url: 'https://github.com/mihonapp/mihon', desc: 'Tachiyomi 继任者',
        fullDesc: 'Tachiyomi 官方继任者项目，Android 平台开源漫画阅读器，通过扩展源（Repository）支持上千个漫画站。',
        tags: ['Android', '扩展源', '开源'], features: ['上千源', '扩展架构', '开源'], proxy: false
      },
      {
        name: 'TachiyomiSY', url: 'https://github.com/jobobby04/TachiyomiSY', desc: 'Tachiyomi 稳定分支',
        fullDesc: 'Tachiyomi 停止维护前的稳定分支，由社区接手继续更新，UI 稳定，扩展生态成熟，老用户首选。',
        tags: ['Android', '稳定', 'Tachiyomi'], features: ['老用户友好', '稳定', '成熟生态'], proxy: false
      },
      {
        name: 'Aniyomi', url: 'https://github.com/aniyomiorg/aniyomi', desc: '漫画+番剧一站式',
        fullDesc: '基于 Mihon 衍生的"漫画 + 番剧"二合一客户端，一个 App 同时管漫画和追番，扩展源打通番剧 / 漫画两个生态。',
        tags: ['漫画', '番剧', '二合一'], features: ['二合一', 'Mihon 同源', '扩展互通'], proxy: false
      },
      {
        name: 'YACReader', url: 'https://github.com/YACReader/yacreader', desc: '桌面漫画阅读器',
        fullDesc: '跨平台桌面漫画阅读器（Windows / macOS / Linux），支持 CBZ/CBR/PDF 漫画库管理 + 远程 YACReaderLibrary 服务。',
        tags: ['桌面', '三端', '阅读器'], features: ['三端', '漫画库', '远程'], proxy: false
      },
      {
        name: 'OpenComic', url: 'https://github.com/ollm/OpenComic', desc: '开源漫画阅读',
        fullDesc: 'Electron 写的开源漫画阅读器（Windows / macOS / Linux），UI 现代，支持 manga / comic / 双页模式。',
        tags: ['Electron', '开源', '桌面'], features: ['现代 UI', '多格式', '三端'], proxy: false
      },
      {
        name: 'PeriHubo', url: 'https://github.com/nicobooz/PeriHubo', desc: '哔咔桌面客户端',
        fullDesc: '哔咔的桌面端第三方客户端，基于 Tauri 框架，支持 Win/Mac/Linux 三大平台。',
        tags: ['Tauri', '哔咔', '桌面'], features: ['三端', '现代 UI', '轻量'], proxy: false
      },
    ]
  },
  {
    id: 'anime_app',
    name: '番剧 App',
    icon: '📺',
    items: [
      {
        name: 'Kazumi', url: 'https://github.com/Predidit/Kazumi/releases/tag/1.7.3', desc: '跨平台番剧 App',
        fullDesc: '基于自定义规则的跨平台番剧 App（Windows / macOS / Android / iOS），通过规则文件解析各资源站，自带弹幕。',
        tags: ['番剧', '规则', '跨平台'], features: ['自定义规则', '弹幕', '四端'], proxy: false
      },
      {
        name: 'Animeko', url: 'https://myani.org/', desc: 'Compose 番剧 App',
        fullDesc: 'JetBrains Compose Multiplatform 开发的番剧 App，UI 现代、性能好，支持 Bangumi 追番进度同步。',
        tags: ['番剧', 'Compose', 'Bangumi'], features: ['现代 UI', '追番同步', 'KMP'], proxy: false
      },
      {
        name: 'Mihon 番剧', url: 'https://github.com/aniyomiorg/aniyomi', desc: '番剧+漫画',
        fullDesc: 'Mihon 的番剧衍生态，单独抽出番剧追番功能，提供与漫画同源的扩展仓库。',
        tags: ['番剧', '扩展', 'Mihon'], features: ['扩展源', 'Mihon 同源', '追番'], proxy: false
      },
      {
        name: '弹弹play', url: 'https://www.dandanplay.com/', desc: '老牌弹幕播放器',
        fullDesc: '老牌本地视频 + 弹幕匹配播放器，可自动从视频文件匹配第三方弹幕库（包含部分番剧），是下载党追番利器。',
        tags: ['弹幕', '本地', '匹配'], features: ['弹幕匹配', '本地播放', '多格式'], proxy: false
      },
      {
        name: 'EasyBangumi', url: 'https://github.com/easybangumi/easybangumi', desc: '免费开源追番',
        fullDesc: 'Java 写的开源番剧 App，提供资源采集 + 弹幕 + Web 端管理后台，可自部署后端 + 多端 App 追番。',
        tags: ['番剧', 'Java', '自部署'], features: ['资源采集', 'Web 后台', '开源'], proxy: false
      },
      {
        name: 'Bangumi-Android', url: 'https://github.com/czy0729/Bangumi', desc: 'React Native 追番',
        fullDesc: '基于 React Native 的 Bangumi 第三方客户端（iOS / Android / WSA），UI 现代化，与 bgm.tv 账号体系完全打通。',
        tags: ['React Native', 'Bangumi', 'iOS'], features: ['原生体验', '追番同步', '多端'], proxy: false
      },
    ]
  },
  {
    id: 'anime_site',
    name: '在线番剧',
    icon: '🎬',
    items: [
      {
        name: '琉璃神社', url: 'https://www.llss.icu/wp/', desc: '下载',
        fullDesc: '老牌动漫 / GalGame 资源共享站，主打 BT 种子与网盘分发，资源按季度 / 年份整理。',
        tags: ['BT', '网盘', '老牌'], features: ['BT 为主', '按季度', '老资源全'], proxy: false
      },
      {
        name: 'ACG漫音社', url: 'https://www.acgjc.com/', desc: '下载',
        fullDesc: '番剧 / 漫画 / 音乐综合下载站，资源按新番更新，自带磁力链接。',
        tags: ['番剧', '磁力', '新番'], features: ['新番速更', '磁力', '音乐'], proxy: false
      },
      {
        name: 'MX动漫', url: 'https://www.mxdm.xyz/', desc: '在线番剧',
        fullDesc: '在线番剧聚合站，无广告、移动端友好，资源按新番速更，多线路切换。',
        tags: ['在线', '新番', '无广告'], features: ['多线路', '移动友好', '无广告'], proxy: false
      },
      {
        name: '大千视界', url: 'https://www.dalvdm.cc/', desc: '在线番剧',
        fullDesc: '在线番剧 / 电影聚合站，资源以新番 / 剧场版为主，画质涵盖 1080p / 4K。',
        tags: ['在线', '4K', '剧场版'], features: ['高画质', '剧场版', '新番'], proxy: false
      },
      {
        name: '第一动漫', url: 'https://1anime2024.com/', desc: '在线番剧',
        fullDesc: '新晋在线番剧站，主打 4K 高画质 + 新番同步更新，UI 现代。',
        tags: ['在线', '4K', '新站'], features: ['4K 画质', '新番速更', '现代 UI'], proxy: true
      },
      {
        name: 'H次元', url: 'https://h-ciyuan.com/', desc: '在线番剧',
        fullDesc: '在线番剧 / 漫画综合站，UI 仿哔咔风格，资源以网盘 + 在线双模式分发。',
        tags: ['在线', '网盘', '漫画'], features: ['双模式', 'UI 仿哔咔', '漫画+番剧'], proxy: true
      },
    ]
  },
  {
    id: 'subgroup',
    name: '字幕组 / 磁力',
    icon: '🔗',
    items: [
      {
        name: '动漫花园', url: 'https://share.dmhy.org/', desc: '字幕组磁力聚合',
        fullDesc: '老牌动漫字幕组磁力聚合站（DMHY），每天实时聚合各大字幕组新番发布，磁力 + 迅雷链接双发。',
        tags: ['字幕组', '磁力', '新番'], features: ['实时聚合', '双链接', '字幕组全'], proxy: false
      },
      {
        name: 'ACG.RIP', url: 'https://acg.rip/', desc: '高质量新番',
        fullDesc: '高品质新番磁力站，主打"质量优先"，每集附带发布组、分辨率、编码信息，适合收藏党。',
        tags: ['高质量', '磁力', '新番'], features: ['高画质', '详细信息', '收藏党'], proxy: false
      },
      {
        name: 'Nyaa', url: 'https://nyaa.si/', desc: '海外动漫磁力',
        fullDesc: '海外最知名的动漫磁力索引站（喵站），资源以日 / 英 / 韩新番和里番为主，分类细致。',
        tags: ['Nyaa', '海外', '磁力'], features: ['海外资源', '分类细', '元数据全'], proxy: true
      },
      {
        name: '蜜柑计划', url: 'https://mikanani.me/', desc: '新番磁力索引',
        fullDesc: '国内新番磁力索引站，自动从各字幕组抓取新番发布，UI 简洁，磁力 + 迅雷链双发。',
        tags: ['新番', '磁力', '索引'], features: ['自动抓取', 'UI 简洁', '速更'], proxy: false
      },
    ]
  },
  {
    id: 'game',
    name: '游戏',
    icon: '🕹️',
    items: [
      {
        name: 'Switch520', url: 'https://www.gamer520.com/', desc: 'Switch 资源',
        fullDesc: 'Switch 平台游戏资源 + 模拟器 / 固件下载站，资源按字母 / 类型 / 容量筛选，更新快。',
        tags: ['Switch', '模拟器', '固件'], features: ['资源全', '固件 / 工具', '分类细'], proxy: false
      },
      {
        name: '游戏分享社', url: 'https://www.gameshare.cc/', desc: '多平台资源',
        fullDesc: 'PC / Switch / PS / 手游多平台游戏资源站，主打网盘分发，每款资源附预览图 + 简介。',
        tags: ['多平台', '网盘', '综合'], features: ['多平台', '附预览', '网盘'], proxy: false
      },
      {
        name: 'Steam', url: 'https://store.steampowered.com/', desc: 'PC 数字游戏平台',
        fullDesc: '全球最大 PC 数字游戏平台，俗称"蒸汽平台"。官方渠道，无盗版风险，需科学上网。',
        tags: ['Steam', '官方', 'PC'], features: ['官方', '云存档', '社区'], proxy: true
      },
      {
        name: 'Epic Games', url: 'https://store.epicgames.com/', desc: '每周免费',
        fullDesc: 'PC 数字游戏平台，每周送一款免费游戏，部分独占作品（如《堡垒之夜》），需科学上网。',
        tags: ['Epic', '免费', '独占'], features: ['周免', '独占作品', '官方'], proxy: true
      },
      {
        name: '3DM 论坛', url: 'https://bbs.3dmgame.com/', desc: 'PC 单机游戏',
        fullDesc: '老牌 PC 单机游戏论坛，附带破解资源（请支持正版），版块涵盖硬件 / 资讯 / MOD。',
        tags: ['PC', '论坛', '老牌'], features: ['论坛', '硬件', 'MOD'], proxy: false
      },
      {
        name: 'PlayStation Store', url: 'https://store.playstation.com/', desc: 'PS 平台',
        fullDesc: '索尼 PlayStation 官方数字商店，PS4 / PS5 数字版游戏、PSN 会员订阅等，需科学上网。',
        tags: ['PS', '官方', '主机'], features: ['官方', 'PSN 会员', '独占'], proxy: true
      },
    ]
  },
  {
    id: 'novel',
    name: '轻小说 / 网络小说',
    icon: '📖',
    items: [
      {
        name: '轻小说文库', url: 'https://www.wenku8.cc/', desc: '日文轻小说中文翻译',
        fullDesc: '国内最老牌的日文轻小说中文化站点，志愿者翻译，按作品 / 作者 / 标签分类齐全。',
        tags: ['轻小说', '日文', '翻译'], features: ['志愿者', '老牌', '分类细'], proxy: false
      },
      {
        name: '鸠摩搜索', url: 'https://www.jiumodiary.com/', desc: '电子书聚合搜索',
        fullDesc: '电子书聚合搜索引擎，跨网盘 / 论坛 / Z-Library 等多个数据源，结果按相关度 / 时间排序。',
        tags: ['电子书', '搜索', '聚合'], features: ['多源聚合', '电子书', '网盘'], proxy: false
      },
      {
        name: '80电子书', url: 'https://m.txt80.cc/', desc: 'TXT 电子书',
        fullDesc: 'TXT 格式电子书下载站，资源以网文 / 轻小说 / 历史为主，移动端适配好。',
        tags: ['TXT', '网文', '轻小说'], features: ['TXT 格式', '网文全', '移动端'], proxy: false
      },
      {
        name: '奇书网', url: 'https://m.9qishu.com/', desc: '网络小说',
        fullDesc: '网络小说聚合站，按玄幻 / 都市 / 言情 / 科幻 / 历史分类，每日更新。',
        tags: ['网文', '玄幻', '都市'], features: ['分类全', '日更', '移动端'], proxy: false
      },
      {
        name: '全本同人小说', url: 'https://www.qbtr.cc/', desc: '同人小说',
        fullDesc: '同人小说专门站，资源以已完结作品为主，按动漫 / 影视 / 小说 / 游戏原作分类。',
        tags: ['同人', '完结', '原作'], features: ['完结多', '按原作', '细分'], proxy: false
      },
      {
        name: '幻梦轻小说', url: 'https://www.huanmengacg.com/', desc: '轻小说',
        fullDesc: '轻小说专门站，资源多为高质量翻译 / 转载，附带书评与推荐。',
        tags: ['轻小说', '翻译', '书评'], features: ['高质量', '附书评', '推荐'], proxy: false
      },
      {
        name: '刺猬猫阅读', url: 'https://www.ciweimao.com/', desc: '二次元网文头部',
        fullDesc: '国内二次元网文头部平台，书籍量超百万册，首创弹幕互动阅读，主打二次元穿越 / 综漫同人 / 娘化百合。',
        tags: ['网文', '二次元', '弹幕'], features: ['百万册', '弹幕互动', '综漫'], proxy: false
      },
      {
        name: '轻之文库', url: 'https://www.linovel.net/', desc: '国轻原创',
        fullDesc: '国内最早轻小说分享交流平台之一，主打新作首发与读者共创生态，大量国轻作者 / 原创作品。',
        tags: ['轻小说', '原创', '国轻'], features: ['新作首发', '国轻', '移动端'], proxy: false
      },
      {
        name: 'Kadokado', url: 'https://kadokado.com.tw/', desc: '角川正版',
        fullDesc: '角川官方正版平台，台湾繁体区，庞大正版日轻库藏 + 漫画 / 插画资源，版权保障稳定性高。',
        tags: ['角川', '正版', '日轻'], features: ['正版', '库藏大', '漫画'], proxy: true
      },
    ]
  },
  {
    id: 'library',
    name: '图书馆 / 古籍',
    icon: '🏛️',
    items: [
      {
        name: '鸠摩搜索', url: 'https://www.jiumodiary.com/', desc: '电子书聚合',
        fullDesc: '电子图书馆藏聚合搜索，跨网盘 + 论坛 + Z-Library，资源类型横跨网文 / 古典 / 学术。',
        tags: ['电子书', '聚合', '学术'], features: ['多源', '全类型', '搜索强'], proxy: false
      },
      {
        name: 'Library Digital', url: 'https://library.ucsd.edu/dc/', desc: 'UCSD 数字馆藏',
        fullDesc: '加州大学圣地亚哥分校数字馆藏公开访问入口，含古籍 / 报纸 / 照片 / 音像资料，免费浏览。',
        tags: ['UCSD', '公开', '古籍'], features: ['古籍', '免费', '高校'], proxy: true
      },
      {
        name: 'Internet Archive', url: 'https://archive.org/', desc: '全球数字图书馆',
        fullDesc: '全球最大的非营利数字图书馆，收录网页快照、书籍、音频、视频、软件等海量公共资源。',
        tags: ['Archive', '全球', '公益'], features: ['海量', '公共域', '可借阅'], proxy: true
      },
      {
        name: 'Z-Library', url: 'https://zh.z-lib.help/', desc: '免费电子书',
        fullDesc: '全球最大免费电子书库之一，学术 / 小说 / 漫画 / 教材 / 期刊均有，访问需通过镜像（域名经常变动）。',
        tags: ['电子书', '免费', '学术'], features: ['资源极大', '多类型', '镜像多'], proxy: true
      },
      {
        name: '毛泽东著作', url: 'https://www.mzdbl.cn/maoxuan/index.html', desc: '毛选全文',
        fullDesc: '《毛泽东选集》全一至四卷在线全文阅读站点，附生平年表、诗词、语录索引。',
        tags: ['政治', '经典', '中文'], features: ['全文', '年表', '语录'], proxy: false
      },
      {
        name: '党政数据库', url: 'https://www.kdocs.cn/l/ci7Hy0AMoyBD', desc: '政经资料',
        fullDesc: '金山文档托管的党政学习资料合集，含各类政策文件、讲话稿、学习材料 PDF。',
        tags: ['党政', 'PDF', '资料'], features: ['PDF', '合集', '政策文件'], proxy: false
      },
    ]
  },
  {
    id: 'github',
    name: 'GitHub 开源',
    icon: '💻',
    items: [
      // JM 工具子组
      {
        name: 'JMComic-Crawler-Python', url: 'https://github.com/hect0x7/JMComic-Crawler-Python', desc: 'Python API 下载器',
        fullDesc: 'JM 漫画的 Python API 包装 + 命令行下载工具，可配合 GitHub Actions 实现云端自动下载并通过 Telegram 推送。',
        tags: ['Python', 'JM', 'CLI'], features: ['API 完整', 'GH Actions', 'TG 推送'], proxy: false
      },
      {
        name: 'jmcomic-downloader', url: 'https://github.com/lanyeeee/jmcomic-downloader', desc: 'Tauri 桌面 GUI',
        fullDesc: '基于 Tauri 框架的 JM 漫画桌面下载器（Win/Mac/Linux），UI 现代，支持多线程 / 断点续传。',
        tags: ['Tauri', 'JM', '桌面'], features: ['三端', '多线程', '现代 UI'], proxy: false
      },
      {
        name: 'JMComic-qt', url: 'https://github.com/tonquer/JMComic-qt', desc: 'Qt 桌面客户端',
        fullDesc: 'Qt 框架开发的 JM 漫画桌面客户端（C++ / Python），支持 Windows / Linux / macOS，体积小。',
        tags: ['Qt', 'JM', '桌面'], features: ['三端', '体积小', 'PyQt'], proxy: false
      },
      // 哔咔工具子组
      {
        name: 'PicaComic', url: 'https://github.com/wgh136/PicaComic', desc: 'Flutter 多源',
        fullDesc: 'Flutter 写的多源漫画 App（iOS / Android / Windows / macOS / Linux），支持哔咔 / 拷贝 / 漫画柜等多个源。',
        tags: ['Flutter', '哔咔', '多源'], features: ['多源', '五端', '现代 UI'], proxy: false
      },
      {
        name: 'picacomic-downloader', url: 'https://github.com/lanyeeee/picacomic-downloader', desc: 'Tauri 哔咔下载器',
        fullDesc: 'Tauri 桌面哔咔下载器，作者同时维护 JM 下载器，UI / 体验一致，支持收藏夹导出。',
        tags: ['Tauri', '哔咔', '桌面'], features: ['收藏夹导出', '现代 UI', '三端'], proxy: false
      },
      {
        name: 'pica-go', url: 'https://github.com/niuhuan/pica-go', desc: 'Go 哔咔 API',
        fullDesc: '哔咔 API 的 Go 语言实现，可作为后端 SDK 或命令行工具，单文件可执行，跨平台。',
        tags: ['Go', '哔咔', 'SDK'], features: ['单文件', '跨平台', 'SDK'], proxy: false
      },
      // E-Hentai 工具子组
      {
        name: 'JHenTai', url: 'https://github.com/jiangtian616/JHenTai', desc: 'Flutter E-Hentai 客户端',
        fullDesc: 'Flutter 写的 E-Hentai 客户端（Android / iOS / Windows / macOS），UI 现代化，阅读体验流畅。',
        tags: ['Flutter', 'E-Hentai', '多端'], features: ['四端', '现代 UI', '阅读优化'], proxy: false
      },
      {
        name: 'EhViewer CN_SXJ', url: 'https://github.com/xiaojieonly/ehviewer_cn_sxj', desc: 'Android E-Hentai 客户端',
        fullDesc: '基于 EhViewer 的 Android 客户端，作者持续维护，本土化（中文翻译 + 国内节点）做得好。',
        tags: ['Android', 'E-Hentai', '本土化'], features: ['持续维护', '本土化', '轻量'], proxy: false
      },
      {
        name: 'nhentai-helper', url: 'https://github.com/Tsuk1ko/nhentai-helper', desc: 'nhentai 下载脚本',
        fullDesc: 'nhentai 番号批量下载脚本，支持多线程 + 断点续传 + 多种输出格式（PDF / ZIP / CBZ）。',
        tags: ['Node.js', 'nhentai', 'CLI'], features: ['多线程', '多格式输出', '断点续传'], proxy: false
      },
      // 通用下载器
      {
        name: 'HakuNeko', url: 'https://github.com/manga-download/hakuneko', desc: '1200+ 源桌面下载器',
        fullDesc: '基于 NW.js 的桌面漫画下载器，内置 1200+ 数据源，覆盖几乎所有主流漫画 / 同人站，桌面端功能完整。',
        tags: ['桌面', '多源', '下载器'], features: ['1200+ 源', '三端', '桌面端'], proxy: false
      },
      {
        name: 'Mihon', url: 'https://github.com/mihonapp/mihon', desc: 'Tachiyomi 继任者',
        fullDesc: 'Tachiyomi 的官方继任者，Android 端开源漫画阅读器，通过扩展仓库支持上千漫画站。',
        tags: ['Android', '扩展', '开源'], features: ['上千源', '扩展架构', '开源'], proxy: false
      },
      {
        name: 'Komikku', url: 'https://github.com/komikku-app/komikku', desc: 'GNOME 桌面阅读器',
        fullDesc: 'GNOME 桌面环境的开源漫画阅读器（Linux 主战场，亦有 Android），UI 与 GNOME 设计语言统一。',
        tags: ['GNOME', 'Linux', '阅读器'], features: ['GNOME 原生', '开源', '本地优先'], proxy: false
      },
      {
        name: 'TachiyomiSY', url: 'https://github.com/jobobby04/TachiyomiSY', desc: 'Tachiyomi 稳定分支',
        fullDesc: 'Tachiyomi 停止维护前的稳定分支，由社区接手持续更新，扩展生态成熟。',
        tags: ['Android', '稳定', 'Tachiyomi'], features: ['稳定', '扩展全', '社区维护'], proxy: false
      },
      {
        name: 'Suwayomi-Server', url: 'https://github.com/Suwayomi/Suwayomi-Server', desc: '自托管漫画服务器',
        fullDesc: '自托管漫画服务器前端 + Tachiyomi 后端的组合，可自部署在 NAS / 服务器，配合 Web UI 在任何设备上阅读。',
        tags: ['自托管', 'Server', 'Web'], features: ['自托管', '多端', '开源'], proxy: false
      },
      {
        name: 'Aniyomi', url: 'https://github.com/aniyomiorg/aniyomi', desc: '漫画+番剧一站式',
        fullDesc: 'Mihon 衍生态，漫画 + 番剧二合一客户端，一个 App 同时管两类内容。',
        tags: ['漫画', '番剧', '二合一'], features: ['二合一', 'Mihon 同源', '扩展互通'], proxy: false
      },
      {
        name: 'copymanga-downloader', url: 'https://github.com/lanyeeee/copymanga-downloader', desc: '拷贝漫画下载器',
        fullDesc: 'Tauri 桌面"拷贝漫画"下载器，作者同款 jmcomic-downloader，体验一致。',
        tags: ['Tauri', '拷贝', '桌面'], features: ['三端', '现代 UI', '多线程'], proxy: false
      },
      {
        name: 'Kavita', url: 'https://github.com/Kareadita/Kavita', desc: '自托管阅读服务器',
        fullDesc: '自托管漫画 / 书籍 / 杂志阅读服务器，OPDS / Web Reader 全平台支持，部署简单，活跃开发。',
        tags: ['自托管', '阅读器', 'OPDS'], features: ['自托管', '多格式', 'Web Reader'], proxy: false
      },
      {
        name: 'Komga', url: 'https://github.com/gotson/komga', desc: '漫画库管理',
        fullDesc: '自托管漫画库管理服务器，OPDS / Web Reader / REST API，UI 现代化，适合家庭 NAS 部署。',
        tags: ['自托管', 'OPDS', 'Web'], features: ['OPDS', 'REST API', '家庭友好'], proxy: false
      },
      {
        name: 'manga-image-translator', url: 'https://github.com/zyddnys/manga-image-translator', desc: 'AI 漫画图片翻译',
        fullDesc: 'AI 漫画图片翻译（OCR + 擦除 + 重绘），支持中日英多语言，命令行 / Colab 均可运行。',
        tags: ['AI', 'OCR', '漫画'], features: ['多语言', '可本地', 'CLI'], proxy: false
      },
      {
        name: 'Kazumi', url: 'https://github.com/Predidit/Kazumi/releases/tag/1.7.3', desc: '番剧 App',
        fullDesc: '基于自定义规则的跨平台番剧 App，自带弹幕，支持 Windows / macOS / Android / iOS。',
        tags: ['番剧', '规则', '跨平台'], features: ['自定义规则', '弹幕', '四端'], proxy: false
      },
      {
        name: 'Animeko', url: 'https://myani.org/', desc: 'Compose 番剧',
        fullDesc: 'JetBrains Compose Multiplatform 番剧 App，UI 现代，Bangumi 追番同步。',
        tags: ['番剧', 'Compose', 'Bangumi'], features: ['现代 UI', '追番同步', 'KMP'], proxy: false
      },
      {
        name: 'Waifu2x-Extension-GUI', url: 'https://github.com/AaronFeng753/Waifu2x-Extension-GUI', desc: 'AI 图像超分 GUI',
        fullDesc: '集成了 Waifu2x / SRMD / RealSR / Real-ESRGAN / Real-CUGAN 等多种超分算法的 GUI 客户端，批量处理视频 / 番剧 / 漫画图片。',
        tags: ['超分', 'GUI', '批量'], features: ['多算法', '批量', '视频帧'], proxy: false
      },
      {
        name: 'Real-ESRGAN', url: 'https://github.com/xinntao/Real-ESRGAN', desc: 'AI 图像超分',
        fullDesc: '腾讯 ARC 实验室开源的图像 / 视频超分算法，Anime6B / Video 多个模型，是当前开源超分的事实标准之一。',
        tags: ['超分', '腾讯', '开源'], features: ['多模型', '视频支持', '高质量'], proxy: false
      },
      {
        name: 'Real-CUGAN', url: 'https://github.com/bilibili/ailab/Real-CUGAN', desc: 'B站开源超分',
        fullDesc: 'B站 AI Lab 开源的动漫专用超分算法，WebUI + 命令行双模式，对二次元画面细节保留好。',
        tags: ['超分', 'B站', '二次元'], features: ['二次元', 'WebUI', '开源'], proxy: false
      },
      {
        name: 'EasySpider', url: 'https://github.com/NaiboWang/EasySpider', desc: '可视化爬虫',
        fullDesc: '零代码可视化爬虫工具，图形化选择元素 + 流程编排，可批量抓取番剧 / 漫画 / 小说章节。',
        tags: ['爬虫', '零代码', 'GUI'], features: ['可视化', '零代码', '批量'], proxy: false
      },
    ]
  },
  {
    id: 'music',
    name: '二次元音乐',
    icon: '🎵',
    items: [
      {
        name: 'ACG 漫音社', url: 'https://www.acgjc.com/', desc: 'ACG 音乐下载',
        fullDesc: '老牌 ACG 音乐 / 番剧 / 漫画综合下载站，资源以网盘 / 磁力分发，OP / ED / BGM / OST 一应俱全。',
        tags: ['ACG', '音乐', '网盘'], features: ['音乐', 'OP/ED', '综合'], proxy: false
      },
      {
        name: 'Biu.Moe', url: 'https://biu.moe/', desc: '二次元音乐',
        fullDesc: '专做 ACG 音乐分享的小众站，资源以单曲 / 专辑形式组织，UI 简洁无广告，是音乐党的纯享选择。',
        tags: ['ACG', '单曲', '纯享'], features: ['单曲专辑', '无广告', '纯享'], proxy: false
      },
      {
        name: '源音塘', url: 'https://www.yuanyintang.org/', desc: '原声带 / OST',
        fullDesc: '专注动画 / 游戏原声带分享的 ACG 音乐站，资源以 OST / BGM 专辑为主，标签细致。',
        tags: ['OST', 'BGM', '标签'], features: ['OST', '标签细', '动画'], proxy: false
      },
      {
        name: '千千音乐', url: 'https://www.taihe.com/', desc: '在线音乐',
        fullDesc: '老牌在线音乐平台（前百度音乐），ACG / 二次元专区收录丰富，资源齐全 + 智能推荐。',
        tags: ['音乐', '平台', 'ACG'], features: ['ACG 专区', '推荐', '老牌'], proxy: false
      },
      {
        name: 'MyFreeMP3', url: 'https://tool.liumingye.cn/music/', desc: '在线试听 / 下载',
        fullDesc: '聚合多音乐平台资源的免费试听 / 下载站，ACG 资源丰富，UI 简洁，支持歌词 / 封面下载。',
        tags: ['音乐', '免费', '聚合'], features: ['多源聚合', '免费', '歌词'], proxy: false
      },
    ]
  },
  {
    id: 'figure',
    name: '周边 / 谷子',
    icon: '🎁',
    items: [
      {
        name: '哔哩哔哩会员购', url: 'https://mall.bilibili.com/', desc: '官方周边商城',
        fullDesc: 'B 站官方周边商城，主打二次元 IP 衍生品（手办 / 吧唧 / 亚克力 / 周边），全部正版授权。',
        tags: ['B站', '官方', '周边'], features: ['正版', '品类多', '官方'], proxy: false
      },
      {
        name: '萌购', url: 'https://www.amiami.com/', desc: '日淘手办',
        fullDesc: '日本最大手办 / 周边网上商城，中文界面，支持直邮 / 转运，价格比国内便宜，是手办党日淘首选。',
        tags: ['日淘', '手办', '转运'], features: ['日淘', '中文', '转运'], proxy: true
      },
      {
        name: '闲鱼', url: 'https://www.goofish.com/', desc: '二手交易',
        fullDesc: '阿里旗下二手交易平台，二次元"回血"主场，2026 年新上线"鱼鲤次元"频道专注谷子经济，提供官方仓鉴定服务。',
        tags: ['二手', '回血', '谷子'], features: ['二手大', '官方仓', '谷子'], proxy: false
      },
      {
        name: '千岛 App', url: 'https://www.qdobos.com/', desc: '潮玩 / 谷子',
        fullDesc: '潮玩 / 谷子垂类交易平台，闪购模式 + 行情榜 + 圈子社区，潮玩圈和谷圈核心用户的"查价 + 闪购"双优选。',
        tags: ['潮玩', '谷子', '闪购'], features: ['闪购', '行情榜', '社区'], proxy: false
      },
      {
        name: 'Animate 中国', url: 'https://www.animate-onlineshop.com.cn/', desc: '动漫周边',
        fullDesc: '日本 Animate 在华官方商城，IP 周边齐全（手办 / 周边 / CD / 漫画），常有限定商品。',
        tags: ['Animate', '官方', 'IP'], features: ['官方', 'IP 全', '限定'], proxy: true
      },
    ]
  },
  {
    id: 'news',
    name: '资讯 / 评分',
    icon: '📰',
    items: [
      {
        name: 'Bangumi 番组计划', url: 'https://bgm.tv/', desc: 'ACG 评分核心',
        fullDesc: '中文 ACG 圈最权威的评分 / 资讯 / 社区平台，覆盖动画 / 漫画 / 游戏 / 音乐 / 三次元，条目库极全，社区氛围浓厚。',
        tags: ['评分', '社区', '条目'], features: ['条目全', '社区强', '多领域'], proxy: false
      },
      {
        name: 'MyAnimeList', url: 'https://myanimelist.net/', desc: '全球最大动漫 DB',
        fullDesc: '全球最知名的动漫 / 漫画评分数据库，月活数千万，英文社区最活跃，榜单权威。',
        tags: ['MAL', '英文', '评分'], features: ['英文 DB', '评分权威', '榜单'], proxy: true
      },
      {
        name: 'AniList', url: 'https://anilist.co/', desc: '现代 ACG 平台',
        fullDesc: '新一代 ACG 平台，UI 现代、统计丰富，跨端 iOS / Android / macOS / Windows 同步追番，适合数据控。',
        tags: ['AniList', '现代', '统计'], features: ['现代 UI', '数据统计', '多端'], proxy: true
      },
      {
        name: 'VNDB', url: 'https://vndb.org/', desc: '视觉小说 DB',
        fullDesc: '全球最大的视觉小说（GalGame）数据库，6.3 万+ 作品、16 万+ 角色、14 万+ 发行版，标签系统业内标杆。',
        tags: ['VN', 'GalGame', '标签'], features: ['VN 全', '标签细', '业界标杆'], proxy: true
      },
      {
        name: 'AniDB', url: 'https://anidb.net/', desc: '动漫资料库',
        fullDesc: '老牌动漫资料库，覆盖动画 / 番剧 / OVA / 剧场版等所有形式的 ACG 作品，文件信息（CRC / 来源）极详。',
        tags: ['资料库', '老牌', 'CRC'], features: ['资料全', '文件信息', '老牌'], proxy: true
      },
      {
        name: 'B站番剧索引', url: 'https://www.bilibili.com/anime/', desc: 'B站官方番剧',
        fullDesc: 'B站官方番剧索引，权威番剧时间表 / 评分 / 追番数 / 播放量，正版番剧大本营，国创 / 日漫 / 欧美动画全收录。',
        tags: ['B站', '官方', '正版'], features: ['正版', '时间表', '评分'], proxy: false
      },
    ]
  },
  {
    id: 'imgai',
    name: '图像 AI',
    icon: '🖼️',
    items: [
      {
        name: 'Waifu2x', url: 'https://waifu2x.net/', desc: '二次元超分鼻祖',
        fullDesc: '二次元图像超分辨率算法鼻祖，原始项目已被多次重写，目前 waifu2x.net 提供 Web 在线版，免登录直接使用。',
        tags: ['Waifu2x', 'Web', '在线'], features: ['Web 版', '免登录', '二次元'], proxy: false
      },
      {
        name: 'Real-ESRGAN ncnn', url: 'https://github.com/xinntao/Real-ESRGAN-ncnn-vulkan', desc: 'Real-ESRGAN 桌面',
        fullDesc: 'Real-ESRGAN 的 ncnn + Vulkan 实现桌面版，开箱即用（Win / Mac / Linux），无 Python 环境要求。',
        tags: ['超分', '桌面', '三端'], features: ['三端', 'Vulkan', '无依赖'], proxy: false
      },
      {
        name: 'Waifu2x-Extension-GUI', url: 'https://github.com/AaronFeng753/Waifu2x-Extension-GUI', desc: '超分全功能 GUI',
        fullDesc: '集成 Waifu2x / SRMD / RealSR / Real-ESRGAN / Real-CUGAN 等多种算法的 Windows GUI，批量处理视频帧 / 图片。',
        tags: ['超分', 'GUI', 'Windows'], features: ['多算法', '批量', '视频帧'], proxy: false
      },
      {
        name: 'upscayl', url: 'https://github.com/upscayl/upscayl', desc: '开源桌面超分',
        fullDesc: '开源桌面超分辨率客户端（Win / Mac / Linux），UI 现代，基于 Real-ESRGAN 模型，支持批量处理。',
        tags: ['超分', '三端', '现代 UI'], features: ['三端', '现代 UI', '批量'], proxy: false
      },
      {
        name: 'chaiNNer', url: 'https://github.com/chaiNNer-org/chaiNNer', desc: '节点式图像处理',
        fullDesc: '节点式（Node-based）图像处理工具，可视化拼接超分 / 修复 / 上色等 AI 模型，适合进阶玩家。',
        tags: ['节点', '可视化', '进阶'], features: ['节点', '可视化', '可拼装'], proxy: false
      },
    ]
  },
];
