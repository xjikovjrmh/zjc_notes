# 写作速查表

这篇本身就是一份**可运行的语法示例**，写笔记时忘了怎么写就回来翻。

## 一、Markdown 基础（够用就这 8 个）

```markdown
# 一级标题（一篇只写一个）
## 二级标题（会进右侧"本页目录"）
### 三级标题

**粗体**  *斜体*  `行内代码`  ~~删除线~~

[链接文字](目标路径)  ![图片alt](/图片.png)

- 无序列表
  - 缩进两个空格 = 子项

1. 有序列表

> 引用文字

| 表头 | 表头 |
| --- | --- |
| 内容 | 内容 |

- [ ] 待办事项
- [x] 已完成事项
```

## 二、代码块

写上语言名才有语法高亮：

````markdown
```python
def hello(name: str) -> None:
    print(f"hello {name}")
```
````

**高亮指定行**（大括号里写行号）：

````markdown
```python{1,3-4}
a = 1
b = 2
c = 3
d = 4
```
````

**多标签代码块**：

````markdown
::: code-group

```bash [npm]
npm run docs:dev
```

```bash [pnpm]
pnpm docs:dev
```

:::
````

## 三、提示框（VitePress 特有，很好用）

```markdown
::: tip 提示
适合放"小技巧"。
:::

::: info 说明
适合放"补充信息"。
:::

::: warning 注意
适合放"容易踩的坑"。
:::

::: danger 危险
适合放"会造成严重后果的操作"。
:::

::: details 点我展开
适合放"折叠的详细内容"，比如大段报错日志。
:::
```

实际效果：

::: tip 提示
适合放"小技巧"。
:::

::: warning 注意
容器必须以单独一行 `:::` 结尾，否则后面的内容会被一起吞进去。
:::

::: details 点我展开
里面可以放任意 Markdown，包括代码块。
:::

## 四、Frontmatter（单篇设置）

写在文件**第一行**，用两个 `---` 包起来，冒号后必须有空格：

```markdown
---
title: 自定义这篇的标题
outline: deep
---

正文从这里开始……
```

| 字段 | 作用 |
|---|---|
| `title` | 覆盖浏览器标签页标题 |
| `outline: deep` | 右侧目录显示到四级标题 |
| `outline: false` | 这篇不显示右侧目录 |
| `lastUpdated: false` | 这篇不显示更新日期 |

## 五、本页目录

正文里任意位置写：

```markdown
[[toc]]
```

就会插入一个当前页面的目录。

## 六、⚠️ 一个必踩的坑：`{{ }}`

VitePress 会把 Markdown **当成 Vue 模板来编译**，所以下面这种写法会报错或显示空白：

```markdown
模板变量是 {{ name }} 这样写的    ← 会出问题
```

三种解决办法：

1. **放进代码块里**（最省事，代码块是免编译区）
2. 用 `v-pre` 指令：`<span v-pre>{{ name }}</span>`
3. 用 HTML 实体：`&#123;&#123; name &#125;&#125;`

写 Vue、Jinja2、Ansible、Helm 之类模板的笔记时一定会遇到。

## 七、图片

1. 把图片放到 `docs/public/images/` 目录下（自己新建这个目录）
2. 正文里用**绝对路径**引用：

```markdown
![截图](/images/xxx.png)
```

> `public` 目录里的文件会被原样复制到网站根目录，所以引用时**不要**写 `/public/`。

用 VS Code 的 **Paste Image** 插件截图后按 `Ctrl+Alt+V`，会自动存图并插入链接。

## 八、超链接的两种写法（最容易混）

| 位置 | 写法 | 例子 |
|---|---|---|
| 正文 Markdown | 文件路径，**带 `.md`** | `[基础语法](./python/basics.md)` |
| `config.mts` 的 sidebar | URL 路径，**不带 `.md`** | `{ text: '基础语法', link: '/notes/python/basics' }` |

写错了不会报错，只会 404，所以记牢。

## 九、日常命令

```bash
npm run docs:dev       # 本地预览（开发时用，热更新）
npm run docs:build     # 构建（Actions 自动做，平时不用）
npm run docs:preview   # 预览构建后的成品

# 退出正在运行的 dev server：在终端里按 Ctrl + C
```
