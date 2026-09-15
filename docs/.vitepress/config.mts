import { defineConfig } from 'vitepress'

// ================================================================
//  VitePress 全站配置
//  改完保存 → 浏览器自动刷新，不用重启
// ================================================================
export default defineConfig({
  // ---------------------------------------------------------------
  //  ★★★ 最容易出错的一项 ★★★
  //  部署到 https://<用户名>.github.io/<仓库名>/ 时，
  //  这里必须是 '/<仓库名>/'，前后两个斜杠一个都不能少。
  //
  //  例：仓库叫 zjc_notes  →  base: '/zjc_notes/'
  //  只有仓库名恰好是 <用户名>.github.io 时，才写成 base: '/'
  //
  //  写错的表现：本地一切正常，线上打开是一片空白。
  //  本地开发不受这一行影响，所以可以最后再改。
  // ---------------------------------------------------------------
  base: '/zjc_notes/',

  lang: 'zh-CN',
  title: 'zjc 的学习笔记',
  description: '记录我的学习笔记',

  lastUpdated: true, // 显示"最后更新于"（需要 git 仓库才有数据）

  themeConfig: {
    // ============ 顶部导航条 ============
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/notes/' },
      { text: '速查表', link: '/notes/cheatsheet' }
    ],

    // ============ 左侧目录（核心） ============
    // 规则：
    //   1. 键（如 '/notes/'）是"目录路径"，前后都要有斜杠
    //   2. link 不带 .md 后缀，从 docs/ 算起，以 / 开头
    //   3. 新增笔记 = 建一个 .md 文件 + 在这里加一行 items
    sidebar: {
      '/notes/': [
        {
          text: '开始',
          items: [
            { text: '笔记总览', link: '/notes/' },
            { text: '写作速查表', link: '/notes/cheatsheet' }
          ]
        },
        {
          text: 'VitePress 建站',
          collapsed: false,
          items: [
            { text: '原理与目录/链接', link: '/notes/vitepress/how-it-works' }
          ]
        },
        {
          text: 'Python',
          collapsed: false, // false = 默认展开，true = 默认折叠
          items: [
            { text: '基础语法', link: '/notes/python/basics' }
          ]
        },
        {
          text: '计算机网络',
          collapsed: false,
          items: [
            { text: 'TCP 三次握手', link: '/notes/network/tcp' }
          ]
        }
        ,// 加一个逗号，方便后续添加新笔记
        {
          text: 'Linux',
          collapsed: false,
          items: [
            { text: 'Linux 基础', link: '/notes/linux/linux' }
          ]
        }
      ]
    },

    // ============ 其他常用设置 ============
    search: { provider: 'local' }, // 本地全文搜索，免费、无需注册
    outline: { level: [2, 3], label: '本页目录' }, // 右侧"本页目录"
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新于' },

    // 界面文案汉化
    darkModeSwitchLabel: '主题',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    outlineTitle: '本页目录',

    // 右上角 GitHub 图标：记得换成你自己的主页
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xjikovjrmh' }
    ],

    footer: {
      message: '用 VitePress 构建 · 托管于 GitHub Pages',
      copyright: '© 2025 zjc'
    }
  }
})
