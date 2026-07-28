---
title: 附录：网站搭建与部署
description: 从本地预览、GitHub 推送到 Cloudflare Pages 部署的操作清单。
sidebar:
  label: 附录：部署指南
---

# 网站搭建与部署

操作检查清单。以后忘了怎么更新网站，回来看这里。

## 本地写作流程

### 1. 启动预览

在项目根目录运行：

```bash
npm run dev
```

打开终端提示里的地址，通常是：

```text
http://localhost:4321
```

### 2. 新建章节

所有正式网页文章都放在：

```text
src/content/docs/
```

建议按部建目录，例如：

```text
src/content/docs/<部目录>/<slug>.mdx
```

图片、截图和 GIF 放在：

```text
src/assets/images/
```

### 3. 更新侧边栏

侧栏使用 `autogenerate`，新增章节自动出现。**不需要回 `astro.config.mjs` 改任何东西**，只需在新文件 frontmatter 里写 `sidebar.order` 控制排序：

```mdx
---
title: 5. AI 是你的创作搭档
sidebar:
  order: 5
---
```

### 4. 提交并推送

```bash
git add .
git commit -m "docs: 新增章节内容"
git push
```

推送后，Cloudflare Pages 会自动重新构建并更新网站。

## Cloudflare Pages 部署设置

进入 Cloudflare Pages 后选择连接 Git 仓库，核心设置如下：

| 项目 | 填写 |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | 留空，使用仓库根目录 |
| Production branch | `main` |

部署成功后，站点地址：

```text
https://your-book.pages.dev
```

## 避坑提醒

- `node_modules/`、`dist/` 不要提交到仓库。
- 超大素材（大 GIF、压缩包等）不要直接塞进仓库，放到 GitHub Releases 再在文章里贴下载链接。
- 涉及具体工具/平台的技术章节写完后，尽量标注当时使用的版本号，方便日后判断内容是否过期。
