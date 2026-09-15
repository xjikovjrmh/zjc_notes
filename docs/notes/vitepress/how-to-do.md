# 如何新建笔记？

## 一 新建一个科目
   - 在 notes下新建文件夹例如notes/java/java-basis.md 
   - 在.vitepress/config.mts 文件内  '/notes/': 内部元素添加
  
  ```ts
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
        }
        
        ,// 加一个逗号，方便后续添加新笔记
        {
          text: 'java',
          collapsed: false,
          items: [
            { text: 'java 基础', link: '/notes/java/java-basis' } //不加.md
          ]
        }
      ]
    },
  ```

  ## 二、要在已有目录下新建新的小笔记
  - 先在java下新建笔记java-primer.md
  直接在对应代码块 
  ```ts
   items: [
    这里添加{ text: 'java入门', link: '/notes/java/java-primer' }
    ]
``` 

