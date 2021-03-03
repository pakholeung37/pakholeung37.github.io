---
title: vite-plugin-vue2-svg插件开发和总结
date: "2021-03-03 00:00:00"
description: ""
categories: ["实战心得"]
comments: true
---

## 前言

最近在做旧项目（vue2）的 vite 工程化改造中，遇到了 svg 引入和优化的问题。因为 vite 是相对新的一个工程工具，所以相应的生态也不是特别丰富。目前这个阶段而言，关于可用的 vite svg 工程化库有三个，分别是[vite-svg](https://github.com/visualfanatic/vite-svg/tree/master/packages/vite-plugin-vue-svg), [vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader), [vite-plgin-svg-sprite](https://github.com/meowtec/vite-plugin-svg-sprite)。这里面前两个库都是针对 vue3 的，所以排除了，只剩下 vite-plugin-svg-sprite 可选。这个库的功能还是比较齐全的，单 svg svgo 优化，svg sprite，框架无关，算是很不错的选择。介意的地方有几个

### 模版代码

在调用上，不是特别清晰，需要写一些模版代码，下面是一个比较典型的 svg 引用

```vue
<template>
  <svg><use :xlink:href="`#${icon}`"></use></svg>
</template>
<script>
import icon from "./icon.svg"
export default {
  data() {
    return {
      icon,
    }
  },
}
</script>
```

可以看到，处理引入 svg，还需要写一些模版 template 才可以引用真正的 svg

### 动态加载

这个是 svg sprite 的通病，因为 svg sprite 需要把所有 svg 全部压在一个文件里面，这样你的网站加载的时候只能一次性把所有需要用到的 svg 加载进来，没办法加载到页面的决定性的资源。我猜测这是大部分网站放弃 svg sprite 的原因。目前比较主流的方法都是将 svg 转换成组件使用的。

## vite-plugin-vue2-svg 插件开发

看了这几个插件的源码，发现现阶段没有特别适合 vue2 的方案，所以决定开发一个新的插件[vite-plugin-vue2-svg](https://github.com/pakholeung37/vite-plugin-vue2-svg)。虽然以前也有一些插件开发和包发布的经验，但是这次决定采取更高的标准去完成这件事。

## 工具栈

这次选用的组合是 yarn、typescript，以及一些必要的规范工具。

## 开发

这个插件是参考 vite-svg 完成的。在 compileSvg 的阶段有一些麻烦。这个函数主要的作用是接受一个 svg file 的 content，然后返回 vue component 的 file content
一开始选择纯手撸 render

```js
function compileSvg(svg) {
  return `
    export default {
      render(h) {
        h('span', {
          domProps: {
            innerHTML: '${svg}',
          }
        })
      }
    }
  `
}
```

咋一看好像没有什么问题，但是问题很大

1. svg 需要由一个 wrapper tag 包裹，这样在调用时一些 dom props 就没办法传递到真正的 svg tag 上面。
2. 有 xss 风险，这里将一个 svg 作为 innerHTML 直接插入到 dom 中，如果 svg 文件里面有一些 script 标签，也会一并插入到 dom 中，虽然所有的 svg 都来自内部，但是作为一个插件开发者应该考虑各种状况。

所以看来，得上 vue template compiler 了

```js
import { compile } from "vue-template-compiler";

function compileSvg(svg) {
  return compile({
    id: ...,
    source: svg,
    filename:...
  }).code;
}
```

这里又有一个比较麻烦的地方，我使用 vue-template-compiler 编译后，代码中有`with(this)`的代码，这样根本没办法在严格模式下运行。果不其然，引用后直接就报错了。

于是我参考了另一个库 vite-plugin-vue2，它里面使用了一个@vue/component-compiler-utils 的包，用于将\*.vue 文件编译出 vue component。于是最终代码变成这样

```js
import { compileTemplate, parse } from "@vue/component-compiler-utils";
import * as compiler from "vue-template-compiler";

function compileSvg(svg) {
  const template = parse({
    source: `
      <template>
        ${svg}
      </template>
    `,
    compiler: compiler,
    filename: ...,
  }).template;

  if (!template) return "";

  const result = compileTemplate({
    compiler: compiler,
    source: template.content,
    filename: ...,
  });

  return `
    ${result.code}
    export default {
      render: render,
    }
  `;
}
```

整体看上去还是比较简洁的。

## 打包

一开始是使用 rollup 打包，但是总是发现会将一些外部的包引入到最终代码中，导致运行报错，一开始没意识到这个插件在 node 中运行，其实只需要将 typescript 编译到 javascript 就可以了，后来放弃使用 rollup 包，只使用 tsc 即可。

### tsc 配置

tsconfig 打包配置有几个关键的字段是要声明的

```json
{
  "compilerOptions": {
    "target": "es5", // 这里其实填es6也是可以的，毕竟只是在node中运行
    "module": "commonjs", // 会添加额外的runtime将import转换成cjs。虽然有些node开了esmodule实验特性，不过还是转换比较好
    "outDir": "./lib", // 这里是输出目录
    "declaration": true // 这一步会确定*.d.ts文件会不会输出到目录，没有这个type文件，那你的插件就没办法被正确的类型推断
  }
}
```

## 调试

以往的调试我都是直接在 src 里面加调试文件和代码做调试的，所以这次参考了其他一些库，更加标准地做这件事。

这里主要是将一个调试用的项目放在/examples 目录下，与 src 文件夹区分开来。examples 下是一个完整的 vite 项目，可以用于测试插件。主要的难点是如何将插件链接到这个项目中。
一开始使用 yarn 本地依赖的方法，在 package.json 中添加`"vite-plugin-vue2-svg": "file:../"`，这样 yarn 会将插件的目录链接到调试项目中。但是这里有一个问题，每次修改完代码我都需要重新 build 然后`yarn --force`安装依赖，过程比较缓慢。

后来我参考了`yarn link`的方案，彻底解放调试效率。

## 发版

npm 发包需要在 package.json 填写一些必要的字段

```json
{
  ...
  "main": "lib/index.js", // 这里需要指定包入口文件
  "types": "lib/index.d.ts", // 这里需要指定types入口
  "files": [
    "lib"
  ] // 这个字段比较关键， 我一开始发包的时候，尝试数次都只能将*.js发上去，自动忽略了*.d.ts和sourcemap，指定了这个字段后，该目录下所有文件都会入npm包
  ...
}
```

然后执行`yarn publish --registry="https://registry.npmjs.org/"`，添加后面 registry 是因为我用的是 taobao 源，所以发版会发不上去，需要将注册源临时换到官方 npm
