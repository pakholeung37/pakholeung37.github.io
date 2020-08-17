---
title: javascript中的执行环境
date: "2020-08-17 14:48:56"
description: ""
categories: [金风梨]
comments: true
---

在学习JavaScript的时候出现很多难以理解的概念，例如闭包，回调，this，作用域，作用域链，执行环境等等。但是这些概念难懂，归根到底都是对call stack模型的把握太差。只要理解好JavaScript调用栈模型，所有这些问题概念对会很容易解决。

这里贴上youtube上对于call stack解释非常好的视频[JavaScript Foundations: Execution Context and Call Stack](https://www.youtube.com/watch?v=jTGb4t31vCY)，以及一篇绝世神文[JavaScript. The Core](http://dmitrysoshnikov.com/ecmascript/javascript-the-core/)，这位作者 Dmitry Soshnikov 的[博客](http://dmitrysoshnikov.com/)也是干货满满，对一些JavaScript的基础概念都有深入的讲解，而且覆盖面非常全。

## 执行环境（execution context）

执行环境是javascript中很重要的概念，它定义了变量和函数有权访问的其他数据，决定了他们各自的行为。与之关联的是一个变量对象（variable object）。

一个执行环境的变量对象定义了以下这些属性：

*   作用域链（Scope Chain）：定义了当前上下文的作用域链。

*   变量环境（Variable Environment）:定义了当前上下文中所有变量。

*   this绑定（this Binding）：定义了当前上下文this的绑定。

![image](assets/1240-20200817210458335.png)



这里概念在ES5，ES6出现了一些变化，详细可以看[JavaScript. The Core: 2nd Edition](http://dmitrysoshnikov.com/ecmascript/javascript-the-core-2nd-edition/#execution-context)

## 调用栈（call stack or execution stack）

调用栈是程序运行的一个很重要的概念，如果不是很清楚可以先看一下[The Call Stack](https://www.youtube.com/watch?v=Q2sFmqvpBe0&t=299s "The Call Stack")这个视频，里面也详实解释到包括C或汇编运行时的调用栈情况。

在javascript上这个情况要更复杂一些，它使用到一种叫环境栈的结构，一个函数调用压栈时，同时也会生成该函数的执行环境，进入环境栈。

![image](assets/1240-20200817210458378.png)

实际情况中，当一个函数caller调用一个callee时，会根据caller传递的参数初始化arguments变量和callee本身的local variable 生成一个变量对象（activation object），这个变量对象是就是新的execution context的variable object。

同时会生成一个scope chain，scope chain的一种链表结构，在创建时会拿取caller的execution context中的Scope chain，而后把自己的variable object加到链表头部。当前context的Scope chain则指向此链表头。其实说到底，Scope chain就是variable object chain，其中没有什么特别难理解的。这样形成的Scope chain 符合词法作用域的特点。

最后再在环境栈压入当前执行环境，至此完成整个入栈过程。出栈就不多说了，无非就是销毁执行环境，然后出栈。这样整个执行环境栈模型大致叙述完毕。有了这套模型，其实很多JavaScript的难点都迎刃而解了。

## this binding

javascript最令人迷惑的一个变量就是this指针了。很多人对各种this绑定云里雾里，不知其解。理解this，最重要的其实还是要知道javascript根本没有this变量。

其实很多人的对接触this都是从c++或java等OOP中来的。javascript对this的处理和他们区别很大。在c++的class模型中，this是作为一个隐藏指针，传递给methods的，也就是说每个methods都会拿到一个this变量，作为自己的local variable。而且，他们的method不会像句柄一样传来传去，所以也导致这些this比较容易理解。

然而在JavaScript中，function的中是没有名为this的变量的，所有的this，都是引用当前顶层execution context的this。也就是说，理解this是context的property而不是variable object的property这一点很重要。

> NOTE: 在ese6中确实有了lexical environment this，以支持arrow function。

关于this binding继承自父context还是辅以其他值，可以看另一篇文章[ECMA-262-3 in detail. Chapter 3\. This.](http://dmitrysoshnikov.com/ecmascript/chapter-3-this/)

## 动态作用域

虽然JavaScript使用的是词法作用域，但是它提供一些方法去添加当前context 的scope chain头部。例如with或catch块。不多说。

## 闭包和回调

回调就是闭包的应用，就不说了。闭包的实现在闭包的函数中具有一个[[scope]]的属性用于保存父Scope chain。最重要是JavaScript的垃圾回收机制不会回收这些被引用的variable object，虽然父级context可能被销毁（例如在异步回调之前，外部函数已调用完毕，它的context自然销毁了），但是在[[scope]]属性Sc链表中所引用variable object是不会销毁的。这就是闭包。当闭包被调用的时候，会生成新的context，而后会将context的Scope chain 初始化为 actived object + [[scope]]，这样，闭包就可以访问到它父Scope的变量了。

值得注意的是[[scope]]是在函数创建的时候就初始化好了，而并不是在调用的时候初始化。所以其实所有的函数，都是闭包。