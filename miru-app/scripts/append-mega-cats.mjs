#!/usr/bin/env node
// 在 site-extensions.js 的 extensionCategories 数组末尾追加 14 个新分类
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { execFileSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const FILE = path.resolve(ROOT, 'src/data/site-extensions.js')

const newCategories = [
  {
    id: 'ai_chat',
    name: 'AI 助手 / 对话',
    icon: '🧠',
    items: [
      {
        name: 'ChatGPT',
        url: 'https://chat.openai.com/',
        desc: 'OpenAI 旗舰对话',
        fullDesc:
          'OpenAI 推出的旗舰对话式 AI 助手，基于 GPT 系列模型，支持多轮对话、代码生成、文档分析、图像理解、DALL·E 图像生成，海外最主流的 AI 工具。',
        tags: ['GPT', '对话', 'OpenAI'],
        features: ['多模态', '代码', '插件'],
        proxy: true,
      },
      {
        name: 'Claude',
        url: 'https://claude.ai/',
        desc: 'Anthropic 对话 AI',
        fullDesc:
          'Anthropic 推出的对话式 AI 助手 Claude，擅长长文本理解（200K token 上下文）、代码、写作、推理，写作质量与安全性业内领先。',
        tags: ['Claude', 'Anthropic', '长文本'],
        features: ['200K 上下文', '写作', '代码'],
        proxy: true,
      },
      {
        name: 'Gemini',
        url: 'https://gemini.google.com/',
        desc: 'Google 多模态 AI',
        fullDesc:
          'Google DeepMind 推出的多模态 AI 助手 Gemini（原 Bard），原生支持图像、视频、音频、文本四种模态，深度整合 Google 搜索与 Workspace。',
        tags: ['Gemini', 'Google', '多模态'],
        features: ['多模态', '搜索整合', '免费'],
        proxy: true,
      },
      {
        name: 'Poe',
        url: 'https://poe.com/',
        desc: '多模型聚合',
        fullDesc:
          'Quora 推出的 AI 对话聚合平台 Poe，一个账号即可使用 GPT-4、Claude、Gemini、Llama、Mistral 等数十个模型，可创建自定义 Bot。',
        tags: ['Poe', '聚合', '多模型'],
        features: ['多模型', '自定义 Bot', '跨平台'],
        proxy: true,
      },
      {
        name: 'Perplexity',
        url: 'https://www.perplexity.ai/',
        desc: 'AI 搜索引擎',
        fullDesc:
          'Perplexity 是一款 AI 驱动的对话式搜索引擎，结合大模型与实时网络检索，给出带引用来源的答案，是替代 Google 的新一代搜索工具。',
        tags: ['搜索', 'AI', '引用'],
        features: ['实时检索', '引用来源', 'Focus 模式'],
        proxy: true,
      },
      {
        name: '文心一言',
        url: 'https://yiyan.baidu.com/',
        desc: '百度大模型',
        fullDesc:
          '百度推出的对话式 AI 助手文心一言，基于 ERNIE 大模型，支持文本创作、代码、绘画（文心一格）、文档问答，国内访问稳定。',
        tags: ['百度', 'ERNIE', '国内'],
        features: ['国内直连', '中文强', '多模态'],
        proxy: false,
      },
      {
        name: '通义千问',
        url: 'https://tongyi.aliyun.com/',
        desc: '阿里大模型',
        fullDesc:
          '阿里云推出的对话式 AI 助手通义千问，基于 Qwen 系列大模型，支持文本、代码、图像理解、文档分析，可免费注册使用。',
        tags: ['阿里', 'Qwen', '国内'],
        features: ['国内直连', '免费', '代码强'],
        proxy: false,
      },
      {
        name: 'Kimi',
        url: 'https://kimi.moonshot.cn/',
        desc: '月之暗面助手',
        fullDesc:
          '月之暗面 Moonshot AI 推出的 Kimi 智能助手，擅长长文本阅读（200 万字上下文）、文档总结、联网搜索，国内口碑极佳。',
        tags: ['Kimi', 'Moonshot', '长文'],
        features: ['200 万字', '文档分析', '免费'],
        proxy: false,
      },
      {
        name: '智谱清言',
        url: 'https://chatglm.cn/',
        desc: '清华 GLM 对话',
        fullDesc:
          '智谱 AI 基于 GLM 系列大模型推出的对话助手智谱清言，支持文本、图像、代码、文档，开放 API，支持本地部署。',
        tags: ['GLM', '智谱', '开源'],
        features: ['国内直连', 'GLM-4', 'API'],
        proxy: false,
      },
      {
        name: '豆包',
        url: 'https://www.doubao.com/',
        desc: '字节大模型',
        fullDesc:
          '字节跳动旗下抖音推出的 AI 助手豆包，基于豆包大模型，集成 AI 搜索、对话、写作、图像生成，App 端装机量大。',
        tags: ['豆包', '字节', '抖音'],
        features: ['国内', 'App', '免费'],
        proxy: false,
      },
      {
        name: '天工 AI',
        url: 'https://www.tiangong.cn/',
        desc: '昆仑万维 AI',
        fullDesc:
          '昆仑万维推出的天工 AI 助手，支持搜索、对话、写作、绘图（天工 SkyPaint），是国内较早开放的对话大模型之一。',
        tags: ['天工', '昆仑', '国内'],
        features: ['国内', '搜索', '绘图'],
        proxy: false,
      },
      {
        name: 'You.com',
        url: 'https://you.com/',
        desc: 'AI 搜索引擎',
        fullDesc:
          'You.com 是一款 AI 驱动的搜索引擎，集成 GPT、Claude 等模型，支持多模态、定制 App、隐私优先，可作为 Google 替代品。',
        tags: ['You', '搜索', 'AI'],
        features: ['多模型', '定制', '隐私'],
        proxy: true,
      },
    ],
  },
  {
    id: 'ai_image',
    name: 'AI 图像',
    icon: '🎨',
    items: [
      {
        name: 'Midjourney',
        url: 'https://www.midjourney.com/',
        desc: 'AI 绘画标杆',
        fullDesc:
          'Midjourney 是当前质量最强的 AI 绘画工具之一，通过 Discord / Web 输入提示词生成高品质插画，二次元 / 概念艺术 / 商业插画表现一流。',
        tags: ['MJ', '绘画', '艺术'],
        features: ['质量顶级', 'Discord', '商业可用'],
        proxy: true,
      },
      {
        name: 'Stable Diffusion WebUI',
        url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
        desc: '开源 SD 客户端',
        fullDesc:
          'AUTOMATIC1111 开发的 Stable Diffusion WebUI，开源 AI 绘画本地部署方案，支持 SD 1.5/2.x/SDXL，社区生态最丰富，插件 1000+。',
        tags: ['SD', '开源', '本地'],
        features: ['开源', '插件多', '本地部署'],
        proxy: false,
        mirrors: [
          'https://gh-proxy.com/https://raw.githubusercontent.com/AUTOMATIC1111/stable-diffusion-webui/HEAD',
          'https://cdn.jsdelivr.net/gh/AUTOMATIC1111/stable-diffusion-webui@master',
        ],
      },
      {
        name: 'ComfyUI',
        url: 'https://github.com/comfyanonymous/ComfyUI',
        desc: '节点式 SD',
        fullDesc:
          'ComfyUI 是节点式（Node-based）的 Stable Diffusion 客户端，可视化搭建工作流，适合批量生成 + 复杂流程控制，效率极高。',
        tags: ['ComfyUI', '节点', 'SD'],
        features: ['节点流', '高效', '可复现'],
        proxy: false,
        mirrors: ['https://gh-proxy.com/https://raw.githubusercontent.com/comfyanonymous/ComfyUI/HEAD'],
      },
      {
        name: 'Civitai',
        url: 'https://civitai.com/',
        desc: 'AI 模型社区',
        fullDesc:
          'Civitai 是全球最大的 Stable Diffusion 模型与作品分享社区，托管上万 Checkpoint / LoRA / Embedding，配套图片生成与提示词参考。',
        tags: ['Civitai', '模型', 'LoRA'],
        features: ['模型库', '社区', '在线生成'],
        proxy: true,
      },
      {
        name: 'Hugging Face',
        url: 'https://huggingface.co/',
        desc: 'AI 模型 Hub',
        fullDesc:
          'Hugging Face 是全球最大的 AI 开源社区，提供模型、数据集、Demo Spaces（在线体验）、Transformers / Diffusers 库下载，AI 开发者必备。',
        tags: ['HF', '模型', 'Spaces'],
        features: ['10 万+ 模型', 'Spaces', 'Transformers'],
        proxy: true,
      },
      {
        name: 'Leonardo.ai',
        url: 'https://leonardo.ai/',
        desc: '在线 AI 绘画',
        fullDesc:
          'Leonardo.ai 在线 AI 绘画平台，提供 SDXL 微调模型、Canvas 编辑、纹理生成、3D 纹理、动画生成等高级功能，免费额度友好。',
        tags: ['Leonardo', '在线', 'SDXL'],
        features: ['SDXL', '3D', 'Canvas'],
        proxy: true,
      },
      {
        name: 'SeaArt',
        url: 'https://www.seaart.ai/',
        desc: '国内 AI 绘画',
        fullDesc:
          'SeaArt（海艺）国内 AI 绘画平台，模型库丰富、生成速度快、中文提示词友好、可训练 LoRA，国内创作者常用。',
        tags: ['SeaArt', '国内', 'LoRA'],
        features: ['国内', '中文友好', 'LoRA 训练'],
        proxy: false,
      },
      {
        name: 'LiblibAI',
        url: 'https://www.liblib.art/',
        desc: '哩布哩布 AI',
        fullDesc:
          '哩布哩布 AI（LiblibArt）国内 AI 绘画社区，模型与作品并重，提供在线 WebUI、ComfyUI 在线版、LoRA 训练，ACGN 创作者聚集。',
        tags: ['Liblib', '国内', 'WebUI'],
        features: ['在线 WebUI', '模型', '社区'],
        proxy: false,
      },
      {
        name: 'DALL·E 3',
        url: 'https://openai.com/dall-e-3',
        desc: 'OpenAI 绘画',
        fullDesc:
          'OpenAI 推出的 DALL·E 3 图像生成模型，集成于 ChatGPT Plus / Bing Image Creator，文字理解力强、提示词直译效果好。',
        tags: ['DALL·E', 'OpenAI', 'ChatGPT'],
        features: ['文字理解', '集成 ChatGPT', '安全'],
        proxy: true,
      },
      {
        name: 'Replicate',
        url: 'https://replicate.com/',
        desc: 'AI 模型云',
        fullDesc:
          'Replicate 是 AI 模型的云端运行平台，几行代码即可调用 SD、Flux、Whisper、Suno 等数千开源模型，按秒计费，是 AI 工程师的 API 中心。',
        tags: ['Replicate', '云', 'API'],
        features: ['一键 API', '按秒计费', '模型多'],
        proxy: true,
      },
      {
        name: 'Pixlr',
        url: 'https://www.pixlr.com/',
        desc: '在线 PS 替代',
        fullDesc:
          'Pixlr 在线图片编辑器，AI 抠图、AI 修图、AI 生成一应俱全，桌面 / 移动 / Web 全平台，免费版即可完成 90% 日常修图。',
        tags: ['Pixlr', '在线', '修图'],
        features: ['AI 抠图', '跨平台', '免费'],
        proxy: false,
      },
      {
        name: 'Photopea',
        url: 'https://www.photopea.com/',
        desc: 'PS 在线版',
        fullDesc:
          'Photopea 是开源免费的 Web 版 Photoshop 替代品，PSD 原生支持，图层 / 蒙版 / 智能对象 / 滤镜完整，无需注册即可使用。',
        tags: ['Photopea', 'PSD', '免费'],
        features: ['PSD 兼容', '图层', '免费'],
        proxy: false,
      },
    ],
  },
  {
    id: 'ai_video',
    name: 'AI 视频 / 音频',
    icon: '🎬',
    items: [
      {
        name: 'Runway',
        url: 'https://runwayml.com/',
        desc: 'AI 视频生成',
        fullDesc:
          'Runway 是 AI 视频生成与编辑领域的领先平台，Gen-3 Alpha 模型可生成电影级短片，提供绿幕、动效、风格转换等 AI 编辑工具。',
        tags: ['Runway', '视频', 'Gen-3'],
        features: ['Gen-3', '视频编辑', '绿幕'],
        proxy: true,
      },
      {
        name: 'Pika',
        url: 'https://pika.art/',
        desc: 'AI 短视频',
        fullDesc:
          'Pika 推出的 AI 视频生成工具，输入文本/图像即可生成 3-10 秒短视频，支持动作控制、镜头平移、视频风格转换，社区氛围活跃。',
        tags: ['Pika', '短视频', '图生视频'],
        features: ['图生视频', '3 秒', '免费试用'],
        proxy: true,
      },
      {
        name: 'Sora',
        url: 'https://openai.com/sora',
        desc: 'OpenAI 视频模型',
        fullDesc:
          'OpenAI 推出的 Sora 视频生成模型，可生成长达 60 秒的高质量视频，理解物理世界、镜头语言、角色一致性，是当前最受关注的 AI 视频模型。',
        tags: ['Sora', 'OpenAI', '长视频'],
        features: ['60 秒', '物理理解', '多角色'],
        proxy: true,
      },
      {
        name: 'Kling',
        url: 'https://klingai.com/',
        desc: '快手可灵',
        fullDesc:
          '快手推出的 AI 视频生成模型可灵（Kling），支持文本 / 图像生成视频，长度 2-10 秒，运动幅度与质量在国内领先。',
        tags: ['可灵', '快手', '国内'],
        features: ['国内直连', '2-10 秒', '图生视频'],
        proxy: false,
      },
      {
        name: '即梦',
        url: 'https://jimeng.jianying.com/',
        desc: '字节即梦',
        fullDesc: '字节跳动剪映团队推出的 AI 创作平台即梦，支持文/图生视频、AI 图像、AI 数字人，与剪映深度集成。',
        tags: ['即梦', '字节', '剪映'],
        features: ['国内', '剪映集成', '数字人'],
        proxy: false,
      },
      {
        name: 'Suno',
        url: 'https://www.suno.ai/',
        desc: 'AI 音乐生成',
        fullDesc:
          'Suno 是当前最强的 AI 音乐生成工具，输入歌词或描述即可生成完整歌曲（人声 + 伴奏），v3.5 质量接近人类创作。',
        tags: ['Suno', '音乐', '作曲'],
        features: ['完整歌曲', '人声', '免费试用'],
        proxy: true,
      },
      {
        name: 'Udio',
        url: 'https://www.udio.com/',
        desc: 'AI 音乐',
        fullDesc:
          'Udio 是一款 AI 音乐生成平台，专注人声 + 编曲质量，可生成流行、摇滚、电子、古典等多种风格，对中文支持也持续提升。',
        tags: ['Udio', '音乐', '人声'],
        features: ['人声', '多风格', '高质量'],
        proxy: true,
      },
      {
        name: 'ElevenLabs',
        url: 'https://elevenlabs.io/',
        desc: 'AI 配音',
        fullDesc:
          'ElevenLabs 是全球最顶级的 AI 语音合成平台，语音克隆 / 多语种 / 情感控制行业领先，影视解说 / 播客 / 游戏配音常用。',
        tags: ['ElevenLabs', 'TTS', '克隆'],
        features: ['语音克隆', '多语言', '情感'],
        proxy: true,
      },
      {
        name: '剪映专业版',
        url: 'https://www.capcut.cn/',
        desc: '剪映桌面',
        fullDesc:
          '字节剪映专业版（CapCut Desktop），免费视频剪辑工具，AI 字幕、AI 配音、AI 特效齐全，是国内最主流的短视频剪辑软件。',
        tags: ['剪映', '剪辑', 'AI'],
        features: ['AI 字幕', 'AI 配音', '免费'],
        proxy: false,
      },
      {
        name: 'Descript',
        url: 'https://www.descript.com/',
        desc: 'AI 音视频编辑',
        fullDesc:
          'Descript 是 AI 驱动的音视频编辑器，像编辑文档一样编辑视频，自动转录、语音克隆、去除杂音、字幕生成，播客 / YouTube 创作者神器。',
        tags: ['Descript', '播客', '转录'],
        features: ['文本编辑', '语音克隆', '去杂音'],
        proxy: true,
      },
    ],
  },
  {
    id: 'dev_tool',
    name: '开发工具',
    icon: '🛠️',
    items: [
      {
        name: 'Stack Overflow',
        url: 'https://stackoverflow.com/',
        desc: '程序员问答',
        fullDesc:
          'Stack Overflow 是全球最大的程序员问答社区，覆盖所有编程语言与框架，日活问答 1 万+，是程序员日常检索 bug 与解决方案的首选。',
        tags: ['问答', '编程', '英文'],
        features: ['问答', '标签', '声誉'],
        proxy: true,
      },
      {
        name: 'MDN Web Docs',
        url: 'https://developer.mozilla.org/',
        desc: 'Web 权威文档',
        fullDesc:
          'MDN Web Docs 是 Mozilla 维护的 Web 技术权威文档，HTML / CSS / JavaScript / Web API / 浏览器兼容数据完整，是前端开发者的必备参考。',
        tags: ['MDN', 'Web', '文档'],
        features: ['权威', '兼容数据', '示例'],
        proxy: true,
      },
      {
        name: 'Can I Use',
        url: 'https://caniuse.com/',
        desc: '浏览器兼容',
        fullDesc:
          'Can I Use 收录了所有 Web 特性在主流浏览器中的兼容数据（Chrome / Firefox / Safari / Edge），支持按特性、地区、Beta 版筛选。',
        tags: ['兼容', '浏览器', 'Web'],
        features: ['兼容表', '地区', 'Babel 建议'],
        proxy: true,
      },
      {
        name: 'Greasy Fork',
        url: 'https://greasyfork.org/zh-CN',
        desc: '油猴脚本',
        fullDesc:
          'Greasy Fork 是最大的用户脚本（油猴脚本）社区，托管上万脚本，按安装量排序，覆盖 ACG 站去广告、网盘加速、翻译、辅助等。',
        tags: ['油猴', '脚本', 'Tampermonkey'],
        features: ['脚本库', '中文', '审核'],
        proxy: false,
      },
      {
        name: '极简插件',
        url: 'https://chrome.zzzmh.cn/',
        desc: 'Chrome 插件',
        fullDesc:
          '极简插件是国内 Chrome / Edge 浏览器插件聚合下载站，每款插件附详细介绍与截图，分类齐全、下载稳定，是国内插件下载首选。',
        tags: ['Chrome', '插件', '下载'],
        features: ['国内镜像', '稳定', '分类'],
        proxy: false,
      },
      {
        name: 'CrxDL',
        url: 'https://crxdl.com/',
        desc: 'CRX 下载',
        fullDesc:
          'CrxDL 提供 Chrome 商店插件的 CRX 离线下载，无需翻墙即可获取最新版本插件，适合国内无法直接访问 Chrome Web Store 的用户。',
        tags: ['CRX', '离线', 'Chrome'],
        features: ['离线下载', '国内', '版本全'],
        proxy: false,
      },
      {
        name: 'Regex101',
        url: 'https://regex101.com/',
        desc: '正则测试',
        fullDesc:
          'Regex101 是一款在线正则表达式测试工具，支持 PCRE / JavaScript / Python 三种引擎，实时高亮匹配、解释每段含义、生成示例代码。',
        tags: ['正则', '测试', '工具'],
        features: ['多引擎', '高亮', '解释'],
        proxy: true,
      },
      {
        name: 'JSON Tools',
        url: 'https://jsonformatter.org/',
        desc: 'JSON 格式化',
        fullDesc:
          'JSON Formatter & Validator 提供 JSON 在线格式化、校验、转 XML/CSV/YAML、生成类型定义，是前后端调试常用工具。',
        tags: ['JSON', '格式化', '在线'],
        features: ['格式化', '校验', '转换'],
        proxy: true,
      },
      {
        name: 'DevDocs',
        url: 'https://devdocs.io/',
        desc: '文档聚合',
        fullDesc:
          'DevDocs 把几十种技术文档（HTML、CSS、JS、React、Vue、Python、Go 等）整合在一个极速搜索界面，离线可用，是开发者必备的文档中心。',
        tags: ['DevDocs', '文档', '搜索'],
        features: ['多文档', '极速搜索', '离线'],
        proxy: true,
      },
      {
        name: 'CodePen',
        url: 'https://codepen.io/',
        desc: '前端 Playground',
        fullDesc:
          'CodePen 是前端开发者的在线 Playground，HTML + CSS + JS 实时预览，社区作品丰富（动效 / 组件 / 创意 UI），适合分享 Demo 与灵感。',
        tags: ['CodePen', 'Playground', '前端'],
        features: ['实时预览', '社区', '作品'],
        proxy: true,
      },
    ],
  },
  {
    id: 'learn',
    name: '在线学习',
    icon: '🎓',
    items: [
      {
        name: '中国大学 MOOC',
        url: 'https://www.icourse163.org/',
        desc: '国内高校公开课',
        fullDesc:
          '中国大学 MOOC 是高教社与网易联合打造的在线学习平台，汇聚国内 800+ 高校的优质课程，考研 / 编程 / 设计全覆盖，课程免费 + 证书付费。',
        tags: ['MOOC', '高校', '免费'],
        features: ['高校课程', '免费', '证书'],
        proxy: false,
      },
      {
        name: '学堂在线',
        url: 'https://www.xuetangx.com/',
        desc: '清华在线教育',
        fullDesc:
          '学堂在线是清华大学发起的慕课平台，聚集清华、北大、MIT、Stanford 等国内外名校课程，覆盖计算机、经管、人文、外语等。',
        tags: ['清华', '高校', 'MOOC'],
        features: ['名校课程', '免费', '微学位'],
        proxy: false,
      },
      {
        name: 'Coursera',
        url: 'https://www.coursera.org/',
        desc: '国际慕课',
        fullDesc:
          'Coursera 是全球最大的在线教育平台之一，Yale、Stanford、Google、IBM 等机构开设课程，专业证书、学位项目齐全。',
        tags: ['Coursera', '国际', '证书'],
        features: ['名校', '证书', '学位'],
        proxy: true,
      },
      {
        name: 'edX',
        url: 'https://www.edx.org/',
        desc: '哈佛 MIT 慕课',
        fullDesc:
          'edX 由哈佛、MIT 创办的在线教育平台，3000+ 课程覆盖编程、数据科学、人文、工程等，证书被国际广泛认可。',
        tags: ['edX', '名校', '免费'],
        features: ['名校', '微硕士', '免费旁听'],
        proxy: true,
      },
      {
        name: '可汗学院',
        url: 'https://www.khanacademy.org/',
        desc: '免费全科',
        fullDesc:
          '可汗学院 Khan Academy 提供从幼儿园到大学的全科免费课程（数学、物理、化学、生物、经济、计算机、人文），中英文版本齐全。',
        tags: ['可汗', '免费', '全科'],
        features: ['全科', '免费', '中英'],
        proxy: true,
      },
      {
        name: '极客时间',
        url: 'https://time.geekbang.org/',
        desc: 'IT 技能学习',
        fullDesc:
          '极客时间极客邦旗下 IT 技能学习平台，课程覆盖架构、AI、Python、前端、运维、产品等，业内一线工程师 / 架构师主讲。',
        tags: ['极客', 'IT', '付费'],
        features: ['一线讲师', '实战', '订阅'],
        proxy: false,
      },
      {
        name: '慕课网',
        url: 'https://www.imooc.com/',
        desc: '程序员的梦工厂',
        fullDesc:
          '慕课网（imooc）专注 IT 技能在线学习，前端 / Java / Python / 大数据 / AI 全栈课程，配套实战项目与就业指导，国内老牌程序员学习站。',
        tags: ['慕课', '编程', '实战'],
        features: ['实战', '就业', '老牌'],
        proxy: false,
      },
      {
        name: '网易云课堂',
        url: 'https://study.163.com/',
        desc: '网易在线教育',
        fullDesc: '网易云课堂是网易旗下综合在线教育平台，IT、办公技能、考试、兴趣课程齐全，微专业和系列课质量稳定。',
        tags: ['网易', '综合', '微专业'],
        features: ['综合', '微专业', '网易出品'],
        proxy: false,
      },
      {
        name: 'B站学习区',
        url: 'https://www.bilibili.com/v/knowledge/',
        desc: 'B站知识区',
        fullDesc:
          'B站知识区是国内最活跃的免费学习社区，考研、考公、编程、设计、外语、乐器、绘画课程应有尽有，弹幕互动氛围好。',
        tags: ['B站', '免费', '综合'],
        features: ['免费', '弹幕', 'UP 主多'],
        proxy: false,
      },
      {
        name: 'Crash Course',
        url: 'https://thecrashcourse.com/',
        desc: '速成课',
        fullDesc:
          'Crash Course 是 YouTube 上最知名的速成课系列，每集 10-15 分钟，覆盖世界史、化学、心理学、哲学、计算机等几十个学科，中英字幕。',
        tags: ['速成', '英文', '综合'],
        features: ['10 分钟', '中英', '全科'],
        proxy: true,
      },
    ],
  },
  {
    id: 'design',
    name: '设计协作',
    icon: '✏️',
    items: [
      {
        name: 'Figma',
        url: 'https://www.figma.com/',
        desc: '在线设计协作',
        fullDesc:
          'Figma 是全球最主流的在线 UI 设计协作工具，浏览器即用、原型 / 组件 / 自动布局 / 多人实时协作，是设计师 / 产品经理的事实标准。',
        tags: ['Figma', '协作', 'UI'],
        features: ['在线', '实时协作', '组件'],
        proxy: true,
      },
      {
        name: 'Canva 可画',
        url: 'https://www.canva.cn/',
        desc: '在线平面设计',
        fullDesc:
          'Canva 可画是国民级在线平面设计工具，海报 / PPT / 视频封面 / 社交媒体图模板丰富，拖拽即用，国内访问稳定。',
        tags: ['Canva', '模板', '拖拽'],
        features: ['模板', '国内', '视频剪辑'],
        proxy: false,
      },
      {
        name: '即时设计',
        url: 'https://js.design/',
        desc: '国产 Figma',
        fullDesc:
          '即时设计是国内对标 Figma 的在线设计协作工具，UI/UX 设计、原型、白板、资源社区齐全，国内访问快、中文支持好。',
        tags: ['即时', '国产', 'Figma'],
        features: ['国内', '中文', '组件库'],
        proxy: false,
      },
      {
        name: 'MasterGo',
        url: 'https://mastergo.com/',
        desc: '字节设计平台',
        fullDesc:
          '字节跳动旗下企业级 UI 设计协作平台 MasterGo（莫高设计），对标 Figma，主打大型团队协作、设计交付、研发对接。',
        tags: ['MasterGo', '字节', '企业'],
        features: ['企业', '协作', '研发对接'],
        proxy: false,
      },
      {
        name: 'Pixso',
        url: 'https://pixso.cn/',
        desc: '国产设计工具',
        fullDesc: 'Pixso 是国产一体化设计协作平台，UI 设计、原型、白板、研发交付一站式，资源社区免费，国内访问稳定。',
        tags: ['Pixso', '国产', '协作'],
        features: ['一体化', '免费', '资源社区'],
        proxy: false,
      },
      {
        name: '稿定设计',
        url: 'https://www.gaoding.com/',
        desc: '在线设计',
        fullDesc:
          '稿定设计（Gaoding）在线设计协作平台，图片设计、视频剪辑、抠图、AI 设计一应俱全，模板丰富，是中小企业营销设计常用工具。',
        tags: ['稿定', '模板', 'AI'],
        features: ['模板', 'AI 抠图', '商用'],
        proxy: false,
      },
      {
        name: 'Sketch',
        url: 'https://www.sketch.com/',
        desc: 'Mac 设计工具',
        fullDesc:
          'Sketch 是 Mac 平台主流的 UI 设计工具，组件 / 符号 / 插件生态成熟，与 Figma 并列 UI 设计两大主流工具。',
        tags: ['Sketch', 'Mac', 'UI'],
        features: ['Mac', '组件', '插件'],
        proxy: true,
      },
      {
        name: 'Excalidraw',
        url: 'https://excalidraw.com/',
        desc: '手绘白板',
        fullDesc:
          'Excalidraw 是一款开源的手绘风格在线白板，架构图、流程图、UI 线框图随手画，支持多人协作，本地存储，工程师 / 产品经理常用。',
        tags: ['Excalidraw', '手绘', '白板'],
        features: ['手绘', '开源', '协作'],
        proxy: true,
      },
    ],
  },
  {
    id: 'font_more',
    name: '字体资源',
    icon: '🔤',
    items: [
      {
        name: '字由',
        url: 'https://www.hellofont.cn/',
        desc: '字体管理客户端',
        fullDesc:
          '字由（hellofont）字体管理客户端 + 在线字体库，2 万+ 商用字体一键激活 / 预览，设计师 / 视频创作者的字体管理工具。',
        tags: ['字由', '字体管理', '商用'],
        features: ['一键激活', '商用', '预览'],
        proxy: false,
      },
      {
        name: '求字体',
        url: 'https://www.qiuziti.com/',
        desc: '识图找字体',
        fullDesc:
          '求字体网（qiuziti）支持上传图片识别字体，再也不用为"看到好看的字却不知道是什么"发愁；同时提供字体下载、版权信息查询。',
        tags: ['求字体', '识图', '找字'],
        features: ['识图', '版权查询', '下载'],
        proxy: false,
      },
      {
        name: '字体松鼠',
        url: 'https://www.fontsquirrel.com/',
        desc: '免费商用英文字体',
        fullDesc:
          'Font Squirrel 收录 1000+ 免费可商用英文字体，每款都经过授权审核并提供 Webfont Kit（EOT / WOFF / TTF），是英文网站字体首选。',
        tags: ['英文字体', '免费商用', 'Webfont'],
        features: ['商用', 'Webfont', '授权审核'],
        proxy: true,
      },
      {
        name: 'Fonts Bunny',
        url: 'https://fonts.bunny.net/',
        desc: '隐私优先字体 CDN',
        fullDesc:
          'Fonts Bunny 是 Google Fonts 的隐私优先替代品（GDPR 友好），提供与 Google Fonts 相同的 1500+ 字体家族，零追踪，欧盟服务器。',
        tags: ['Bunny', '字体', '隐私'],
        features: ['隐私', 'GDPR', '1500+ 字体'],
        proxy: true,
      },
      {
        name: '字魂网',
        url: 'https://www.zihun.com/',
        desc: '中文字体下载',
        fullDesc:
          '字魂网（zihun）收录大量中文字体免费下载，覆盖黑体、宋体、楷体、卡通、手写、艺术体，分类齐全，是中文字体下载常用站。',
        tags: ['中文字体', '下载', '免费'],
        features: ['中文', '免费下载', '分类'],
        proxy: false,
      },
      {
        name: '100font',
        url: 'https://www.100font.com/',
        desc: '免费商用字体',
        fullDesc:
          '100font 专注收集可免费商用的中文字体，每款都附带授权协议说明，是设计师 / 自媒体 / 电商找免费商用中文字体的高频站。',
        tags: ['商用', '中文', '免费'],
        features: ['商用', '授权说明', '更新'],
        proxy: false,
      },
      {
        name: 'Fontke 字体库',
        url: 'https://www.fontke.com/',
        desc: '中文字体大全',
        fullDesc:
          '字客网（fontke）国内老牌字体站，提供字体下载、字体识别、字体在线预览、字体设计工具，是字体行业垂直门户。',
        tags: ['字客', '中文字体', '老牌'],
        features: ['下载', '识别', '预览'],
        proxy: false,
      },
    ],
  },
  {
    id: 'efficiency',
    name: '效率工具',
    icon: '⚡',
    items: [
      {
        name: 'Notion',
        url: 'https://www.notion.so/',
        desc: '全能工作区',
        fullDesc:
          'Notion 是集笔记、文档、数据库、Wiki、项目管理于一体的全能工作区，模块化 Block 编辑器、模板生态丰富，是知识工作者的事实标准。',
        tags: ['Notion', '笔记', '协作'],
        features: ['块编辑', '数据库', 'AI'],
        proxy: true,
      },
      {
        name: 'Obsidian',
        url: 'https://obsidian.md/',
        desc: '双向链接笔记',
        fullDesc:
          'Obsidian 是基于 Markdown + 双向链接 + 知识图谱的本地优先笔记软件，插件生态丰富，适合个人知识管理 / PKM / Zettelkasten。',
        tags: ['Obsidian', 'Markdown', 'PKM'],
        features: ['双向链接', '本地', '插件'],
        proxy: true,
      },
      {
        name: 'Logseq',
        url: 'https://logseq.com/',
        desc: '开源双链笔记',
        fullDesc:
          'Logseq 是一款开源的双向链接笔记软件，类 Roam Research 体验，本地优先、支持纯文本、知识图谱、白板，隐私与可移植性极佳。',
        tags: ['Logseq', '开源', '双链'],
        features: ['开源', '本地', '白板'],
        proxy: true,
      },
      {
        name: '飞书',
        url: 'https://www.feishu.cn/',
        desc: '字节办公套件',
        fullDesc:
          '飞书（Feishu/Lark）是字节跳动旗下企业协作平台，整合即时通讯、文档、表格、多维表格、妙记视频会议、AI 助手，国内远程办公高频工具。',
        tags: ['飞书', '字节', '办公'],
        features: ['多维表格', '妙记', 'AI'],
        proxy: false,
      },
      {
        name: '钉钉',
        url: 'https://www.dingtalk.com/',
        desc: '阿里办公',
        fullDesc:
          '钉钉（DingTalk）阿里旗下企业沟通与协同办公平台，IM、考勤、视频会议、审批、文档、AI 助理齐全，国内中小企业主流。',
        tags: ['钉钉', '阿里', '办公'],
        features: ['考勤', '审批', 'AI'],
        proxy: false,
      },
      {
        name: '腾讯文档',
        url: 'https://docs.qq.com/',
        desc: '在线协作文档',
        fullDesc:
          '腾讯文档（docs.qq.com）腾讯出品的在线协作文档，支持 Word / Excel / PPT / 表单 / 智能表，微信生态打通，国内协作高频工具。',
        tags: ['腾讯', '文档', '协作'],
        features: ['微信', '智能表', '免费'],
        proxy: false,
      },
      {
        name: '语雀',
        url: 'https://www.yuque.com/',
        desc: '蚂蚁知识库',
        fullDesc:
          '语雀是蚂蚁集团出品的知识库 / 文档 / 写作平台，目录化、Markdown、团队空间、API 完善，是国内技术团队与个人知识管理常用工具。',
        tags: ['语雀', '知识库', '蚂蚁'],
        features: ['目录', '团队空间', 'API'],
        proxy: false,
      },
      {
        name: 'Anki',
        url: 'https://apps.ankiweb.net/',
        desc: '间隔重复记忆',
        fullDesc:
          'Anki 是基于间隔重复（SRS）算法的开源记忆卡片软件，自制卡组或下载共享卡组（医学 / 日语 / 单词），背单词 / 备考 / 学习利器。',
        tags: ['Anki', '记忆', '间隔重复'],
        features: ['间隔重复', '跨平台', '卡组共享'],
        proxy: true,
      },
      {
        name: '滴答清单',
        url: 'https://www.dida365.com/',
        desc: '跨平台 TODO',
        fullDesc:
          '滴答清单（Dida365）跨平台待办事项 / 习惯打卡 / 番茄钟 / 日历应用，支持多端同步、提醒、看板视图，是 GTD / 时间管理常用工具。',
        tags: ['滴答', 'TODO', 'GTD'],
        features: ['跨平台', '番茄钟', '看板'],
        proxy: false,
      },
      {
        name: 'Trello',
        url: 'https://trello.com/',
        desc: '看板管理',
        fullDesc:
          'Trello 是经典看板（Kanban）项目管理工具，列表 / 卡片 / 拖拽、Power-Up 扩展丰富，小团队 / 个人项目 / 工作流编排都好用。',
        tags: ['Trello', '看板', '项目管理'],
        features: ['看板', '拖拽', 'Power-Up'],
        proxy: true,
      },
    ],
  },
  {
    id: 'community_more',
    name: '社区 / 论坛',
    icon: '💬',
    items: [
      {
        name: '半次元',
        url: 'https://bcy.net/',
        desc: '二次元创作社区',
        fullDesc:
          '半次元（bcy.net）国内 ACG 创作社区，cosplay / 插画 / 同人 / 手工 / 摄影垂直社区，用户活跃度高，是 ACG 创作者交流首选。',
        tags: ['半次元', '同人', '社区'],
        features: ['同人', 'cos', '社区'],
        proxy: false,
      },
      {
        name: '涂手',
        url: 'https://www.tushuoapp.com/',
        desc: '随手画社区',
        fullDesc:
          '涂手（tushuo）随手画创作社区，手机涂鸦 / 简笔画 / 概念速写为核心，扁平工具 + 简单滤镜，灵感分享和脑暴常用。',
        tags: ['涂手', '随手画', '社区'],
        features: ['随手画', 'App', '灵感'],
        proxy: false,
      },
      {
        name: '动漫之家社区',
        url: 'https://bbs.acg06.com/',
        desc: 'ACG 综合论坛',
        fullDesc:
          'ACG06 动漫之家论坛，动漫、漫画、轻小说、同人、cosplay 讨论区齐全，资源分享与水区并存，ACG 圈老牌论坛。',
        tags: ['ACG06', '论坛', '综合'],
        features: ['论坛', '资源', '综合'],
        proxy: false,
      },
      {
        name: 'Bangumi 小组',
        url: 'https://bgm.tv/group',
        desc: 'Bangumi 群组',
        fullDesc:
          'Bangumi 番组计划群组 / 论坛讨论区，番剧讨论、角色排名、动画数据库、ACG 社交一应俱全，国内最专业的番剧评分社区。',
        tags: ['Bangumi', '小组', '番剧'],
        features: ['番剧', '讨论', '社交'],
        proxy: true,
      },
      {
        name: 'V2EX',
        url: 'https://www.v2ex.com/',
        desc: '技术创意社区',
        fullDesc:
          'V2EX 是国内知名的技术 / 创意 / 互联网社区，节点制讨论（程序员 / 设计 / 创业 / Apple / 优惠），技术氛围浓厚。',
        tags: ['V2EX', '技术', '创意'],
        features: ['节点', '技术', '优惠'],
        proxy: true,
      },
      {
        name: '掘金',
        url: 'https://juejin.cn/',
        desc: '开发者社区',
        fullDesc:
          '掘金（juejin）字节跳动旗下的开发者社区，技术文章、沸点、课程、Code Review、AI 工具齐全，是国内技术写作高频平台。',
        tags: ['掘金', '技术', '写作'],
        features: ['技术', '沸点', 'AI'],
        proxy: false,
      },
      {
        name: '思否',
        url: 'https://segmentfault.com/',
        desc: 'SegmentFault',
        fullDesc:
          'SegmentFault 思否是国内中文开发者问答与写作社区，提问 / 回答 / 文章 / 专栏 / 课程生态完整，与 Stack Overflow 类似的问答模式。',
        tags: ['思否', '问答', '开发者'],
        features: ['问答', '写作', '课程'],
        proxy: false,
      },
      {
        name: 'CSDN',
        url: 'https://blog.csdn.net/',
        desc: '老牌技术博客',
        fullDesc: 'CSDN 是国内老牌 IT 技术博客与社区，文章 / 问答 / 课程 / 高校合作齐全，缺点是质量参差，需要筛选。',
        tags: ['CSDN', '老牌', '博客'],
        features: ['博客', '问答', '课程'],
        proxy: false,
      },
      {
        name: '简书',
        url: 'https://www.jianshu.com/',
        desc: '创作社区',
        fullDesc:
          '简书是国内创作社区，写作门槛低，散文、随笔、技术、读书笔记、旅行等垂直专题活跃，是个人写作与阅读常用平台。',
        tags: ['简书', '写作', '社区'],
        features: ['写作', '专题', '社区'],
        proxy: false,
      },
      {
        name: '小红书',
        url: 'https://www.xiaohongshu.com/',
        desc: '生活种草',
        fullDesc:
          '小红书（RED）生活方式分享社区，ACG / 二次元 / cosplay / 插画 / 手账 / 旅行 / 美食全覆盖，年轻用户为主，搜索种草强。',
        tags: ['小红书', '种草', '生活'],
        features: ['种草', '搜索', '笔记'],
        proxy: false,
      },
    ],
  },
  {
    id: 'novel_more',
    name: '网文 / 轻小说',
    icon: '📚',
    items: [
      {
        name: '起点中文网',
        url: 'https://www.qidian.com/',
        desc: '起点中文网',
        fullDesc:
          '起点中文网（qidian）阅文集团旗下最大网文站，VIP 订阅 + 月票 + 打赏体系成熟，玄幻 / 都市 / 二次元 / 轻小说类型齐全。',
        tags: ['起点', '网文', 'VIP'],
        features: ['VIP', '月票', '正版'],
        proxy: false,
      },
      {
        name: '番茄小说',
        url: 'https://fanqienovel.com/',
        desc: '免费网文',
        fullDesc:
          '番茄小说字节跳动旗下免费网文 App，靠广告变现，作者激励强，读者免费看，玄幻 / 言情 / 二次元 / 轻小说内容丰富。',
        tags: ['番茄', '免费', '字节'],
        features: ['免费', '广告变现', 'App'],
        proxy: false,
      },
      {
        name: '刺猬猫',
        url: 'https://www.ciweimao.com/',
        desc: '二次元轻小说',
        fullDesc:
          '刺猬猫（ciweimao）是专注二次元 / 轻小说 / 同人的网文站，作者与读者都偏 ACG 圈，轻小说、综漫、变身、穿越类内容聚集地。',
        tags: ['刺猬猫', '二次元', '轻小说'],
        features: ['二次元', '同人', '轻小说'],
        proxy: false,
      },
      {
        name: '轻之文库',
        url: 'https://www.linovel.net/',
        desc: '轻小说平台',
        fullDesc:
          '轻之文库（linovel）国内轻小说投稿 / 阅读平台，日轻翻译 / 国产轻小说 / 同人作品众多，ACGN 圈轻小说读者首选。',
        tags: ['轻之文库', '轻小说', '日轻'],
        features: ['日轻', '翻译', '投稿'],
        proxy: false,
      },
      {
        name: '成为小说家吧',
        url: 'https://syosetu.com/',
        desc: '日本 Web 小说',
        fullDesc:
          '成为小说家吧（narou）是日本最大的 Web 小说投稿站，异世界 / 恋爱 / 奇幻 / 推理题材聚集，多部热门作品动画化（《无职转生》《Re:Zero》等）。',
        tags: ['narou', '日轻', 'Web 小说'],
        features: ['日轻', 'Web 投稿', '动画化'],
        proxy: true,
      },
      {
        name: 'カクヨム',
        url: 'https://kakuyomu.jp/',
        desc: '角川轻小说',
        fullDesc:
          'カクヨム（Kakuyomu）角川集团旗下 Web 小说平台，与成为小说家吧并称日本两大轻小说投稿站，官方编辑扶持力度大。',
        tags: ['Kakuyomu', '角川', '日轻'],
        features: ['角川', '日轻', '编辑扶持'],
        proxy: true,
      },
      {
        name: 'Royal Road',
        url: 'https://www.royalroad.com/',
        desc: '英文 Web 小说',
        fullDesc:
          'Royal Road 是英文 Web 小说与 LitRPG / 玄幻 / 奇幻投稿站，作者与读者都极活跃，原创 + 同人，是英文 ACG / 奇幻读者聚集地。',
        tags: ['Royal Road', '英文', 'LitRPG'],
        features: ['英文', 'LitRPG', 'Web 小说'],
        proxy: true,
      },
      {
        name: 'Archive of Our Own',
        url: 'https://archiveofourown.org/',
        desc: 'AO3 同人',
        fullDesc:
          'Archive of Our Own（AO3）非营利同人作品档案库，由 OTW 维护，覆盖小说 / 同人 / 漫画 / 翻译，标签系统极强，ACGN 同人读者首选。',
        tags: ['AO3', '同人', '英文'],
        features: ['同人', '标签', '翻译'],
        proxy: true,
      },
    ],
  },
  {
    id: 'anime_site_more',
    name: '番剧站点',
    icon: '📺',
    items: [
      {
        name: '巴哈姆特动画疯',
        url: 'https://ani.gamer.com.tw/',
        desc: '台湾正版番剧',
        fullDesc:
          '巴哈姆特旗下正版番剧平台动画疯（ani.gamer.com.tw），台湾 / 香港正版授权，1080P 高画质，繁体字幕，新番更新及时。',
        tags: ['动画疯', '台湾', '正版'],
        features: ['正版', '1080P', '繁体'],
        proxy: true,
      },
      {
        name: 'Disney+',
        url: 'https://www.disneyplus.com/',
        desc: '迪士尼流媒体',
        fullDesc:
          'Disney+ 迪士尼流媒体平台，漫威 / 星球大战 / 迪士尼 / 皮克斯 / 国家地理全收录，部分剧集含中文配音，海外华人常用。',
        tags: ['Disney', '漫威', '流媒体'],
        features: ['漫威', '星战', '中文'],
        proxy: true,
      },
      {
        name: 'Crunchyroll',
        url: 'https://www.crunchyroll.com/',
        desc: '全球动画流媒体',
        fullDesc:
          'Crunchyroll 全球最大动画流媒体平台，1 万+ 集正版番剧，新番同步日本播出，多语种字幕，ACGN 圈海外追番首选。',
        tags: ['CR', '正版', '海外'],
        features: ['正版', '同步', '多语言'],
        proxy: true,
      },
      {
        name: 'Funimation',
        url: 'https://www.funimation.com/',
        desc: '英文动画',
        fullDesc:
          'Funimation 英文动画流媒体平台，与 Crunchyroll 合并后专注英文市场，英文配音 / 字幕齐全，海外英文用户常用。',
        tags: ['Funimation', '英文', '配音'],
        features: ['英文', '配音', '正版'],
        proxy: true,
      },
      {
        name: 'Netflix',
        url: 'https://www.netflix.com/',
        desc: 'Netflix',
        fullDesc:
          'Netflix（网飞）全球最大流媒体平台，独家日漫 / 番剧 / 剧场版（吉卜力 / 鬼灭之刃 / 进击的巨人最终季等），原创动画质量高。',
        tags: ['Netflix', '网飞', '独占'],
        features: ['独占', '原创', '吉卜力'],
        proxy: true,
      },
      {
        name: 'HIDIVE',
        url: 'https://www.hidive.com/',
        desc: '英文动画流媒体',
        fullDesc: 'HIDIVE 英文动画流媒体平台，与 Sentai Filmworks 合作，专注英文市场，配音与字幕齐全，订阅价格亲民。',
        tags: ['HIDIVE', '英文', 'Sentai'],
        features: ['英文', '配音', '亲民'],
        proxy: true,
      },
      {
        name: 'ABEMA',
        url: 'https://abema.tv/',
        desc: '日本直播',
        fullDesc:
          'ABEMA 是日本 CyberAgent 旗下的免费流媒体平台，番剧 / 综艺 / 新闻 / 体育 / 恋爱真人秀直播，部分内容限定日本 IP。',
        tags: ['ABEMA', '日本', '直播'],
        features: ['直播', '免费', '综合'],
        proxy: true,
      },
      {
        name: 'Ani-One Asia',
        url: 'https://www.anione.asia/',
        desc: '亚洲动画 YouTube',
        fullDesc:
          'Ani-One Asia 是木棉花 / 羚邦集团运营的官方 YouTube 频道，提供大量正版动画（带英文字幕）免费观看，是东南亚 ACG 圈常用资源。',
        tags: ['Ani-One', 'YouTube', '正版'],
        features: ['免费', 'YouTube', '亚洲'],
        proxy: true,
      },
      {
        name: 'Muse Asia',
        url: 'https://www.youtube.com/@MuseAsia',
        desc: '木棉花 YouTube',
        fullDesc:
          'Muse Asia 木棉花 YouTube 官方频道，提供大量正版动画带英文字幕免费观看，覆盖新番、剧场版、亚洲地区 ACG 资源。',
        tags: ['Muse', 'YouTube', '免费'],
        features: ['YouTube', '免费', '新番'],
        proxy: true,
      },
    ],
  },
  {
    id: 'podcast_more',
    name: '播客 / 电台',
    icon: '🎙️',
    items: [
      {
        name: '小宇宙',
        url: 'https://www.xiaoyuzhoufm.com/',
        desc: '中文播客',
        fullDesc:
          '小宇宙（xiaoyuzhou）国内最受欢迎的中文播客 App，UI 设计出色，编辑精选、推荐机制、评论区氛围好，是中文播客听众首选。',
        tags: ['小宇宙', '中文', '播客'],
        features: ['中文', '精选', 'App'],
        proxy: false,
      },
      {
        name: '喜马拉雅',
        url: 'https://www.ximalaya.com/',
        desc: '音频平台',
        fullDesc:
          '喜马拉雅（ximalaya）国内最大音频平台，有声书 / 相声 / 评书 / 知识付费 / 播客 / 广播剧 / ASMR 全覆盖，资源量国内第一。',
        tags: ['喜马拉雅', '有声', '综合'],
        features: ['有声书', '综合', '免费+付费'],
        proxy: false,
      },
      {
        name: '网易云音乐',
        url: 'https://music.163.com/',
        desc: '云村播客',
        fullDesc:
          '网易云音乐（music.163.com）国内主流音乐平台，近年加大播客 / 电台 / 有声内容投入，ACG 翻唱、广播剧、电台节目丰富。',
        tags: ['网易云', '音乐', '播客'],
        features: ['音乐', '电台', '翻唱'],
        proxy: false,
      },
      {
        name: 'Apple Podcasts',
        url: 'https://podcasts.apple.com/',
        desc: '苹果播客',
        fullDesc:
          'Apple Podcasts（iTunes 播客）苹果生态官方播客 App，覆盖全球 100+ 国家、数百万档播客，订阅、推荐、章节、字幕齐全。',
        tags: ['Apple', '播客', '海外'],
        features: ['海外', '章节', '字幕'],
        proxy: true,
      },
      {
        name: 'Spotify',
        url: 'https://open.spotify.com/',
        desc: 'Spotify 播客',
        fullDesc:
          'Spotify 音乐 + 播客一站式平台，全球最大音乐流媒体，近年大力投资播客（独家 Joe Rogan、Prince 等），中文播客也在增长。',
        tags: ['Spotify', '播客', '音乐'],
        features: ['独家', '音乐', '全球'],
        proxy: true,
      },
      {
        name: '猫耳 FM',
        url: 'https://www.missevan.com/',
        desc: '二次元广播剧',
        fullDesc:
          '猫耳 FM（missevan）国内二次元广播剧 / 声优 / ASMR 平台，《魔道祖师》《全职高手》等顶级 IP 广播剧聚集地，ACGN 圈广播剧首选。',
        tags: ['猫耳', '广播剧', '二次元'],
        features: ['广播剧', '声优', 'ASMR'],
        proxy: false,
      },
      {
        name: '荔枝 FM',
        url: 'https://www.lizhi.fm/',
        desc: '荔枝播客',
        fullDesc:
          '荔枝 FM（lizhi）国内老牌播客 / 直播 / 声音社交平台，语音直播、有声书、播客、电台节目，UGC 氛围浓厚。',
        tags: ['荔枝', '播客', '直播'],
        features: ['直播', 'UGC', '老牌'],
        proxy: false,
      },
      {
        name: '蜻蜓 FM',
        url: 'https://www.qingting.fm/',
        desc: '蜻蜓播客',
        fullDesc:
          '蜻蜓 FM（qingting）国内老牌音频平台，有声书 / 评书 / 广播剧 / 相声 / 知识付费齐全，与喜马拉雅、荔枝并称三大音频平台。',
        tags: ['蜻蜓', '老牌', '有声'],
        features: ['有声', '评书', '老牌'],
        proxy: false,
      },
      {
        name: 'Pocket Casts',
        url: 'https://pocketcasts.com/',
        desc: '跨平台播客',
        fullDesc:
          'Pocket Casts 是一款跨平台（iOS / Android / Web）的高级播客 App，订阅 / 同步 / 变速 / 睡眠定时 / 智能播放列表，播客爱好者口碑之选。',
        tags: ['Pocket Casts', '跨平台', '高级'],
        features: ['跨平台', '变速', '同步'],
        proxy: true,
      },
    ],
  },
  {
    id: 'image_search',
    name: '以图搜图',
    icon: '🔍',
    items: [
      {
        name: 'SauceNAO',
        url: 'https://saucenao.com/',
        desc: '动漫反向搜图',
        fullDesc:
          'SauceNAO 是 ACG 圈最常用的反向图片搜索引擎，针对 Pixiv、Danbooru、Niconico、DeviantArt 等站点建立索引，识别准确率最高。',
        tags: ['SauceNAO', '反向搜图', 'ACG'],
        features: ['ACG 强', '来源精确', '批量'],
        proxy: false,
      },
      {
        name: 'ASCII2D',
        url: 'https://ascii2d.net/',
        desc: '二次元搜图',
        fullDesc:
          'ASCII2D 是日本 ACG 圈主流反向搜图站，专注于二次元插画识别，按 Pixiv / ニコニコ / 二次元画像 / 色彩排序，结果准确。',
        tags: ['ASCII2D', '二次元', '日本'],
        features: ['二次元', '色彩', 'Pixiv'],
        proxy: true,
      },
      {
        name: 'IQDB',
        url: 'https://www.iqdb.org/',
        desc: '多源聚合',
        fullDesc:
          'IQDB 是聚合多个图源（Danbooru / Konachan / yande.re / Gelbooru / Sankaku）的反向搜图站，无需注册，对欧美图库识别率高。',
        tags: ['IQDB', '聚合', '欧美'],
        features: ['多源', '聚合', '无注册'],
        proxy: true,
      },
      {
        name: 'Yandex Images',
        url: 'https://yandex.com/images/',
        desc: 'Yandex 搜图',
        fullDesc:
          'Yandex Images 是俄罗斯 Yandex 搜索引擎的图像搜索，以图搜图能力极强，对二次元、插画、欧美图识别率都极佳，是 Google 搜图的优秀替代。',
        tags: ['Yandex', '以图搜图', '强'],
        features: ['搜图强', '二次元', '替代 Google'],
        proxy: false,
      },
      {
        name: '3D IQDB',
        url: 'https://3d.iqdb.org/',
        desc: '3D 搜图',
        fullDesc:
          '3D IQDB 是 IQDB 的 3D 站版本，专注搜索 3D 模型（sketchfab / 3dwarehouse），对 MMD / 3D 角色识别效果好。',
        tags: ['3D', 'IQDB', '模型'],
        features: ['3D 模型', 'MMD', 'sketchfab'],
        proxy: true,
      },
      {
        name: 'Soutubot',
        url: 'https://soutubot.moe/',
        desc: '视频帧搜图',
        fullDesc:
          'Soutubot 是 ACG 视频帧反向搜图工具，上传视频或截图，自动提取关键帧到 SauceNAO / trace.moe 检索，识别动漫出处必备。',
        tags: ['Soutubot', '视频帧', '动画'],
        features: ['视频帧', '动画识别', '自动提取'],
        proxy: false,
      },
      {
        name: 'Trace.moe',
        url: 'https://trace.moe/',
        desc: '动画出处查询',
        fullDesc:
          'Trace.moe 是基于深度学习的动画截图出处查询站，上传截图自动匹配具体番剧集数 / 时间码，识别率业内领先。',
        tags: ['trace', '动画', '出处'],
        features: ['深度学习', '时间码', '高准确率'],
        proxy: true,
      },
      {
        name: '谷歌以图搜图',
        url: 'https://www.google.com/imghp',
        desc: 'Google 搜图',
        fullDesc: 'Google Images 谷歌以图搜图，全球最大综合图源，识别度综合最强，是核实图片来源、查找原图的首选。',
        tags: ['Google', '搜图', '综合'],
        features: ['综合', '来源全', '准确'],
        proxy: true,
      },
    ],
  },
  {
    id: 'storage',
    name: '网盘 / 云存储',
    icon: '💾',
    items: [
      {
        name: '阿里云盘',
        url: 'https://www.alipan.com/',
        desc: '阿里云盘',
        fullDesc:
          '阿里云盘（alipan）阿里旗下个人云盘，下载不限速、100GB+ 免费空间、视频在线播放、原画质保留，资源分享生态完善。',
        tags: ['阿里', '网盘', '不限速'],
        features: ['不限速', '原画', '分享'],
        proxy: false,
      },
      {
        name: '夸克网盘',
        url: 'https://pan.quark.cn/',
        desc: '夸克网盘',
        fullDesc: '夸克网盘是 UC / 阿里旗下网盘，深度整合夸克浏览器，下载速度、分享、二次元资源生态都不错。',
        tags: ['夸克', 'UC', '网盘'],
        features: ['不限速', '浏览器整合', '分享'],
        proxy: false,
      },
      {
        name: '百度网盘',
        url: 'https://pan.baidu.com/',
        desc: '百度网盘',
        fullDesc: '百度网盘国内最大个人云盘，资源生态最丰富，缺点是限速（会员解决），ACGN 资源分享、视频存储常用。',
        tags: ['百度', '网盘', '老牌'],
        features: ['资源多', '会员', '老牌'],
        proxy: false,
      },
      {
        name: '115 网盘',
        url: 'https://115.com/',
        desc: '115 网盘',
        fullDesc:
          '115 网盘是 ACG 圈常用网盘，磁链 / BT 离线下载、在线播放、分享码生态成熟，是动漫 / 同人 / 游戏资源高频使用工具。',
        tags: ['115', '网盘', 'ACG'],
        features: ['磁链', '离线', 'ACG'],
        proxy: false,
      },
      {
        name: 'OneDrive',
        url: 'https://onedrive.live.com/',
        desc: '微软云盘',
        fullDesc:
          'OneDrive 微软个人云盘，深度整合 Office 365、5GB 免费（订阅 1TB），跨平台同步，企业用户与海外华人常用。',
        tags: ['OneDrive', '微软', 'Office'],
        features: ['Office', '5GB', '同步'],
        proxy: true,
      },
      {
        name: 'Google Drive',
        url: 'https://drive.google.com/',
        desc: 'Google Drive',
        fullDesc:
          'Google Drive 谷歌云盘，15GB 免费、深度整合 Google 文档/表格/幻灯片，海外华人 / 留学生常用，AI 搜索能力增强。',
        tags: ['GDrive', 'Google', '15GB'],
        features: ['15GB', '文档', 'AI'],
        proxy: true,
      },
      {
        name: 'Dropbox',
        url: 'https://www.dropbox.com/',
        desc: 'Dropbox',
        fullDesc:
          'Dropbox 老牌云存储，文件同步 / 协作 / 第三方集成生态完善，2GB 免费，是海外创业团队、设计公司高频工具。',
        tags: ['Dropbox', '同步', '海外'],
        features: ['同步', '协作', '集成'],
        proxy: true,
      },
      {
        name: 'MEGA',
        url: 'https://mega.nz/',
        desc: 'MEGA',
        fullDesc: 'MEGA 端到端加密云存储，20GB 免费、注重隐私、大文件分享友好，是海外文件分享高频工具。',
        tags: ['MEGA', '加密', '分享'],
        features: ['端到端加密', '20GB', '大文件'],
        proxy: true,
      },
    ],
  },
  {
    id: 'photo',
    name: '摄影 / 作品集',
    icon: '📷',
    items: [
      {
        name: '500px',
        url: 'https://500px.com/',
        desc: '摄影社区',
        fullDesc:
          '500px 是全球知名摄影作品分享社区，摄影师上传作品、按主题分类、社区打分（Pulse），是摄影爱好者作品集和商业接单平台。',
        tags: ['500px', '摄影', '社区'],
        features: ['作品集', '评分', '商业'],
        proxy: true,
      },
      {
        name: '图虫',
        url: 'https://tuchong.com/',
        desc: '国内摄影社区',
        fullDesc: '图虫（tuchong）字节跳动旗下摄影社区，国内摄影师作品集、活动、比赛、接单平台，器材评测与教程齐全。',
        tags: ['图虫', '摄影', '字节'],
        features: ['社区', '比赛', '接单'],
        proxy: false,
      },
      {
        name: 'Lofter',
        url: 'https://www.lofter.com/',
        desc: '兴趣创作',
        fullDesc:
          'Lofter 网易旗下兴趣创作社区，摄影 / 二次元 / 同人 / 写作 / 设计四大领域，标签 / 关注流 / 推荐机制成熟，年轻创作者聚集。',
        tags: ['Lofter', '网易', '兴趣'],
        features: ['兴趣', '社区', '推荐'],
        proxy: false,
      },
      {
        name: 'Behance',
        url: 'https://www.behance.net/',
        desc: '设计作品集',
        fullDesc:
          'Behance Adobe 旗下创意作品集平台，全球设计师 / 摄影师 / 插画师 / 动态设计师发布作品、招聘 / 接单，是国际作品集标配。',
        tags: ['Behance', 'Adobe', '作品集'],
        features: ['作品集', '招聘', '全球'],
        proxy: true,
      },
      {
        name: 'Dribbble',
        url: 'https://dribbble.com/',
        desc: '设计灵感',
        fullDesc:
          'Dribbble 设计师作品灵感社区，UI / 插画 / 动效 / 品牌 / 图标短片为主，是设计师日常灵感来源与作品集展示。',
        tags: ['Dribbble', '设计', '灵感'],
        features: ['灵感', '招聘', '短片'],
        proxy: true,
      },
      {
        name: 'Pinterest',
        url: 'https://www.pinterest.com/',
        desc: '灵感图钉',
        fullDesc:
          'Pinterest 全球最大灵感图钉网站，插画 / 设计 / 摄影 / 美食 / 家居 / 二次元 / cosplay 灵感收藏，ACGN 创作者必备。',
        tags: ['Pinterest', '灵感', '收藏'],
        features: ['灵感', '图钉', '推荐'],
        proxy: true,
      },
      {
        name: 'CNU 视觉联盟',
        url: 'https://www.cnu.cc/',
        desc: '视觉中国',
        fullDesc: 'CNU 视觉联盟（cnu.cc）国内设计 / 摄影 / 插画灵感社区，汇集优秀作品与原创作者，分类齐全、每日更新。',
        tags: ['CNU', '视觉', '国内'],
        features: ['灵感', '国内', '原创'],
        proxy: false,
      },
      {
        name: 'Pixivic',
        url: 'https://pixivic.com/',
        desc: 'Pixiv 镜像',
        fullDesc:
          'Pixivic 是 Pixiv 的国内镜像，提供按关键词 / 画师 / 排行榜检索、收藏、下载，UI 现代化，是不翻墙用 Pixiv 的优秀替代。',
        tags: ['Pixivic', '镜像', '国内'],
        features: ['镜像', '国内', 'Pixiv'],
        proxy: false,
      },
    ],
  },
  {
    id: 'game_more',
    name: '游戏 / Steam',
    icon: '🎮',
    items: [
      {
        name: 'Steam',
        url: 'https://store.steampowered.com/',
        desc: 'Steam 商店',
        fullDesc: 'Steam Valve 旗下全球最大 PC 游戏商店与社区，覆盖 3A / 独立 / 模拟器 / MOD / DLC，国内玩家主力平台。',
        tags: ['Steam', 'PC', '游戏'],
        features: ['3A', '独立', 'MOD'],
        proxy: true,
      },
      {
        name: 'SteamDB',
        url: 'https://steamdb.info/',
        desc: 'Steam 数据',
        fullDesc:
          'SteamDB 是 Steam 公开数据的第三方聚合站，价格历史、在线人数、版本更新、API 透明查询，是 Steam 玩家与开发者的必备工具。',
        tags: ['SteamDB', '数据', '工具'],
        features: ['价格历史', '在线人数', '版本'],
        proxy: true,
      },
      {
        name: 'Epic Games',
        url: 'https://store.epicgames.com/',
        desc: 'Epic 商城',
        fullDesc:
          'Epic Games Store 是 Epic 旗下 PC 游戏商城，每周送 1-2 款游戏、独占作品、虚幻引擎生态完善，与 Steam 竞争激烈。',
        tags: ['Epic', '免费', '独占'],
        features: ['每周送', '独占', '虚幻'],
        proxy: true,
      },
      {
        name: 'GOG',
        url: 'https://www.gog.com/',
        desc: 'GOG 商城',
        fullDesc:
          'GOG（Good Old Games）CD Projekt 旗下 PC 游戏商城，专注重制经典老游戏 + 无 DRM 现代游戏，是怀旧与独立游戏玩家的首选。',
        tags: ['GOG', '老游戏', '无 DRM'],
        features: ['无 DRM', '重制', '经典'],
        proxy: true,
      },
      {
        name: 'itch.io',
        url: 'https://itch.io/',
        desc: '独立游戏',
        fullDesc:
          'itch.io 全球最大独立游戏平台，独立开发者上传作品（部分免费 / pay-what-you-want），游戏 jam、工具、艺术作品聚集。',
        tags: ['itch', '独立', '免费'],
        features: ['独立', 'pay-what-you-want', '游戏 Jam'],
        proxy: true,
      },
      {
        name: 'IGN',
        url: 'https://www.ign.com/',
        desc: 'IGN 游戏媒体',
        fullDesc:
          'IGN 是全球最大游戏媒体之一，评测、攻略、资讯、视频、播客齐全，覆盖主机、PC、手游、动漫、电影，是综合游戏新闻源。',
        tags: ['IGN', '游戏', '评测'],
        features: ['评测', '攻略', '视频'],
        proxy: true,
      },
      {
        name: '游民星空',
        url: 'https://www.gamersky.com/',
        desc: '国内游戏门户',
        fullDesc:
          '游民星空（gamersky）国内主流游戏门户，PC / 主机 / 手游新闻、攻略、评测、专区齐全，是国内单机游戏玩家高频访问站。',
        tags: ['游民星空', '门户', 'PC'],
        features: ['新闻', '攻略', '专区'],
        proxy: false,
      },
      {
        name: '3DMGame',
        url: 'https://www.3dmgame.com/',
        desc: '3DM 游戏',
        fullDesc: '3DMGame 是国内老牌游戏资讯 + 单机游戏下载站，覆盖新闻、攻略、MOD、补丁、下载，但需注意正版化趋势。',
        tags: ['3DM', '老牌', '下载'],
        features: ['老牌', 'MOD', '下载'],
        proxy: false,
      },
      {
        name: '小霸王',
        url: 'https://www.yikm.net/',
        desc: '在线红白机',
        fullDesc:
          '小霸王其乐无穷（yikm.net）是怀旧游戏在线模拟器站，FC / SFC / MD / GBA / N64 等经典主机游戏在线玩，童年回忆必备。',
        tags: ['小霸王', '怀旧', 'FC'],
        features: ['在线玩', '怀旧', '多主机'],
        proxy: false,
      },
    ],
  },
]

// 转为对象字面量字符串
function serializeItem(item, indent) {
  const lines = []
  lines.push(`${indent}{`)
  lines.push(`${indent}  name: ${JSON.stringify(item.name)},`)
  lines.push(`${indent}  url: ${JSON.stringify(item.url)},`)
  lines.push(`${indent}  desc: ${JSON.stringify(item.desc)},`)
  if (item.fullDesc) lines.push(`${indent}  fullDesc: ${JSON.stringify(item.fullDesc)},`)
  if (item.tags) lines.push(`${indent}  tags: ${JSON.stringify(item.tags)},`)
  if (item.features) lines.push(`${indent}  features: ${JSON.stringify(item.features)},`)
  if (item.mirrors) lines.push(`${indent}  mirrors: ${JSON.stringify(item.mirrors)},`)
  lines.push(`${indent}  proxy: ${item.proxy},`)
  lines.push(`${indent}}`)
  return lines.join('\n')
}

function serializeCategory(cat) {
  const lines = []
  lines.push('  {')
  lines.push(`    id: ${JSON.stringify(cat.id)},`)
  lines.push(`    name: ${JSON.stringify(cat.name)},`)
  lines.push(`    icon: ${JSON.stringify(cat.icon)},`)
  lines.push('    items: [')
  cat.items.forEach((it, i) => {
    lines.push(serializeItem(it, '      '))
    if (i < cat.items.length - 1) lines[lines.length - 1] = lines[lines.length - 1] + ','
  })
  lines.push('    ],')
  lines.push('  }')
  return lines.join('\n')
}

const block = newCategories.map(serializeCategory).join(',\n')

let src = await fs.readFile(FILE, 'utf8')
// 在 extensionCategories 闭合 `]` 之前插入：在 1642 `  },` 之后
const insertAt = '  },\n]\n\n/** 对现有分类的补充条目 */\nexport const extensionItems'
if (!src.includes(insertAt)) {
  throw new Error('插入点未找到')
}
src = src.replace(insertAt, '  },\n' + block + ',\n]\n\n/** 对现有分类的补充条目 */\nexport const extensionItems')
await fs.writeFile(FILE, src)

// 写入后语法校验：site-extensions.js 是 ESM 模块（含 import/export），不能用 new Function 校验，
// 改用 `node --check` 子进程校验语法正确性，写入失败立即抛错避免产出损坏文件
try {
  execFileSync(process.execPath, ['--check', FILE], { stdio: 'pipe' })
} catch (e) {
  const detail = e.stderr ? e.stderr.toString().trim() : e.message
  throw new Error('写入后语法校验失败: ' + detail, { cause: e })
}

console.log(
  `✓ 已追加 ${newCategories.length} 个分类，共 ${newCategories.reduce((n, c) => n + c.items.length, 0)} 条新条目`
)
