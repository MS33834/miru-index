#!/usr/bin/env node
import { categories } from '../src/data/nav.js'

const VALID_HEALTH = new Set(['ok', 'mirror', 'unstable', 'crawl', 'dead'])

const errors = []
const warnings = []

function error(path, msg) {
  errors.push(`[错误] ${path}: ${msg}`)
}
function warn(path, msg) {
  warnings.push(`[警告] ${path}: ${msg}`)
}

function validate() {
  const seenUrls = new Map()
  const seenNames = new Map()

  for (const cat of categories) {
    if (!cat.id) error('category', '分类缺少 id')
    if (!cat.name) error(`category[${cat.id}]`, '分类缺少 name')
    if (!cat.icon) warn(`category[${cat.id}]`, '分类缺少 icon')

    if (!Array.isArray(cat.items)) {
      error(`category[${cat.id}]`, 'items 不是数组')
      continue
    }

    for (let i = 0; i < cat.items.length; i++) {
      const item = cat.items[i]
      const path = `category[${cat.id}].items[${i}]`

      const required = ['name', 'url', 'desc', 'fullDesc', 'tags', 'features', 'proxy', 'health']
      for (const key of required) {
        if (!(key in item)) error(path, `缺少字段 ${key}`)
      }

      if (typeof item.name !== 'string' || !item.name.trim()) error(path, 'name 为空')
      if (typeof item.url !== 'string' || !item.url.trim()) {
        error(path, 'url 为空')
      } else {
        if (!/^https?:\/\//.test(item.url)) error(path, `url 协议异常: ${item.url}`)
        if (!item.url.startsWith('https://')) warn(path, `url 未使用 HTTPS: ${item.url}`)
        if (seenUrls.has(item.url)) {
          error(path, `URL 重复: ${item.url}（首次出现在 ${seenUrls.get(item.url)}）`)
        } else {
          seenUrls.set(item.url, `${cat.id}#${item.name}`)
        }
      }

      if (typeof item.desc !== 'string' || !item.desc.trim()) error(path, 'desc 为空')
      if (typeof item.fullDesc !== 'string' || !item.fullDesc.trim()) error(path, 'fullDesc 为空')

      if (!Array.isArray(item.tags) || item.tags.length === 0) {
        warn(path, 'tags 为空或非数组')
      } else {
        for (const tag of item.tags) {
          if (typeof tag !== 'string' || !tag.trim()) error(path, `tag 格式错误: ${tag}`)
        }
      }

      if (!Array.isArray(item.features) || item.features.length === 0) {
        warn(path, 'features 为空或非数组')
      } else {
        for (const f of item.features) {
          if (typeof f !== 'string' || !f.trim()) error(path, `feature 格式错误: ${f}`)
        }
      }

      if (typeof item.proxy !== 'boolean') error(path, `proxy 应为布尔值: ${item.proxy}`)

      if (!VALID_HEALTH.has(item.health)) {
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
