#!/usr/bin/env node
/**
 * 数据完整性审计脚本
 *
 * 扫描 nav.js 和 site-extensions.js 中的所有源数据 URL，
 * 与 mergeCategories 合并后的结果对比，检测：
 * 1. 被静默丢弃的条目（同一分类内 URL 重复）
 * 2. 跨分类被误杀重（不同分类中同一 URL 被错误去重）
 * 3. 无 URL 的无效条目
 * 4. 重复分类 ID
 *
 * 退出码：
 *   0 - 全部通过（无丢失）
 *   1 - 有丢失条目（CI 会失败）
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

// ====== 读取并扫描文件 ======
function extractEntries(content) {
  const entries = []
  // 匹配每个条目块：{ name: '...', url: '...', ... }
  const itemRegex = /\{\s*\n\s*name:\s*'([^']+)',\s*\n\s*(?:url:\s*'([^']+)'|health:\s*'[^']+',\s*\n\s*url:\s*'([^']+)')/g
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

  // 读取源文件
  const navContent = fs.readFileSync(path.join(SRC, 'nav.js'), 'utf8')
  const extContent = fs.readFileSync(path.join(SRC, 'site-extensions.js'), 'utf8')

  // 扫描所有条目
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

  // 跨文件重复 URL 检查
  const navUrls = new Map()
  for (const e of navEntries) {
    if (!navUrls.has(e.url)) navUrls.set(e.url, [])
    navUrls.get(e.url).push(e.name)
  }

  const extUrls = new Map()
  for (const e of extEntries) {
    if (!extUrls.has(e.url)) extUrls.set(e.url, [])
    extUrls.get(e.url).push(e.name)
  }

  // 检查同文件内重复 URL（这些会在分类内被去重）
  for (const [url, names] of navUrls) {
    if (names.length > 1) {
      issues.push({
        severity: 'warn',
        type: 'intra_file_dup',
        file: 'nav.js',
        url,
        names: [...new Set(names)],
        message: `nav.js 内重复 URL（${names.length}次），会被去重只保留第一个：${names[0]}`,
      })
    }
  }

  for (const [url, names] of extUrls) {
    if (names.length > 1) {
      issues.push({
        severity: 'warn',
        type: 'intra_file_dup',
        file: 'site-extensions.js',
        url,
        names: [...new Set(names)],
        message: `site-extensions.js 内重复 URL（${names.length}次），会被去重只保留第一个：${names[0]}`,
      })
    }
  }

  // 检查无 URL 条目
  for (const e of navEntries) {
    if (!e.url) {
      issues.push({
        severity: 'error',
        type: 'no_url',
        file: 'nav.js',
        name: e.name,
        message: `nav.js 中缺少 URL：${e.name}`,
      })
    }
  }
  for (const e of extEntries) {
    if (!e.url) {
      issues.push({
        severity: 'error',
        type: 'no_url',
        file: 'site-extensions.js',
        name: e.name,
        message: `site-extensions.js 中缺少 URL：${e.name}`,
      })
    }
  }

  // 检查重复分类 ID
  const allCatIds = [...navCats.map(c => c.id), ...extCats.map(c => c.id)]
  const dupCats = allCatIds.filter((id, i) => allCatIds.indexOf(id) !== i)
  for (const id of [...new Set(dupCats)]) {
    const names = [...navCats, ...extCats].filter(c => c.id === id).map(c => c.name)
    issues.push({
      severity: 'error',
      type: 'dup_category',
      id,
      names: [...new Set(names)],
      message: `重复分类 ID "${id}"：${[...new Set(names)].join('、')}`,
    })
  }

  // 通过动态导入获取合并后的数据
  let mergedCategories
  try {
    const mod = await import(path.join(SRC, 'nav.js'))
    mergedCategories = mod.categories
  } catch (e) {
    issues.push({
      severity: 'fatal',
      type: 'import_error',
      message: `无法加载合并数据：${e.message}`,
    })
    mergedCategories = []
  }

  stats.mergedCategories = mergedCategories.length
  const mergedUrls = new Set()
  const mergedUrlToName = new Map()
  for (const cat of mergedCategories) {
    for (const item of cat.items) {
      mergedUrls.add(item.url)
      mergedUrlToName.set(item.url, item.name)
    }
  }
  stats.mergedUniqueUrls = mergedUrls.size
  stats.mergedTotalItems = mergedCategories.reduce((a, c) => a + c.items.length, 0)

  // 检查跨分类丢失：源中唯一的 URL，但合并后不存在
  const allSourceUrls = new Set([...navEntries.map(e => e.url), ...extEntries.map(e => e.url)])
  stats.sourceUniqueUrls = allSourceUrls.size

  const lostUrls = [...allSourceUrls].filter(u => !mergedUrls.has(u))
  stats.lostCount = lostUrls.length

  for (const url of lostUrls) {
    // 找出哪个源文件的哪个条目丢失了
    let source = 'unknown'
    let name = 'unknown'
    for (const e of navEntries) {
      if (e.url === url) { source = 'nav.js'; name = e.name; break }
    }
    if (source === 'unknown') {
      for (const e of extEntries) {
        if (e.url === url) { source = 'site-extensions.js'; name = e.name; break }
      }
    }
    issues.push({
      severity: 'error',
      type: 'lost_entry',
      source,
      url,
      name,
      message: `条目丢失：${name}（${url}）在源文件 ${source} 中存在但合并后消失`,
      fix_suggestion: fix ? `建议检查 ${source} 中是否有同名条目与其他分类的 URL 重复` : undefined,
    })
  }

  // 检查空分类
  const emptyCats = mergedCategories.filter(c => c.items.length === 0)
  for (const cat of emptyCats) {
    issues.push({
      severity: 'warn',
      type: 'empty_category',
      id: cat.id,
      name: cat.name,
      message: `空分类：${cat.name}（id: ${cat.id}）没有任何条目`,
    })
  }
  stats.emptyCategories = emptyCats.length

  // ====== 输出 ======
  const exitCode = lostUrls.length > 0 ? 1 : 0

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
    console.log()

    const errors = issues.filter(i => i.severity === 'error' || i.severity === 'fatal')
    const warns = issues.filter(i => i.severity === 'warn')

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
      console.log('❌ 审计失败，发现数据丢失！请修复后重新检查。\n')
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

audit(options).then(code => process.exit(code)).catch(err => {
  console.error('审计脚本错误:', err.message)
  process.exit(2)
})
