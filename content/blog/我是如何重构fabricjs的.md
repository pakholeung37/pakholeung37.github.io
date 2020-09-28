---
title: 我是如何重构fabric.js的
date: "2020-09-23 16:00:00"
description: ""
categories: []
comments: true
---

本文将记录我在重构 fabric.js 的思考和实践

## 动机

在进行 twilight 项目编写的时候, 我就有意在寻找一些库, 作为我编辑器的底层库调用. 在浏览了一些库以后, 最终选择了 [fabric.js](fabricjs.com) 作为编辑器的底层. 这个库点赞过 10k, 稳定, 快. 没有外部依赖, 基本是基于原生 canvas 等一系列 browser api 进行编写. 足够接近底层, 单元测试接近完整. 而且原生带有互动层, 可以减少我再建模的时间和精力. 但是, 这个库是在 08 年编写, 以现今前端技术栈来看, 或多或少存在一些问题: 使用 iife 构建模块, 没有模块管理. 所以, 缺少 tree-shaking. 只能通过全局初始化, 对 esm 导入不利. 另外就是打包太大, 把以及一些不必要的工具函数打包进来. 基于 prototype 的类模型也不够直观, 并且难以调试. 所以, 在种种历史问题下, 我决定尝试以下重构该项目.

## 目标

- [x] modern frontend workflow (rollup + eslint + prettier + babel)

- [ ] tree shaking and dynamic import

- [ ] modern es6+ syntax (especially class)

- [ ] heavy utils external

- [ ] plugin system

- [ ] excellent performance

- [ ] typescript support

- [ ] migrate test framework to jest

- [ ] independent fabric config

## 重构成 esModule

在完成 workflow 迁移以后, 首要的工作是将整个工程重构成 esm. 在原来的架构中, 模块脚本在第一次载入运行的代码过重, 运行上下文重度依赖于当前脚本的执行顺序.而且这种结构无法做 tree shaking, 我的想法是将整个项目做成一个库的形式, 只需要导入用到的代码就好了, 将上下文限制在脚本文件内部, 而不是依赖于全局, 方便压缩导入后的体积. 所以首要目标是将整个项目重构成 esm. 在重构的过程中, 遇到的最棘手的问题, 便是循环依赖引用. esm 和 cjs 是完全不一样的模块系统, 在 cjs 中, 模块的加载是同步的, 在 require 的时候就会立即运行 cjs 模块, 然后生成一个模块引用, 也就是说, 当执行类似

```js
const path = require("path")
```

的代码的时候, 这个 path 的引用其实已经是完整的模块引用, 再往后就不会再调用这个模块的任何脚本, 而是使用已经在 cjs 模块 cache 中的"path"模块引用.对于 esm, 情况要更复杂一些. 在正统的 esm 中, 即 browser 中 esm 的实现中. esm 模块是异步执行的.
