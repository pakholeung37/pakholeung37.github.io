---
title: CRP资源整理及quick quiz
date: "2020-08-17 14:48:56"
description: ""
categories: [金风梨]
comments: true
---

*   [Google DeveloperCRP系列文章](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)

*   和上面文章同一作者的Udacity课程：[网站性能优化](https://classroom.udacity.com/courses/ud884)

*   CRP详述：[understanding critical render path | bitofcodes](https://bitsofco.de/understanding-the-critical-rendering-path/)

*   async 和 defer javascipt 在CRP理论下的分析：[Asynchronous vs Deferred JavaScript](https://bitsofco.de/async-vs-defer/)

*   <script>标签位置方案详述：[Deep dive into the murky waters of script loading](https://www.html5rocks.com/en/tutorials/speed/script-loading/)

## quick quiz

Q：请简述critical render path。

A：在浏览器请求资源的时候，最先请求到的一定是一个html文件，所有的其他资源一定是围绕这个入口进行加载的。关键渲染路径就在于浏览器加载其他资源和构建相关模型以及渲染到屏幕的策略。

一个正常的CRP包含以下步骤：

1.  构建DOM

2.  构建CSSOM

3.  运行JavaScript脚本

4.  创建渲染树

5.  生成布局

6.  绘制画面

![image](assets/1240-20200817211711642.png)

一般而言，这个过程是顺序执行的，唯一需要关注的，是JavaScript如何影响DOM和CSSOM的构建。

JavaScript是一种解析阻塞的资源。一旦html解析器遇到一个script标签，它将会立即加载并执行脚本，同时blocking html parser。而且，script还可能会改变一些样式，这意味着，脚本将会在CSSOM构建完毕后才会执行。这里有一篇参考文章：[使用 JavaScript 新增互動功能](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript)。

关键路径决定了页面将会如何呈现到客户端，并决定了呈现的速度。关键路径的优化则会影响页面首次加载的性能。

一般而言，首次加载的性能瓶颈一般是在网络上和解析上。加载资源的顺序和速度会直接影响首次加载的性能。所以对于如何优化关键路径，可以分为两大类：1、尽早加载网页关键资源，例如关键
CSS和关键JS。2、优化可能产生阻塞的代码，例如js运行阻塞dom构建等。

Q：简述async脚本的执行路径。

A：async是HTML5的提案，目的是防止阻塞dom构建，async脚本将会并行dom构建进行加载，并且在加载完毕后立刻执行。

![image](assets/1240-20200817211711742.png)

Q：简述defer脚本的执行路径。

A：如上图，defer一样可以并行dom构建加载，并会在dom构建完毕后立刻执行。

Q：为什么要使用async和defer，它们又有什么问题。

A：async和defer的都是为了防止原始脚本标签阻塞dom构建而提出的，并行加载可以让他们更快地加载。但是同样，他们两者也有问题。第一、async和defer都无法保证脚本的执行一致性。

例如一下代码

```
// async提案
<script async src="1.js">
<script async src="2.js">
// defer提案
<script defer src="1.js">
<script defer src="2.js">
```

async在这种代码中，无法保证1.js运行在2.js之前，defer则会在某些浏览器中存在bug导致2.js部分代码可能提前与1.js。致使两个脚本无法顺序运行。defer提案由于严重的bug，现在几乎不会用了。async则只会使用在独立的，关键的脚本之上。

Q：请比较async和defer异同。

A：上面说的也很详细，async和defer都能并行于parser加载，不同是async会在加载完成时执行，defer则在dom构建完成时执行。

Q：如何应用CRP分析加快网站的加载速度。

A：上面也说到过，关键在于如何尽早地加载关键资源和防止阻塞dom构建。

能用的策略包括：

1.  最小化、压缩、缓存关键资源。

2.  最小化渲染阻塞资源。

    *   使用media query防止加载非关键CSS

    *   使用inline CSS

3.  最小化解析阻塞资源。

    *   推迟JavaScript执行

    *   异步加载JavaScript

Q：综述script标签放置问题。

A：[https://www.html5rocks.com/en/tutorials/speed/script-loading/#toc-enough](https://www.html5rocks.com/en/tutorials/speed/script-loading/#toc-enough)自己看吧。