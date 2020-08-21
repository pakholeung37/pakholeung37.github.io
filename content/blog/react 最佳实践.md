---
title: react 最佳实践
date: "2020-05-12 00:00:00"
description: ""
categories: []
comments: true
---

## 状态管理方案

状态管理一直是前端框架重中之重, 选择合适的状态管理框架能有效提高效率, 提高项目可维护性, 状态可预测性.

很头痛的是 react 可选的方案实在太多. 以前用过一段时间的 redux + redux-thunk, 模板代码略多

### redux

原生坦克, 不配备弹药. 不可置否 redux 很优秀, 与其说他是一个状态管理库, 不如说是状态管理框架. 必须配备额外的库才能体现出 redux 的强大. 强硬的 action creator 蛋疼的 typescript 支持都让原生 redux 非常难用. 围绕一个 action 通常需要编写 acition, creator, reducer, mapProps 以及额外代码 typescript 支持. 使用原生 redux 给我一种过度设计的感觉.

### dva

redux + redux-saga + react-router + reselect 的封装, 文档堪忧, 离开 dva-cli 啥也不是.

### redux + reduxjs/toolkit

真正意义上的开箱即用的方案, 目前也是选择这种方案, 本质和 dva 一样, 是 redux + redux-thunk + reselect + immer 的封装. 但是能作为一个单独库使用. 再加上 useSelector, useDispatch 的体验感爆棚, 比各种 mapProps 高到不知道哪里去. 真正意义上的 redux best practice. 另外 immer 着实强大, 一统天下指日可待.( 不支持 iE9 )

## hook first

新时代, 新架构 抛弃以往笨重的 class component 形式, 采用基于 hook 的架构是更好的选择. 其实你会发现, 基于 hook 的 react component 其实和 svelte 很像, 官方也说明了, 要跟上时代的脚步, 预编译的流行几乎板上钉钉, function component 能在往后更好的优化做铺垫, 如果现在开始写, hook 是更好的选择

hook 也是更好组织代码的一种架构. 反正用就 hook 没错

[Why React Hooks](https://tylermcginnis.com/why-react-hooks/)
