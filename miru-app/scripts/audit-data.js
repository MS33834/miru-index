#!/usr/bin/env node
/**
 * 数据完整性审计脚本
 *
 * 以 mergeCategories 的合并结果与 drops 为权威数据来源（ground truth），
 * 而非对源文件做正则猜测。检测：
 * 1. 合并过程中被丢弃的条目（同分类内 URL 重复 / 缺少 URL）—— 来自 mergeDrops
 * 2. 跨分类被误杀的条目（源中存在但合并后消失）
 * 3. 重复的分类 ID（结构性问题，mergeCategories 会把同 id 分类合并）
 * 4. 空分类
 * 5. 跨分类收录统计（同一站点出现在多个分类，属正常，仅作信息展示）
 *
 * 注意：同一站点跨分类出现是合法的（mergeCategories 允许），不再作为警告。
 *
 * 退出码：
 *   0 - 全部通过（无错误）
 *   1 - 有错误（被丢弃条目 / 丢失条目 / 重复分类 ID）
 *   2 - 脚本执行错误
 *
 * 用法：
 *   node scripts/audit-data.js          # 仅检查
 *   node scripts/audit-data.js --fix    # 自动修复（输出恢复建议）
 *   node scripts/audit-data.js --json   # JSON 输出（CI 友好）
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.resolve(__dirname, '../src/data')

// ====== 源文件轻量扫描（仅用于统计与结构性检查，不用于去重判断） ======
function extractEntries(content) {
  const entries = []
  // 匹配每个条目块：{ name: '...', url: '...', ... }
  const itemRegex =
    /\{\s*\n\s*name:\s*'([^']+)',\s*\n\s*(?:url:\s*'([^']+)'|health:\s*'[^']+',\s*\n\s*url:\s*'([^']+)')/g
  let match
  while ((match = itemRegex.exec(content)) !== null) {
    const name = match[1]
    const url = match[2] || match[3]
    entries.push({ name, url })
  }
  return entries
}

function extractCategories(content) {
  const cats = []
  const catRegex = /\{\s*\n\s*id:\s*'([^']+)',\s*\n\s*name:\s*'([^']+)'/g
  let match
  while ((match = catRegex.exec(content)) !== null) {
    cats.push({ id: match[1], name: match[2] })
  }
  return cats
}

// ====== 主审计逻辑 ======
async function audit(options = {}) {
  const { json = false, fix = false } = options
  const issues = []
  const stats = {}

  // 读取源文件（用于统计与结构性检查）
  const navContent = fs.readFileSync(path.join(SRC, 'nav.js'), 'utf8')
  const extContent = fs.readFileSync(path.join(SRC, 'site-extensions.js'), 'utf8')

  const navEntries = extractEntries(navContent)
  const extEntries = extractEntries(extContent)
  stats.navEntries = navEntries.length
  stats.extEntries = extEntries.length
  stats.sourceTotal = navEntries.length + extEntries.length

  // 分类统计
  const navCats = extractCategories(navContent)
  const extCats = extractCategories(extContent)
  stats.navCategories = navCats.length
  stats.extCategories = extCats.length

  // 通过动态导入获取合并后的数据（ground truth）
  let mergedCategories = []
  let mergeDrops = []
  try {
    const mod = await import(path.join(SRC, 'nav.js'))
    mergedCategories = mod.categories
    mergeDrops = mod.mergeDrops || []
  } catch (e) {
    issues.push({
      severity: 'fatal',
      type: 'import_error',
      message: `无法加载合并数据：${e.message}`,
    })
  }

  stats.mergedCategories = mergedCategories.length
  const mergedUrls = new Set()
  for (const cat of mergedCategories) {
    for (const item of cat.items) {
      mergedUrls.add(item.url)
    }
  }
  stats.mergedUniqueUrls = mergedUrls.size
  stats.mergedTotalItems = mergedCategories.reduce((a, c) => a + c.items.length, 0)

  // 1) mergeDrops：合并过程中被丢弃的条目（权威来源）
  stats.droppedCount = mergeDrops.length
  for (const d of mergeDrops) {
    issues.push({
      severity: 'error',
      type: d.reason === 'no_url' ? 'no_url' : 'intra_cat_dup',
      source: 'mergeDrops',
      category: d.cat,
      name: d.name,
      url: d.url || '',
      message:
        d.reason === 'no_url'
          ? `条目被丢弃（缺少 URL）：分类=${d.cat} 名称=${d.name}`
          : `条目被丢弃（同分类内 URL 重复，仅保留首个）：分类=${d.cat} 名称=${d.name} URL=${d.url}`,
      fix_suggestion: fix
        ? d.reason === 'no_url'
          ? `为 ${d.name} 补充 url 字段，或删除该条目`
          : `在分类 ${d.cat} 中删除 ${d.name}（${d.url}）的重复条目，保留元数据更完整的一个`
        : undefined,
    })
  }

  // 2) 跨分类丢失：源中存在的 URL，合并后不存在
  const allSourceUrls = new Set([...navEntries.map((e) => e.url), ...extEntries.map((e) => e.url)])
  stats.sourceUniqueUrls = allSourceUrls.size
  const lostUrls = [...allSourceUrls].filter((u) => u && !mergedUrls.has(u))
  stats.lostCount = lostUrls.length
  for (const url of lostUrls) {
    const src = navEntries.find((e) => e.url === url) || extEntries.find((e) => e.url === url)
    issues.push({
      severity: 'error',
      type: 'lost_entry',
      url,
      name: src ? src.name : 'unknown',
      message: `条目丢失：${src ? src.name : 'unknown'}（${url}）在源文件中存在但合并后消失`,
    })
  }

  // 3) 重复分类 ID（结构性问题）
  const allCatIds = [...navCats.map((c) => c.id), ...extCats.map((c) => c.id)]
  const dupCats = allCatIds.filter((id, i) => allCatIds.indexOf(id) !== i)
  for (const id of [...new Set(dupCats)]) {
    const names = [...navCats, ...extCats].filter((c) => c.id === id).map((c) => c.name)
    issues.push({
      severity: 'error',
      type: 'dup_category',
      id,
      names: [...new Set(names)],
      message: `重复分类 ID "${id}"：${[...new Set(names)].join('、')}（mergeCategories 会将其条目合并到首个同名分类）`,
    })
  }

  // 4) 空分类
  const emptyCats = mergedCategories.filter((c) => c.items.length === 0)
  stats.emptyCategories = emptyCats.length
  for (const cat of emptyCats) {
    issues.push({
      severity: 'warn',
      type: 'empty_category',
      id: cat.id,
      name: cat.name,
      message: `空分类：${cat.name}（id: ${cat.id}）没有任何条目`,
    })
  }

  // 5) 跨分类收录统计（合法行为，仅信息）
  const urlToCats = new Map()
  for (const cat of mergedCategories) {
    for (const item of cat.items) {
      if (!urlToCats.has(item.url)) urlToCats.set(item.url, new Set())
      urlToCats.get(item.url).add(cat.id)
    }
  }
  const crossCategoryUrls = [...urlToCats.entries()].filter(([, cats]) => cats.size > 1)
  stats.crossCategoryCount = crossCategoryUrls.length

  // ====== 输出 ======
  const errors = issues.filter((i) => i.severity === 'error' || i.severity === 'fatal')
  const warns = issues.filter((i) => i.severity === 'warn')
  const exitCode = errors.length > 0 ? 1 : 0

  if (json) {
    console.log(JSON.stringify({ stats, issues, exitCode }, null, 2))
  } else {
    console.log('\n╔══════════════════════════════════════════╗')
    console.log('║   漫藏阁 MIRU INDEX — 数据完整性审计   ║')
    console.log('╚══════════════════════════════════════════╝\n')

    console.log('📊 源数据统计：')
    console.log(`   nav.js:              ${stats.navEntries} 条目 / ${stats.navCategories} 分类`)
    console.log(`   site-extensions.js:  ${stats.extEntries} 条目 / ${stats.extCategories} 分类`)
    console.log(`   源文件唯一 URL:       ${stats.sourceUniqueUrls}`)
    console.log()

    console.log('📊 合并后统计：')
    console.log(`   分类数:               ${stats.mergedCategories}`)
    console.log(`   总条目（含跨分类）:    ${stats.mergedTotalItems}`)
    console.log(`   合并后唯一 URL:        ${stats.mergedUniqueUrls}`)
    console.log(`   跨分类收录站点:        ${stats.crossCategoryCount}（正常）`)
    console.log(`   合并丢弃条目:          ${stats.droppedCount}`)
    console.log()

    if (errors.length > 0) {
      console.log(`❌ 发现 ${errors.length} 个错误：\n`)
      for (const e of errors) {
        console.log(`   [${e.type}] ${e.message}`)
        if (e.fix_suggestion) console.log(`   💡 ${e.fix_suggestion}`)
      }
      console.log()
    }

    if (warns.length > 0) {
      console.log(`⚠️  发现 ${warns.length} 个警告：\n`)
      for (const w of warns) {
        console.log(`   [${w.type}] ${w.message}`)
      }
      console.log()
    }

    if (errors.length === 0 && warns.length === 0) {
      console.log('✅ 全部通过！数据完整性验证成功。\n')
    } else if (errors.length === 0) {
      console.log('✅ 无严重问题，但存在警告。\n')
    } else {
      console.log('❌ 审计失败，发现数据问题！请修复后重新检查。\n')
    }
  }

  return exitCode
}

// ====== CLI 入口 ======
const args = process.argv.slice(2)
const options = {
  json: args.includes('--json'),
  fix: args.includes('--fix'),
}

audit(options)
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error('审计脚本错误:', err.message)
    process.exit(2)
  })
