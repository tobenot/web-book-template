# 插章 / 调章号操作手册

> 写给未来的我：再要插一章、拆一章、合并两章时按这个走，30 秒搞定。

## TL;DR

```bash
# 比如要在「第 5 章之前」插一章新章（即原来的第 5 章变第 6 章）
npm run shift:chapters -- --from 5 --by +1            # 预览
npm run shift:chapters -- --from 5 --by +1 --write    # 写入
```

写入完成后脚本会自动跑 `fix:chapters` + `check:chapters:strict`。然后才动手写新章 mdx。

---

## 三种典型场景

### 场景 A：在 N 章之前插一章

原章号 N、N+1、N+2 … 全部 +1。

```bash
npm run shift:chapters -- --from N --by +1 --write
```

之后新建 `src/content/docs/<part>/<new-slug>.mdx`，frontmatter `title: "N. 新章名"`。

### 场景 B：删一章 / 合并相邻两章

被删章号之后所有章 -1。

```bash
# 假设删了第 12 章
npm run shift:chapters -- --from 13 --by -1 --write
```

然后再删掉那个 mdx 文件（或把内容合并到上一章）。

### 场景 C：从某点开始整体加多章

```bash
npm run shift:chapters -- --from 20 --by +3 --write
```

---

## 工具三件套速查

| 命令 | 作用 |
|------|------|
| `npm run check:chapters` | 体检，列出 stale / 漂移 / 冲突 / orphan / 散文引用 |
| `npm run check:chapters:strict` | 严格模式（CI 用），结构性问题挂 exit 1 |
| `npm run fix:chapters` | 自动同步可识别的链接 + LinkCard |
| `npm run shift:chapters -- --from N --by ±M` | 整体顺移；不加 `--write` 是预览 |

`npm run build` = `check:chapters:strict` + `astro build`，章号腐烂会直接挡住构建。

---

## shift 脚本能改什么、不能改什么

**能自动改：**

- frontmatter `title:` 里的 `N. 章名`
- 散文 / 链接文本里的「第 N 章」
- `<LinkCard title="第 N 章 ...">` 和 `<LinkCard title="N. ...">`（点号形式）
- markdown 链接 `[第 N 章 ...](slug)`

**不会动：**

- 代码块（``` 围栏）和行内代码（`` `code` ``）里的内容
- 不在指定 `--from` 范围内的章号
- design/rules/ 文件夹默认**不在**扫描范围内？—— 实际**在**，因为脚本扫整个仓库的 md/mdx。如有特殊设计文档不想被改，提前 git stash。

**不知道该不该信？** 永远先跑预览（不加 `--write`），看清楚改动列表再决定。

---

## 写作公约（避免下次再痛）

1. **frontmatter `title` 是章号的唯一真源**：每篇 mdx 的章号只在 `title:` 里写一次。
2. **散文里能不写章号就别写**：写「[后面有一章专门讲 X](slug)」永远比「第 N 章会讲 X」健壮——slug 不会因插章而变。
3. **必须写章号时**：优先写成 markdown 链接 `[第 N 章 ...](slug)` 或 `<LinkCard title="N. ..." href="slug" />`，这两种工具能自动同步。
4. **附录里的「详情见第 N 章」放在固定的 ⏳ 标记区或数据源块里**，便于扫描。

---

## 出问题怎么办

### shift 之后 build 挂了

看 `build.log`，`check:chapters:strict` 报告里会列出：

- **stale**：链接的 title 章号和 href 指向的实际章号不一致 → `npm run fix:chapters` 一般能自动修
- **orphan**：链接的 href 找不到目标 mdx → 多半是 slug 拼错或文件没新建
- **conflict**：两篇 mdx 的 frontmatter 都自称同一个章号 → 检查是不是漏了一篇没顺移
- **multi**：一段文字里出现了「第 X、Y 章」这种多章引用 → 工具不敢自动改，去文件里手动改

### 想看脚本到底改了什么

```bash
git diff
```

不满意就 `git checkout -- .` 回滚，重新预览。

### 章号已经一团糟，想从零对齐一次

1. 先在每篇 mdx 的 frontmatter `title` 里把章号改对（这是真源）。
2. `npm run fix:chapters` 让链接 / LinkCard 跟上。
3. `npm run check:chapters` 看剩下的散文引用，人肉改。
4. `npm run build` 验。

---

## 历史教训

- **2026-05 第一部加第 5 章**：第二部及以后所有章号 +1，手改了 18 个文件。痛点：散文式「第 N 章」、点号 LinkCard `<LinkCard title="6. ...">` 当时脚本都不识别。修复：补了 `shift-chapters.mjs` + 扩展 `check-chapter-refs.mjs` 的点号识别。从此一行命令解决。

下次再发生类似的事，第一反应应该是：**「这次的痛能不能也固化成工具？」**——而不是「这次先扛过去」。
