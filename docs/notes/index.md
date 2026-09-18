# 笔记总览

这里是所有笔记的入口。**新增一篇笔记的完整流程：**

1. 在 `docs/notes/` 下建一个 `.md` 文件，比如 `docs/notes/python/decorator.md`
2. 打开 `docs/.vitepress/config.mts`，在 `sidebar` 里加一行：

   ```ts
   { text: '装饰器', link: '/notes/python/decorator' }
   ```

npm run docs:dev  查看效果
npm run docs:build 测试
3. 保存 → 左侧目录立刻出现新条目 → `git push` 发布

## 现有笔记

| 分类 | 笔记 | 说明 |
|---|---|---|
| 开始 | [写作速查表](./cheatsheet.md) | Markdown 和 VitePress 语法，**建议常回来查** |
| VitePress 建站 | [原理与目录/链接](./vitepress/how-it-works.md) | 为什么能搜索、目录怎么排、链接怎么写 |
| Python | [基础语法](./python/basics.md) | 语法演示样例 |
| 计算机网络 | [TCP 三次握手](./network/tcp.md) | 语法演示样例 |
| Linux | [Linux 基础](./linux/linux.md) | 语法基础 |
| 计算机组成原理 |[计算机组成原理](./coa//cpu/cpu.md) | 概念理解 |

::: tip 两种链接写法别搞混
- **正文里**写链接：用文件路径，**带 `.md`**，如 `[基础语法](./python/basics.md)`
- **配置文件里**（`config.mts` 的 sidebar）：用 URL 路径，**不带 `.md`**，如 `'/notes/python/basics'`
:::
