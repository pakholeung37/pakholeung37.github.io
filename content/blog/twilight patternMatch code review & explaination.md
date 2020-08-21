---
title: "twilight: patternMatch code review & explaination"
date: "2020-05-19 00:00:00"
description: ""
categories: []
comments: true
---

## 前言

patternMatch 是一个进行类正则的模式匹配类, 再设计中, 可以利用这个类来完成模块组合的一些限制功能, 例如限制一个组件的子节点是某几种组件,限制一个组件能添加的有限个子节点. 限制一个子组件只能出现在一个组件中有限次等等. 其中的原理和正则几乎的一样, 就是基于所给模式构造一个确定有限状态自动机.

在[计算理论](https://zh.wikipedia.org/wiki/计算理论)中，**确定有限状态自动机**或**确定有限自动机**（英语：deterministic finite automaton, DFA）是一个能实现状态转移的[自动机](https://zh.wikipedia.org/wiki/自动机)。对于一个给定的属于该自动机的状态和一个属于该自动机字母表{\displaystyle \Sigma }的字符，它都能根据事先给定的转移函数转移到下一个状态（这个状态可以是先前那个状态）。

## 重点类/方法/类型解析

### NodeSchema

nodeSchema 是对具体节点的描述, 通常必须具有 type 唯一标志, children 描述子元素的模式, 和 groups 表示所属组别.

### PatternMatch parse

输入一个模式匹配串和一个节点定义表, 输出一个可对输入进行匹配的自动机. 是外部使用的接口类. 通过这个类就能判断输入的新的组件是否符合模式.

里面最主要用到了几个算法, 一个是 parseExpr, 可以将一个处理过的表达式转化为 AST, 另一个是使用 nfa 和 dfa 将这个 AST 进一步转化成可用于匹配的对象.

### dfa

dfa 最重要的作用是把一个 nfa 转化成一个 dfa, 并且这个 dfa 就是一个可供最后匹配的自动机, 暂时没细看具体实现.

### nfa

这个方法可以将模式串转化成一个 nfa, 比较重要, 主要是建立状态转换表并返回.

## 运作

首先这里比较重要的是定义自己的 NodeSchema, 例如以下 schema

```typescript
const ArticleList = {
  type: "ArticleList",
  children: "Article*",
}
const Article = {
  type: "Article",
  group: "atom",
}
const Swiper = {
  type: "Swiper",
  children: "Slide*",
}
const Slide = {
  type: "Slide",
  children: "Container+",
}
const Container = {
  type: "Container",
  children: "*",
}
```

然后可以使用一个 createSchema 方法将这些 nodeschemazhuang 转化成一个键值对, 用一个对象表示, 这个对象就是模式匹配要用到的 schema 对象. 编译器会在模式串上面链接这个 schema 对象, 在 parseExpr 的 parseExprAtom 阶段, 符合条件的 NodeSchema 会链接到 NameExpression 上
