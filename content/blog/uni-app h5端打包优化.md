---
title: uni-app h5端打包优化
date: "2020-08-14 00:00:00"
description: ""
categories: []
comments: true
---

## 前言

webpack 打包优化的话题已是老生常谈, 这次则将以一次完整的实践讨论打包优化方式, 规则选择等.

## Tree Shaking

这里谈到的 tree shaking, 是在 uni-app 规则下的 tree shaking. 和普通的 tree shaking 不同的是, uni-app 在 tree-shaking, 特别是组件的摇树优化方面是不同的, 详细的摇树原理请参阅[https://ask.dcloud.net.cn/article/36279](https://ask.dcloud.net.cn/article/36279)

```json
// manifest.json
"h5": {
    "optimization": {
      "treeShaking": {
        "enable": true
      }
    },
  }
```

### import & require

import 和 require 在摇树优化上有很大的区别. 只有通过 es6 export ... 的方式导出的模块才能进行摇树处理, cjs 是不能通过摇树处理的, 另如果 esm 中有副作用的代码, 则也会导致摇树失败. 在本次项目中由于历史原因有很多 cjs, esm 甚至在同一个文件中 import export require module.exports 混用的四不像. 我做的第一步, 就是把这些模块都规范化, 统一转换成 esm, 如果是库, 则可以转换成 cjs. 总之, 处理最基本原则是不能 cjs, esm 混用, 有时候看起来能用的代码, 其实只是碰巧能用[干货:import 和 require 如何在项目中混用](https://juejin.im/post/6844904114183208968). esm 是目前也是未来的标准, 力所能及地转换成 esm, 即为未来摇树做准备.

设置完成后还需要设置 babel->modules 一项 [@vue/babel-preset-app](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/babel-preset-app) [babel - preset-env - modules](https://babeljs.io/docs/en/babel-preset-env#modules), 原来的 cjs 选项会使 babel 将所有模块当作 cjs 对待, 自然没有摇树. auto 则会依据文件内部的一些语法判定到底使 cjs 还是 esm, 一般而言, 只要调用 require 则会被当做 cjs 对待. 这里设置 auto 则可

```js
module.exports = {
  presets: [
    [
      "@vue/app",
      {
        modules: process.env.UNI_PLATFORM === "h5" ? "auto" : "cjs", // 这个值会直接传到@babel/preset-env
      },
    ],
  ],
  plugins,
}
```

### babel polyfill

现代浏览器其实并不需要 babel, 更不需要 babel polyfill, 引入完整的 babel polyfill 可为项目带来 200+K 的体积增长, 在 babel.config.js 中可配置此项. 将 modules 设置为 false 则不会引入 polyfill.

```js
module.exports = {
  presets: [
    [
      "@vue/app",
      {
        // false when building with webpack
        //'commonjs' when running tests in Jest.
        useBuiltIns: process.env.UNI_PLATFORM === "h5" ? "usage" : "entry",
      },
    ],
  ],
  plugins,
}
```

## 公共组件

真正大幅减少 bundle 总体积的操作是需要提取公共的组件, 我当前项目为例, 未提取之前, bundle 总体积为 22mb 左右, 这部分其实要通过配置 splitChunks 来进行自定义分包优化. 在默认配置中, common 包是所谓代码总包存在的, 一般而言, chunk-vendor 会打包 node_modules 内的文件, 而 chunk-common 则打包 src 内的文件. 但是有例外, 重点在于 common 包中的 chunks 配置. [webpack documentation - splitChunks](https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks)

```js
// vue.config.js
module.exports = {
  configureWebpack: {
    optimization: {
      // 默认配置
      splitChunks: {
        cacheGroups: {
          common: {
            chunks: "initial",
            minChunks: 2,
            priority: -20,
          },
        },
      },
    },
  },
}
```

这个配置的意思是打包非异步的文件, 这与 vue-router 的一般引入方式不能自洽. 总所周知, vue-router 为了分开页面, 提高加载速度, 一般会建议使用懒加载来载入页面, 而这种写法就是异步模块.

```js
"path": () => import "pages/abde/";
```

这种配置方案, 会使得 webpack 在打包的时候, 分开页面进行打包, 但是, 也正因为如此, 这样打包不会重复利用已打包的模块, 会将公共的组件重复打包. 所以用这种方案打包后, 体积非常大, 而且页面切换的网络开销, 运算开销也非常大, 没有最大限度的运用已加载的资源. 因此需要再配置一个公共组件的分包, 不管异步还是同步, 统统打包进来. 通过这种方案, 我将打包体积降低到了 4mb 大小. 另外由于公共组件在一个包中而不是在几个页面包中重复定义, 所以在切换页面的时候, 可以载入更小的页面包, 达到更快的加载速度的目的.

```js
configureWebpack: {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commonComponents: {
            name: "chunk-common-component",
            test: /src\/components/,
            chunks: "all",
            minChunks: 10,    // 只有引用超过10次的组件才打进此包
            maxSize: 500000,  // 因为公共组件也很大, 所以限制打包大小为500K
            priority: 11,     // 优先级11, 先进行此分包操作
          },
          components: {
            name: "chunk-component",
            test: /src\/components/,
            chunks: "all",
            minChunks: 4,   // 只有引用超过4次才打进此包
            maxSize: 500000,   // 由于公共组件很大, 允许最大打包大小为500K
            reuseExistingChunk: true,   // 重复利用已存在的包
            priority: 10,
          },
          common: {
            chunks: "initial",
            minChunks: 2,
            priority: -20,
          }
        }
      }
    },
```

## CSS

一种降低 js 体积, 提高解析速度的方法是进行 css 提取, 本来 vue-cli 项目是可以依靠 css.extract 参数在生产环境下实现 css 提取, 单独加载的. 但是官方直接覆盖了这个设置, 说明是 uni-app 有依赖到 css 运行时, 所以不允许提取独立的 css[#148](https://github.com/dcloudio/uni-app/issues/148)

## 删除没用的代码

这点我觉得是很多前端都不注重, 但是是最能减少打包体积的一种方法. 养成良好的编程习惯, 就可以有效减少扯皮, 减少 bug, 提高幸福感, 顺便减低打包体积.

向我们团队, 本次项目是从旧项目迁移过来的, 很多代码是直接 copy 原来的代码, 更有些代码是从别的目录直接复制的, 美其名曰留副本. 我实在不知道, 你要这样留副本, 那要 git 来干嘛. 而且很多代码中也是直接注释, 明明已经没用的代码, 直接删除不就好了.

更重要的是不要引入无关的依赖, 项目中很多模块引入一些不必要的模块, 除了徒增体积毫无用处. 我直接开 eslint, 把这些代码都删掉了. 又有一些旧的代码, 明明已经不用了, 却偏要留着. 杂七杂八删掉这些代码之后, 体积也有个几百 k 的提高, 还是可以的, 更重要的是可以提高幸福感, 看着一个几千行的文件, 实际只有几百行有用的代码, 换谁都受不了吧.
