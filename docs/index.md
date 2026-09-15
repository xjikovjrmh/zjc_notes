---
# 首页专用布局：home 表示"首页大标题 + 功能卡片"风格
layout: home

hero:
  name: "zjc 的学习笔记"
  text: "把学过的东西写下来"
  tagline: Markdown 写作 · 左侧目录 · 全文搜索 · 推送即发布
  actions:
    - theme: brand
      text: 开始阅读
      link: /notes/
    - theme: alt
      text: 写作速查表
      link: /notes/cheatsheet

features:
  - title: 纯 Markdown
    details: 所有笔记都是 .md 文件，随时能迁移到 Obsidian、Typora 或任何编辑器。
  - title: 左侧目录 + 全文搜索
    details: 按目录导航，右上角搜索框能搜到全站每一个字。
  - title: git push 即发布
    details: 写完推送，GitHub Actions 自动构建并发布到 Pages，不用手动部署。
---
