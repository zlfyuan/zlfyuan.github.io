# 橘子的皮 · 个人主页

[zlfyuan](https://github.com/zlfyuan) 的个人主页，使用 [Astro](https://astro.build) 构建，托管在 GitHub Pages。

🌐 **在线访问**：https://zlfyuan.github.io

## ✨ 技术栈

- **Astro 6** — 静态站点生成器
- **Tailwind CSS 4** — CSS-first `@theme` 配置
- **Astro i18n** — 中文（默认）+ 英文 UI 双语
- **Content Collections** — 博客 / 项目 / 页面内容集合
- **Giscus** — 基于 GitHub Discussions 的评论系统
- **Pagefind** — 构建时全文搜索
- **GitHub Actions** — 自动化构建与部署

## ✨ 特性

- 🍎 **Apple 风极简设计** — 大量留白、大圆角、玻璃态 Header
- 🌓 **三态主题** — 浅色 / 深色 / 跟随系统，无白闪切换
- 🌍 **中英双语** — UI 完整翻译，文章主体保留中文
- 🔍 **全文搜索** — Pagefind 零运行时客户端
- 💬 **Giscus 评论** — 留言板 + 文章底部
- 📡 **RSS 订阅** — `/rss.xml`
- 🗺 **自动 Sitemap** — `@astrojs/sitemap`
- ⚡ **视图过渡** — 整站 SPA 感页面切换
- 🏷 **标签 + 归档** — 完整的内容索引
- 🔗 **旧 URL 兼容** — 8 个老 Hexo 链接自动跳转

## 🛠️ 命令速查

| 命令 | 作用 |
| :-- | :-- |
| `npm install` | 安装依赖 |
| `npm run dev` | 启动开发服务器（`http://localhost:4321`） |
| `npm run build` | 构建生产版本到 `./dist/`（含 Pagefind 索引 + 旧 URL 重定向） |
| `npm run preview` | 本地预览构建产物 |
| `npm run check` | TypeScript 类型检查 |
| `npm run migrate` | 从 `/tmp/legacy-articles/` 重新迁移老 Hexo 旧文章 |
| `npm run redirects` | 重新生成 8 个旧 URL 的静态重定向文件 |
| `node scripts/generate-legacy-redirects.mjs` | 同上 |

## 📁 目录结构

```
zlfyuan.github.io/
├── astro.config.mjs                  # Astro 配置：i18n + MDX + Sitemap + Tailwind
├── tsconfig.json                     # TypeScript strict + 路径别名 ~/*
├── package.json                      # 脚本和依赖
├── .github/workflows/deploy.yml      # GitHub Actions 部署流水线
├── scripts/
│   ├── migrate-html.mjs              # HTML → MD 迁移（Turndown + 自定义规则）
│   └── generate-legacy-redirects.mjs # 旧 URL 静态重定向生成器
├── public/
│   ├── favicon.svg                   # 自定义 🍊 favicon
│   ├── apple-touch-icon.png
│   └── img/avatar.png                # 头像
└── src/
    ├── content.config.ts             # blog / projects / pages Zod schema
    ├── styles/global.css             # Tailwind 4 @theme tokens（Apple 风调色板）
    ├── i18n/                         # 翻译字典 + helpers
    │   ├── ui.zh-CN.json
    │   ├── ui.en.json
    │   └── index.ts                  # getLocaleFromUrl / localizedPath / ui()
    ├── data/                         # 站点元数据
    │   ├── site.ts                   # 标题、ICP、社交链接
    │   └── nav.ts
    ├── content/
    │   ├── blog/zh-cn/               # 9 篇 Markdown 博客文章
    │   ├── projects/                 # 项目卡片
    │   └── pages/about.md
    ├── layouts/
    │   ├── BaseLayout.astro          # 根布局：HTML 壳、SEO、Header/Footer
    │   └── PostLayout.astro          # 文章详情布局：TOC、Meta、上下篇
    ├── components/
    │   ├── header/                   # Header / Nav / LangSwitch
    │   ├── footer/                   # Footer / Beian（ICP 备案）
    │   ├── post/                     # PostCard / PostMeta / TOC / PostNav
    │   ├── theme/ThemeToggle.astro   # 3 态主题切换（系统/浅/深）
    │   ├── comments/Giscus.astro     # GitHub Discussions 评论
    │   └── seo/SEO.astro             # OG / Twitter / canonical
    ├── pages/
    │   ├── index.astro               # 根路径 → /zh-CN/ 重定向
    │   ├── 404.astro
    │   ├── rss.xml.ts                # RSS 订阅源
    │   ├── robots.txt.ts
    │   └── [lang]/                   # 本地化路由
    │       ├── index.astro           # 首页
    │       ├── blog/
    │       │   ├── index.astro       # 博客列表
    │       │   └── [year]/[month]/[day]/[slug].astro  # 文章详情（URL 兼容 Hexo）
    │       ├── archives.astro        # 归档时间线
    │       ├── tags/
    │       │   ├── index.astro       # 标签云
    │       │   └── [tag].astro       # 单标签页
    │       ├── projects.astro
    │       ├── about.astro
    │       ├── guestbook.astro       # Giscus 留言板
    │       └── search.astro          # Pagefind 搜索
    └── lib/format-date.ts            # 国际化日期 + 字数统计
```

## 📝 写一篇新文章

1. 在 `src/content/blog/zh-cn/` 新建 `<slug>.md`：

```markdown
---
title: "你的文章标题"
date: 2026-06-15
lang: zh-CN
originalSlug: "your-slug"     # 出现在 URL 里，建议英文短横线
description: "一句话简介"
tags: [tag1, tag2]
draft: false
---

正文内容，支持 Markdown 全部标准语法 + 代码块（自动高亮）。
```

2. `npm run build` 会自动生成：
   - 文章详情页：`/zh-CN/blog/YYYY/MM/DD/<originalSlug>/`
   - 博客列表 / 归档 / 标签页自动收录
   - Pagefind 索引自动更新

## 🚢 部署

推送到 `master` 分支即可自动部署：

```bash
git add -A
git commit -m "feat: 新增一篇博客"
git push origin master
```

GitHub Actions 会自动：

1. 安装依赖
2. `npm run build`（构建 + 旧 URL 重定向 + Pagefind 索引）
3. 部署 `dist/` 到 GitHub Pages

详见 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)。

## 🔧 进阶配置

### 启用 Giscus 评论

1. 在 https://giscus.app/ 配置（需要 GitHub 仓库启用 Discussions）
2. 拿到 `data-repo-id` 和 `data-category-id`
3. 在仓库根创建 `.env`：

```bash
PUBLIC_GISCUS_REPO_ID=R_你的ID
PUBLIC_GISCUS_CATEGORY_ID=DIC_你的ID
```

### 自定义域名

1. 在 `astro.config.mjs` 改 `site` 字段
2. 在 `public/` 下放 `CNAME` 文件

### 修改主题色

所有颜色 token 在 [`src/styles/global.css`](src/styles/global.css) 的 `@theme` 块（使用 oklch 色彩空间）。

## 📜 备案

本站已备案：[**赣ICP备2023012875号**](https://beian.miit.gov.cn/)

## 📜 许可证

[MIT](LICENSE)
