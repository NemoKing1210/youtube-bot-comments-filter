# YouTube Bot Comments Filter

[English](README.md) · [Русский](README.ru.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português (Brasil)](README.pt.md) · **中文（简体）** · [日本語](README.ja.md) · [العربية](README.ar.md) · [हिन्दी](README.hi.md)

> 本文档为翻译版本。以[英文 README](README.md)为准；如有出入，请以英文版为准。

[![CI](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml/badge.svg)](https://github.com/NemoKing1210/youtube-bot-comments-filter/actions/workflows/ci.yml)
[![安装用户脚本](https://img.shields.io/badge/Install-userscript-ff0000?style=for-the-badge)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)
[![许可证：MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![版本](https://img.shields.io/badge/version-1.3.0-green?style=for-the-badge)](CHANGELOG.md)

一个 YouTube 用户脚本，通过昵称模式识别垃圾机器人评论，并将其隐藏或模糊。设置位于 YouTube 账号（头像）菜单中：打开 **机器人过滤器**，选择 **隐藏** 或 **模糊**。

兼容 [Tampermonkey](https://www.tampermonkey.net/)、[Violentmonkey](https://violentmonkey.github.io/)、[Greasemonkey](https://www.greasespot.net/)、[ScriptCat](https://scriptcat.org/)，以及支持 `// ==UserScript==` 元数据块的其他管理器。

## 快速安装

1. 安装用户脚本管理器（推荐 Tampermonkey 或 Violentmonkey）。
2. 点击下方安装链接——管理器应弹出安装提示。

**安装 URL：**

```
https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js
```

[![安装](https://img.shields.io/badge/⬇_Install-YouTube_Bot_Comments_Filter-0f0f0f?style=for-the-badge&labelColor=ff0000)](https://raw.githubusercontent.com/NemoKing1210/youtube-bot-comments-filter/main/youtube-bot-comments-filter.user.js)

### 从 URL 安装（面板）

| 管理器 | 路径 |
|--------|------|
| Tampermonkey | 面板 → **Utilities** → **Install from URL** |
| Violentmonkey | 面板 → **+** → **Install from URL** |
| Greasemonkey | 附加组件菜单 → **New User Script** → 粘贴 raw URL |
| ScriptCat | 安装[扩展](https://scriptcat.org/)，使用 GitHub raw URL |

粘贴上方的[安装 URL](#快速安装)。

### 手动安装

1. 在仓库中打开构建好的 [`youtube-bot-comments-filter.user.js`](youtube-bot-comments-filter.user.js)（或克隆后运行 `npm run build`）。
2. 复制文件全部内容。
3. 在用户脚本管理器中新建脚本并粘贴代码。
4. 保存并启用脚本。

## 更新

脚本包含指向 GitHub raw 文件的 `@updateURL` 和 `@downloadURL` 元数据。受支持的管理器会自动检查更新。

**发布新版本：**

1. 修改 [`package.json`](package.json) 中的 `version`。
2. 运行 `npm run build`（重新生成根目录的 `youtube-bot-comments-filter.user.js` / `.meta.js`）。
3. 在 [`CHANGELOG.md`](CHANGELOG.md) 中添加条目。
4. 推送到 `main`（或创建 GitHub Release）。

## 功能

- **按昵称识别机器人** —— 加权规则引擎对评论者的显示名称评分（例如 `@SAWS.PW__TyT_Ha_CauT_05`）
- **隐藏模式** —— 机器人评论正文替换为本地化提示
- **模糊模式** —— 机器人评论保留在原位，但被模糊和变暗；悬停即可查看
- **账号菜单设置** —— 头像菜单中的入口，提供隐藏/模糊选项和“机器人百分比”徽章开关
- **置信度徽章** —— 估计机器人概率高于 50% 时显示（琥珀色 / 橙色 / 红色）；可在设置中关闭
- **偏好持久化** —— 所选模式在会话之间保存
- **YouTube 风格** —— 使用 YouTube CSS 变量，兼容浅色和深色主题
- **10 种界面语言** —— 英语、俄语、西班牙语、法语、德语、葡萄牙语、中文、日语、阿拉伯语、印地语（根据浏览器语言检测）

## 支持的页面

| 网站 | URL 模式 |
|------|----------|
| YouTube | `https://www.youtube.com/*` |

适用于观看页、带评论的 Shorts，以及任何渲染标准评论区（`ytd-comment-view-model` / `ytd-comment-renderer`）的 YouTube 视图。

## 显示模式

| 模式 | 行为 |
|------|------|
| **隐藏**（默认） | 评论正文替换为简短提示；布局保持稳定 |
| **模糊** | 机器人评论显示为模糊、灰度和半透明；悬停时显示完整内容 |

打开头像菜单 → **机器人过滤器** → 选择模式。菜单项下方的副标题显示当前模式。

## 工作原理

```
YouTube 页面加载
       │
       ▼
MutationObserver + 定期重新扫描（兼容 SPA）
       │
       ▼
头像菜单打开时添加设置入口
       │
       ▼
对每条新评论（ytd-comment-view-model / ytd-comment-renderer）
       │
       ▼
读取作者的显示名称（#author-text）
       │
       ▼
运行 BotDetector 规则 → 累加权重
       │
       ├── score < 阈值 ──► 评论保持不变
       │
       └── score ≥ 阈值 ──► 应用隐藏提示或模糊
```

### 机器人识别

识别基于评论者的**显示名称**，而不是评论正文。每条规则包含名称、权重和 `test(name)` 函数。总分为所有匹配规则的权重之和。若总分 **≥ 4**（默认阈值），评论即被标记为机器人。

内置信号：

| 信号 | 权重 | 示例 |
|------|------|------|
| 带垃圾 TLD 的类域名前缀 | 3 | `@SAWS.PW__...`、`@TLES.TOP-...` |
| TLD 后紧跟分隔符 | 2 | `.PW__`、`.TOP-` |
| 音译垃圾关键词 | 3 | `tyt_ha`、`na_caut`、`smotri`、`4ki_na` |
| 大量下划线 | 1 | 名称中有三个或更多 `_` |
| 单词中的 leetspeak 数字 | 1 | `Sy4ki`、`CauT0` |
| 带点的大写前缀 | 1 | `@SAWS.PW` |
| 精确匹配列表 | 100 | `SAWS.PW`、`TLES.TOP` |

检查的垃圾 TLD：`PW`、`TOP`、`XYZ`、`ONLINE`、`SITE`、`CLUB`、`WIN`、`CC`、`ICU`、`VIP` 等常用于机器人昵称的域名后缀。

要扩展识别范围，请编辑 [`src/constants.js`](src/constants.js) 中的 `EXACT_MATCHES` / `SPAM_TLDS`，或向 [`src/detection/bot-detector.js`](src/detection/bot-detector.js) 中的 `RULES` 添加新对象。

### 动态内容

YouTube 异步加载评论（无限滚动、回复、无刷新导航）。`document.documentElement` 上的 `MutationObserver` 通过 `requestAnimationFrame` 调度防抖处理。2 秒的安全定时器会捕获遗漏的 DOM 变更。

## 仓库结构

```text
youtube-bot-comments-filter/
├── src/                                      # 源代码（在此编辑）
│   ├── main.js
│   ├── constants.js
│   ├── settings.js
│   ├── i18n/
│   ├── detection/
│   ├── styles/
│   └── features/
├── scripts/                                  # 构建辅助脚本
├── youtube-bot-comments-filter.user.js       # 构建好的可安装用户脚本
├── youtube-bot-comments-filter.meta.js       # 构建好的纯元数据镜像
├── package.json
├── vite.config.js
├── README.md
├── README.<lang>.md                          # 翻译（ru、es、fr、de、pt、zh、ja、ar、hi）
├── CHANGELOG.md
├── CONTRIBUTING.md                           # 本地设置、约定、PR 检查清单
├── SECURITY.md                               # 漏洞报告政策
└── LICENSE
```

| 文件 | 用途 |
|------|------|
| `src/` | 可编辑的源代码模块 |
| `youtube-bot-comments-filter.user.js` | 通过 `@downloadURL` / `@updateURL` 提供的构建脚本 |
| `youtube-bot-comments-filter.meta.js` | 用于更新检查的轻量元数据镜像 |
| `vite.config.js` | 用户脚本元数据 + Vite / monkey 配置 |

## 脚本元数据

`// ==UserScript==` 的关键字段（由 `vite.config.js` + `package.json` 生成）：

| 字段 | 值 |
|------|-----|
| `@namespace` | `https://github.com/NemoKing1210/youtube-bot-comments-filter` |
| `@version` | 来自 `package.json` |
| `@updateURL` / `@downloadURL` | `youtube-bot-comments-filter.user.js` 的 GitHub raw URL |
| `@homepageURL` | 本仓库 |
| `@supportURL` | GitHub Issues |
| `@license` | MIT |
| `@grant` | `GM_getValue`、`GM_setValue` |
| `@match` | `https://www.youtube.com/*` |

为 en、ru、es、fr、de、pt-BR、zh-CN、ja、ar 和 hi 提供本地化的 `@name` 和 `@description` 标签。

## 所需权限

| 权限 | 用途 |
|------|------|
| `GM_getValue` / `GM_setValue` | 在会话之间保存隐藏/模糊模式 |
| `GM_addStyle` | 注入过滤器和菜单 CSS（由 Vite 构建自动授予） |

不发起任何网络请求。脚本只读取 DOM 并应用 CSS 类。

## 开发

需要 [Node.js](https://nodejs.org/) 20+（npm）。

```bash
npm install
npm run dev      # Vite 开发服务器——打开/安装生成的 "dev:" 用户脚本
npm run build    # 生产构建 → dist/ + 复制到仓库根目录
npm run ci       # 与 GitHub Actions 相同的检查（构建 + 验证构建产物）
```

编辑 [`src/`](src/) 下的文件（入口：[`src/main.js`](src/main.js)）。用户脚本元数据（`@match`、本地化名称等）位于 [`vite.config.js`](vite.config.js)。版本来自 `package.json` → 头部的 `@version` 和脚本内的 `SCRIPT_VERSION`。

对于需要发布的更改，运行 `npm run build` 并提交重新生成的根目录 `.user.js` / `.meta.js`。Pull Request 会运行 [CI](.github/workflows/ci.yml)，如果这些文件过期就会失败。

### 本地工作流说明

- **`npm run dev`：** vite-plugin-monkey 提供可安装的用户脚本（名称带 `dev:` 前缀）。在 Tampermonkey、Violentmonkey 或 ScriptCat 中安装一次；服务器运行时 HMR 会应用更改。
- **构建文件：** 运行 `npm run build` 后，也可以安装根目录的 `youtube-bot-comments-filter.user.js`（Violentmonkey 的 **Track local file** 仍然可用）。
- 不要提交带有 localhost 值的 `@updateURL` / `@downloadURL`。

### 配置

| 常量 | 默认值 | 位置 | 说明 |
|------|--------|------|------|
| `STORAGE_KEY_MODE` | `ytbf_mode` | `src/constants.js` | 显示模式的存储键 |
| `DEFAULT_MODE` | `hide` | `src/constants.js` | 未保存偏好时的初始模式 |
| `STORAGE_KEY_SHOW_SCORE` | `ytbf_show_score` | `src/constants.js` | “机器人百分比”徽章可见性的存储键 |
| `DEFAULT_SHOW_SCORE` | `false` | `src/constants.js` | 默认显示置信度徽章 |
| `THRESHOLD` | 4 | `src/constants.js` | 标记评论为机器人的最低分数 |
| `EXACT_MATCHES` | `SAWS.PW`、… | `src/constants.js` | 立即标记昵称的子串 |
| `SAFETY_RESCAN_MS` | 2000 | `src/constants.js` | 遗漏 DOM 变更时的备用定时器 |

## 参与贡献

欢迎贡献。本地设置、代码约定和 Pull Request 检查清单请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)。

报告安全问题请遵循 [SECURITY.md](SECURITY.md)——请勿公开提交 issue。

## 免责声明

本项目**与 Google 或 YouTube 无关**。机器人识别基于启发式规则——一些正常昵称可能被标记，一些机器人也可能漏过。请将其视为便捷过滤器，而非评论质量的保证。

## 许可证

[MIT](LICENSE) — Copyright (c) 2026 NemoKing
