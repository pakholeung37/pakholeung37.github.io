---
title: "Miniprogram Transformer Review: javscript parser 应用"
date: "2020-10-22 10:32:00"
description: ""
categories: ["学习笔记"]
comments: true
---

## 前言

我们组从小程序推出的开始就一直在小程序相关的业务，一直到现在大概 3 年时间，这几年时间里面， 小程序语法添加了一些新特性, 也出现很多新的框架. 但是, 我们的小程序依然维持在一个非常原始的状态. 而现在必须考虑到迁移的问题.

## 现状

先来谈谈目前项目的组成, 除了基本的 Component, Page, 还有一些混合 Component 的开发模式. Component, Page 其实都比较好理解, 关键是混合开发. 这类混合模式的特点在于, 看起来像一个组件, 但是其实不是.

```text
// /component1
component1.wxml
component1.wxss
component1.js
```

看起来很像一个组件是不是, 但其实不是. wxml 里面其实是一个 wx template, js 是用别的方式直接混入到 Page 对象,

```javascript
Page(Object.asign({}, component1, {....}))
```

css 是直接在全局 css 中 import 依赖的. 即 template 中的方法不是来自于组件本身, 而是来自于 Page 对象的. 拥有这种模式是因为在小程序的初期是不支持自定义组件的, 所以这种模式则被继承了下来, 并逐步扩大到大量的组件.至此, 某类组件都使用这种开发模式.

如果要迁移到 uniapp, 则必须要解决一个问题, 怎么将这种模式转换到 uniapp 中.

## 目标

其实在这此前, 我已经做过一个基本一样的需求, 那时候没有考虑到 ast 转换的问题, 都是基本纯手写 + string replace 来修改原有的项目. 同时在重构的过程中, 暴露出了很多问题. 第一, 迁移的过程中开发的需求, 为了不影响线上的小程序, 我们必须在旧的小程序写一套, 然后又在新的小程序上写一套. 第二, 因为基本上是重构, 没有办法做覆盖性测试, 在上线之后暴露出很多问题. 然后开始思考有什么办法能做的更好, 然后就想到了 codemod, babel,开始萌生构建 ast 转换器的想法. 基于此搭建的转换器, 需要满足的基本需求是, 必须不影响线上功能的情况下, 完成迁移, 要么一步到位, 要么转换可以渐进式地进行, 仅通过转换器加快迁移效率.

## 原理

先来看看组件.
一个完整的 Component 形式的小程序组件转换到 vue 语法完整的过程包括, 将 wxml 转换成对应的 vue template, 将 wx component js 代码转换成 vue component js 代码, 然后最后将 template, js, css 拼接起来. template 转换和 js 转换, 说白了就是 ast 转换. 使用 parser 将 wxcomponent 解析成 ast, 再转换成 vuecomponent 对应的 ast, 最后转换回最终的代码.

## 方案

一开始使用[miniprogram-to-uniapp](https://github.com/zhangdaren/miniprogram-to-uniapp)进行转换, 但是发现了一些问题, 最大的问题是这个库使用的 htmlparser2 这个库对 wxml 进行转换. 但是这个库并不能有效对一些语法进行有效的解析. 转换的问题.

## 结语

虽然这次转换器只实现了其中一部分, 但是其中的调研, 思考, 实践也让我成长了很多
