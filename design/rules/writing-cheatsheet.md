# 写新章速查卡

> 写章前看这一页就够。详细解释见 [`STARLIGHT-FEATURES.md`](../STARLIGHT-FEATURES.md)。

## 模板：动手章

新建文件 `src/content/docs/<部目录>/<slug>.mdx`（slug 用纯英文短语，**不要数字前缀**——侧栏顺序由 frontmatter `sidebar.order` 控制）：

```mdx
---
title: 4. 你的第一个世界
description: 一句话描述。
difficulty: 新手               # 新手 / 进阶 / 硬核
estimatedMinutes: 30            # 不写则按字数自动估
chapterType: hands-on           # hands-on / concept / creator-view
summary: RSS 与卡片用的简短摘要
sidebar:
  order: 4                      # 该章在所属"部"内的排序，从 1 开始
---

import { Steps, FileTree, Tabs, TabItem, CardGrid, Card, LinkCard } from '@astrojs/starlight/components';

正文从 ## 开头。不要写 # 一级标题。

## 第一节

正文……

:::tip[为什么是这样？]
讲设计原理。
:::

<Steps>

1. 第一步
2. 第二步

</Steps>

<FileTree>
- src/
  - **example.ts**
</FileTree>

```ts title="example.ts" {2}
function greet(name: string) {
  return `Hello, ${name}!`;
}
```

<div class="mermaid">
flowchart LR
  A --> B --> C
</div>
```

## 模板：理解章 / 创作者视角

```mdx
---
title: 理解章 X：…
description: …
chapterType: concept             # 或 creator-view
difficulty: 新手
---

正文。理解章不超过动手章一半篇幅。
```

## 模板：部入口页（splash）

新增一部时，在该部目录下放 `index.mdx`：

```mdx
---
title: 第三部 · …
description: 一句话副标题
template: splash
hero:
  tagline: …
  actions:
    - text: 开始第 N 章
      link: ./<slug>/
      icon: right-arrow
      variant: primary
sidebar:
  label: 第三部 · 总览     # 避免与 group 标题"第三部：…"重复
  order: 0                 # 让它排在该 group 第一位
chapterType: part-intro
tableOfContents: false
pagefind: false
editUrl: false
---

import { CardGrid, LinkCard } from '@astrojs/starlight/components';

引子两句。

<CardGrid>
  <LinkCard title="N. 章标题" href="./<slug>/" description="一句话定位" />
</CardGrid>
```

参考实例：已有「部」目录下的 `index.mdx`（新开一部时可以照抄改文字）。

## 模板：「减法」前言或结语

文字本身就是钩子的页面（前言、结语、致谢），用减法而非加法。详见 `STARLIGHT-FEATURES.md` §6.1。

```yaml
---
title: 前言：…
description: …
tableOfContents: false
pagefind: false
editUrl: false
lastUpdated: false
prev: false
next:
  link: /<部目录>/<slug>/
  label: 第 1 章 · …
---
```

## 用什么语义对什么场景

| 想做的事 | 用什么 |
| :--- | :--- |
| 多步骤教程 | `<Steps>` |
| 项目目录 / 资源结构 | `<FileTree>` |
| 多平台 / 多环境区别 | `<Tabs><TabItem>` |
| 章节末「相关阅读」 | `<CardGrid><LinkCard>` |
| 入口页大卡片 | `<CardGrid><Card>` |
| 标记新内容 | `<Badge text="新" variant="tip" />` |
| 流程图 / 时序图 | `<div class="mermaid">…</div>` |
| 设计原理 | `:::tip[为什么是这样？]` |
| 真实踩坑 | `:::caution[踩坑预警]` |
| 严重风险 | `:::danger[千万别]` |
| AI 提问示范 | `:::note[AI 小助手]` |

## frontmatter 检查清单

- [ ] `title` 用动作或承诺，不用「概述/简介/的目的」
- [ ] `description` 一句话，能让搜索引擎和卡片摘要看懂
- [ ] `difficulty` 在 `新手 / 进阶 / 硬核` 三选一
- [ ] `estimatedMinutes` 写整数，不带单位
- [ ] `chapterType` 在 `hands-on / concept / creator-view` 三选一
- [ ] 草稿期加 `draft: true`

## 写完前自检

- [ ] 第 1 步「制造渴望」是不是钩子，不是「本章学习 X」？
- [ ] callout 数量 ≤ 4 个？
- [ ] 排比连用 ≤ 一次？
- [ ] 末尾有没有「下一章 X」桥接句？这本书只允许一半章节用此句式
- [ ] 没有「新手常常……」「养成……的习惯」「不要 X」这种爹味句式？把"对读者下指令"换成"对事情本身的描述"
- [ ] 没有「不用全记住」「不需要背」这种假减压？这种话预设了"读者本来在背"，并把作者放到发许可证的位置——直接讲"这一节是当字典用的""后面会反复回查"就够了
- [ ] 中英文之间留了空格（盘古之白）？
- [ ] 内部链接末尾带 `/`，例：`/<部目录>/<slug>/`

## 常用本地命令

```bash
npm run dev              # 写作时常驻
npm run build            # 提交前构建一次（自动跑死链检查）
npm run build:strict     # 死链 / 严格模式（同上，显式触发）
```

写完一章，按提交前流程：

1. `npm run build` 通过。
2. `git diff` 确认改动只动你这一章（autogenerate sidebar 不需要再改 config）。
3. 推上 GitHub，Cloudflare Pages 自动部署。
