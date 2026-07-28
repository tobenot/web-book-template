# Web Book Template

一个 Astro + Starlight 的网页书模板：复制整个项目目录，改几处占位信息，就能开始写一本新书并发布成网站。

## 快速开始

1. 复制这个项目目录到新位置，作为新书的仓库。
2. 按下表改占位信息（这份清单也是给 AI 用的：把整个项目丢给 AI，让它照着这张表逐项改掉就行）：

   | 文件 | 字段 | 必改 | 说明 |
   |---|---|---|---|
   | `astro.config.mjs` | `bookTitle` | 必改 | 书名，显示在侧栏/标题/OG |
   | `astro.config.mjs` | `bookDescription` | 必改 | 一两句话简介，写进 meta description |
   | `astro.config.mjs` | `siteUrl` | 必改 | 部署后的域名，sitemap/canonical 用 |
   | `astro.config.mjs` | `editLink.baseUrl` | 必改 | 你的 GitHub 仓库地址 + `/edit/main/`，"改文档"按钮用 |
   | `src/overrides/Head.astro` | `bookTitle` / `author` | 必改 | `bookTitle` 和上面保持一致；`author` 填名字/链接 |
   | `src/overrides/Footer.astro` | `repoBase` | 必改 | 你的 GitHub 仓库地址（不带 `/edit/main/`），"提 Issue"按钮用 |
   | `scripts/build-og.mjs` | `SITE_FOOTER` / `BOOK_NAME` / `HOME_TITLE_LINES` / `HOME_BADGES` | 必改 | 分享卡上出现的文字 |
   | `src/pages/rss.xml.js` | `title` / `description` | 必改 | RSS 订阅源标题/简介 |
   | `public/manifest.webmanifest` | `name` / `short_name` / `description` | 必改 | 手机"添加到主屏幕"用的信息，和 bookTitle/bookDescription 保持一致 |
   | `src/content/docs/index.mdx` / `preface.mdx` / `about.mdx` | 正文 | 必改 | 首页/前言/关于页的占位正文 |
   | `package.json` | `name` | 可选 | 包名，不影响运行 |

   `favicon.svg` 和 `robots.txt` 已经内置默认值（robots.txt 是按 `siteUrl` 动态生成的，改 `astro.config.mjs` 一处就同步），favicon 想换成自己的图标直接替换 `public/favicon.svg`。

   注意 `editLink.baseUrl` 和 `repoBase` 是同一个仓库地址，出现两处；部署按钮（见「部署」一节）用的也是这个地址。

3. 安装依赖并本地预览：

```bash
npm install
npm run dev
```

预览地址：`http://localhost:4321`

4. 在 `src/content/docs/<部目录>/` 下新增章节 `.mdx` 文件，侧栏会自动生成；新增一「部」时去 `astro.config.mjs` 的 `sidebar` 加一个 `autogenerate` 条目。写章的速查表见 [`design/rules/writing-cheatsheet.md`](./design/rules/writing-cheatsheet.md)（该目录不入 git，仅本地保留）。

## 这个模板长什么样

- **Astro + Starlight**：文档站框架，侧栏 / 搜索 / 深浅主题都是内置的。
- **章节元数据**：`difficulty`（难度）/ `estimatedMinutes`（预计阅读时间）/ `chapterType`（章节类型）等 frontmatter 字段，配套渲染成标题下方的徽章，定义在 `src/content.config.ts`。
- **per-page OG 分享卡**：`scripts/build-og.mjs` 在构建前按每篇文章的标题自动生成社交分享图。
- **章节引用工具**：写作过程中插章、拆章、合并章节时，`第 N 章` 这类引用全书都要跟着变。见下方「章节引用规则」。
- **反馈条 + JSON-LD + 面包屑**：`src/overrides/` 下的组件覆盖，给每页加了「提个 Issue / 改文档」入口和搜索引擎结构化数据。

更完整的功能说明见 [`STARLIGHT-FEATURES.md`](./STARLIGHT-FEATURES.md)。

## 章节引用规则（写作公约）

章号是最容易腐烂的引用之一：插一章、拆一章、合一章，全书的「第 N 章」就会集体过期。为了把成本压到最低：

1. **frontmatter `title` 是唯一真源**：每篇 mdx 只在 `title:` 里写「N. 章名」，其他地方只引用，不复述。
2. **散文里能不写章号就不写**：与其写「第 11 章会讲 X」，不如写「[后面会有一章专门讲 X](slug)」——slug 不会因为插章而变，章号会。
3. **必须写章号时**：优先用 markdown 链接 `[第 11 章 ...](slug)` 或 `<LinkCard title="11. ..." href="slug" />`，工具能自动同步。

配套工具：

```bash
npm run check:chapters              # 体检：扫一遍有没有 stale / 漂移 / 冲突的章号引用
npm run fix:chapters                # 自动同步可识别的链接 / LinkCard
npm run shift:chapters -- --from 5 --by +1            # 整体顺移：预览
npm run shift:chapters -- --from 5 --by +1 --write    # 整体顺移：写入
```

`npm run build` 默认会跑 `check:chapters:strict`，章号腐烂会直接挡住构建。

## 目录结构

```text
src/content/docs/      正式发布到网站的章节（.md / .mdx）
src/overrides/         Starlight 组件覆盖（Head / SiteTitle / PageTitle / Footer）
src/components/        自定义 Astro 组件（字数统计、封面海报等）
src/pages/             非文档页（rss.xml / 404）
src/styles/            自定义样式
src/assets/            配图、封面海报等素材
public/                静态资源（favicon.svg / manifest.webmanifest 已带默认值，OG 图按需补充）
scripts/               构建与维护脚本（OG 图生成 / 章号检查 / 章号顺移 / 引号修复）
design/rules/           写作规划、方法论参考等私人工作文档（已 .gitignore，不进仓库）
```

## 部署

Astro + Starlight 的标准静态站，可以部署到任何支持静态站点的平台。仓库推到 GitHub 后（用上面填的那个仓库地址），点按钮一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-name/your-repo)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-name/your-repo)

Cloudflare Pages 目前没有等价的按钮式一键部署，需要在 dashboard 里手动连接一次仓库（之后每次 push 都自动构建）：

| 项目 | 值 |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | ≥ 18 |

三个平台都会自动识别 Astro，上表参数一般不用改。

## License

本仓库自带的模板代码（脚本、组件、配置）采用 [MIT](./LICENSE-CODE)。

写自己的书之后，内容部分（`src/content/docs/` 下的正文）用什么协议由你自己决定——单独写一份 `LICENSE`，或者在这里说明。`LICENSE` 文件目前保留的是一份 CC BY-NC 4.0 示例，按需替换或删除。
