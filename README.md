# 漫藏阁 · MIRU INDEX

> A hand-picked collection of ACGN bookmarks. No ads. No tracking. Just links that work.
>
> 🌐 **[ms33834.github.io/miru-index](https://ms33834.github.io/miru-index/)**
>
> 651 sites. 59 categories. Updated whenever I find something worth bookmarking.

---

## What is this?

I got tired of losing my bookmarks. Browser sync? Unreliable. Cloud services? They die. So I built a static site to keep all my ACGN links in one place — proxies, manga readers, anime streaming, GalGame databases, image boards, wallpapers, tools, communities... basically everything an ACGN fan might need.

The site is a single-page app built with Vue 3 and deployed to GitHub Pages. All data lives in plain JavaScript files so anyone can fork it, add their own links, and deploy their own copy. No backend. No database. No tracking scripts.

Everything on the site is public, hand-verified, and tagged. Sites that don't work in mainland China are clearly marked. Permanent URLs are noted where available.

---

## Features

- **Search** — Type anything. Searches names, tags, descriptions. Instant results.
- **Categories** — 59 categories from 網絡工具 to AI 助手. Browse by what you need.
- **Filters** — One-click show only mainland-accessible sites, or only proxy-needed ones.
- **Favorites** — Star anything. Exports to JSON. Never lose your collection again.
- **Direct jump** — Every card has a direct link button. One click, new tab, done.
- **Health status** — Each site marked: online, blocked in China, mirror needed, unstable, or dead.
- **Keyboard shortcuts** — `/` to search, `Esc` to close, arrow keys to navigate.
- **Offline support** — Service worker caches the app shell. Works without internet once loaded.
- **Dark theme** — It's dark by default. Your eyes will thank you.
- **Zero analytics** — No Google Analytics. No counters. No pixels. Your browsing is your business.

---

## Getting started

### Just browsing?

Go to **[ms33834.github.io/miru-index](https://ms33834.github.io/miru-index/)**. That's it.

### Run your own copy

```bash
git clone https://github.com/MS33834/miru-index.git
cd miru-index/miru-app
npm install
npm run dev        # development server
npm run build      # production build → ../docs/
```

The built files go to `docs/` — point GitHub Pages at that directory and you're live.

### Add your own links

Edit `miru-app/src/data/site-extensions.js`. Add items to existing categories or create new ones. The format is:

```js
{
  name: 'Site Name',
  url: 'https://example.com',
  desc: 'Short description',
  fullDesc: 'Longer description shown in the modal.',
  tags: ['tag1', 'tag2'],
  features: ['Feature one', 'Feature two'],
  proxy: false,        // true if mainland China needs a VPN
  health: 'ok',        // ok | blocked | restricted | mirror | unstable | dead
  mirrors: ['https://mirror.example.com'],
}
```

Run `npm run audit` to check for duplicates or missing data before committing.

---

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Vue 3 (Composition API) | Reactive, lightweight, no build-step complexity |
| Bundler | Vite | Fast builds, zero-config for simple SPAs |
| CSS | Tailwind CSS v4 | Utility-first, purge unused styles automatically |
| Icons | Inline SVG | No icon library dependency |
| I18n | Custom reactive store | Lighter than vue-i18n for our use case |
| Testing | Vitest | Vite-native, fast |
| CI/CD | GitHub Actions | Deploy to Pages on every push |
| Hosting | GitHub Pages | Free, fast, no maintenance |

---

## Contributing

Found a dead link? Know a site that should be here? Got a better description?

1. Fork the repo
2. Edit `miru-app/src/data/site-extensions.js`
3. Run `npm run audit && npm test && npm run build`
4. Send a PR

Before submitting, check that:
- The URL is correct and the site is still alive
- The `proxy` and `health` fields are accurate
- Tags are useful (not too generic, not too specific)
- The description is in natural language, not SEO spam

For bug reports or feature ideas, open an [Issue](https://github.com/MS33834/miru-index/issues).

---

## 中文说明

漫藏阁（MIRU INDEX）是一个手工整理的 ACGN 资源导航站。

收录代理工具、漫画阅读器、番剧站点、GalGame 数据库、图站、壁纸、AI 工具、VTuber、同人音乐、Cosplay、轻小说等 59 个分类共 651 个站点。每一个站点都经过人工验证，标注了国内是否可访问、是否需要梯子、是否有永久域名。

数据全部存储在纯文本 JavaScript 文件中，开源可 fork。没有后端，没有数据库，没有追踪脚本。你可以部署自己的私有导航站，也可以提交 PR 添加你发现的站点。

### 关于 JM / 哔咔 / E-Hentai 等漫画工具

旧版 README 曾列出大量第三方漫画下载工具（JMComic-Crawler、picacomic-downloader、PicaComic、EhViewer 等）。这些工具的链接仍在站内「下载器」「工坊工具」「漫画软件」等分类中可找到——站点数据本身没有删减。

---

## 日本語

漫蔵閣（MIRU INDEX）は、手作業で厳選した ACGN リソースのナビゲーションサイトです。

VPN ツール、マンガリーダー、アニメ配信サイト、ギャルゲーデータベース、画像掲示板、壁紙サイト、AI ツール、VTuber、同人音楽、コスプレ、ライトノベルなど、59 カテゴリ・651 サイトを収録。すべてのサイトは手動で検証済みで、中国本土からのアクセス可否、プロキシ要否、恒久ドメインの有無を明記しています。

---

## License

[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — share, adapt, remix. Just give credit and keep it open.

This repo indexes publicly available websites and open-source projects. It does not host, distribute, or link to copyrighted media files. All linked projects follow their own licenses (MIT, GPL, Apache 2.0, etc.).

---

*Built with 朱泥 and 御金. Maintained with tea.*
