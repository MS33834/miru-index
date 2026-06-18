# 漫画资源集成仓库

> 收录 GitHub 上最近仍在活跃维护的 JM 漫画（禁漫天堂 / 18comic）、哔咔哔咔（PicACG / manhuabika）以及同类漫画阅读 / 下载 / 解析相关开源项目，按用途和平台分类整理，便于直接跳转至对应仓库获取资源。
>
> 👉 想要**实用网站导航**（梯子 / 下载器 / 解压 / 搜图 / GalGame / 番剧 / 游戏 / 书籍）？请查看 [SITES.md](SITES.md)。
>
> 🌐 **前端网站**：仓库自带 `docs/` 静态站点（**漫藏 · MIRU INDEX**），支持搜索、分类、标签浏览。在仓库 Settings → Pages 中选择 Branch: main、Folder: /docs 即可启用，访问 `https://badhope.github.io/miru-index/`。
>
> ⚠️ 本仓库仅做开源项目导航与索引，**不托管、不分发任何受版权保护的内容**。所有内容均来自 GitHub 开源社区，请使用者遵守各项目对应的开源协议以及相关网站的使用条款。

---

## 目录

- [一、JM 漫画（禁漫天堂 / 18comic）](#一jm-漫画禁漫天堂--18comic)
  - [1. 下载器 / 爬虫（CLI / GUI）](#1-jm-下载器--爬虫cli--gui)
  - [2. JM 客户端（桌面 / 移动）](#2-jm-客户端桌面--移动)
  - [3. JM APK 预编译分发](#3-jm-apk-预编译分发)
  - [4. JM 插件 / 衍生工具](#4-jm-插件--衍生工具)
- [二、哔咔哔咔（PicACG / manhuabika）](#二哔咔哔咔picacg--manhuabika)
  - [1. 哔咔下载器](#1-哔咔下载器)
  - [2. 哔咔客户端 / 浏览工具](#2-哔咔客户端--浏览工具)
  - [3. 哔咔 API / SDK](#3-哔咔-api--sdk)
- [三、Tachiyomi 生态（多源漫画阅读器系列）](#三tachiyomi-生态多源漫画阅读器系列)
  - [1. 官方继承 / 主流分支](#1-官方继承--主流分支)
  - [2. 第三方定制分支](#2-第三方定制分支)
  - [3. 配套服务器 / 扩展](#3-配套服务器--扩展)
  - [4. Suwayomi 客户端（Flutter）](#4-suwayomi-客户端flutter)
- [四、跨平台多源漫画 App](#四跨平台多源漫画-app)
- [五、E-Hentai / ExHentai 相关（同类生态）](#五e-hentai--exhentai-相关同类生态)
- [六、nhentai / 同人志下载器](#六nhentai--同人志下载器)
- [七、通用漫画下载 / 解析工具](#七通用漫画下载--解析工具)
- [八、漫画阅读 / 翻译辅助工具](#八漫画阅读--翻译辅助工具)
- [九、自托管漫画服务器 / 库管理](#九自托管漫画服务器--库管理)
- [十、相关辅助资源](#十相关辅助资源)
- [十一、推荐阅读顺序](#十一推荐阅读顺序)
- [十二、贡献 & 说明](#十二贡献--说明)

---

## 一、JM 漫画（禁漫天堂 / 18comic）

### 1. JM 下载器 / 爬虫（CLI / GUI）

| 名称 | 简介 | 平台 | 最近更新 | 仓库 |
| --- | --- | --- | --- | --- |
| **JMComic-Crawler-Python** | Python API 封装，配套 GitHub Actions 下载器；可登录、搜索、收藏夹下载；绕过 Cloudflare | Python / CLI / GitHub Actions | 持续维护（2025 多次发布） | [hect0x7/JMComic-Crawler-Python](https://github.com/hect0x7/JMComic-Crawler-Python) |
| **jmcomic-downloader** | 基于 Tauri (Rust + Vue) 的桌面 GUI 多线程下载器，带收藏夹、可下载收费本 | Windows / macOS / Linux | v0.17.0（2026 年初更新） | [lanyeeee/jmcomic-downloader](https://github.com/lanyeeee/jmcomic-downloader) |
| **JMComic-qt** | 使用 Qt 实现的 PC 客户端，支持 Windows / Linux / macOS | Windows / Linux / macOS | 1.5.x 系列持续维护 | [tonquer/JMComic-qt](https://github.com/tonquer/JMComic-qt) |
| **JM_Downloader** | 自制桌面下载器（customtkinter + jmcomic 库），支持打包 exe | Windows | 持续在 dev 分支更新 | [Wyl-cmd/JM_Downloader](https://github.com/Wyl-cmd/JM_Downloader) |

### 2. JM 客户端（桌面 / 移动）

| 名称 | 简介 | 平台 | 最近更新 | 仓库 |
| --- | --- | --- | --- | --- |
| **JMComic (ReactNative)** | 第三方 18comic App，React Native 构建 | Android / iOS | 持续维护 | [justagoodman/JMComic](https://github.com/justagoodman/JMComic) |
| **LibreBika** | 自由开源、跨平台哔咔客户端，Python + GTK | 桌面（Linux 友好） | 维护中 | 搜索 `LibreBika` 关键词 |

### 3. JM APK 预编译分发

| 名称 | 简介 | 最近更新 | 仓库 |
| --- | --- | --- | --- |
| **JMComic-APK** | hect0x7 维护的 JMComic Android 安装包仓库，配套 GitHub Actions 自动打包 | 持续发布 APK | [hect0x7/JMComic-APK](https://github.com/hect0x7/JMComic-APK) |

### 4. JM 插件 / 衍生工具

| 名称 | 简介 | 最近更新 | 仓库 |
| --- | --- | --- | --- |
| **nonebot-plugin-jmdownloader** | 基于 NoneBot2 的 JMComic QQ 机器人插件，支持 PDF / ZIP 输出、群黑白名单、速率限制 | 1.3.x（持续维护） | [Misty02600/nonebot-plugin-jmdownloader](https://github.com/Misty02600/nonebot-plugin-jmdownloader) |

---

## 二、哔咔哔咔（PicACG / manhuabika）

### 1. 哔咔下载器

| 名称 | 简介 | 平台 | 最近更新 | 仓库 |
| --- | --- | --- | --- | --- |
| **picacomic-downloader** | Tauri (Rust + Vue + Naive UI) GUI 多线程下载器，登录、搜索、收藏夹同步、勾选章节 | Windows / macOS / Linux | v0.8.0+（2026 年初更新） | [lanyeeee/picacomic-downloader](https://github.com/lanyeeee/picacomic-downloader) |
| **pica-cli** | Node.js 命令行下载器，配套 GitHub Action（基于 file.io 高速分发，无需代理） | CLI / GitHub Actions | 2024+ 持续维护 | [justorez/pica-cli](https://github.com/justorez/pica-cli) |
| **picacomic_downloader** | 哔咔收藏夹下载程序（Python） | CLI | 维护中 | [muyoou/picacomic_downloader](https://github.com/muyoou/picacomic_downloader) |
| **pica_crawler** | Python 实现的哔咔爬虫 | CLI | 维护中 | [lx1169732264/pica_crawler](https://github.com/lx1169732264/pica_crawler) |

### 2. 哔咔客户端 / 浏览工具

| 名称 | 简介 | 平台 | 最近更新 | 仓库 |
| --- | --- | --- | --- | --- |
| **PicaComic** | Flutter 多源漫画 App，内置 PicACG、E-Hentai/ExHentai 等 5+ 漫画源，支持 Android / iOS / Windows / macOS / Linux | 全平台 | 持续活跃（7k+ stars） | [wgh136/PicaComic](https://github.com/wgh136/PicaComic) |
| **Pacalini/PicaComic**（fork） | 同名 Flutter 多源客户端，源 + 收藏同步 + WebDAV | 全平台 | 维护中 | [Pacalini/PicaComic](https://github.com/Pacalini/PicaComic) |
| **picacg-qt** | PyQt 桌面客户端，分类 / 搜索 / 收藏 / 下载 / 在线观看，集成 waifu2x 去噪 | Windows / Linux / macOS | 1.5.0 系列 | [tonquer/picacg-qt](https://github.com/tonquer/picacg-qt) |
| **picacg-windows** | PyQt + 爬虫，Windows 客户端，支持 waifu2x GPU 解码 | Windows | 维护中 | [tonquer/picacg-windows](https://github.com/tonquer/picacg-windows) |
| **jasmine** | Flutter 漫画浏览器，支持多平台 | Android / iOS / macOS / Windows / Linux | 3.2k+ stars | [niuhuan/jasmine](https://github.com/niuhuan/jasmine) |
| **jenny** | Flutter 漫画浏览器（姊妹项目） | 全平台 | 1.0k+ stars | [niuhuan/jenny](https://github.com/niuhuan/jenny) |

### 3. 哔咔 API / SDK

| 名称 | 简介 | 语言 | 仓库 |
| --- | --- | --- | --- |
| **pica-go** | Golang 版的哔咔漫画 API | Go | [niuhuan/pica-go](https://github.com/niuhuan/pica-go) |
| **pica-rust** | Rust 哔咔漫画 API | Rust | [niuhuan/pica-rust](https://github.com/niuhuan/pica-rust) |
| **BIKA API 文档（非官方）** | 第三方整理的 BIKA 漫画 API 文档（Apifox） | 文档 | [API Fox BIKA 文档](https://www.apifox.cn/apidoc/shared-44da213e-98f7-4587-a75e-db998ed067ad/doc-1034189) |

---

## 三、Tachiyomi 生态（多源漫画阅读器系列）

Tachiyomi 是开源圈最著名的多源 Android 漫画阅读器，2024 年原项目停止维护后，社区出现了大量继承者 / 分支。**大部分项目通过安装「图源扩展」可以同时支持 PicACG / 拷贝漫画 / MangaDex / E-Hentai / 哔哩哔哩漫画 / 咚漫 等站点**，因此非常适合作为 JM / 哔咔的替代或补充。

### 1. 官方继承 / 主流分支

| 名称 | 简介 | 平台 | 最近更新 | 仓库 |
| --- | --- | --- | --- | --- |
| **Mihon** | Tachiyomi 官方继任者（社区共识），免费开源 + Android 8.0+；支持 1000+ 图源扩展，AniList / MAL / Kitsu / Bangumi 同步 | Android | v0.19.x（2025-08 ~ 2025-11） | [mihonapp/mihon](https://github.com/mihonapp/mihon) |
| **TachiyomiSY** | Tachiyomi 早期分支，维护节奏稳定；可直接读 Mihon 的 backup | Android | v1.12.0 | [jobobby04/TachiyomiSY](https://github.com/jobobby04/TachiyomiSY) |
| **Komikku** | 基于 TachiyomiSY / Mihon 重写的 Android + GNOME 桌面（GTK4 / libadwaita）跨平台阅读器 | Android / Linux | v1.13.x（2026-05 commit） | [komikku-app/komikku](https://github.com/komikku-app/komikku) |
| **TachiyomiJ2K** | 经典 Tachiyomi 维护分支，社区版备份；功能与 SY 接近 | Android | v1.7.4 | [Jays2Kings/tachiyomiJ2K](https://github.com/Jays2Kings/tachiyomiJ2K) |
| **Yōkai** | 另一条稳定维护的 Tachiyomi 继承分支 | Android | v1.9.x | [null2264/yokai](https://github.com/null2264/yokai) |
| **Aniyomi** | 在 Mihon 基础上加入「动漫（番剧）」支持，漫画 + 番剧一站式 | Android | v0.16.4.3 | [aniyomiorg/aniyomi](https://github.com/aniyomiorg/aniyomi) |
| **Kahon** | Mihon 的「去限制」分支 | Android | v0.19.2 | [AmanoTeam/Kahon](https://github.com/AmanoTeam/Kahon) |
| **TachiyomiS97** | 「快速版」Tachiyomi 分支，启动速度优化 | Android | v1.7.4 | [Saud-97/TachiyomiS97](https://github.com/Saud-97/TachiyomiS97) |

### 2. 第三方定制分支

| 名称 | 简介 | 最近更新 | 仓库 |
| --- | --- | --- | --- |
| **TachiyomiAZ** | 内置多源 + 「EMAIL / DOUJIN」友好分支 | v8.8.2-AZ | [az4521/TachiyomiAZ](https://github.com/az4521/TachiyomiAZ) |
| **TachiyomiEH** | 强化 E-Hentai / ExHentai 兼容 | v8.4.5-EH | [NerdNumber9/TachiyomiEH](https://github.com/NerdNumber9/TachiyomiEH) |
| **Dartotsu** | 基于 Dantotsu 的多平台追番 + 漫画客户端 | v0.0.2+ | [aayush2622/Dartotsu](https://github.com/aayush2622/Dartotsu) |
| **AnymeX** | 多服务（AniList / MAL / SIMKL）追番 App，附带本地文件播放 | v2.9.9 | [RyanYuuki/AnymeX](https://github.com/RyanYuuki/AnymeX) |
| **Himitsu** | Tachiyomi 风格但支持自定义下载器 | v1.0.x | [RepoDevil/Himitsu](https://github.com/RepoDevil/Himitsu) |

### 3. 配套服务器 / 扩展

| 名称 | 简介 | 最近更新 | 仓库 |
| --- | --- | --- | --- |
| **keiyoushi/extensions** | 社区维护的 Mihon / Tachiyomi 扩展仓库（最常用中文 / 英文源） | 持续维护 | [keiyoushi/extensions](https://github.com/keiyoushi/extensions) |
| **ThePBone/tachiyomi-extensions-revived** | 另一份扩展源，常见 Mihon 站点扩展 fork 聚合 | 持续维护 | [ThePBone/tachiyomi-extensions-revived](https://github.com/ThePBone/tachiyomi-extensions-revived) |
| **copymanga-copy20** | 拷贝漫画 Mihon 扩展（独立源） | 维护中 | [LittleSurvival/copymanga-copy20](https://github.com/LittleSurvival/copymanga-copy20) |

### 4. Suwayomi 客户端（Flutter）

| 名称 | 简介 | 平台 | 最近更新 | 仓库 |
| --- | --- | --- | --- | --- |
| **Suwayomi-Server（原 Tachidesk）** | 自托管漫画服务器，兼容 Mihon / Tachiyomi 全部图源扩展；Docker / Windows / Linux / macOS / NAS | 服务端 | 持续维护（v1.x 路线图） | [Suwayomi/Suwayomi-Server](https://github.com/Suwayomi/Suwayomi-Server) |
| **Tachidesk-Sorayomi** | Flutter 客户端，连接 Suwayomi-Server；全平台覆盖 | Android / iOS / Windows / macOS / Linux / Web | Alpha 持续发布 | [Suwayomi/Tachidesk-Sorayomi](https://github.com/Suwayomi/Tachidesk-Sorayomi) |
| **Suwayomi-Launcher** | 官方桌面启动器，集成 Java + Electron + WebUI 一键启动 | Windows / macOS / Linux | 持续维护 | [Suwayomi/Suwayomi-Launcher](https://github.com/Suwayomi/Suwayomi-Launcher) |
| **docker-tachidesk** | 官方 Docker Compose 模板（含 FlareSolverr 绕过反爬） | Docker | 持续维护 | [Suwayomi/docker-tachidesk](https://github.com/Suwayomi/docker-tachidesk) |
| **tachidesk_cn** | Suwayomi 中文汉化镜像（DockerHub） | Docker | 维护中 | [uparrows/tachidesk_cn](https://github.com/uparrows/tachidesk_cn) |

---

## 四、跨平台多源漫画 App

这一类 App 通常内置 PicACG、E-Hentai、JM 等多个漫画源，能一个客户端访问多个平台。

| 名称 | 简介 | 平台 | 最近更新 | 仓库 |
| --- | --- | --- | --- | --- |
| **PicaComic (wgh136)** | Flutter，内置 PicACG + E-Hentai/ExHentai + 自定义源 | 全平台 | 持续维护 | [wgh136/PicaComic](https://github.com/wgh136/PicaComic) |
| **JHenTai** | Flutter 跨平台 E-Hentai 客户端，支持 Android / iOS / Windows / macOS / Linux，多布局阅读、归档下载 | 全平台 | v8.0.13（2026-06 更新） | [jiangtian616/JHenTai](https://github.com/jiangtian616/JHenTai) |
| **Kotatsu** | Android 漫画阅读器，支持本地文件 + Tachiyomi 扩展 | Android | 2025-11 更新 | [Kotatsu 镜像（SourceForge）](https://sourceforge.net/projects/kotatsu.mirror/) |
| **MangaReader** | React Native 漫画 App，兼容 copymanga / 咚漫之家等源 | Android / iOS | 1.4k+ stars | [youniaogu/MangaReader](https://github.com/youniaogu/MangaReader) |
| **EhViewer CN_SXJ** | E-Hentai Android 客户端，Material 3 + 中文优化 | Android | v2.0.1.x（2026-01 持续更新） | [xiaojieonly/ehviewer_cn_sxj](https://github.com/xiaojieonly/ehviewer_cn_sxj) |

---

## 五、E-Hentai / ExHentai 相关（同类生态）

E-Hentai 与 JM 漫画同属同类型生态，相关工具可作为 JM / 哔咔的替代或补充。

| 名称 | 简介 | 平台 | 最近更新 | 仓库 |
| --- | --- | --- | --- | --- |
| **JHenTai** | Flutter 跨平台 E-Hentai 客户端（功能最完善） | 全平台 | v8.0.13 | [jiangtian616/JHenTai](https://github.com/jiangtian616/JHenTai) |
| **EhViewer CN_SXJ** | Android E-Hentai 客户端（中文 / 16K page 支持） | Android | v2.0.1.x | [xiaojieonly/ehviewer_cn_sxj](https://github.com/xiaojieonly/ehviewer_cn_sxj) |
| **E-Hentai Downloader** | 油猴脚本，一键下载并打包为 ZIP，支持 Chrome / Firefox / Edge | 浏览器脚本 | 维护中 | [E-Hentai-Downloader 镜像（gitcode）](https://gitcode.com/gh_mirrors/eh/E-Hentai-Downloader) |
| **exhentai-manga-manager** | ExHentai 本地漫画标签管理阅读应用 | 桌面 | 维护中 | [DartSchneeHertz/exhentai-manga-manager](https://github.com/DartSchneeHertz/exhentai-manga-manager) |

---

## 六、nhentai / 同人志下载器

与 JM / 哔咔同生态的还有 nhentai（nhentai.net） 等同人志 / doujinshi 站点，以下工具专注于这部分的批量下载与本地归档。

| 名称 | 简介 | 语言 | 最近更新 | 仓库 |
| --- | --- | --- | --- | --- |
| **nhentai-helper** | 油猴脚本 / 命令行工具，一键将 nhentai 本子打包为 ZIP / CBZ，支持镜像站 | TypeScript / Bun | 3.28.1（2026-05） | [Tsuk1ko/nhentai-helper](https://github.com/Tsuk1ko/nhentai-helper) |
| **nhentai-cpp** | C++ 编写的高性能 nhentai 下载器 | C++ | 持续维护 | [Nenfivirus/nhentai-cpp](https://github.com/Nenfivirus/nhentai-cpp) |
| **nhentai_comic_crawler (Python)** | 经典 Python 爬虫，多线程下载 | Python | 持续维护 | [mikfey/nhentai_comic_crawler](https://github.com/mikfey/nhentai_comic_crawler) |
| **nhentia-comic-crawler (Node.js)** | Node.js 实现的 nhentai 下载库（npm 包） | Node.js | v2.0.6 | [archie0732/nhentia-comic-crawler](https://github.com/archie0732/nhentia-comic-crawler) |
| **NhenDownloader** | Go 实现的并发下载器，带代理 / 重试 / 多语言支持 | Go | 维护中 | [tianyagk/NhenDownloader](https://github.com/tianyagk/NhenDownloader) |
| **nhentai CLI (Rust)** | Rust 实现的现代 CLI，零依赖单文件 | Rust | 持续维护 | [namachan10777/nhentai-cli](https://github.com/namachan10777/nhentai-cli) |

---

## 七、通用漫画下载 / 解析工具

适用于 MangaDex、MangaKakalot 等英文漫画站，可作为 JM / 哔咔的替代或补充下载方案。

| 名称 | 简介 | 语言 | 最近更新 | 仓库 |
| --- | --- | --- | --- | --- |
| **comics-downloader** | Go 语言，支持 MangaDex / Manganato / MangaKakalot 等 8+ 站，输出 PDF / EPUB / CBZ / CBR | Go | 2026-04 更新 | [GitHub 镜像](https://gitcode.com/gh_mirrors/co/comics-downloader) |
| **manga-downloader (elboletaire)** | Go，支持 Mangadex 等多种源，输出 CBZ | Go | v0.0.15（2025-07） | [elboletaire/manga-downloader](https://github.com/elboletaire/manga-downloader) |
| **comic-dl** | Python 通用命令行下载器（多站） | Python | 2024-02 更新 | [Xonshiz/comic-dl](https://github.com/Xonshiz/comic-dl) |
| **HakuNeko** | Electron + Node.js，支持 400+ 漫画站点的桌面下载器 | 跨平台 | 持续活跃（6k+ stars） | [hakuneko/HakuNeko](https://github.com/hakuneko/HakuNeko) |
| **HDoujinDownloader** | Lua，800+ 同人 / 漫画站点，ZIP / CBZ / PDF / EPUB 等多格式 | 跨平台 | 维护中 | [HDoujinDownloader/HDoujinDownloader](https://github.com/HDoujinDownloader/HDoujinDownloader) |
| **copymanga-downloader** | 拷贝漫画 GUI 多线程下载器（Tauri） | 跨平台 | v0.12.0（2026-02） | [lanyeeee/copymanga-downloader](https://github.com/lanyeeee/copymanga-downloader) |

---

## 八、漫画阅读 / 翻译辅助工具

| 名称 | 简介 | 语言 | 最近更新 | 仓库 |
| --- | --- | --- | --- | --- |
| **manga-image-translator** | 漫画图片翻译器：OCR + 17 种翻译引擎 + 嵌字，支持日 / 英 / 韩 / 中互译；提供 Web / CLI / Docker / API | Python | 持续维护（2k+ commits） | [zyddnys/manga-image-translator](https://github.com/zyddnys/manga-image-translator) |
| **balloon-translator** | 同类图片漫画翻译 GUI（PySide6），对用户友好 | Python | 持续维护 | [dmMaze/BalloonTranslator](https://github.com/dmMaze/BalloonTranslator) |
| **Manga-OCR** | Manga109 数据集训练的漫画专用 OCR 模型 | Python | 持续维护 | [kha-white/manga-ocr](https://github.com/kha-white/manga-ocr) |
| **mokuro** | EPUB / PDF / 漫画卷的 OCR 嵌字版本生成器 | Python | 持续维护 | [kha-white/mokuro](https://github.com/kha-white/mokuro) |
| **Yomitan / AnkiConnect** | 配套：日文词汇 / 汉字查词 & Anki 卡片制卡（配合上述翻译工具使用） | - | - | [yomitan-wani](https://github.com/themoeway/yomitan-wani) |
| **Real-ESRGAN ncnn Vulkan** | 二次元图像超分，可与翻译工具联用提升文字清晰度 | C++ | 维护中 | [xinntao/Real-ESRGAN-ncnn-vulkan](https://github.com/xinntao/Real-ESRGAN-ncnn-vulkan) |

---

## 九、自托管漫画服务器 / 库管理

把本地已经下载好的 CBZ / EPUB / PDF 漫画集中管理，配合 Web 客户端在多设备阅读，是 JM / 哔咔之外的「家庭漫画库」方案。

| 名称 | 简介 | 平台 | 最近更新 | 仓库 |
| --- | --- | --- | --- | --- |
| **Kavita** | 高速、跨平台、响应式阅读服务器；支持 Manga / Webtoon / Comics / Books；Mihon 扩展同步 | Windows / macOS / Linux | v0.9.x（2026-05 频繁 commit） | [Kareadita/Kavita](https://github.com/Kareadita/Kavita) |
| **Komga** | 漫画 / 书库管理 + OPDS 推送 | Docker / 桌面 | v1.x（2025-2026 持续） | [Komga-org/Komga](https://github.com/Komga-org/Komga) |
| **Manga-Organizer** | 整理 CBZ / ZIP 漫画库元数据、标签、系列名 | Python | 维护中 | [darodi/manga-organizer](https://github.com/darodi/manga-organizer) |
| **manga-py** | MangaEden / MangaKakalot / MangaNel 等 4 个英文漫画站爬虫库 | Python | 维护中 | [KumaTea/manga-py](https://github.com/KumaTea/manga-py) |

---

## 十、相关辅助资源

- **Tag Translation**：EhTagTranslation 标签翻译数据库，改进所有 E-Hentai 客户端的标签本地化
  - 仓库：[EhTagTranslation/Database](https://github.com/EhTagTranslation/Database)
- **waifu2x-ncnn-vulkan**：waifu2x 神经放大（去除噪点 / 提升清晰度），被多个漫画客户端集成
  - 仓库：[nihui/waifu2x-ncnn-vulkan](https://github.com/nihui/waifu2x-ncnn-vulkan)
- **comic_reader**（pub.dev）：Flutter 包，用于解析 / 阅读 CBZ / ZIP / CBT / TAR 漫画档案
  - 链接：[comic_reader on pub.dev](https://pub.dev/documentation/comic_reader/0.3.0/)
- **JMComic 文档**（ReadTheDocs）：JMComic-Crawler-Python 的官方中文文档
  - 链接：[jmcomic.readthedocs.io](https://jmcomic.readthedocs.io/zh-cn/latest/)
- **Arch Linux AUR 预编译包**：
  - [jmcomic-downloader-bin](https://aur.archlinux.org/packages/jmcomic-downloader-bin)
  - [picacomic-downloader](https://aur.archlinux.org/packages/picacomic-downloader)
  - [copymanga-downloader](https://aur.archlinux.org/packages/copymanga-downloader)
  - [picacg-qt](https://aur.archlinux.org/packages/?K=picacg-qt)

---

## 十一、推荐阅读顺序

如果你是新用户，可按下面的顺序快速上手：

1. **想直接用现成 App 读漫画**
   - Android（推荐）：[Mihon](https://github.com/mihonapp/mihon) / [Komikku](https://github.com/komikku-app/komikku) / [TachiyomiSY](https://github.com/jobobby04/TachiyomiSY)
   - 跨平台（推荐）：[PicaComic](https://github.com/wgh136/PicaComic) / [JHenTai](https://github.com/jiangtian616/JHenTai) / [jasmine](https://github.com/niuhuan/jasmine) / [Kavita](https://github.com/Kareadita/Kavita)（自托管）
   - 桌面：[picacg-qt](https://github.com/tonquer/picacg-qt) / [JMComic-qt](https://github.com/tonquer/JMComic-qt) / [Komikku (Linux 桌面)](https://github.com/komikku-app/komikku)
   - 自托管 + 多设备：[Suwayomi-Server](https://github.com/Suwayomi/Suwayomi-Server) + [Tachidesk-Sorayomi](https://github.com/Suwayomi/Tachidesk-Sorayomi)
   - NAS / 局域网：[Suwayomi-Server + FlareSolverr](https://github.com/Suwayomi/docker-tachidesk) 部署到飞牛 / 群晖

2. **想批量下载 / 离线收藏**
   - JM 优先：[jmcomic-downloader](https://github.com/lanyeeee/jmcomic-downloader)（GUI） / [JMComic-Crawler-Python](https://github.com/hect0x7/JMComic-Crawler-Python)（CLI / GitHub Actions）
   - 哔咔优先：[picacomic-downloader](https://github.com/lanyeeee/picacomic-downloader)（GUI） / [pica-cli](https://github.com/justorez/pica-cli)（CLI / GitHub Actions）
   - nhentai / 同人志：[nhentai-helper](https://github.com/Tsuk1ko/nhentai-helper) / [nhentai-cpp](https://github.com/Nenfivirus/nhentai-cpp)
   - 拷贝漫画：[copymanga-downloader](https://github.com/lanyeeee/copymanga-downloader)
   - 通用 400+ 站：[HakuNeko](https://github.com/hakuneko/HakuNeko)（持续 1.2k+ connector）

3. **想在浏览器上一键下载**
   - 哔咔：[pica-cli GitHub Action](https://github.com/justorez/pica-cli)
   - E-Hentai：[E-Hentai Downloader 油猴脚本](https://gitcode.com/gh_mirrors/eh/E-Hentai-Downloader)
   - nhentai：[nhentai-helper 用户脚本](https://github.com/Tsuk1ko/nhentai-helper)

4. **想自己写一个客户端 / 二次开发**
   - 后端 API：[pica-go](https://github.com/niuhuan/pica-go) / [pica-rust](https://github.com/niuhuan/pica-rust) / [JMComic-Crawler-Python](https://github.com/hect0x7/JMComic-Crawler-Python)
   - 前端 UI：参考 [PicaComic](https://github.com/wgh136/PicaComic) 源码（Flutter）
   - Mihon 图源扩展：[keiyoushi/extensions](https://github.com/keiyoushi/extensions) 模板
   - Suwayomi 兼容：直接 fork [Suwayomi-Server](https://github.com/Suwayomi/Suwayomi-Server)

5. **想把下载好的漫画 / 本地 CBZ 集中管理**
   - 桌面 / 服务器：[Kavita](https://github.com/Kareadita/Kavita) 或 [Komga](https://github.com/Komga-org/Komga)
   - 移动端 + 服务器：Suwayomi + Sorayomi

6. **想翻译 / 啃生肉漫画**
   - 翻译工具：[manga-image-translator](https://github.com/zyddnys/manga-image-translator) / [BalloonTranslator](https://github.com/dmMaze/BalloonTranslator)
   - 配套 OCR：[mokuro](https://github.com/kha-white/mokuro) + [Manga-OCR](https://github.com/kha-white/manga-ocr)

---

## 十二、贡献 & 说明

- 本仓库仅做 **资源索引 / 跳转导航**，不托管任何媒体文件或破解资源。
- 所有项目均来自 GitHub / GitCode 等开源平台，遵循各自的开源协议（MIT / GPL / Apache 2.0 等）。
- 项目是否「最近仍在更新」由收录时的最近 commit / release 时间决定；如发现已停止维护，欢迎提 Issue / PR 替换或移除。
- 收录标准：
  1. 与 JM 漫画 / 哔咔哔咔 / 漫画下载、阅读、API、客户端 直接相关；
  2. 过去 12 个月内有过 commit 或 release；
  3. 仓库公开可访问。

> 再次提醒：访问 / 下载 / 使用本仓库导航的第三方资源时，请遵守当地法律法规，仅用于学习与个人备份。

---
