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
- [x] migrate to esm 
- [ ] tree shaking
- [ ] modern es6+ syntax (especially class)
- [ ] heavy utils external
- [ ] plugin system
- [ ] excellent performance
- [ ] typescript support
- [ ] migrate test framework to jest
- [ ] independent fabric config

##  引入现代前端工作流

在重构工作的开始, 需要先将整个项目引入到新的工作流当中. 引入新的工作流目可以为整个重构工作达成事半功倍的效果. 例如隔离模块变量, 如果没有静态代码检查, 将很难发现全局变量. 原项目的工作流当中, 是使用eslint + raw scripts的方式做代码检查和打包. eslint是必须的, 这部分我只是将他升级到最新的版本, 并且将它替换到我顺手的config. 原来的打包是iife + raw script, 这部分则用rollup来替换, 在最开始的时候只需要将原来的iife import 进入口文件, 就可以了, 这部完成后, 就可以进行esm的工作.

## 重构成 esModule

在完成 workflow 迁移以后, 首要的工作是将整个工程重构成 esm. 在原来的架构中, 模块脚本在第一次载入运行的代码过重, 运行上下文重度依赖于当前脚本的执行顺序.而且这种结构无法做 tree shaking, 我的想法是将整个项目做成一个库的形式, 只需要导入用到的代码就好了, 将上下文限制在脚本文件内部, 而不是依赖于全局, 方便压缩导入后的体积. 所以首要目标是将整个项目重构成 esm. 在重构的过程中, 遇到的最棘手的问题, 便是循环依赖引用. esm 和 cjs 是完全不一样的模块系统, 在 cjs 中, 模块的加载是同步的, 在 require 的时候就会立即运行 cjs 模块, 然后生成一个模块引用, 也就是说, 当执行类似

```js
const path = require("path")
```

的代码的时候, 这个 path 的引用其实已经是完整的模块引用, 再往后就不会再调用这个模块的任何脚本, 而是使用已经在 cjs 模块 cache 中的"path"模块引用.对于 esm, 情况要更复杂一些. 在标准当中, 只规定了模块是如何获取, 执行. 但是并没有规定脚本执行的时机

> Blocking the main thread like this would make an app that uses modules too slow to use. This is one of the reasons that the ES module spec splits the algorithm into multiple phases. Splitting out construction into its own phase allows browsers to fetch files and build up their understanding of the module graph before getting down to the synchronous work of instantiating.
>
> [ES modules: A cartoon deep-dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)

尽管我使用了esm来编写我的模块, 但是当使用rollup打包的时候, 就会发现很不对劲.

在面对esm循环引用的部分, rollup显得有些力不从心.

问题总是出现在脚本第一次调用的地方. 而不是在event loop中, 在脚本第一次被调用的时候, 所引用的依赖必须是初始化完成的. 但是rollup打包出来的chunk是没有module的概念的, 所以模块打包的先后顺序就显得尤为重要.

解决这种问题的方法无非就两种: 调整打包顺序 或 移除首次加载时需要用到外部依赖的代码. 

在原项目中, 最大的问题是运行时继承. 每一个`*.class.js`文件都涉及到运行时继承, 第一次载入脚本就需要执行继承的代码. 导致依赖于父类的类的打包顺序必须在父类之后. 这点通常是可以保证的. 但是在循环引用的状况下则无办法保证. 在将class 改造成 es6 class之前, 这部分是不能动的. 那么只能将在eventloop中的依赖保留自运行时依赖. 这样, 可在打包阶段暂时解决这个问题. 

我的测试方法是, 直接运行一次打包文件, 通常而言, 如果依赖为空, 必定会引发error, 可排除大量因打包顺序引发的错误.

## 迁移到jest

原项目使用的qunit是Jquery的官方测试库, 但是过于老旧. 考虑到未来测试的扩展性和易用性, 并行测试等等, 还是将qunit迁移到jest上.

这里需要用到jest官方的测试转换库[jest-codemods](https://github.com/skovhus/jest-codemods)

> Codemods that simplify migrating JavaScript and TypeScript test files from [AVA](https://github.com/avajs/ava), [Chai](https://github.com/chaijs/chai), [Expect.js (by Automattic)](https://github.com/Automattic/expect.js), [Expect@1.x (by mjackson)](https://github.com/mjackson/expect), [Jasmine](https://github.com/jasmine/jasmine), [Mocha](https://github.com/mochajs/mocha), [proxyquire](https://github.com/thlorenz/proxyquire), [Should.js](https://github.com/tj/should.js/) and [Tape](https://github.com/substack/tape) to [Jest](https://facebook.github.io/jest/).

可以比较方便地将qunit迁移到jest上. 虽然说明上并没有说支持qunit, 但是说实话, 所有的测试库api其实大同小异. 很简单就可以找到相对兼容, 能转换的转换器. 在我测试下来, Chai是一个理想的转换器. 转换步骤大地如下

1. 使用转换器转换成jest
2. 引入打包后的文件
3. 将Qunit.module改成describe, 并将所有test移到此方法下
4. 将aferEach方法迁到顶级

这里其实还有些问题, unit test应当是使用源码作为unit 测试, 而非打包后的文件, 这部分需要以后再作优化. 但是其实问题不大.

这里有几个注意点,

首先是在原项目Qunit中使用最多的`equal`和`deepEqual`, 以及相对应的Jest `toEqual`, `toBe`

`equal`相当于`==`, 而Jest没有相对应的接口, 只能使用更严格的`toBe`, 相当于`===`

而`deepEqual`相当于`==`的递归版本, Jest也是没有相对应的接口, 只能使用`toEqual`, 相当于`===`的递归版本

开始依靠codemods, `equal`和`deepEqual`都转换成`toEqual`了, 这个方法原本没有什么问题, 出问题是在Object比较上. 因为`toEqual`可以递归比较对象, 但是`equal`只是简单对比对象的引用值. 所以这部分只能手动再改回来.