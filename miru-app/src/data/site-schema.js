/**
 * Miru Index 数据 Schema
 *
 * 本文件仅包含 JSDoc 类型定义，用于：
 * 1. IDE 类型提示与自动补全
 * 2. scripts/validate-data.mjs 运行时校验
 * 3. 未来接入 TypeScript / 后端 CMS 时的契约参考
 *
 * 扩展指南：
 * - 新增分类：在 categories 数组追加，建议同步更新 APP_CONFIG.VOLUMES
 * - 新增站点：在对应 category.items 追加 SiteItem
 * - 新增字段：先在 SiteItem / Category 类型声明，再更新 validate-data.mjs
 */

/**
 * @typedef {'ok' | 'mirror' | 'unstable' | 'crawl' | 'dead'} HealthStatus
 * 站点健康状态：
 * - ok: 可直接访问
 * - mirror: 主站不稳定，常用镜像
 * - unstable: 时好时坏
 * - crawl: 反爬严格，需特殊处理
 * - dead: 确认长期失效（建议从数据中移除或归档）
 */

/**
 * @typedef {Object} SiteItem
 * @property {string} name - 站点名称（简短，不超过 12 字）
 * @property {string} url - 主站 URL，必须以 https:// 开头
 * @property {string} [desc] - 一句话描述，卡片副标题
 * @property {string} [fullDesc] - 弹窗内的完整介绍
 * @property {string[]} [tags] - 标签数组，用于标签云筛选
 * @property {string[]} [features] - 特色功能列表，弹窗展示
 * @property {boolean} [proxy=false] - true 表示国内访问需代理
 * @property {HealthStatus} [health='ok'] - 健康状态标记
 * @property {string[]} [mirrors] - GitHub/常用镜像地址列表
 */

/**
 * @typedef {Object} Category
 * @property {string} id - 分类唯一标识（英文，用于 URL 与卷册绑定）
 * @property {string} name - 分类显示名称
 * @property {string} icon - 分类图标（当前使用 emoji，未来可替换为 SVG/Iconfont）
 * @property {SiteItem[]} items - 该分类下的站点列表
 */

/**
 * @typedef {Object} VolumeConfig
 * @property {string} id - 卷册ID
 * @property {string} name - 卷册中文名（如 卷壹）
 * @property {string} title - 卷册标题
 * @property {string} sub - 卷册英文副标题
 * @property {string[]} catIds - 属于该卷的 category.id 列表
 */

export {}
