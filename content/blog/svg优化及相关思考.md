---
title: svg优化及相关思考
date: "2021-02-26 00:00:00"
description: ""
categories: ["最佳实践"]
comments: true
---

最近一直在做项目重构相关工作，有一些关于 svg 优化的事项，思考，一并总结在此。

## 背景

这次重构工作，本质上是工程化的开端。在以前的项目中，js 使用的 gulp 合并压缩，而在这次重构工程化中，使用了 vite 作为工程工具。所以工程化和相关优化都是围绕 vite 生态展开的。svg 的优化也一并提上了日程。在以前的 svg 依赖引入，是使用一个脚本，将所有 svg 文件，打包到一个 svg-manage.js 中，这个脚本会在运行时，向页面注入一个 svg-sprite

```html
<svg>
  <symbol id="sth"></symbol>
</svg>
```

这样在运行时，就可以通过`<svg><use xlink:href="#sth"></use></svg>`，引用到该 svg 了。
这个方案有几个问题：

1. 每次新增一个 \*.svg 的时候，要通过一个额外的脚本，去生成一个 svg-manage.js 的文件，这样才能引用在运行时调用到相应的 svg，这不是一个符合直觉的前端工作流。在这种工作流中，svg 的应用，打包，优化会割裂在一个相对独立的环境中，没办法做整体的优化。

2. 依赖引用非常不明确。首先，\*.svg 需要放在一个指定的目录下，指定的文件夹层级下，才能被成功打包。这种行为既不符合直觉，确定性也很差。如果有一天你想整理 svg 的文件夹，想新增文件夹或想将 svg 放置到不同的目录下，你只能再次重写相应的打包脚本。这对于一个只想整理的人来说是不合理的。其次，引用的 svg 是通过全局`use xlink:href="#sth"`来引用的，这种方案和全局依赖一样糟糕。如果那天 svg 被误删，或者 svg 被优化，或者想整体剔除不再需要用到的 svg，你基本不可能发现和做到。对于重构来说，不确定性会很高。

3. 由于全局 symbol 的关系，没办法处理重名的 svg。虽然有几种方案处理这种状况，例如人为添加 sufix 或添加`[filename]-`prefix 等方案（现在因为只允许单层目录，所以不会重名），这样在调用时会造成难度，另外重构时也麻烦，在项目中也经常出现`icon-undo-2`这样的 svg 文件。

所以我比较认同 webpack everything is a module 的观点。一个合格的模块，他的依赖图必须是确定的，无论是脚本还是资源，你必须有明确的依赖关系，在这个例子中。svg 必须通过 import 或 url 载入到调用的模块。

## 方案

目前的主流方案基本有几种，svgo 是基本的单 svg 优化，就不叙述了。

1. vite 原生
2. 将 svg 编译到相应框架的组件。
3. 类似 svg symbol sprite，将 import 的 svg 打包成一个 svg symbol

在 vite 原生中，导入的静态资源一律是作为 url 处理的

```vue
<template>
  <img src="./assets/sth.svg" />
</template>
<script>
import sthSvg from "./assets/sth.svg"

console.log(sthSvg) // "./assets/sth.svg"
</script>
```

这种方式有一些问题：

1. 应用的 svg，没有做优化，例如合并 svg 请求，需要配合一些其他的插件完成（暂时还没有）。
2. 没法对 svg 做 css animation，css 和 js 处理，只能用作简单显示。

vite 对于第二种方案， 以[Vite SVG loader](https://github.com/jpkleemans/vite-svg-loader)为例， ，是这样引用的

```vue
<template>
  <SthSvg />
</template>
<script>
import SthSvg from "./assets/sth.svg"
export default {
  data() {
    SthSvg,
  }
}
</script>
```

可以看到导入的 svg 变成了一个 vue component。这种方案会将 svg 改写成为一个 component，这样就可以在 SFC 中直接调用这个 svg 了。

这种做法有好有坏：

1. 不太符合直觉，因为跳了一步，不了解的人，很难理解导入 svg -> vue 的过程。针对这个问题，另外一个库[vite-plugin-vue-svg](https://github.com/visualfanatic/vite-svg/tree/master/packages/vite-plugin-vue-svg) 通过一种 query string 的方案去回避这个问题。`import SthSvg from "./assets/sth.svg?component"`或`import SthSvg from "./assets/sth.svg?url"`来控制载入的是 url 还是 vue component
2. 符合`everything in js`的前端趋势。很多的 ui 库其实都是这样处理的，像 antd 等也是直接将 svg 转换成相应的 component 的。
3. 自然的优化方案，保留 tree-shaking 的方法同时对 async component 有效，不会引入多余的资源。

不过最大的问题还是这两个库只支持 vue3，所以目前也用不了。

最后一种方案，以[vite-plugin-svg-sprite](https://github.com/meowtec/vite-plugin-svg-sprite)为例，他的引入方案是这样的

```vue
<template>
  <svg><use :xlink:href="`#${SthSvg}`"></use></svg>
</template>
<script>
import sthSvg from "./assets/sth.svg"
console.log(sthSvg) // "sth"
export default {
  data() {
    SthSvg,
  }
}
</script>
```

当你引入一个 svg 的时候，其实是引入了他的 symbol，这样在代码中可以使用 xlink:href 引用到对应的 svg。暂时来说，我也是使用这种方案。这种方案和以前的方案其实是一样的，不过他处理了明确依赖的问题，也可以通过 hash 解决同名的问题。重点是，你不再需要关注导入的 svg 是什么 symbol 了，一切都非常自然。
这种方案最大的问题还是封装的力度不是很够，你需要写额外的`<svg><use /></svg>`代码去调用相应的 svg。对于 typescript 不是太友好，如果你用其他的图标库就会发现，大部分的库都是按照第二种方法将 svg 直接封装成 component 的，他的 compoennt， props 都有明确的类型的。
在调用时可以写成

```jsx
import React from "react"
import SthIcon from "./SthIcon"
import SomeComponent from "./SomeComponent"

export default function App() {
  return <SomeComponent icon={SthIcon} />
}
```

如果使用 svg-sprite，这种风格就不再那么自然了， 你需要再用额外的方案去处理这个问题。

所以目前来说，虽然我还是偏好第二个方案，我暂时会选择这个方案，写一个针对 vue2 的 vite svg plugin 在这个时间节点不是一件收益特别高的事，而且兼容旧有的风格，这种方案看起来也没有那么不堪。

## references

[A Gulp-Based External SVG Symbol Sprite Icon System](https://una.im/svg-icons/)
[重要的图像优化之六：SVG 的优化](https://www.jianshu.com/p/cb1a64cbcf4e)
