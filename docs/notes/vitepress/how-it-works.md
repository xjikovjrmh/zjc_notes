# VitePress 是怎么跑起来的

这篇讲**原理**：为什么一堆 `.md` 文件能变成网站、为什么没有后端也能搜索、目录和链接到底按什么规则找文件。

> 纯语法速查请看 [写作速查表](../cheatsheet.md)，那篇是"怎么写"，这篇是"为什么"。

## 一、一句话原理

**VitePress = Markdown 编译器 + Vue 运行时 + Vite 打包器。**

它做了一件很"贪心"的事：把每个 Markdown 文件**编译成一个 Vue 组件**，构建时把它们**预渲染成真 HTML**，浏览器打开后再让 Vue **接管（hydrate）**成单页应用。

于是它同时拿到了两种好处：

| 想要的好处 | 谁提供的 |
|---|---|
| 打开就出内容、SEO 好、首屏快 | 构建时预渲染出的静态 HTML |
| 点链接不刷新页面、秒开 | Vue Router 的客户端路由 |

所以它叫 **静态站点生成器（SSG）**：产物是纯静态文件，丢到 GitHub Pages 就能跑，**没有服务器、没有数据库**。

## 二、构建管线（一个 .md 的完整旅程）

```text
docs/notes/network/tcp.md
        │
        │ ① 交给 markdown-it 解析
        ▼
    Markdown AST
        │  + 抽出标题层级（给右侧"本页目录"）
        │  + 抽出 frontmatter（title、outline…）
        │  + 抽取正文纯文本（给搜索索引）★
        ▼
   一段 HTML 片段
        │
        │ ② 当成 Vue 模板编译（所以 md 里能直接写 {{ }} 和组件）
        ▼
   Vue 组件（渲染函数）
        │
        │ ③ 在 Node 里跑一遍 renderToString
        ▼
  notes/network/tcp.html  ← 真 HTML，第一眼就能看见内容
        │
        │ ④ 浏览器加载 → Vue hydrate → 变成可交互的 SPA
        ▼
  之后点击站内链接 → 不走网络整页刷新，只动态 import 目标页的 JS
```

关键点：**第 ④ 步之后，你的网站就是一个 Vue 单页应用**。这也是为什么新页面加载时右侧目录、上一篇/下一篇能顺畅切换。

开发模式（`npm run docs:dev`）不一样：Vite 按需即时编译，改哪个文件只重编译哪个，所以保存就刷新，不用重启。

## 三、为什么没有后端也能搜索？

这是最容易被觉得"厉害"的地方，其实一点也不神秘。

**搜索索引是在构建时生成的，搜索是在浏览器里跑的。**

```text
npm run docs:build
   │
   ├─ 顺手把每页正文切词、统计词频
   └─ 生成一份索引 JSON
          │
          ▼
   打包进一个独立的 .js chunk（懒加载）
   本项目产物：assets/chunks/@localSearchIndexroot.<hash>.js
          │
          ▼
   你第一次点开搜索框 → 浏览器才去下载这个 chunk
          │
          ▼
   输入关键词 → 在内存里用 MiniSearch 做倒排检索 → 直接出结果
```

证据：打开 `docs/.vitepress/dist/assets/chunks/@localSearchIndexroot.Dx3xIvhF.js`，你会看到这就是一个巨大的 JSON 字符串——里面是每篇文档的 URL、锚点、标题和正文。

由此可以推出几个实际结论：

- **不需要任何服务器**，所以能白嫖 GitHub Pages。代价是索引随站点变大而变大（VitePress 会切成多个 chunk，仍然可能有几 MB）。
- **搜的是构建时的快照**：`docs:dev` 下会实时更新，线上版本要重新构建才会包含最新笔记。
- **中文召回率偏低**：MiniSearch 默认按空格切词，中文没有空格，所以短词、连续词的匹配不如预期。想更准可以换 Algolia DocSearch（`search: { provider: 'algolia', options: {...} }`），但要注册申请。

### 顺带说说右上角的"本页目录"

它不是搜索，是构建时从 AST 里抽出的 **标题树**。配置里的
`outline: { level: [2, 3] }` 意思就是"只抓 h2 和 h3"，改 `outline: deep` 可以到 h4。所以它是**静态结构**，不依赖任何运行时计算。

## 四、目录（sidebar）：为什么加了文件左侧没变化

**VitePress 不会自动扫描文件夹生成目录。** 左侧边栏完全来自 `.vitepress/config.mts` 里手写的那份 `sidebar` 数组。

规则就三条：

```ts
sidebar: {
  '/notes/': [            // ① 键是"目录路径"，前后都要有斜杠 = 这段配置只管 /notes/ 下的页面
    {
      text: 'Python',     // ② 分组标题（可以折叠，用 collapsed 控制默认状态）
      collapsed: false,
      items: [
        { text: '基础语法', link: '/notes/python/basics' }  // ③ link 不带 .md，以 / 开头
      ]
    }
  ]
}
```

- `text` = 显示给人看的文字，可以随便起名，和文件名无关。
- `link` = 真正决定跳哪儿的 URL 路径，**必须能在文件系统里对上**。
- 一个页面如果**不在任何 sidebar 里**，它依然能访问，但不会有左侧目录、也不会进"上一篇/下一篇"。

### 不想手写？可以自动生成

VitePress 提供了 `createContentLoader`，在构建时（Node 环境）读文件系统：

```ts
// docs/.vitepress/theme/sidebar.mts 之类
import { createContentLoader } from 'vitepress'

export default createContentLoader('notes/**/*.md', {
  transform(raw) {
    return raw
      .sort((a, b) => a.url.localeCompare(b.url))
      .map(({ url, frontmatter }) => ({
        text: frontmatter.title ?? url,
        link: url
      }))
  }
})
```

代价是：分组、排序、折叠这些都得自己算，标题还得从 frontmatter 里取。**笔记不多的时候，手写反而更省心、更可控**——你现在这份配置就是手写版，挺合适。

## 五、链接：记住"两套写法"，别搞混

同一个页面，在不同地方写法不一样，这是新手 404 的头号原因：

| 写在哪 | 后缀 | 例子 |
|---|---|---|
| **正文 `.md` 里** | 路径，**带 `.md`** | `[基础语法](../python/basics.md)` |
| **`config.mts` 里** | URL，**不带 `.md`** | `{ text: '基础语法', link: '/notes/python/basics' }` |

为什么正文要写 `.md`？因为构建时 VitePress 会**把 `.md` 链接改写成 `.html` 链接**，同时顺手检查这个文件到底存不存在——这就是它报 `dead link` 错误的原理：

```text
✓ [基础语法](../python/basics.md)   → 编译成 /zjc_notes/notes/python/basics.html
✗ [基础语法](../python/basic.md)    → 构建直接报错 "dead link"
```

三种路径写法：

```markdown
相对路径（推荐，文件挪位置时不容易错）
[TCP 三次握手](./network/tcp.md)
[速查表](../cheatsheet.md)

绝对路径（从 docs/ 根算起，不要带 base）
[笔记总览](/notes/)
[首页](/)

锚点（跳本页某标题）
[跳回原理](/notes/vitepress/how-it-works#一、一句话原理)
```

::: warning 三个坑
1. **不要写 `base`**。配置里 `base: '/zjc_notes/'`，但正文链接一律从 `docs/` 算起，`/notes/` 就够了，写成 `/zjc_notes/notes/` 反而 404。
2. **锚点跟标题文字绑定**。改标题文字会让旧锚点失效。中文标题生成的锚点会保留中文。
3. **外链会自动加 `target="_blank"`**，站内链接才是路由跳转。
:::

## 六、上一篇 / 下一篇：不用自己写

这个功能**零配置**（你配置里那行 `docFooter: { prev: '上一篇', next: '下一篇' }` 只是改文案）。

它的规则是：**沿着 sidebar 的书写顺序，找当前页面的前一个和后一个**。

```text
sidebar 顺序：  笔记总览 → 写作速查表 → 基础语法 → TCP 三次握手
                   ↑            ↑          ↑            ↑
在"基础语法"页：上一篇 = 写作速查表    下一篇 = TCP 三次握手
```

所以：

- **想调整翻页顺序？调 sidebar 里 items 的顺序就行**，不要去找什么"下一篇"配置。
- 页面**不在 sidebar 里 → 完全不显示翻页**（连 `docFooter` 也不出现）。
- 想临时覆盖，可以在这篇的 frontmatter 里写：

```markdown
---
prev: false    # 这篇文章不显示"上一篇"
next: 
  text: 直接跳去 TCP
  link: /notes/network/tcp
---
```

- 数组里的**第一个和最后一个**自然只有单向按钮，正常现象。

## 七、把三者串起来：新增一篇笔记的完整动作

1. 建文件：`docs/notes/python/decorator.md`（路径 = 将来的 URL）
2. 在 `config.mts` 的 `sidebar` 里加一行 `{ text: '装饰器', link: '/notes/python/decorator' }`
3. 正文里想引它，就写 `[装饰器](./python/decorator.md)`
4. 保存 → 左侧目录、上/下一篇、右侧本页目录、搜索索引（dev 下）**全部自动就位**
5. `git push` → GitHub Actions 构建 → 等一两分钟，线上就有了自己的搜索索引和翻页

一句话总结：**文件系统负责"页面存在"，sidebar 负责"页面被导航到"，链接负责"页面之间互通"**。三件事各自独立，互不代劳。
