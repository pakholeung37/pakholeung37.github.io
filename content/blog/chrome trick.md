---
title: chrome trick
date: "2020-07-16 00:00:00"
description: ""
categories: ["最佳实践"]
comments: true
---

## console filter

console 的 filter 可以使用正则来过

滤一些不需要的信息. 但是在实践中我发现没办法用 blacklist 来过滤, 尽管使用了/(?!flush)/但是却没有任何效果, 不禁让人感到沮丧.

![img](assets/eab4ab8f-5b03-9afd-6c3f-8143fc70c58a)

在查阅资料的过程中发现, filter 可以只是用-[过滤字样]来进行 blacklist 过滤.

![img](assets/a0c65d50-301c-2ebe-9715-bf2afe55907b)

整个世界都清净了..
