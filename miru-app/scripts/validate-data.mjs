#!/usr/bin/env node
/**
 * 数据 Schema 校验脚本
 *
 * 校验 src/data/nav.js + site-extensions.js 合并后的全部条目，规则与
 * src/data/site-schema.js 的 JSDoc 类型定义对齐：
 *   - 必填字段：name、url（缺失 → error）
 *   - 可选字段：desc / fullDesc / tags / features / proxy / health / mirrors（缺失 → warn，运行时使用默认值）
 *   - health 枚举：ok | mirror | unstable | crawl | dead | blocked | restricted（与 HEALTH_MAP 一致）
 *   - URL 去重：同分类内重复 → error（mergeCategories 会静默丢弃）；跨分类重复 → warn（属 intentional 收录）
 *
 * 退出码：0 = 通过（允许 warning），1 = 存在 error
 */
import { categories } from '../src/data/nav.js'

const VALID_HEALTH = new Set(['ok', 'mirror', 'unstable', 'crawl', 'dead', 'blocked', 'restricted'])

const errors = []
const warnings = []

function error(path, msg) {
  errors.push(`[错误] ${path}: ${msg}`)
}
function warn(path, msg) {
  warnings.push(`[警告] ${path}: ${msg}`)
}

function validate() {
  // url -> 首次出现位置 "catId#name"，用于跨分类重复提示
  const globalUrlSeen = new Map()
  // catId -> Set<url>，用于同分类内重复检测（会被 mergeCategories 丢弃）
  const catUrlSeen = new Map()
  const seenNames = new Map()

  for (const cat of categories) {
    if (!cat.id) error('category', '分类缺少 id')
    if (!cat.name) error(`category[${cat.id}]`, '分类缺少 name')
    if (!cat.icon) warn(`category[${cat.id}]`, '分类缺少 icon')

    if (!Array.isArray(cat.items)) {
      error(`category[${cat.id}]`, 'items 不是数组')
      continue
    }

    catUrlSeen.set(cat.id, new Set())

    for (let i = 0; i < cat.items.length; i++) {
      const item = cat.items[i]
      const path = `category[${cat.id}].items[${i}]`

      // 必填字段（schema 中无方括号）
      for (const key of ['name', 'url']) {
        if (!(key in item)) error(path, `缺少必填字段 ${key}`)
      }

      // 可选字段缺失 → warn（运行时使用默认值，不阻断）
      for (const key of ['desc', 'fullDesc', 'tags', 'features', 'proxy', 'health']) {
        if (!(key in item)) warn(path, `缺少可选字段 ${key}，将使用默认值`)
      }

      const health = item.health ?? 'ok'

      if (typeof item.name !== 'string' || !item.name.trim()) error(path, 'name 为空')
      if (typeof item.url !== 'string' || !item.url.trim()) {
        error(path, 'url 为空')
      } else {
        if (!/^https?:\/\//.test(item.url)) error(path, `url 协议异常: ${item.url}`)
        if (!item.url.startsWith('https://')) warn(path, `url 未使用 HTTPS: ${item.url}`)

        // 同分类内重复：会被 mergeCategories 静默丢弃，视为 error
        const local = catUrlSeen.get(cat.id)
        if (local.has(item.url)) {
          error(path, `同分类内 URL 重复: ${item.url}（将被去重丢弃）`)
        } else {
          local.add(item.url)
        }

        // 跨分类重复：intentional 收录，仅 warn
        if (globalUrlSeen.has(item.url)) {
          warn(path, `跨分类 URL 重复: ${item.url}（首次出现在 ${globalUrlSeen.get(item.url)}）`)
        } else {
          globalUrlSeen.set(item.url, `${cat.id}#${item.name}`)
        }
      }

      if ('desc' in item && (typeof item.desc !== 'string' || !item.desc.trim())) {
        error(path, 'desc 为空')
      }
      if ('fullDesc' in item && (typeof item.fullDesc !== 'string' || !item.fullDesc.trim())) {
        error(path, 'fullDesc 为空')
      }

      if ('tags' in item) {
        if (!Array.isArray(item.tags) || item.tags.length === 0) {
          warn(path, 'tags 为空或非数组')
        } else {
          for (const tag of item.tags) {
            if (typeof tag !== 'string' || !tag.trim()) error(path, `tag 格式错误: ${tag}`)
          }
        }
      }

      if ('features' in item) {
        if (!Array.isArray(item.features) || item.features.length === 0) {
          warn(path, 'features 为空或非数组')
        } else {
          for (const f of item.features) {
            if (typeof f !== 'string' || !f.trim()) error(path, `feature 格式错误: ${f}`)
          }
        }
      }

      if ('proxy' in item && typeof item.proxy !== 'boolean') {
        error(path, `proxy 应为布尔值: ${item.proxy}`)
      }

      if (!VALID_HEALTH.has(health)) {
        error(path, `health 值非法: ${item.health}，允许 ${[...VALID_HEALTH].join('/')}`)
      }

      if (seenNames.has(item.name)) {
        warn(path, `name 可能重复: ${item.name}（${seenNames.get(item.name)}）`)
      } else {
        seenNames.set(item.name, `${cat.id}`)
      }
    }
  }
}

validate()

for (const w of warnings) console.log(w)
for (const e of errors) console.log(e)

console.log(`\n汇总: ${errors.length} 个错误, ${warnings.length} 个警告`)

if (errors.length > 0) process.exit(1)
