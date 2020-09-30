---
title: uni-app 最佳实践
date: "2020-08-12 00:00:00"
description: ""
categories: ["最佳实践"]
comments: true
---

## \_\_call_hook

uni-app 在构建的时候注入的一个方法, 可以直接调用生命周期函数, 这是因为 uniapp 自身定义了很多生命周期, 需要在额外的地方调用, 所以也暴露了这个接口. 这个接口强大的地方在于还可以调用那些非生命周期, 但是挂载到 vue 声明对象上的方法

```vue
// index.vue
<script>
export default {
  onShareAppMessage() {
    console.log("share shit")
  },
}
</script>

// anywhere.js imoprt index from "index.vue"; const component = new
Vue.extend(index); component.__call_hook("onShareAppMessage", { form: "fav" });
```

## h5 端 css 强制 scoped

在这个 issue 中指出, h5 是强制开启 scoped CSS 的, 不论 style 是否填 scoped

[https://github.com/dcloudio/uni-app/issues/1095](https://github.com/dcloudio/uni-app/issues/1095)

在另一篇官方 issue 中, 也讨论过如何关闭强制 scoped[#327](https://github.com/dcloudio/uni-app/issues/327)

```js
module.exports = {
  chainWebpack(webpackConfig) {
    webpackConfig.module.rule("vue").uses.delete("uniapp-h5-style-scoped") // 源issue写的是uniapp-scoped 但是看源码已经改了
  },
}
```

## source maps

这里可能只适用于一些适用了 yarn workspace 的人, 我在安装了 yarn workspace 后发现, 在 workspace 的项目在开发调试中丢失了 source map, 导致调试子项目非常的艰难, 所以我在开发时候的 webpack 配置中, 将这个 evalSourcemapDevToolPlugin 的配置又加了上去, 非常奇妙的是, 这部分代码我是直接抄 uni-app 的官方配置的, 一点都没有改, 然后新的配置 work fine, 也没有和久的配置冲突, 感觉有点不可思议.

## preprocess-loader

官方文档阐述了条件编译的用法, 但是没有说明使用条件编译的库. 在源码中可以查证到, uni-app 是使用 [jsoverson](https://github.com/jsoverson)/[preprocess](https://github.com/jsoverson/preprocess) 这个库来实现条件编译的. 这说明两个问题, 1. 条件编译是生效在 webpack 构建阶段, 并且是在 html, js, css, json 中使用 comment 来生效. 第二点, 这个库不止实现的条件, 还实现了诸如 for each, include, exclude, echo 等模板行为. 而 uni-app 官方只宣称了条件编译. 实际上是一个优秀的模板引擎.

## dataSet

在传统的小程序中习惯使用 dataSet 来回传数据

```vue
<view bindtap="buttonClick" data-first="{{1}}" data-second="{{2}}"></view>

buttonClick(e) { const { first, second } = e.target.dataset; console.log(first,
second) // 1 2 }
```

但是这一点在 h5 中表现变得非常不一致, 在 h5 中, 原本应该是 Number 的值, 变成了 String, 原本应该是 Object 的值变成了[object object], 这使得需要改造所有的接口来完成这个行为. dataset 获取值的方法, 需要完全的废弃.

[绑定事件传参](https://segmentfault.com/a/1190000015684864#item-7)

## behaviors

在 uni-app 中 behaviors 的作用被 mixins 代替了, 但是有一种情况是特殊的

```js
behaviors: ["uni://form-field"]
```

这个值使得一个自定义组件被当成一个 form 组件来对待, 会向自定义组件注入 props: value 和 props: name, 自定义组件切记不能使用这两个特定值作为 data. 这个值会在`<form>` @submit 中回调得到. 尽管这个方法在 uni-app 官方文档中没有被提及, 但是确实可以这样做. 目前已知在微信, 百度, 头条(头条官方文档也没有这个 field, 但是确实可以用)都是有效的.

[小程序注意事项](https://uniapp.dcloud.io/component/form?id=form)

## onPageShow

在小程序中组件生命周期 ready 被映射成 onPageShow, 但是在实践中发现, 在 h5 端这个 hook 并没有触发. 而且会发现, 相对于小程序页面, h5 会使页面 keep-alive, 但是是 inactive 的, 此时 vue 上相关动画 hook 是不会触发的. 需要以下代码来进行 hack

```js
activated() {
    this.__call_hook("onPageShow");
},
```

## babel

优化 babel.config.js 文件里的 @vue/babel-preset-app 支持配置 modules:false ，让打包出来的代码体积更小，运行更快[#929](https://github.com/dcloudio/uni-app/issues/929)
